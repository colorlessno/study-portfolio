from __future__ import annotations

from studyai.common.ai.llm_client import LLMClient
from studyai.systems.system09.prompts.research_prompt import build_plan_prompt
from studyai.systems.system09.schemas.research import ResearchRequest


class ResearchPlanner:
    def __init__(self) -> None:
        self.llm_client = LLMClient()

    async def build_research_plan(self, request: ResearchRequest) -> list[dict]:
        system_prompt, user_prompt = build_plan_prompt(request)
        raw = await self.llm_client.extract_json(system_prompt, user_prompt)
        plan = raw.get("plan")
        if isinstance(plan, list) and plan:
            return [item for item in plan if isinstance(item, dict)]
        return [
            {
                "topic": request.research_type,
                "priority": 1,
                "search_hints": request.focus_areas or request.targets,
            }
        ]
