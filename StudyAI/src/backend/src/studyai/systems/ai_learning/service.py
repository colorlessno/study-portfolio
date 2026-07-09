from __future__ import annotations

import hashlib
import math
import re
from datetime import datetime, timezone
from typing import Any

from studyai.systems.ai_learning.catalog import SYSTEMS, LearningSystem


class LearningSystemService:
    def __init__(self) -> None:
        self._runs: dict[str, list[dict[str, Any]]] = {system_id: [] for system_id in SYSTEMS}

    def get_system(self, system_id: str) -> LearningSystem:
        if system_id not in SYSTEMS:
            raise KeyError(system_id)
        return SYSTEMS[system_id]

    def execute(self, system_id: str, payload: dict[str, Any] | None = None) -> dict[str, Any]:
        system = self.get_system(system_id)
        input_data = {**system.default_input, **(payload or {})}
        result = self._execute_by_category(system.category, input_data)
        run = {
            "run_id": self._run_id(system_id, input_data),
            "system_id": system_id,
            "title": system.title,
            "category": system.category,
            "input": input_data,
            "result": result,
            "observation": system.observation_hint,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        self._runs[system_id].insert(0, run)
        self._runs[system_id] = self._runs[system_id][:20]
        return run

    def list_runs(self, system_id: str) -> list[dict[str, Any]]:
        self.get_system(system_id)
        return self._runs[system_id]

    def _execute_by_category(self, category: str, data: dict[str, Any]) -> dict[str, Any]:
        handlers = {
            "tokenizer": self._tokenizer,
            "embedding": self._embedding,
            "attention": self._attention,
            "context": self._context,
            "generation": self._generation,
            "chunking": self._chunking,
            "reranker": self._reranker,
            "model_compare": self._model_compare,
            "output_control": self._output_control,
            "quantization": self._quantization,
            "vlm": self._vlm,
            "ocr_normalize": self._ocr_normalize,
            "metadata": self._metadata,
            "duplicate": self._duplicate,
            "ground_truth": self._ground_truth,
            "rag_eval": self._rag_eval,
            "retrieval_eval": self._retrieval_eval,
            "answer_eval": self._answer_eval,
            "prompt_ab": self._prompt_ab,
            "trace": self._trace,
        }
        return handlers[category](data)

    def _tokenizer(self, data: dict[str, Any]) -> dict[str, Any]:
        text = str(data.get("text", ""))
        tokens = self._tokens(text)
        limit = int(data.get("context_limit", 128))
        return {
            "char_count": len(text),
            "estimated_tokens": len(tokens),
            "token_segments": tokens,
            "over_limit": len(tokens) > limit,
            "notes": ["Japanese text often uses fewer spaces, so token boundaries are less visible."],
        }

    def _embedding(self, data: dict[str, Any]) -> dict[str, Any]:
        query = str(data.get("query", ""))
        docs = [str(d) for d in data.get("documents", [])]
        top_k = int(data.get("top_k", len(docs) or 1))
        ranked = sorted(
            [{"document_id": f"doc-{i+1}", "text": doc, "score": self._similarity(query, doc)} for i, doc in enumerate(docs)],
            key=lambda item: item["score"],
            reverse=True,
        )
        return {"query": query, "results": ranked[:top_k]}

    def _attention(self, data: dict[str, Any]) -> dict[str, Any]:
        tokens = self._tokens(str(data.get("sentence", "")))
        matrix = []
        for i, left in enumerate(tokens):
            row = []
            for j, right in enumerate(tokens):
                row.append(round(1 / (1 + abs(i - j)) + (0.2 if left == right else 0), 3))
            matrix.append(row)
        focus = int(data.get("focus_token_index", 0))
        return {"tokens": tokens, "attention_matrix": matrix, "focus_relations": matrix[focus] if tokens else []}

    def _context(self, data: dict[str, Any]) -> dict[str, Any]:
        text = str(data.get("text", ""))
        tokens = self._tokens(text)
        limit = int(data.get("context_limit", 128))
        retained = tokens[:limit]
        marker = str(data.get("important_marker", ""))
        return {
            "estimated_tokens": len(tokens),
            "truncated": len(tokens) > limit,
            "retained_text": " ".join(retained),
            "missing_markers": [] if marker and marker in " ".join(retained) else ([marker] if marker else []),
        }

    def _generation(self, data: dict[str, Any]) -> dict[str, Any]:
        prompt = str(data.get("prompt", ""))
        temperatures = data.get("temperatures", [0.2, 0.8])
        trial_count = int(data.get("trial_count", 2))
        runs = []
        for temp in temperatures:
            for trial in range(trial_count):
                runs.append({"temperature": temp, "trial": trial + 1, "text": f"{prompt}: response variation {round(float(temp) * (trial + 1), 2)}"})
        return {"runs": runs, "diff_summary": {"count": len(runs)}, "recommendation": "Use lower temperature for repeatable business workflows."}

    def _chunking(self, data: dict[str, Any]) -> dict[str, Any]:
        text = str(data.get("document", ""))
        size = int(data.get("chunk_size", 100))
        overlap = int(data.get("overlap", 0))
        step = max(1, size - overlap)
        chunks = [text[i : i + size] for i in range(0, len(text), step)]
        return {"chunks": chunks, "chunk_count": len(chunks), "evaluation_notes": ["Compare whether evidence is split across chunks."]}

    def _reranker(self, data: dict[str, Any]) -> dict[str, Any]:
        query = str(data.get("query", ""))
        candidates = [str(c) for c in data.get("candidates", [])]
        before = [{"text": c, "score": self._similarity(query, c)} for c in candidates]
        after = sorted(before, key=lambda x: x["score"] + (0.5 if query in x["text"] else 0), reverse=True)
        return {"before": before, "after": after, "improvement_note": "Exact phrase matches receive a rerank bonus."}

    def _model_compare(self, data: dict[str, Any]) -> dict[str, Any]:
        models = data.get("models") or data.get("model_profiles") or []
        results = [{"model": model, "quality": 70 + i * 5, "latency_ms": 300 + i * 120, "cost_index": i + 1} for i, model in enumerate(models)]
        return {"model_results": results, "selected_model": results[0]["model"] if results else None}

    def _output_control(self, data: dict[str, Any]) -> dict[str, Any]:
        prompt = str(data.get("prompt", ""))
        matrix = []
        for max_tokens in data.get("max_tokens_values", [20]):
            for temp in data.get("temperatures", [0.2]):
                text = (prompt + " ") * max(1, int(max_tokens) // max(1, len(self._tokens(prompt))))
                matrix.append({"max_tokens": max_tokens, "temperature": temp, "output": text[: int(max_tokens) * 4], "cutoff": len(text) > int(max_tokens) * 4})
        return {"matrix_results": matrix, "recommendation": "Set enough max_tokens for complete answers, then control variation separately."}

    def _quantization(self, data: dict[str, Any]) -> dict[str, Any]:
        profiles = data.get("profiles") or data.get("quantization_profiles") or []
        return {"profile_results": [{"profile": p, "memory_index": i + 1, "speed_index": len(profiles) - i, "quality_index": 60 + i * 10} for i, p in enumerate(profiles)]}

    def _vlm(self, data: dict[str, Any]) -> dict[str, Any]:
        expected = int(data.get("expected_points", 5))
        variants = data.get("image_variants", [])
        return {"variant_results": [{"name": v.get("name", "image"), "estimated_accuracy": min(1.0, float(v.get("width", 320)) / 1280), "expected_points": expected} for v in variants]}

    def _ocr_normalize(self, data: dict[str, Any]) -> dict[str, Any]:
        text = str(data.get("ocr_text", ""))
        normalized = text.replace("O", "0").replace("　", " ")
        normalized = re.sub(r"\s+", " ", normalized).strip()
        return {"normalized_text": normalized, "diffs": [{"before": text, "after": normalized}], "review_flags": []}

    def _metadata(self, data: dict[str, Any]) -> dict[str, Any]:
        document = str(data.get("document", ""))
        metadata = dict(data.get("metadata", {}))
        chunks = [{"chunk_id": "chunk-1", "text": document, "metadata": metadata}]
        return {"chunks": chunks, "citation_preview": [f"{metadata.get('source', 'unknown')}#{metadata.get('page', 1)}"]}

    def _duplicate(self, data: dict[str, Any]) -> dict[str, Any]:
        docs = [str(d) for d in data.get("documents", [])]
        groups = []
        for i, left in enumerate(docs):
            matches = [f"doc-{j+1}" for j, right in enumerate(docs) if i != j and self._similarity(left, right) >= float(data.get("similarity_threshold", 0.5))]
            if matches:
                groups.append({"document_id": f"doc-{i+1}", "matches": matches})
        return {"duplicate_groups": groups}

    def _ground_truth(self, data: dict[str, Any]) -> dict[str, Any]:
        case_id = self._run_id("case", data)
        return {"case_id": case_id, "case": data, "review_status": "draft"}

    def _rag_eval(self, data: dict[str, Any]) -> dict[str, Any]:
        cases = data.get("cases", [])
        return {"case_results": [{"case": case, "retrieval_hit": True, "answer_score": 0.8} for case in cases], "regression_diff": {"baseline": data.get("run_label", "baseline")}}

    def _retrieval_eval(self, data: dict[str, Any]) -> dict[str, Any]:
        expected = set(data.get("expected_evidence", []))
        results = list(data.get("retrieval_results", []))
        hit = bool(expected.intersection(results))
        return {"hit_rate": 1.0 if hit else 0.0, "recall_at_k": {"k": len(results), "recall": len(expected.intersection(results)) / max(1, len(expected))}, "failure_cases": [] if hit else ["expected evidence not found"]}

    def _answer_eval(self, data: dict[str, Any]) -> dict[str, Any]:
        expected = str(data.get("expected_answer", ""))
        generated = str(data.get("generated_answer", ""))
        grounded = any(str(e) in generated or expected in str(e) for e in data.get("evidence", []))
        return {"score_breakdown": {"correctness": 1.0 if expected in generated else 0.5, "groundedness": 1.0 if grounded else 0.0}, "risk_flags": [] if grounded else ["missing_evidence"]}

    def _prompt_ab(self, data: dict[str, Any]) -> dict[str, Any]:
        a_score = len(str(data.get("prompt_a", "")))
        b_score = len(str(data.get("prompt_b", ""))) + 5
        return {"winner": "B" if b_score >= a_score else "A", "score_diff": {"A": a_score, "B": b_score}, "changed_cases": data.get("cases", [])}

    def _trace(self, data: dict[str, Any]) -> dict[str, Any]:
        trace_id = self._run_id("trace", data)
        return {"trace_id": trace_id, "trace_record": data, "replay_note": "Replay with the same prompt, context, and model_config."}

    def _tokens(self, text: str) -> list[str]:
        return re.findall(r"[A-Za-z0-9_]+|[^\sA-Za-z0-9_]", text)

    def _similarity(self, left: str, right: str) -> float:
        left_tokens = set(self._tokens(left.lower()))
        right_tokens = set(self._tokens(right.lower()))
        if not left_tokens or not right_tokens:
            return 0.0
        return round(len(left_tokens & right_tokens) / math.sqrt(len(left_tokens) * len(right_tokens)), 3)

    def _run_id(self, prefix: str, payload: dict[str, Any]) -> str:
        digest = hashlib.sha1(repr(sorted(payload.items())).encode("utf-8")).hexdigest()[:10]
        return f"{prefix}-{digest}"


learning_service = LearningSystemService()

