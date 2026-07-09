from decimal import Decimal

from studyai.systems.system01.schemas.extract import ExtractResultPayload
from studyai.systems.system01.services.extract_service import ExtractService


def test_calculate_derived_values_marks_missing_required_fields():
    service = ExtractService()
    payload = ExtractResultPayload(
        document_type="請求書",
        supplier_name="株式会社テスト",
        total=Decimal("1000"),
    )
    derived = service._calculate_derived_values(payload)

    assert derived["requires_review"] is True
    assert "issue_date" in derived["missing_fields"]
    assert derived["confidence_score"] < Decimal("0.70")
