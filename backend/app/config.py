from functools import lru_cache
from pathlib import Path

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

ROOT_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(ROOT_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    cloudinary_url: str = ""

    app_name: str = "UniSphere"
    environment: str = "development"
    secret_key: str = "dev-only-change-me"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 14
    algorithm: str = "HS256"

    database_url: str = "sqlite:///./unisphere.db"

    cors_origins: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"

    openai_api_key: str = ""
    openai_model: str = "gpt-4o-mini"
    openai_base_url: str = "https://api.openai.com/v1"
    gemini_api_key: str = ""
    gemini_model: str = "gemini-3.8-flash"

    enable_scheduler: bool = True
    reminder_timezone: str = "Asia/Kolkata"

    upload_dir: str = "./uploads"
    max_upload_mb: int = 10
    auth_rate_limit: str = "10/minute"

    @field_validator("secret_key")
    @classmethod
    def secret_not_empty(cls, v: str) -> str:
        if not v or len(v) < 8:
            raise ValueError("SECRET_KEY must be at least 8 characters")
        return v

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def is_sqlite(self) -> bool:
        return self.database_url.startswith("sqlite")

    @property
    def ai_provider_configured(self) -> bool:
        return bool(self.gemini_api_key.strip())
    @property
    def upload_path(self) -> Path:
        path = Path(self.upload_dir)
        if not path.is_absolute():
            path = ROOT_DIR / path
        return path


@lru_cache
def get_settings() -> Settings:
    return Settings()


