from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class EnterpriseAiSystem:
    system_id: str
    title: str
    pattern: str
    default_input: dict[str, Any]
    state_flow: list[str]
    kpi_definitions: list[str]
    risk_points: list[str]


SYSTEMS: dict[str, EnterpriseAiSystem] = {
    "system37": EnterpriseAiSystem(
        system_id="system37",
        title="取引実行型AIコンシェルジュ",
        pattern="予約・申込・注文の業務実行",
        default_input={
            "customer_profile": {"segment": "member", "verified": True},
            "request_conditions": {"route": "Tokyo to Osaka", "date": "2026-05-15", "budget": 18000},
            "candidate_inventory": [
                {"id": "plan-a", "price": 16500, "available": True, "changeable": True},
                {"id": "plan-b", "price": 21000, "available": True, "changeable": False},
            ],
            "price_rules": {"max_budget_required": True, "confirmation_required": True},
            "identity_status": "verified",
        },
        state_flow=["hearing", "proposed", "confirming", "executed", "changed", "cancelled", "escalated"],
        kpi_definitions=[
            "execution_success_rate",
            "confirmation_rate",
            "cancellation_rate",
            "policy_violation_count",
            "average_response_ms",
        ],
        risk_points=["本人確認未完了", "価格条件不一致", "取消条件違反", "実行前確認漏れ"],
    ),
    "system38": EnterpriseAiSystem(
        system_id="system38",
        title="リアルタイム推薦・パーソナライズ",
        pattern="推薦・ランキング・パーソナライズ",
        default_input={
            "user_profile": {"segment": "repeat", "interests": ["coffee", "work"]},
            "behavior_events": ["view:beans", "cart:dripper", "view:subscription"],
            "item_catalog": [
                {"id": "item-a", "tags": ["coffee", "subscription"], "freshness": 0.9},
                {"id": "item-b", "tags": ["tea", "gift"], "freshness": 0.7},
                {"id": "item-c", "tags": ["coffee", "tool"], "freshness": 0.8},
            ],
            "context": {"device": "mobile", "time_band": "morning"},
            "exclusion_rules": ["out_of_stock"],
        },
        state_flow=["collected", "scored", "ranked", "displayed", "feedback_recorded", "retrained_candidate"],
        kpi_definitions=["click_through_rate", "conversion_rate", "diversity_score", "freshness_score", "latency_ms"],
        risk_points=["過剰最適化", "同質推薦", "除外条件漏れ", "説明不足"],
    ),
    "system39": EnterpriseAiSystem(
        system_id="system39",
        title="業務実行型カスタマーサポートAI",
        pattern="問い合わせ分類・回答・手続き実行",
        default_input={
            "customer_context": {"contract": "standard", "authenticated": True},
            "inquiry_text": "配送先住所を変更したいです",
            "contract_status": "active",
            "faq_candidates": ["住所変更は出荷前のみ可能です", "返金は7日以内です"],
            "operation_policy": {"address_change_requires_auth": True},
        },
        state_flow=["received", "classified", "answered", "action_pending", "completed", "escalated"],
        kpi_definitions=[
            "automation_rate",
            "escalation_rate",
            "first_contact_resolution",
            "policy_block_count",
            "answer_quality_score",
        ],
        risk_points=["権限外操作", "誤回答", "個人情報露出", "エスカレーション遅延"],
    ),
    "system40": EnterpriseAiSystem(
        system_id="system40",
        title="需要予測・在庫最適化AI",
        pattern="需要予測・補充判断・在庫配分",
        default_input={
            "sales_history": [18, 21, 19, 25, 31, 29, 35],
            "inventory_snapshot": {"sku-100": 42},
            "lead_time": 3,
            "promotion_calendar": [{"date": "2026-05-20", "lift": 1.3}],
            "store_constraints": {"min_stock": 20, "shelf_capacity": 80},
        },
        state_flow=["loaded", "forecasted", "optimized", "reviewed", "approved", "exported"],
        kpi_definitions=["forecast_error", "stockout_risk_rate", "surplus_cost", "service_level", "replenishment_count"],
        risk_points=["欠品", "過剰在庫", "季節性無視", "リードタイム誤り"],
    ),
    "system41": EnterpriseAiSystem(
        system_id="system41",
        title="コンピュータビジョン / マルチモーダルAI",
        pattern="画像・センサー入力の判定と業務連携",
        default_input={
            "image_metadata": {"width": 1280, "height": 720, "quality": "normal"},
            "detection_candidates": ["item", "hand", "shelf_gap"],
            "sensor_events": [{"type": "weight_change", "value": -1}],
            "location_context": {"zone": "shelf-a"},
            "confidence_threshold": 0.75,
        },
        state_flow=["captured", "prechecked", "detected", "reviewed", "accepted", "rejected"],
        kpi_definitions=["precision_proxy", "recall_proxy", "review_rate", "false_positive_count", "processing_ms"],
        risk_points=["低信頼判定", "画像品質不足", "誤検知", "レビュー未実施"],
    ),
    "system42": EnterpriseAiSystem(
        system_id="system42",
        title="不正検知・異常検知AI",
        pattern="取引・行動ログのリスク検知",
        default_input={
            "transaction_event": {"amount": 98000, "country": "JP", "hour": 2},
            "account_profile": {"usual_amount": 12000, "usual_country": "JP"},
            "device_signal": {"new_device": True, "ip_reputation": "medium"},
            "historical_patterns": {"chargeback_count": 0},
            "rule_thresholds": {"amount_multiplier": 5, "risk_block": 0.8},
        },
        state_flow=["ingested", "scored", "flagged", "investigated", "cleared", "blocked"],
        kpi_definitions=["alert_precision_proxy", "blocked_count", "investigation_rate", "false_positive_rate", "response_ms"],
        risk_points=["誤検知", "見逃し", "説明不足", "監査証跡不足"],
    ),
    "system43": EnterpriseAiSystem(
        system_id="system43",
        title="制約最適化AI",
        pattern="配送・シフト・割当の制約最適化",
        default_input={
            "jobs": [{"id": "job-1", "duration": 30}, {"id": "job-2", "duration": 45}],
            "resources": [{"id": "driver-a", "capacity": 3}, {"id": "driver-b", "capacity": 2}],
            "constraints": {"max_duration": 120, "must_visit": ["job-1"]},
            "cost_weights": {"distance": 1.0, "delay": 2.0},
            "time_windows": {"job-1": "09:00-11:00", "job-2": "10:00-12:00"},
        },
        state_flow=["prepared", "solved", "validated", "adjusted", "approved", "exported"],
        kpi_definitions=[
            "cost_reduction_rate",
            "constraint_satisfaction_rate",
            "route_count",
            "overtime_minutes",
            "solve_ms",
        ],
        risk_points=["制約違反", "現場実行不能", "局所最適", "説明不能"],
    ),
    "system44": EnterpriseAiSystem(
        system_id="system44",
        title="AI KPI / 実験評価ダッシュボード",
        pattern="AI施策の実験評価・KPI監視",
        default_input={
            "experiment_config": {"name": "recommendation-v2", "primary_kpi": "conversion_rate"},
            "variant_results": {"control": {"users": 1000, "conversions": 82}, "variant": {"users": 980, "conversions": 96}},
            "guardrail_metrics": {"latency_ms": 420, "complaint_rate": 0.01},
            "segment_filters": ["member"],
            "evaluation_period": "2026-05-01/2026-05-14",
        },
        state_flow=["configured", "collecting", "evaluated", "reviewed", "decided", "archived"],
        kpi_definitions=["uplift", "confidence_proxy", "guardrail_violation_count", "sample_size", "decision_cycle_days"],
        risk_points=["サンプル不足", "KPI取り違え", "ガードレール無視", "結論の早出し"],
    ),
}
