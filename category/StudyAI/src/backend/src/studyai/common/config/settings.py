from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from pydantic import Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "StudyAI Backend"
    api_prefix: str = "/api"
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/studyai"
    lm_studio_base_url: str = "http://localhost:1234/v1"
    llm_model: str = "qwen3-27b-q4"
    vlm_model: str = "qwen3-vl-32b-q4"
    embedding_model: str = "nomic-embed-text"
    upload_dir: Path = Field(default=Path("./data/uploads"))
    model_timeout_seconds: int = 25
    max_upload_size_mb: int = 10
    max_bulk_files: int = 5
    text_pdf_threshold: int = 50
    whisper_model_size: str = "medium"        # tiny / base / small / medium / large-v3
    whisper_device: str = "cpu"               # cpu / cuda
    whisper_compute_type: str = "int8"        # int8 (cpu) / float16 (cuda)

    # AI プロバイダ切り替え設定
    # lmstudio:   LM Studio（ローカル）を使用（既定値）
    # custom:     任意の OpenAI 互換 API を使用（GLM / Gemini 等）
    # commercial: 商用 OpenAI 互換 API を使用（custom の別名）
    ai_provider: str = "lmstudio"
    custom_ai_base_url: str = ""
    custom_ai_api_key: str = ""
    custom_llm_model: str = ""
    custom_vlm_model: str = ""
    custom_embedding_model: str = ""

    @model_validator(mode="after")
    def validate_custom_provider(self) -> "Settings":
        self.ai_provider = self.ai_provider.strip().lower()
        if self.ai_provider not in {"lmstudio", "custom", "commercial"}:
            raise ValueError("AI_PROVIDER は lmstudio、custom、commercial のいずれかを指定してください。")
        if self.ai_provider == "commercial":
            self.ai_provider = "custom"
        if self.ai_provider == "custom":
            if not self.custom_ai_base_url:
                raise ValueError(
                    "AI_PROVIDER=custom の場合は CUSTOM_AI_BASE_URL の設定が必要です。"
                )
            if not self.custom_llm_model:
                raise ValueError(
                    "AI_PROVIDER=custom の場合は CUSTOM_LLM_MODEL の設定が必要です。"
                )
            if not self.custom_embedding_model:
                raise ValueError(
                    "AI_PROVIDER=custom の場合は CUSTOM_EMBEDDING_MODEL の設定が必要です。"
                )
        return self

    def get_ai_base_url(self) -> str:
        """有効な AI エンドポイントの base URL を返す。"""
        if self.ai_provider == "custom":
            return self.custom_ai_base_url.rstrip("/")
        return self.lm_studio_base_url.rstrip("/")

    def get_ai_headers(self) -> dict[str, str]:
        """AI API 呼び出し用の認証ヘッダーを返す。"""
        if self.ai_provider == "custom" and self.custom_ai_api_key:
            return {"Authorization": f"Bearer {self.custom_ai_api_key}"}
        return {}

    def get_llm_model(self) -> str:
        """有効な LLM モデル名を返す。"""
        if self.ai_provider == "custom":
            return self.custom_llm_model
        return self.llm_model

    def get_vlm_model(self) -> str:
        """有効な VLM モデル名を返す。custom_vlm_model 未指定時は LLM モデルを共用する。"""
        if self.ai_provider == "custom":
            return self.custom_vlm_model or self.custom_llm_model
        return self.vlm_model

    def get_embedding_model(self) -> str:
        """有効な Embedding モデル名を返す。"""
        if self.ai_provider == "custom":
            return self.custom_embedding_model
        return self.embedding_model

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        protected_namespaces=("settings_",),
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
