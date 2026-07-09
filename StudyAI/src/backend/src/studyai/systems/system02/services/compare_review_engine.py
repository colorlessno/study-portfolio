from __future__ import annotations


class CompareReviewEngine:
    def run_compare(self, aligned_chunks: list[dict]) -> list[dict]:
        diff_issues: list[dict] = []
        for item in aligned_chunks:
            article = item["article"]
            chunk_a = item.get("chunk_a")
            chunk_b = item.get("chunk_b")
            if chunk_a is None and chunk_b is not None:
                diff_issues.append(self._build_issue("added", "medium", article, chunk_b["chunk_text"], "相手方文書に新規条項が追加されています。"))
                continue
            if chunk_a is not None and chunk_b is None:
                diff_issues.append(self._build_issue("removed", "medium", article, chunk_a["chunk_text"], "基準文書にある条項が相手方文書で削除されています。"))
                continue
            if chunk_a and chunk_b and chunk_a["chunk_text"] != chunk_b["chunk_text"]:
                severity = "high" if len(chunk_b["chunk_text"]) > len(chunk_a["chunk_text"]) * 1.3 else "medium"
                diff_issues.append(self._build_issue("changed", severity, article, chunk_b["chunk_text"], "同一条項に差分があります。追加リスクの確認が必要です。"))
        return diff_issues

    @staticmethod
    def _build_issue(issue_type: str, severity: str, article: str, original_text: str, description: str) -> dict:
        return {
            "type": issue_type,
            "severity": severity,
            "article": article,
            "original_text": original_text,
            "description": description,
            "risk_explanation": "差分により責任範囲や義務の重さが変化している可能性があります。",
            "suggested_text": "差分箇所の意図を確認し、必要であれば自社ひな形に合わせて調整してください。",
        }
