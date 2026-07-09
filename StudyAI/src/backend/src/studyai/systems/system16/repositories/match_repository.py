from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from studyai.common.errors.models import NotFoundAppError
from studyai.systems.system16.models.matching import System16MatchResult, System16PastKnowledge


class MatchRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_next_bulk_id(self) -> int:
        result = await self.session.execute(select(func.max(System16MatchResult.bulk_id)))
        current = result.scalar_one_or_none()
        return int(current or 0) + 1

    async def create_match(
        self,
        *,
        requirement_text: str,
        candidate_data_masked: dict,
        score: float,
        level: str,
        parse_confidence: float,
        review_required: bool,
        review_reasons: list[str],
        score_breakdown: dict,
        report: dict,
        similar_cases: list[dict],
        bulk_id: int | None = None,
        candidate_id: str | None = None,
    ) -> System16MatchResult:
        record = System16MatchResult(
            requirement_text=requirement_text,
            candidate_data_masked=candidate_data_masked,
            score=score,
            level=level,
            parse_confidence=parse_confidence,
            review_required=review_required,
            review_reasons=review_reasons,
            score_breakdown=score_breakdown,
            report=report,
            similar_cases=similar_cases,
            bulk_id=bulk_id,
            candidate_id=candidate_id,
        )
        self.session.add(record)
        await self.session.flush()
        await self.session.refresh(record)
        return record

    async def list_matches(
        self,
        *,
        limit: int = 50,
        review_required: bool | None = None,
        bulk_id: int | None = None,
    ) -> list[System16MatchResult]:
        stmt = select(System16MatchResult).order_by(System16MatchResult.created_at.desc(), System16MatchResult.id.desc())
        if review_required is not None:
            stmt = stmt.where(System16MatchResult.review_required == review_required)
        if bulk_id is not None:
            stmt = stmt.where(System16MatchResult.bulk_id == bulk_id)
        stmt = stmt.limit(limit)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def get_match(self, match_id: int) -> System16MatchResult:
        result = await self.session.execute(
            select(System16MatchResult).where(System16MatchResult.id == match_id)
        )
        record = result.scalar_one_or_none()
        if record is None:
            raise NotFoundAppError("match_not_found", "The requested match result was not found.")
        return record

    async def create_past_case(
        self,
        *,
        requirement_summary: str,
        candidate_profile: str | None,
        result_label: str | None,
        notes: str | None,
        embedding: list[float] | None,
    ) -> System16PastKnowledge:
        record = System16PastKnowledge(
            requirement_summary=requirement_summary,
            candidate_profile=candidate_profile,
            result=result_label,
            notes=notes,
            embedding=embedding,
        )
        self.session.add(record)
        await self.session.flush()
        await self.session.refresh(record)
        return record

    async def list_past_cases(self, *, limit: int = 200) -> list[System16PastKnowledge]:
        result = await self.session.execute(
            select(System16PastKnowledge)
            .order_by(System16PastKnowledge.created_at.desc(), System16PastKnowledge.id.desc())
            .limit(limit)
        )
        return list(result.scalars().all())
