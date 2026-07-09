from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from studyai.app import create_app
from studyai.systems.enterprise_ai.catalog import SYSTEMS
from studyai.systems.enterprise_ai.service import EnterpriseAiService


@pytest.mark.parametrize("system_id", sorted(SYSTEMS))
def test_enterprise_ai_system_executes_with_default_input(system_id: str) -> None:
    service = EnterpriseAiService()

    result = service.execute(system_id)

    assert result["system_id"] == system_id
    assert result["run_id"].startswith(f"{system_id}-")
    assert result["state"] in SYSTEMS[system_id].state_flow
    assert result["result"]["recommendations"]
    assert result["audit_log"]
    assert result["kpi_snapshot"]
    if not result["result"]["risk_flags"]:
        assert result["state"] not in {"escalated", "flagged", "reviewed"}
    assert service.list_runs(system_id)[0]["run_id"] == result["run_id"]


@pytest.mark.parametrize("system_id", sorted(SYSTEMS))
def test_enterprise_ai_api_routes_are_registered(system_id: str) -> None:
    client = TestClient(create_app())

    metadata = client.get(f"/api/{system_id}/metadata")
    executed = client.post(f"/api/{system_id}/execute", json={"input": {}, "mode": "mock"})
    runs = client.get(f"/api/{system_id}/runs")

    assert metadata.status_code == 200
    assert metadata.json()["system_id"] == system_id
    assert executed.status_code == 200
    assert executed.json()["system_id"] == system_id
    assert runs.status_code == 200
    assert runs.json()["runs"]


def test_enterprise_ai_masks_secret_like_values() -> None:
    service = EnterpriseAiService()

    result = service.execute("system37", {"input": {"api_key": "raw-key", "nested": {"password": "raw-password"}}})

    assert result["input"]["api_key"] == "***MASKED***"
    assert result["input"]["nested"]["password"] == "***MASKED***"


def test_enterprise_ai_lmstudio_mode_falls_back_to_mock() -> None:
    service = EnterpriseAiService()

    result = service.execute("system44", {"mode": "lmstudio"})

    assert result["kpi_snapshot"]["mock_fallback_count"] == 1
    assert any(entry["action"] == "lmstudio_fallback_to_mock" for entry in result["audit_log"])
