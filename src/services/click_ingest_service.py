import json
from datetime import UTC, datetime
from typing import Any

from sqlalchemy.orm import Session

from src.core.config import settings
from src.core.redis_client import get_redis_client
from src.repositories.click_repository import ClickRepository

CLICK_QUEUE_KEY = "yes-links:click-events"


class ClickIngestService:
    @staticmethod
    def _payload(
        *,
        link_id: str,
        ip: str | None,
        user_agent: str | None,
        referrer: str | None,
        geo: dict | None,
    ) -> dict[str, Any]:
        return {
            "link_id": link_id,
            "ip": ip,
            "user_agent": user_agent,
            "referrer": referrer,
            "geo": geo or {},
            "timestamp": datetime.now(UTC).isoformat(),
        }

    @staticmethod
    def record_click(
        db: Session,
        *,
        link_id: str,
        ip: str | None,
        user_agent: str | None,
        referrer: str | None,
        geo: dict | None = None,
    ) -> dict[str, Any]:
        payload = ClickIngestService._payload(
            link_id=link_id,
            ip=ip,
            user_agent=user_agent,
            referrer=referrer,
            geo=geo,
        )

        if settings.click_ingest_mode != "async":
            click = ClickRepository.create(
                db,
                link_id=link_id,
                ip=ip,
                user_agent=user_agent,
                referrer=referrer,
                geo=geo or {},
            )
            return {"mode": "sync", "click_id": click.id, "payload": payload}

        try:
            redis_client = get_redis_client()
            redis_client.rpush(CLICK_QUEUE_KEY, json.dumps(payload))
            return {"mode": "async", "click_id": None, "payload": payload}
        except Exception:
            click = ClickRepository.create(
                db,
                link_id=link_id,
                ip=ip,
                user_agent=user_agent,
                referrer=referrer,
                geo=geo or {},
            )
            return {"mode": "sync_fallback", "click_id": click.id, "payload": payload}
