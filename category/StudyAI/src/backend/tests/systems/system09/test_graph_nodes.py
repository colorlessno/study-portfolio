from __future__ import annotations

import asyncio

from studyai.systems.system09.graph.nodes import System09GraphNodes
from studyai.systems.system09.schemas.research import ResearchRequest


class _FakePlanner:
    async def build_research_plan(self, request: ResearchRequest):
        return [{"topic": request.research_type, "priority": 1}]


class _FakeQueryGenerator:
    async def generate_queries(self, request: ResearchRequest, plan: list[dict]):
        return [f"{request.targets[0]} 料金"]


class _FakeSearchTool:
    async def search(self, query: str, *, max_results: int = 5):
        return [{"title": "A", "url": "https://example.com/a", "snippet": "snippet", "source_type": "search"}]


class _FakeFetchTool:
    async def fetch(self, url: str):
        return {"url": url, "title": "Fetched", "content": "A" * 120, "source_type": "web", "domain": "example.com"}


class _FakeComposer:
    async def compose_report(self, request: ResearchRequest, sources: list[dict]):
        return {
            "executive_summary": "summary",
            "key_findings": ["finding"],
            "companies": [],
            "comparison_table": {"headers": [], "rows": []},
            "swot": {"strengths": [], "weaknesses": [], "opportunities": [], "threats": []},
            "trends": "trends",
            "limitations": "limitations",
        }


def test_graph_nodes_plan_and_collect_sources():
    request = ResearchRequest(research_type="競合調査", targets=["株式会社A"])
    nodes = System09GraphNodes(
        planner=_FakePlanner(),
        query_generator=_FakeQueryGenerator(),
        search_tool=_FakeSearchTool(),
        fetch_tool=_FakeFetchTool(),
        report_composer=_FakeComposer(),
    )
    state = {"request": request, "step_logs": [], "errors": []}

    planned = asyncio.run(nodes.plan_research(state))
    state.update(planned)
    collected = asyncio.run(nodes.collect_sources(state))

    assert planned["queries"] == ["株式会社A 料金"]
    assert collected["search_count"] == 1
    assert len(collected["accepted_sources"]) == 1


def test_graph_nodes_compose_report():
    request = ResearchRequest(research_type="競合調査", targets=["株式会社A"])
    nodes = System09GraphNodes(report_composer=_FakeComposer())
    state = {"request": request, "accepted_sources": [{"url": "https://example.com"}], "step_logs": [], "errors": []}

    composed = asyncio.run(nodes.compose_report(state))

    assert composed["report_payload"]["executive_summary"] == "summary"
