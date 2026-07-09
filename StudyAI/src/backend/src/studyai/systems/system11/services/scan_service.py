from __future__ import annotations

import logging
from datetime import datetime, timezone
from pathlib import Path

from studyai.systems.system11.services.path_safety_service import PathSafetyService

logger = logging.getLogger(__name__)

# テキスト系拡張子（内容プレビューを試みる）
_TEXT_EXTENSIONS = {
    ".txt", ".md", ".py", ".js", ".ts", ".java", ".sql",
    ".sh", ".yaml", ".yml", ".json", ".xml", ".csv", ".html", ".css",
}


class ScanService:
    def __init__(self) -> None:
        self.safety = PathSafetyService()

    def collect_files(
        self,
        watch_folders: list[str],
        exclude_patterns: list[str],
        max_files: int = 500,
    ) -> list[dict]:
        roots = self.safety.validate_watch_folders(watch_folders)
        results: list[dict] = []
        for root in roots:
            if not root.exists():
                continue
            if root.is_file():
                info = self._build_file_info(root, exclude_patterns)
                if info:
                    results.append(info)
                if len(results) >= max_files:
                    break
                continue
            for file_path in root.rglob("*"):
                if not file_path.is_file():
                    continue
                info = self._build_file_info(file_path, exclude_patterns)
                if info:
                    results.append(info)
                if len(results) >= max_files:
                    break
            if len(results) >= max_files:
                break
        return sorted(results, key=lambda x: x["path"])

    def _build_file_info(self, path: Path, exclude_patterns: list[str]) -> dict | None:
        if self.safety.matches_exclude(path, exclude_patterns):
            return None
        if self.safety.is_symlink_or_junction(path):
            return None
        try:
            stat = path.stat()
        except OSError:
            return None
        now = datetime.now(timezone.utc).timestamp()
        days_since_access = int((now - stat.st_atime) / 86400)
        size_kb = round(stat.st_size / 1024, 1)
        preview = self._read_preview(path)
        return {
            "path": str(path),
            "ext": path.suffix.lower(),
            "size_kb": size_kb,
            "days_since_access": days_since_access,
            "preview": preview,
            "is_forbidden": self.safety.is_forbidden_extension(path),
        }

    @staticmethod
    def _read_preview(path: Path, max_chars: int = 300) -> str:
        if path.suffix.lower() not in _TEXT_EXTENSIONS:
            return ""
        try:
            with path.open(encoding="utf-8", errors="ignore") as f:
                return f.read(max_chars)
        except OSError:
            return ""
