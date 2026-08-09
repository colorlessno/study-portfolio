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


def validate_system23(result: dict[str, Any]) -> None:
    output = result["result"]
    before = output["before"]
    after = output["after"]
    require(len(before) == len(after), "system23 must preserve the candidate count")
    require({row["text"] for row in before} == {row["text"] for row in after}, "system23 must preserve candidates")
    require(result["input"]["query"] in after[0]["text"], "system23 must promote the exact phrase candidate")


def validate_system24(result: dict[str, Any]) -> None:
    output = result["result"]
    rows = output["model_results"]
    models = result["input"]["models"]
    require([row["model"] for row in rows] == models, "system24 must return every model profile")
    require(output["selected_model"] in models, "system24 selected model must be one of the candidates")
    require(all({"quality", "latency_ms", "cost_index"} <= row.keys() for row in rows), "system24 metrics are incomplete")


def validate_system25(result: dict[str, Any]) -> None:
    rows = result["result"]["matrix_results"]
    expected = {
        (max_tokens, temperature)
        for max_tokens in result["input"]["max_tokens_values"]
        for temperature in result["input"]["temperatures"]
    }
    actual = {(row["max_tokens"], row["temperature"]) for row in rows}
    require(actual == expected, "system25 must execute the full configuration matrix")
    require(all(len(row["output"]) <= row["max_tokens"] * 4 for row in rows), "system25 mock output exceeded its character cap")


def validate_system26(result: dict[str, Any]) -> None:
    rows = result["result"]["profile_results"]
    require([row["profile"] for row in rows] == result["input"]["profiles"], "system26 must preserve profile order")
    require(all({"memory_index", "speed_index", "quality_index"} <= row.keys() for row in rows), "system26 profile metrics are incomplete")


def validate_system27(result: dict[str, Any]) -> None:
    rows = result["result"]["variant_results"]
    require(len(rows) == len(result["input"]["image_variants"]), "system27 must return every image variant")
    require(all(0 <= row["estimated_accuracy"] <= 1 for row in rows), "system27 estimated accuracy must be bounded")
    require(rows[-1]["estimated_accuracy"] > rows[0]["estimated_accuracy"], "system27 default large image must score above small")


def validate_system28(result: dict[str, Any]) -> None:
    output = result["result"]
    normalized = output["normalized_text"]
    require("O3" not in normalized and "03" in normalized, "system28 must apply the O-to-zero rule")
    require("  " not in normalized and "　" not in normalized, "system28 must normalize whitespace")
    require(output["diffs"][0]["after"] == normalized, "system28 diff must contain the normalized text")


def validate_system29(result: dict[str, Any]) -> None:
    output = result["result"]
    chunk = output["chunks"][0]
    metadata = result["input"]["metadata"]
    require(chunk["metadata"] == metadata, "system29 must preserve chunk metadata")
    require(output["citation_preview"] == [f"{metadata['source']}#{metadata['page']}"], "system29 citation preview is invalid")


def validate_system30(result: dict[str, Any]) -> None:
    groups = result["result"]["duplicate_groups"]
    valid_ids = {f"doc-{index + 1}" for index, _ in enumerate(result["input"]["documents"])}
    require(bool(groups), "system30 default input must return review candidates")
    for group in groups:
        require(group["document_id"] in valid_ids, "system30 returned an unknown document id")
        require(set(group["matches"]) <= valid_ids, "system30 returned an unknown match id")
        require(group["document_id"] not in group["matches"], "system30 must not match a document to itself")


def validate_system31(result: dict[str, Any]) -> None:
    output = result["result"]
    require(output["case"] == result["input"], "system31 must preserve the evaluation case")
    require(output["case_id"].startswith("case-"), "system31 case id is invalid")
    require(output["review_status"] == "draft", "system31 default case must start as draft")


def validate_system32(result: dict[str, Any]) -> None:
    output = result["result"]
    rows = output["case_results"]
    require(len(rows) == len(result["input"]["cases"]), "system32 must return every evaluation case")
    require(all({"case", "retrieval_hit", "answer_score"} <= row.keys() for row in rows), "system32 case result is incomplete")
    require(output["regression_diff"]["baseline"] == result["input"]["run_label"], "system32 baseline label is invalid")


def validate_system33(result: dict[str, Any]) -> None:
    output = result["result"]
    expected = set(result["input"]["expected_evidence"])
    retrieved = set(result["input"]["retrieval_results"])
    expected_recall = len(expected & retrieved) / max(1, len(expected))
    require(output["recall_at_k"]["k"] == len(result["input"]["retrieval_results"]), "system33 k must match result count")
    require(output["recall_at_k"]["recall"] == expected_recall, "system33 recall is invalid")
    require(output["hit_rate"] == (1.0 if expected & retrieved else 0.0), "system33 hit rate is invalid")


def validate_system34(result: dict[str, Any]) -> None:
    output = result["result"]
    scores = output["score_breakdown"]
    require({"correctness", "groundedness"} <= scores.keys(), "system34 score breakdown is incomplete")
    require(all(0 <= score <= 1 for score in scores.values()), "system34 scores must be bounded")
    require(scores["correctness"] == 1.0 and scores["groundedness"] == 1.0, "system34 default answer must pass both checks")
    require(isinstance(output["risk_flags"], list), "system34 risk flags must be a list")


def validate_system35(result: dict[str, Any]) -> None:
    output = result["result"]
    require(output["winner"] in {"A", "B"}, "system35 winner is invalid")
    require(set(output["score_diff"]) == {"A", "B"}, "system35 must score both prompts")
    require(output["changed_cases"] == result["input"]["cases"], "system35 must preserve evaluation cases")
    require(output["winner"] == "B", "system35 default mock must select prompt B")


def validate_system36(result: dict[str, Any]) -> None:
    output = result["result"]
    require(output["trace_id"].startswith("trace-"), "system36 trace id is invalid")
    require(output["trace_record"] == result["input"], "system36 must preserve the trace record")
    require(bool(output["replay_note"]), "system36 must provide a replay note")


SYSTEM_VALIDATORS: dict[str, Callable[[dict[str, Any]], None]] = {
    "system17": validate_system17,
    "system18": validate_system18,
    "system19": validate_system19,
    "system20": validate_system20,
    "system21": validate_system21,
    "system22": validate_system22,
    "system23": validate_system23,
    "system24": validate_system24,
    "system25": validate_system25,
    "system26": validate_system26,
    "system27": validate_system27,
    "system28": validate_system28,
    "system29": validate_system29,
    "system30": validate_system30,
    "system31": validate_system31,
    "system32": validate_system32,
    "system33": validate_system33,
    "system34": validate_system34,
    "system35": validate_system35,
    "system36": validate_system36,
}


def validate(system_ids: list[str], show_output: bool) -> None:
    service = LearningSystemService()
    for system_id in system_ids:
        run = service.execute(system_id)
        require(run["system_id"] == system_id, f"{system_id} returned a different system id")
        require(run["run_id"].startswith(f"{system_id}-"), f"{system_id} returned an invalid run id")
        require(bool(run["result"]), f"{system_id} returned an empty result")
        require(service.list_runs(system_id)[0]["run_id"] == run["run_id"], f"{system_id} run history was not updated")
        if system_id in SYSTEM_VALIDATORS:
            SYSTEM_VALIDATORS[system_id](run)
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
