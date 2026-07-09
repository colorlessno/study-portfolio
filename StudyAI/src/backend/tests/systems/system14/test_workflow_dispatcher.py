from __future__ import annotations

import asyncio

from studyai.systems.system14.services.workflow_dispatcher import WorkflowDispatcher


def test_workflow_dispatcher_normalizes_ui_filters() -> None:
    filters = WorkflowDispatcher._normalize_filters(
        {
            "fromDate": "2026-04-01",
            "to_date": "2026-04-22",
            "product": " 商品A ",
            "callReason": "配送確認",
            "staffId": "staff_001",
            "type": "クレーム",
        }
    )

    assert filters["from_date"].isoformat() == "2026-04-01"
    assert filters["to_date"].isoformat() == "2026-04-22"
    assert filters["product"] == "商品A"
    assert filters["call_reason"] == "配送確認"
    assert filters["staff_id"] == "staff_001"
    assert filters["utterance_type"] == "クレーム"


def test_workflow_dispatcher_dashboard_delivery_succeeds() -> None:
    status, response, error_message = asyncio.run(
        WorkflowDispatcher()._deliver("dashboard", {"method": "dashboard"}, {"output": {"type": "voice_ranking"}})
    )

    assert status == "success"
    assert response["log_table"] == "system14_workflow_delivery_logs"
    assert error_message is None


def test_workflow_dispatcher_email_delivery_skips_without_smtp(monkeypatch) -> None:
    monkeypatch.delenv("SYSTEM14_SMTP_HOST", raising=False)

    status, response, error_message = asyncio.run(
        WorkflowDispatcher()._deliver("email", {"method": "email", "recipients": ["team@example.com"]}, {})
    )

    assert status == "skipped"
    assert response["message"] == "smtp_not_configured"
    assert error_message == "SYSTEM14_SMTP_HOST is not configured."


def test_workflow_dispatcher_crm_delivery_returns_explicit_failure() -> None:
    status, response, error_message = asyncio.run(
        WorkflowDispatcher()._deliver("crm", {"method": "crm", "endpoint": "crm://local"}, {})
    )

    assert status == "failed"
    assert response["message"] == "crm_delivery_not_configured"
    assert error_message is not None
