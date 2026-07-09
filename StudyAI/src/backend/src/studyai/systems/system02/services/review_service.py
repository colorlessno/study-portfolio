from __future__ import annotations

import hashlib

from sqlalchemy.ext.asyncio import AsyncSession

from studyai.common.audit.logger import get_audit_logger
from studyai.systems.system02.repositories.review_repository import ReviewRepository
from studyai.systems.system02.schemas.review import (
    CompareResponse,
    ReviewCompareResponse,
    ReviewDetailResponse,
    ReviewIssueResponse,
    ReviewListItem,
    ReviewListResponse,
    ReviewResponse,
    ReviewSummaryResponse,
)
from studyai.systems.system02.services.chunk_service import ChunkService
from studyai.systems.system02.services.compare_review_engine import CompareReviewEngine
from studyai.systems.system02.services.document_parser import DocumentParser
from studyai.systems.system02.services.issue_aggregator import IssueAggregator
from studyai.systems.system02.services.risk_review_engine import RiskReviewEngine


class ReviewService:
    def __init__(self) -> None:
        self.document_parser = DocumentParser()
        self.chunk_service = ChunkService()
        self.risk_review_engine = RiskReviewEngine()
        self.compare_review_engine = CompareReviewEngine()
        self.issue_aggregator = IssueAggregator()
        self.audit_logger = get_audit_logger()

    async def review_document(
        self,
        session: AsyncSession,
        *,
        file_name: str,
        file_bytes: bytes,
        perspective: str,
        trace_id: str,
        user_id: str | None,
    ) -> ReviewResponse:
        text = self.document_parser.extract_text(file_name, file_bytes)
        chunks = self.chunk_service.split_by_clause(text)
        document_type = self.risk_review_engine.classify_document_type(text)
        issues = self.issue_aggregator.merge_issues(
            self.risk_review_engine.run_review(chunks=chunks, document_text=text, perspective=perspective)
        )
        summary = self.issue_aggregator.build_summary(issues)
        repository = ReviewRepository(session)
        review = await repository.create_review(
            review_type="single",
            file_name=file_name,
            file_hash=self._sha256(file_bytes),
            file_hash_b=None,
            document_type=document_type,
            perspective=perspective,
            overall_risk=summary["overall_risk"],
            recommendation=summary["recommendation"],
            summary=summary,
            total_issues=summary["total_issues"],
        )
        await repository.create_issues(review.id, issues)
        await session.commit()
        self.audit_logger.log(
            action="system02.review.single",
            trace_id=trace_id,
            user_id=user_id,
            resource_type="system02_review",
            resource_id=review.id,
            details={"document_type": document_type, "issues": len(issues)},
        )
        return ReviewResponse(
            review_id=review.id,
            document_type=document_type,
            perspective=perspective,
            summary=ReviewSummaryResponse(**summary),
            issues=[ReviewIssueResponse(issue_id=index + 1, **issue) for index, issue in enumerate(issues)],
        )

    async def compare_documents(
        self,
        session: AsyncSession,
        *,
        file_name_a: str,
        file_bytes_a: bytes,
        file_name_b: str,
        file_bytes_b: bytes,
        perspective: str,
        trace_id: str,
        user_id: str | None,
    ) -> CompareResponse:
        text_a = self.document_parser.extract_text(file_name_a, file_bytes_a)
        text_b = self.document_parser.extract_text(file_name_b, file_bytes_b)
        chunks_a = self.chunk_service.split_by_clause(text_a)
        chunks_b = self.chunk_service.split_by_clause(text_b)
        issues_a = self.issue_aggregator.merge_issues(self.risk_review_engine.run_review(chunks=chunks_a, document_text=text_a, perspective=perspective))
        issues_b = self.issue_aggregator.merge_issues(self.risk_review_engine.run_review(chunks=chunks_b, document_text=text_b, perspective=perspective))
        summary_a = self.issue_aggregator.build_summary(issues_a)
        summary_b = self.issue_aggregator.build_summary(issues_b)
        diff_issues = self.issue_aggregator.merge_issues(
            self.compare_review_engine.run_compare(self.chunk_service.align_for_compare(text_a, text_b))
        )
        repository = ReviewRepository(session)
        compare_summary = self.issue_aggregator.build_summary(diff_issues)
        review = await repository.create_review(
            review_type="compare",
            file_name=f"{file_name_a} vs {file_name_b}",
            file_hash=self._sha256(file_bytes_a),
            file_hash_b=self._sha256(file_bytes_b),
            document_type=self.risk_review_engine.classify_document_type(text_b),
            perspective=perspective,
            overall_risk=compare_summary["overall_risk"],
            recommendation=compare_summary["recommendation"],
            summary=compare_summary,
            total_issues=compare_summary["total_issues"],
            compare_payload={"review_a": summary_a, "review_b": summary_b},
        )
        await repository.create_issues(review.id, diff_issues)
        await session.commit()
        self.audit_logger.log(
            action="system02.review.compare",
            trace_id=trace_id,
            user_id=user_id,
            resource_type="system02_review",
            resource_id=review.id,
            details={"diff_issues": len(diff_issues)},
        )
        return CompareResponse(
            comparison_id=review.id,
            review_a=ReviewSummaryResponse(**summary_a),
            review_b=ReviewSummaryResponse(**summary_b),
            diff_issues=[ReviewIssueResponse(issue_id=index + 1, **issue) for index, issue in enumerate(diff_issues)],
            recommendation_diff={
                "from": summary_a["recommendation"],
                "to": summary_b["recommendation"],
            },
        )

    async def list_reviews(
        self,
        session: AsyncSession,
        *,
        document_type: str | None,
        overall_risk: str | None,
        from_date,
        to_date,
    ) -> ReviewListResponse:
        reviews = await ReviewRepository(session).list_reviews(
            document_type=document_type,
            overall_risk=overall_risk,
            from_date=from_date,
            to_date=to_date,
        )
        return ReviewListResponse(
            total=len(reviews),
            items=[
                ReviewListItem(
                    review_id=review.id,
                    review_type=review.review_type,
                    document_type=review.document_type,
                    overall_risk=review.overall_risk,
                    recommendation=review.recommendation,
                    created_at=review.created_at,
                )
                for review in reviews
            ],
        )

    async def get_review(self, session: AsyncSession, *, review_id: int) -> ReviewDetailResponse:
        review = await ReviewRepository(session).get_review(review_id)
        return ReviewDetailResponse(
            review_id=review.id,
            review_type=review.review_type,
            document_type=review.document_type,
            perspective=review.perspective,
            summary=ReviewSummaryResponse(**review.summary),
            issues=[
                ReviewIssueResponse(
                    issue_id=issue.id,
                    type=issue.issue_type,
                    severity=issue.severity,
                    article=issue.article,
                    original_text=issue.original_text,
                    description=issue.description,
                    risk_explanation=issue.risk_explanation,
                    suggested_text=issue.suggested_text,
                )
                for issue in review.issues
            ],
            created_at=review.created_at,
        )

    async def compare_saved_reviews(self, session: AsyncSession, *, review_id_a: int, review_id_b: int) -> ReviewCompareResponse:
        repository = ReviewRepository(session)
        review_a = await repository.get_review(review_id_a)
        review_b = await repository.get_review(review_id_b)
        issues_a = {self._issue_key(issue): issue for issue in review_a.issues}
        issues_b = {self._issue_key(issue): issue for issue in review_b.issues}
        added = [issues_b[key] for key in issues_b.keys() - issues_a.keys()]
        removed = [issues_a[key] for key in issues_a.keys() - issues_b.keys()]
        return ReviewCompareResponse(
            review_id_a=review_a.id,
            review_id_b=review_b.id,
            overall_risk_diff={"from": review_a.overall_risk, "to": review_b.overall_risk},
            recommendation_diff={"from": review_a.recommendation, "to": review_b.recommendation},
            issue_count_diff=review_b.total_issues - review_a.total_issues,
            added_issues=[self._issue_model_to_schema(issue) for issue in added],
            removed_issues=[self._issue_model_to_schema(issue) for issue in removed],
        )

    @staticmethod
    def _sha256(file_bytes: bytes) -> str:
        return hashlib.sha256(file_bytes).hexdigest()

    @staticmethod
    def _issue_key(issue) -> tuple:
        return issue.issue_type, issue.severity, issue.article, issue.description

    @staticmethod
    def _issue_model_to_schema(issue) -> ReviewIssueResponse:
        return ReviewIssueResponse(
            issue_id=issue.id,
            type=issue.issue_type,
            severity=issue.severity,
            article=issue.article,
            original_text=issue.original_text,
            description=issue.description,
            risk_explanation=issue.risk_explanation,
            suggested_text=issue.suggested_text,
        )
