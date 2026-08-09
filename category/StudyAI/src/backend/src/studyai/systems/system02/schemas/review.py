from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class ReviewIssueResponse(BaseModel):
    issue_id: int | None = None
    type: str
    severity: str
    article: str | None = None
    original_text: str | None = None
    description: str
    risk_explanation: str | None = None
    suggested_text: str | None = None


class ReviewSummaryResponse(BaseModel):
    total_issues: int
    by_type: dict[str, int] = Field(default_factory=dict)
    by_severity: dict[str, int] = Field(default_factory=dict)
    overall_risk: str
    recommendation: str
    recommendation_note: str
    top_priorities: list[str] = Field(default_factory=list)


class ReviewResponse(BaseModel):
    review_id: int
    document_type: str
    perspective: str
    summary: ReviewSummaryResponse
    issues: list[ReviewIssueResponse]


class CompareResponse(BaseModel):
    comparison_id: int
    review_a: ReviewSummaryResponse
    review_b: ReviewSummaryResponse
    diff_issues: list[ReviewIssueResponse]
    recommendation_diff: dict[str, str]


class ReviewListItem(BaseModel):
    review_id: int
    review_type: str
    document_type: str | None = None
    overall_risk: str | None = None
    recommendation: str | None = None
    created_at: datetime


class ReviewListResponse(BaseModel):
    total: int
    items: list[ReviewListItem]


class ReviewDetailResponse(BaseModel):
    review_id: int
    review_type: str
    document_type: str | None = None
    perspective: str | None = None
    summary: ReviewSummaryResponse
    issues: list[ReviewIssueResponse]
    created_at: datetime


class ReviewCompareResponse(BaseModel):
    review_id_a: int
    review_id_b: int
    overall_risk_diff: dict[str, str | None]
    recommendation_diff: dict[str, str | None]
    issue_count_diff: int
    added_issues: list[ReviewIssueResponse]
    removed_issues: list[ReviewIssueResponse]
