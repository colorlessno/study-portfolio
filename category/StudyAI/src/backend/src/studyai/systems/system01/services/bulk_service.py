from __future__ import annotations

import uuid
from decimal import Decimal

from fastapi import BackgroundTasks, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from studyai.common.db.session import SessionLocal
from studyai.systems.system01.repositories.job_repository import JobRepository
from studyai.systems.system01.repositories.log_repository import LogRepository
from studyai.systems.system01.schemas.extract import BulkExtractAcceptedResponse, BulkJobResultResponse, BulkJobStatusResponse
from studyai.systems.system01.services.extract_service import ExtractService


class BulkService:
    def __init__(self) -> None:
        self.extract_service = ExtractService()

    async def enqueue(self, session: AsyncSession, files: list[UploadFile], background_tasks: BackgroundTasks) -> BulkExtractAcceptedResponse:
        job_id = f"job_{uuid.uuid4().hex[:8]}"
        file_payloads: list[tuple[str, bytes]] = []
        for upload_file in files:
            file_payloads.append((upload_file.filename, await upload_file.read()))
        await JobRepository(session).create_job(job_id, len(files))
        await session.commit()
        background_tasks.add_task(self.process_job, job_id, file_payloads)
        return BulkExtractAcceptedResponse(
            job_id=job_id,
            total_files=len(files),
            status="queued",
            results_endpoint=f"/api/extract/bulk/{job_id}",
        )

    async def process_job(self, job_id: str, files: list[tuple[str, bytes]]) -> None:
        async with SessionLocal() as session:
            repo = JobRepository(session)
            await repo.mark_running(job_id)
            await session.commit()

            succeeded = 0
            failed = 0
            for file_name, file_bytes in files:
                try:
                    result = await self.extract_service.run_single_extract_bytes(session, file_name, file_bytes)
                    await repo.add_result(
                        job_id=job_id,
                        file_name=file_name,
                        status="success",
                        document_id=result.document_id,
                        message="ok",
                    )
                    succeeded += 1
                except Exception as exc:  # pragma: no cover - background path
                    await repo.add_result(
                        job_id=job_id,
                        file_name=file_name,
                        status="failed",
                        error_code=getattr(exc, "error_code", "extraction_failed"),
                        message=str(exc),
                    )
                    await LogRepository(session).insert(file_name, "error", str(exc))
                    failed += 1
                await session.commit()

            await repo.finalize(job_id, succeeded, failed)
            await session.commit()

    async def get_status(self, session: AsyncSession, job_id: str) -> BulkJobStatusResponse:
        job = await JobRepository(session).get_job(job_id)
        return BulkJobStatusResponse(
            job_id=job.id,
            status=job.status,
            total_files=job.total_files,
            succeeded=job.succeeded,
            failed=job.failed,
            results=[
                BulkJobResultResponse(
                    file_name=result.file_name,
                    status=result.status,
                    document_id=result.document_id,
                    confidence_score=None,
                    error=result.error_code,
                    message=result.message,
                )
                for result in job.results
            ],
        )
