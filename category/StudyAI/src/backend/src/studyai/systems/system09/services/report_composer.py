from __future__ import annotations

from studyai.common.ai.llm_client import LLMClient
from studyai.systems.system09.prompts.research_prompt import build_report_prompt
from studyai.systems.system09.schemas.research import (
    CompanyReport,
    ComparisonTable,
    ResearchRequest,
    SWOTReport,
)


class ReportComposer:
    def __init__(self) -> None:
        self.llm_client = LLMClient()

    async def compose_report(self, request: ResearchRequest, sources: list[dict]) -> dict:
        system_prompt, user_prompt = build_report_prompt(request, sources)
        raw = await self.llm_client.extract_json(system_prompt, user_prompt)
        companies = [
            CompanyReport(**item).model_dump()
            for item in raw.get("companies", [])
            if isinstance(item, dict)
        ]
        comparison = ComparisonTable(**(raw.get("comparison_table") or {})).model_dump()
        swot = SWOTReport(**(raw.get("swot") or {})).model_dump()
        return {
            "executive_summary": str(raw.get("executive_summary") or ""),
            "key_findings": [str(item) for item in raw.get("key_findings", [])][:10],
            "companies": companies,
            "comparison_table": comparison,
            "swot": swot,
            "trends": str(raw.get("trends") or ""),
            "limitations": str(raw.get("limitations") or "This report uses public web sources only."),
        }
