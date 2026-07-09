from __future__ import annotations

import uuid

from studyai.common.ai.llm_client import LLMClient
from studyai.systems.system11.prompts.organize_prompt import ORGANIZE_SYSTEM_PROMPT, build_organize_prompt
from studyai.systems.system11.schemas.organizer import ActionItem, ScanSummary

_CONFIDENCE_THRESHOLD = 0.70


class PlanGenerator:
    def __init__(self) -> None:
        self.llm_client = LLMClient()

    async def generate_plan(
        self,
        file_info_list: list[dict],
        output_folder: str,
    ) -> tuple[str, list[ActionItem], ScanSummary]:
        if not file_info_list:
            summary = ScanSummary(total_actions=0, moves=0, renames=0, archives=0, skips=0, duplicates_found=0)
            return "対象ファイルがありませんでした。", [], summary

        user_prompt = build_organize_prompt(output_folder, file_info_list)
        raw = await self.llm_client.extract_json(ORGANIZE_SYSTEM_PROMPT, user_prompt)

        raw_actions = raw.get("actions") if isinstance(raw.get("actions"), list) else []
        summary_text = str(raw.get("summary") or "整理案を生成しました。")

        actions: list[ActionItem] = []
        counts = {"move": 0, "rename": 0, "archive": 0, "keep": 0}

        for item in raw_actions:
            if not isinstance(item, dict):
                continue
            action_type = str(item.get("action_type") or "keep").lower()
            if action_type not in {"move", "rename", "archive", "keep"}:
                action_type = "keep"

            source_path = str(item.get("source_path") or "")
            if not source_path:
                continue

            confidence = float(item.get("confidence") or 0.0)
            # confidenceが閾値未満はkeepに格下げ
            if confidence < _CONFIDENCE_THRESHOLD and action_type != "keep":
                action_type = "keep"

            action = ActionItem(
                action_id=str(item.get("action_id") or uuid.uuid4().hex[:8]),
                action_type=action_type,
                source_path=source_path,
                dest_path=str(item.get("dest_path") or "") or None,
                new_name=str(item.get("new_name") or "") or None,
                reason=str(item.get("reason") or ""),
                confidence=confidence,
            )
            actions.append(action)
            counts[action_type] = counts.get(action_type, 0) + 1

        summary = ScanSummary(
            total_actions=len(actions),
            moves=counts["move"],
            renames=counts["rename"],
            archives=counts["archive"],
            skips=counts["keep"],
            duplicates_found=0,
        )
        return summary_text, actions, summary
