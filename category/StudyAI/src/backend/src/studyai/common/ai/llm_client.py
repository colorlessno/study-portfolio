from __future__ import annotations

import json

import httpx

from studyai.common.config.settings import get_settings
from studyai.common.errors.models import ExternalServiceError


class LLMClient:
    def __init__(self) -> None:
        self.settings = get_settings()

    async def extract_json(self, system_prompt: str, user_prompt: str) -> dict:
        payload = {
            "model": self.settings.get_llm_model(),
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "temperature": 0,
        }
        try:
            async with httpx.AsyncClient(timeout=self.settings.model_timeout_seconds) as client:
                response = await client.post(
                    f"{self.settings.get_ai_base_url()}/chat/completions",
                    headers=self.settings.get_ai_headers(),
                    json=payload,
                )
                response.raise_for_status()
        except httpx.TimeoutException as exc:
            raise ExternalServiceError("model_timeout", "LLM 呼び出しがタイムアウトしました。") from exc
        except httpx.HTTPError as exc:
            raise ExternalServiceError("llm_request_failed", "LLM 呼び出しに失敗しました。", 502) from exc

        content = response.json()["choices"][0]["message"]["content"]
        try:
            return self._parse_json(content)
        except json.JSONDecodeError as exc:
            raise ExternalServiceError("invalid_model_output", "LLM の出力が JSON ではありません。", 422) from exc

    @staticmethod
    def _parse_json(content: str) -> dict:
        import re
        content = re.sub(r"```(?:json)?\s*", "", content).strip()
        match = re.search(r"[{\[]", content)
        if match:
            content = content[match.start():]
        return json.loads(content)
