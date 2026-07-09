from __future__ import annotations

import re


class RiskReviewEngine:
    def classify_document_type(self, text: str) -> str:
        lowered = text.casefold()
        if "秘密保持" in text or "nda" in lowered:
            return "NDA（秘密保持契約）"
        if "業務委託" in text:
            return "業務委託契約書"
        if "売買" in text:
            return "売買契約書"
        if "賃貸" in text:
            return "賃貸借契約書"
        if "雇用" in text:
            return "雇用契約書"
        return "その他"

    def run_review(self, *, chunks: list[dict], document_text: str, perspective: str) -> list[dict]:
        issues = []
        for chunk in chunks:
            article = chunk.get("article")
            clause = chunk["chunk_text"]
            issues.extend(self._issues_for_clause(article, clause, perspective))
        issues.extend(self._missing_clause_issues(document_text))
        return issues

    def _issues_for_clause(self, article: str | None, clause: str, perspective: str) -> list[dict]:
        items = []
        if any(token in clause for token in ["一切の損害", "無制限", "全ての損害"]):
            items.append(self._build_issue("unfavorable", "high", article, clause, "賠償責任が過度に広く、一方的に不利となる可能性があります。"))
        if "自動更新" in clause and "解約" not in clause and "通知" not in clause:
            items.append(self._build_issue("unfavorable", "medium", article, clause, "自動更新条項に解約通知条件がなく、更新停止条件が不明瞭です。"))
        if "競業避止" in clause and not any(token in clause for token in ["期間", "範囲", "地域"]):
            items.append(self._build_issue("unfavorable", "high", article, clause, "競業避止義務の範囲が広く、制約が過大になるおそれがあります。"))
        if "別途協議" in clause and any(token in clause for token in ["成果物", "知的財産", "著作権"]):
            items.append(self._build_issue("missing", "critical", article, clause, "知的財産権の帰属が未確定で、後日の紛争要因になります。"))
        if "個人情報" in clause and "安全管理" not in clause:
            items.append(self._build_issue("legal_check", "medium", article, clause, "個人情報の取扱条項はありますが、安全管理や委託条件の確認が必要です。"))
        if "電子契約" in clause:
            items.append(self._build_issue("legal_check", "low", article, clause, "電子契約の有効性や保存方法は別途確認が必要です。"))
        return items

    def _missing_clause_issues(self, document_text: str) -> list[dict]:
        issues = []
        checks = [
            ("知的財産権", "critical", "知的財産権の帰属が文書内で確認できません。"),
            ("支払", "high", "支払条件または遅延損害金の定めが不足している可能性があります。"),
            ("管轄", "medium", "管轄裁判所または準拠法の定めが確認できません。"),
            ("個人情報", "medium", "個人情報の取り扱い条項が確認できません。"),
            ("変更", "low", "契約変更手続きの定めが確認できません。"),
        ]
        for keyword, severity, message in checks:
            if keyword not in document_text:
                issues.append(self._build_issue("missing", severity, None, None, message))
        if re.search(r"(請負|委託|売買)", document_text) and "印紙" not in document_text:
            issues.append(self._build_issue("legal_check", "low", None, None, "印紙税の要否は別途確認が必要です。"))
        return issues

    @staticmethod
    def _build_issue(issue_type: str, severity: str, article: str | None, original_text: str | None, description: str) -> dict:
        return {
            "type": issue_type,
            "severity": severity,
            "article": article,
            "original_text": original_text,
            "description": description,
            "risk_explanation": "契約締結前に条文の明確化または専門家確認が必要です。",
            "suggested_text": "当該条項の目的、範囲、責任分担が明確になるよう修正してください。",
        }
