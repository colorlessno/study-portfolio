from __future__ import annotations

import hashlib
import json
from datetime import datetime, timezone
from typing import Any

from studyai.systems.enterprise_ai.catalog import SYSTEMS, EnterpriseAiSystem


SECRET_KEYS = ("api_key", "password", "token", "secret", "card_number")


class EnterpriseAiService:
    def __init__(self) -> None:
        self._runs: dict[str, list[dict[str, Any]]] = {system_id: [] for system_id in SYSTEMS}

    def get_system(self, system_id: str) -> EnterpriseAiSystem:
        if system_id not in SYSTEMS:
            raise KeyError(system_id)
        return SYSTEMS[system_id]

    def execute(self, system_id: str, payload: dict[str, Any] | None = None) -> dict[str, Any]:
        system = self.get_system(system_id)
        request = payload or {}
        input_data = request.get("input", system.default_input) if "input" in request else request
        if not isinstance(input_data, dict):
            raise ValueError("input must be an object")

        mode = str(request.get("mode", "mock")) if isinstance(request, dict) else "mock"
        operator = str(request.get("operator", "learner")) if isinstance(request, dict) else "learner"
        merged_input = self._mask_secrets({**system.default_input, **input_data})
        run_id = self._run_id(system_id, merged_input)
        started_at = datetime.now(timezone.utc)
        fallback = mode == "lmstudio"
        result = self._mock_decision(system, merged_input)
        audit_log = self._audit_log(system, run_id, operator, merged_input, fallback)
        kpi_snapshot = self._kpi_snapshot(system, result, fallback)
        run = {
            "run_id": run_id,
            "system_id": system.system_id,
            "title": system.title,
            "pattern": system.pattern,
            "state": result["state"],
            "input": merged_input,
            "result": result,
            "audit_log": audit_log,
            "kpi_snapshot": kpi_snapshot,
            "created_at": started_at.isoformat(),
        }
        self._runs[system_id].insert(0, run)
        self._runs[system_id] = self._runs[system_id][:20]
        return run

    def list_runs(self, system_id: str) -> list[dict[str, Any]]:
        self.get_system(system_id)
        return self._runs[system_id]

    def _mock_decision(self, system: EnterpriseAiSystem, input_data: dict[str, Any]) -> dict[str, Any]:
        handler = getattr(self, f"_{system.system_id}", self._generic)
        summary, recommendations, risk_flags = handler(input_data)
        state = self._final_state(system, risk_flags)
        return {
            "summary": summary,
            "state": state,
            "recommendations": recommendations,
            "explanations": [
                f"{system.pattern} の教材用mock判定です。",
                "実企業システムそのものを再現するのではなく、判断境界と監査を学ぶための結果です。",
            ],
            "risk_flags": risk_flags,
        }

    def _system37(self, data: dict[str, Any]) -> tuple[str, list[dict[str, Any]], list[str]]:
        budget = int(data.get("request_conditions", {}).get("budget", 0))
        candidates = [item for item in data.get("candidate_inventory", []) if item.get("available")]
        ranked = sorted(candidates, key=lambda item: (item.get("price", 0) > budget, item.get("price", 0)))
        risks = [] if data.get("identity_status") == "verified" else ["本人確認未完了"]
        if ranked and ranked[0].get("price", 0) > budget:
            risks.append("価格条件不一致")
        return "確認付きで実行候補を選定しました。", ranked[:3], risks

    def _system38(self, data: dict[str, Any]) -> tuple[str, list[dict[str, Any]], list[str]]:
        interests = set(data.get("user_profile", {}).get("interests", []))
        items = data.get("item_catalog", [])
        ranked = sorted(
            [
                {
                    **item,
                    "score": round(len(interests.intersection(item.get("tags", []))) + float(item.get("freshness", 0)), 3),
                }
                for item in items
            ],
            key=lambda item: item["score"],
            reverse=True,
        )
        risks = ["同質推薦"] if len({tag for item in ranked[:2] for tag in item.get("tags", [])}) <= 2 else []
        return "行動イベントと鮮度から推薦順位を生成しました。", ranked, risks

    def _system39(self, data: dict[str, Any]) -> tuple[str, list[dict[str, Any]], list[str]]:
        text = str(data.get("inquiry_text", ""))
        intent = "address_change" if "住所" in text else "general_question"
        authenticated = bool(data.get("customer_context", {}).get("authenticated"))
        risks = [] if authenticated else ["権限外操作"]
        return "問い合わせを分類し、必要な業務操作を判定しました。", [{"intent": intent, "next_action": "update_address" if intent == "address_change" else "answer"}], risks

    def _system40(self, data: dict[str, Any]) -> tuple[str, list[dict[str, Any]], list[str]]:
        history = [float(v) for v in data.get("sales_history", [])]
        forecast = round(sum(history[-3:]) / max(1, min(3, len(history))) * 1.1, 2) if history else 0
        stock = int(next(iter(data.get("inventory_snapshot", {"sku": 0}).values())))
        reorder = max(0, int(forecast * int(data.get("lead_time", 1)) - stock))
        risks = ["欠品"] if reorder > 0 else []
        return "直近需要から補充量を算出しました。", [{"forecast": forecast, "current_stock": stock, "reorder_quantity": reorder}], risks

    def _system41(self, data: dict[str, Any]) -> tuple[str, list[dict[str, Any]], list[str]]:
        width = int(data.get("image_metadata", {}).get("width", 0))
        threshold = float(data.get("confidence_threshold", 0.75))
        confidence = min(0.95, max(0.4, width / 1600))
        risks = [] if confidence >= threshold else ["低信頼判定"]
        return "画像メタデータとセンサーイベントから検出結果を作成しました。", [{"object": "item", "confidence": round(confidence, 3)}], risks

    def _system42(self, data: dict[str, Any]) -> tuple[str, list[dict[str, Any]], list[str]]:
        event = data.get("transaction_event", {})
        profile = data.get("account_profile", {})
        amount = float(event.get("amount", 0))
        usual = max(1.0, float(profile.get("usual_amount", 1)))
        risk_score = min(1.0, amount / usual / 10 + (0.2 if data.get("device_signal", {}).get("new_device") else 0))
        risks = ["監査証跡不足"] if risk_score >= 0.8 else []
        return "取引金額と端末シグナルからリスクを算出しました。", [{"risk_score": round(risk_score, 3), "action": "block" if risk_score >= 0.8 else "review"}], risks

    def _system43(self, data: dict[str, Any]) -> tuple[str, list[dict[str, Any]], list[str]]:
        jobs = data.get("jobs", [])
        resources = data.get("resources", [])
        capacity = sum(int(resource.get("capacity", 0)) for resource in resources)
        risks = ["制約違反"] if len(jobs) > capacity else []
        plan = [{"resource": resource.get("id"), "jobs": [job.get("id") for job in jobs[index:: max(1, len(resources))]]} for index, resource in enumerate(resources)]
        return "制約を満たす割当案を生成しました。", plan, risks

    def _system44(self, data: dict[str, Any]) -> tuple[str, list[dict[str, Any]], list[str]]:
        variants = data.get("variant_results", {})
        control = variants.get("control", {})
        variant = variants.get("variant", {})
        control_rate = control.get("conversions", 0) / max(1, control.get("users", 1))
        variant_rate = variant.get("conversions", 0) / max(1, variant.get("users", 1))
        uplift = round(variant_rate - control_rate, 4)
        total_sample = control.get("users", 0) + variant.get("users", 0)
        risks = ["サンプル不足"] if total_sample < 1000 else []
        return "実験KPIとガードレールから展開判断を作成しました。", [{"uplift": uplift, "recommendation": "rollout" if uplift > 0 and not risks else "continue_test"}], risks

    def _generic(self, data: dict[str, Any]) -> tuple[str, list[dict[str, Any]], list[str]]:
        return "入力から教材用の判断結果を生成しました。", [{"input_keys": sorted(data)}], []

    def _final_state(self, system: EnterpriseAiSystem, risks: list[str]) -> str:
        if risks:
            for state in ("escalated", "reviewed", "flagged"):
                if state in system.state_flow:
                    return state
        for state in ("executed", "displayed", "completed", "exported", "accepted", "cleared", "decided", "approved"):
            if state in system.state_flow:
                return state
        return system.state_flow[-1]

    def _audit_log(
        self,
        system: EnterpriseAiSystem,
        run_id: str,
        operator: str,
        input_data: dict[str, Any],
        fallback: bool,
    ) -> list[dict[str, Any]]:
        now = datetime.now(timezone.utc).isoformat()
        entries = [
            {
                "timestamp": now,
                "run_id": run_id,
                "system_id": system.system_id,
                "actor": operator,
                "action": "request_received",
                "reason": "教材入力を受け付けました。",
                "input_hash": self._hash(input_data),
            },
            {
                "timestamp": now,
                "run_id": run_id,
                "system_id": system.system_id,
                "actor": "system",
                "action": "decision_generated",
                "reason": "deterministic mock engine で判断しました。",
                "input_hash": self._hash(input_data),
            },
        ]
        if fallback:
            entries.append(
                {
                    "timestamp": now,
                    "run_id": run_id,
                    "system_id": system.system_id,
                    "actor": "system",
                    "action": "lmstudio_fallback_to_mock",
                    "reason": "LM Studio はローカル起動前提のため、未接続時は mock に切り替えます。",
                    "input_hash": self._hash(input_data),
                }
            )
        entries.append(
            {
                "timestamp": now,
                "run_id": run_id,
                "system_id": system.system_id,
                "actor": "system",
                "action": "execution_completed",
                "reason": "監査ログとKPIを生成しました。",
                "input_hash": self._hash(input_data),
            }
        )
        return entries

    def _kpi_snapshot(self, system: EnterpriseAiSystem, result: dict[str, Any], fallback: bool) -> dict[str, Any]:
        values = {name: round((index + 1) / (len(system.kpi_definitions) + 1), 3) for index, name in enumerate(system.kpi_definitions)}
        values["risk_flag_count"] = len(result.get("risk_flags", []))
        values["mock_fallback_count"] = 1 if fallback else 0
        values["latency_ms"] = 120 + len(system.system_id)
        return values

    def _mask_secrets(self, value: Any) -> Any:
        if isinstance(value, dict):
            return {key: ("***MASKED***" if any(token in key.lower() for token in SECRET_KEYS) else self._mask_secrets(item)) for key, item in value.items()}
        if isinstance(value, list):
            return [self._mask_secrets(item) for item in value]
        return value

    def _run_id(self, prefix: str, payload: dict[str, Any]) -> str:
        digest = self._hash(payload)[:10]
        return f"{prefix}-{digest}"

    def _hash(self, payload: dict[str, Any]) -> str:
        raw = json.dumps(payload, ensure_ascii=False, sort_keys=True, default=str)
        return hashlib.sha1(raw.encode("utf-8")).hexdigest()


enterprise_ai_service = EnterpriseAiService()
