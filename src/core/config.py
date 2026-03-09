import os

from pydantic import BaseModel


class Settings(BaseModel):
    service_name: str = os.getenv("SERVICE_NAME", "yes-links")
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./yes_links.db")
    db_table_prefix: str = os.getenv("DB_TABLE_PREFIX", "yes_links")
    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    click_ingest_mode: str = os.getenv("CLICK_INGEST_MODE", "sync")
    redirect_cache_ttl_seconds: int = int(os.getenv("REDIRECT_CACHE_TTL_SECONDS", "300"))
    click_worker_batch_size: int = int(os.getenv("CLICK_WORKER_BATCH_SIZE", "200"))
    otel_endpoint: str | None = os.getenv("OTEL_ENDPOINT")
    jwt_secret: str = os.getenv("JWT_SECRET", "change_me")


settings = Settings()
