from __future__ import annotations

from studyai.common.ai.llm_client import LLMClient
from studyai.systems.system09.prompts.research_prompt import build_query_prompt
from studyai.systems.system09.schemas.research import ResearchRequest


class QueryGenerator:
    def __init__(self) -> None:
        self.llm_client = LLMClient()

    async def generate_queries(self, request: ResearchRequest, plan: list[dict]) -> list[str]:
        system_prompt, user_prompt = build_query_prompt(request, plan)
        raw = await self.llm_client.extract_json(system_prompt, user_prompt)
        queries = raw.get("queries")
        if isinstance(queries, list):
            filtered = [str(item).strip() for item in queries if str(item).strip()]
            if filtered:
                return filtered[:20]
        fallback: list[str] = []
        for target in request.targets or [request.research_type]:
            fallback.append(f"{target} 最新ニュース")
            fallback.append(f"{target} 料金 強み 弱み")
        for area in request.focus_areas:
            fallback.append(f"{' '.join(request.targets[:2])} {area}")
        deduped = list(dict.fromkeys(item for item in fallback if item.strip()))
        return deduped[:20]
