from __future__ import annotations

import hashlib
import math
import time
from pathlib import Path

from sqlalchemy.ext.asyncio import AsyncSession

from studyai.common.ai.embedding_client import EmbeddingClient
from studyai.common.ai.llm_client import LLMClient
from studyai.common.audit.logger import get_audit_logger
from studyai.common.errors.models import ValidationAppError
from studyai.systems.system10.prompts.file_summary_prompt import build_file_summary_prompt
from studyai.systems.system10.repositories.index_repository import IndexRepository
from studyai.systems.system10.schemas.indexing import (
    DuplicateGroupItem,
    DuplicateGroupResponse,
    FolderMapResponse,
    ReportResponse,
    ScanLogsResponse,
    ScanLogItem,
    ScanRequest,
    ScanResponse,
    SearchDuplicateHit,
    SearchHit,
    SearchResponse,
)
from studyai.systems.system10.services.duplicate_detector import DuplicateDetector
from studyai.systems.system10.services.mcp_filesystem_client import MCPFilesystemClient
from studyai.systems.system10.services.report_service import ReportService
from studyai.systems.system10.services.structure_map_builder import StructureMapBuilder
from studyai.systems.system10.services.text_extractor import TextExtractor


class IndexingService:
    def __init__(self) -> None:
        self.filesystem_client = MCPFilesystemClient()
        self.text_extractor = TextExtractor()
        self.embedding_client = EmbeddingClient()
        self.llm_client = LLMClient()
        self.duplicate_detector = DuplicateDetector()
        self.structure_map_builder = StructureMapBuilder()
        self.report_service = ReportService()
        self.audit_logger = get_audit_logger()

    async def scan(
        self,
        session: AsyncSession,
        *,
        body: ScanRequest,
        trace_id: str,
        user_id: str,
    ) -> ScanResponse:
        if body.scan_mode not in {"full", "diff", "incremental"}:
            raise ValidationAppError("invalid_scan_mode", "scan_mode は full / diff / incremental のみ指定できます。")

        started_at = time.perf_counter()
        repository = IndexRepository(session)
        scan_log = await repository.create_scan_log(scan_targets=body.scan_targets, scan_mode=body.scan_mode)
        files = self.filesystem_client.list_files(body.scan_targets, body.exclude_patterns)
        seen_paths: set[str] = set()
        new_files = 0
        updated_files = 0

        for file_path in files:
            full_path = str(file_path)
            seen_paths.add(full_path)
            file_bytes = file_path.read_bytes()
            file_hash = hashlib.sha256(file_bytes).hexdigest()
            text = self.text_extractor.extract_text(file_path.name, file_bytes)
            summary_payload = await self._summarize_file(file_path.name, text)
            embedding = (await self.embedding_client.embed([text[:4000] or file_path.name]))[0]
            _, state = await repository.upsert_file(
                full_path=full_path,
                file_name=file_path.name,
                folder_path=str(file_path.parent),
                file_hash=file_hash,
                file_size=file_path.stat().st_size,
                doc_type=summary_payload["doc_type"],
                summary=summary_payload["summary"],
                is_latest=bool(summary_payload["is_latest"]),
                updated_at=self._to_naive_datetime(file_path.stat().st_mtime),
                embedding=embedding,
            )
            if state == "new":
                new_files += 1
            elif state == "updated":
                updated_files += 1

        deleted_files = 0
        if body.scan_mode == "full":
            deleted_files = await repository.deactivate_missing_files(
                target_prefixes=body.scan_targets,
                seen_paths=seen_paths,
            )

        active_files = await repository.list_files()
        duplicate_groups = self.duplicate_detector.find_duplicates(active_files)
        await repository.replace_duplicate_groups(duplicate_groups)
        duration_seconds = int(time.perf_counter() - started_at)
        await repository.complete_scan_log(
            scan_log,
            total_files=len(files),
            new_files=new_files,
            updated_files=updated_files,
            deleted_files=deleted_files,
            duplicates_found=len(duplicate_groups),
            duration_seconds=duration_seconds,
        )
        await session.commit()

        self.audit_logger.log(
            action="system10.scan.completed",
            trace_id=trace_id,
            user_id=user_id,
            resource_type="system10_scan",
            resource_id=scan_log.id,
            details={"targets": body.scan_targets, "total_files": len(files)},
        )
        return ScanResponse(
            scan_id=scan_log.id,
            status=scan_log.status,
            total_files=scan_log.total_files,
            new_files=scan_log.new_files,
            updated_files=scan_log.updated_files,
            deleted_files=scan_log.deleted_files,
            duplicates_found=scan_log.duplicates_found,
            scan_duration_seconds=scan_log.duration_seconds or 0,
        )

    async def search(
        self,
        session: AsyncSession,
        *,
        query: str,
        search_mode: str,
        path_prefix: str | None,
        latest_only: bool,
    ) -> SearchResponse:
        if not query.strip():
            raise ValidationAppError("search_query_empty", "検索クエリは必須です。")
        if search_mode not in {"keyword", "vector", "hybrid"}:
            raise ValidationAppError("invalid_search_mode", "search_mode は keyword / vector / hybrid のみ指定できます。")

        repository = IndexRepository(session)
        items = await repository.list_files(path_prefix=path_prefix, latest_only=latest_only)
        query_embedding: list[float] | None = None
        if search_mode in {"vector", "hybrid"}:
            query_embedding = (await self.embedding_client.embed([query]))[0]
        duplicates = await repository.list_duplicate_groups()
        duplicate_map = self._build_duplicate_map(duplicates)

        ranked: list[tuple[float, object]] = []
        for item in items:
            keyword_score = self._keyword_score(query, item)
            vector_score = self._vector_score(query_embedding, item.embedding) if query_embedding else 0.0
            if search_mode == "keyword":
                score = keyword_score
            elif search_mode == "vector":
                score = vector_score
            else:
                score = keyword_score * 0.4 + vector_score * 0.6
            ranked.append((score, item))
        ranked.sort(key=lambda pair: (pair[0], pair[1].updated_at or pair[1].scanned_at, pair[1].id), reverse=True)
        hits = [pair for pair in ranked if pair[0] > 0][:20]
        return SearchResponse(
            query=query,
            total_hits=len(hits),
            results=[
                SearchHit(
                    file_id=item.id,
                    file_name=item.file_name,
                    full_path=item.full_path,
                    summary=item.summary,
                    doc_type=item.doc_type,
                    relevance_score=round(score, 4),
                    updated_at=item.updated_at,
                    file_size_kb=int((item.file_size or 0) / 1024) if item.file_size is not None else None,
                    is_latest=item.is_latest,
                    duplicates=[
                        SearchDuplicateHit(
                            file_name=duplicate["file_name"],
                            full_path=duplicate["full_path"],
                            similarity=duplicate["similarity"],
                        )
                        for duplicate in duplicate_map.get(item.id, [])
                    ],
                )
                for score, item in hits
            ],
        )

    async def get_map(self, session: AsyncSession, *, folder: str | None) -> FolderMapResponse:
        root_path = folder or ""
        repository = IndexRepository(session)
        indexed_files = await repository.list_files(path_prefix=root_path or None)
        if not indexed_files:
            raise ValidationAppError("path_out_of_scope", "対象フォルダにインデックス済みファイルがありません。")
        duplicate_groups = await repository.list_duplicate_groups()
        root = folder or str(Path(indexed_files[0].full_path).anchor)
        return self.structure_map_builder.build(
            root_path=root,
            indexed_files=indexed_files,
            duplicate_groups=duplicate_groups,
        )

    async def get_report(self, session: AsyncSession, *, folder: str | None) -> ReportResponse:
        repository = IndexRepository(session)
        indexed_files = await repository.list_files(path_prefix=folder or None)
        duplicate_groups = await repository.list_duplicate_groups()
        issues = [f"重複候補 {len(duplicate_groups)} 件"]
        return self.report_service.build_report(
            report_id=1,
            indexed_files=indexed_files,
            duplicate_groups=duplicate_groups,
            issues=issues,
        )

    async def get_duplicates(self, session: AsyncSession) -> DuplicateGroupResponse:
        groups = await IndexRepository(session).list_duplicate_groups()
        return DuplicateGroupResponse(
            items=[
                DuplicateGroupItem(
                    file_ids=item.file_ids,
                    similarity_type=item.similarity_type,
                    similarity_score=float(item.similarity_score),
                    latest_file_id=item.latest_file_id,
                )
                for item in groups
            ]
        )

    async def get_scan_logs(self, session: AsyncSession) -> ScanLogsResponse:
        logs = await IndexRepository(session).list_scan_logs()
        return ScanLogsResponse(
            items=[
                ScanLogItem(
                    scan_id=log.id,
                    scan_targets=log.scan_targets,
                    scan_mode=log.scan_mode,
                    total_files=log.total_files,
                    new_files=log.new_files,
                    updated_files=log.updated_files,
                    deleted_files=log.deleted_files,
                    duplicates_found=log.duplicates_found,
                    status=log.status,
                    executed_at=log.executed_at,
                )
                for log in logs
            ]
        )

    async def _summarize_file(self, file_name: str, text: str) -> dict[str, object]:
        system_prompt, user_prompt = build_file_summary_prompt(file_name, text)
        raw = await self.llm_client.extract_json(system_prompt, user_prompt)
        return {
            "doc_type": str(raw.get("doc_type", "その他")).strip() or "その他",
            "summary": str(raw.get("summary", "")).strip()[:240],
            "is_latest": bool(raw.get("is_latest", True)),
        }

    @staticmethod
    def _to_naive_datetime(timestamp: float):
        from datetime import datetime

        return datetime.fromtimestamp(timestamp)

    @staticmethod
    def _keyword_score(query: str, item) -> float:
        query_tokens = {token.lower() for token in query.split() if token.strip()}
        if not query_tokens:
            query_tokens = {query.lower()}
        text = " ".join(
            filter(
                None,
                [
                    item.file_name,
                    item.full_path,
                    item.doc_type or "",
                    item.summary or "",
                ],
            )
        ).lower()
        if not text:
            return 0.0
        matched = sum(1 for token in query_tokens if token in text)
        return matched / len(query_tokens)

    @staticmethod
    def _vector_score(query_embedding: list[float], target_embedding: list[float] | None) -> float:
        if not query_embedding or not target_embedding or len(query_embedding) != len(target_embedding):
            return 0.0
        numerator = sum(a * b for a, b in zip(query_embedding, target_embedding, strict=True))
        left_norm = math.sqrt(sum(a * a for a in query_embedding))
        right_norm = math.sqrt(sum(b * b for b in target_embedding))
        if left_norm == 0 or right_norm == 0:
            return 0.0
        return max(0.0, numerator / (left_norm * right_norm))

    @staticmethod
    def _build_duplicate_map(groups: list) -> dict[int, list[dict[str, object]]]:
        mapping: dict[int, list[dict[str, object]]] = {}
        for group in groups:
            for file_id in group.file_ids:
                others = [item for item in group.file_ids if item != file_id]
                mapping.setdefault(file_id, []).extend(
                    [
                        {
                            "file_name": f"file_id={other}",
                            "full_path": f"file_id={other}",
                            "similarity": float(group.similarity_score),
                        }
                        for other in others
                    ]
                )
        return mapping
