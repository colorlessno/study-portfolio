from __future__ import annotations

import pytest

from studyai.systems.ai_learning.catalog import SYSTEMS
from studyai.systems.ai_learning.service import LearningSystemService


@pytest.mark.parametrize("system_id", sorted(SYSTEMS))
def test_ai_learning_system_executes_with_default_input(system_id: str) -> None:
    service = LearningSystemService()

    result = service.execute(system_id)

    assert result["system_id"] == system_id
    assert result["run_id"].startswith(f"{system_id}-")
    assert result["result"]
    assert service.list_runs(system_id)[0]["run_id"] == result["run_id"]


def test_system18_ranks_similar_document_first() -> None:
    service = LearningSystemService()

    result = service.execute(
        "system18",
        {
            "query": "返品",
            "documents": ["配送について", "返品について", "請求書について"],
            "top_k": 3,
        },
    )

    assert result["result"]["results"][0]["text"] == "返品について"


def test_system36_returns_trace_id() -> None:
    service = LearningSystemService()

    result = service.execute(
        "system36",
        {
            "user_input": "返品期限は？",
            "retrieved_context": ["返品条件は7日以内"],
            "output": "7日以内です",
        },
    )

    assert result["result"]["trace_id"].startswith("trace-")

