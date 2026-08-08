from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any, Callable


STUDY_AI_ROOT = Path(__file__).resolve().parents[1]
BACKEND_SOURCE = STUDY_AI_ROOT / "src" / "backend" / "src"
sys.path.insert(0, str(BACKEND_SOURCE))

from studyai.systems.ai_learning.catalog import SYSTEMS  # noqa: E402
from studyai.systems.ai_learning.service import LearningSystemService  # noqa: E402


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def validate_system17(result: dict[str, Any]) -> None:
    output = result["result"]
    require(output["char_count"] > 0, "system17 must count characters")
    require(output["estimated_tokens"] == len(output["token_segments"]), "system17 token count must match segments")


def validate_system18(result: dict[str, Any]) -> None:
    rows = result["result"]["results"]
    require(bool(rows), "system18 must return ranked documents")
    require(rows == sorted(rows, key=lambda row: row["score"], reverse=True), "system18 results must be score ordered")


def validate_system19(result: dict[str, Any]) -> None:
    output = result["result"]
    token_count = len(output["tokens"])
    require(token_count > 0, "system19 must return tokens")
    require(len(output["attention_matrix"]) == token_count, "system19 matrix row count must match tokens")
    require(all(len(row) == token_count for row in output["attention_matrix"]), "system19 matrix must be square")


def validate_system20(result: dict[str, Any]) -> None:
    output = result["result"]
    require(output["truncated"] is True, "system20 default input must demonstrate truncation")
    require(output["estimated_tokens"] > 40, "system20 default input must exceed its context limit")


def validate_system21(result: dict[str, Any]) -> None:
    runs = result["result"]["runs"]
    require(len(runs) == 6, "system21 default matrix must contain six runs")
    require({row["temperature"] for row in runs} == {0.1, 0.7}, "system21 must compare both temperatures")


def validate_system22(result: dict[str, Any]) -> None:
    output = result["result"]
    require(output["chunk_count"] == len(output["chunks"]), "system22 chunk count must match chunks")
    require(output["chunk_count"] > 1, "system22 default input must create multiple chunks")


FOUNDATION_VALIDATORS: dict[str, Callable[[dict[str, Any]], None]] = {
    "system17": validate_system17,
    "system18": validate_system18,
    "system19": validate_system19,
    "system20": validate_system20,
    "system21": validate_system21,
    "system22": validate_system22,
}


def validate(system_ids: list[str], show_output: bool) -> None:
    service = LearningSystemService()
    for system_id in system_ids:
        run = service.execute(system_id)
        require(run["system_id"] == system_id, f"{system_id} returned a different system id")
        require(run["run_id"].startswith(f"{system_id}-"), f"{system_id} returned an invalid run id")
        require(bool(run["result"]), f"{system_id} returned an empty result")
        require(service.list_runs(system_id)[0]["run_id"] == run["run_id"], f"{system_id} run history was not updated")
        if system_id in FOUNDATION_VALIDATORS:
            FOUNDATION_VALIDATORS[system_id](run)
        print(f"PASS {system_id}: {run['title']} ({run['category']})")
        if show_output:
            print(json.dumps(run, ensure_ascii=False, indent=2))


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate StudyAI systems 17-36 without external services.")
    parser.add_argument("system_ids", nargs="*", help="system17 through system36; omit to validate all")
    parser.add_argument("--show-output", action="store_true", help="print input, result, and observation as JSON")
    args = parser.parse_args()

    requested = args.system_ids or sorted(SYSTEMS)
    unknown = [system_id for system_id in requested if system_id not in SYSTEMS]
    if unknown:
        parser.error(f"unknown system id: {', '.join(unknown)}")

    validate(requested, args.show_output)
    print(f"StudyAI learning validation passed: {', '.join(requested)}")


if __name__ == "__main__":
    main()
