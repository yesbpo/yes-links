import json
import time

from src.core.config import settings
from src.core.database import SessionLocal
from src.core.logging import configure_logging
from src.core.redis_client import get_redis_client
from src.models import click, link  # noqa: F401
from src.repositories.click_repository import ClickRepository
from src.services.click_ingest_service import CLICK_QUEUE_KEY
from src.services.events import emit_event


def run() -> None:
    logger = configure_logging()
    redis_client = get_redis_client()
    batch_size = max(1, settings.click_worker_batch_size)

    logger.info("click.worker.started", extra={"event": "click.worker.started"})

    while True:
        item = redis_client.blpop(CLICK_QUEUE_KEY, timeout=5)
        if not item:
            continue

        _, raw_payload = item
        raw_items = [raw_payload]

        for _ in range(batch_size - 1):
            next_item = redis_client.lpop(CLICK_QUEUE_KEY)
            if not next_item:
                break
            raw_items.append(next_item)

        payloads = [json.loads(raw) for raw in raw_items]
        batch = [
            {
                "link_id": payload["link_id"],
                "ip": payload.get("ip"),
                "user_agent": payload.get("user_agent"),
                "referrer": payload.get("referrer"),
                "geo": payload.get("geo") or {},
            }
            for payload in payloads
        ]

        db = SessionLocal()
        try:
            inserted = ClickRepository.create_many(db, batch)
            emit_event(
                logger,
                event_name="link.click_persisted.v1",
                payload={
                    "route": "/worker/clicks",
                    "status_code": 200,
                    "payload": {"inserted": inserted, "batch_size": len(batch)},
                },
            )
        except Exception as exc:
            if raw_items:
                redis_client.rpush(CLICK_QUEUE_KEY, *raw_items)
            emit_event(
                logger,
                event_name="click.worker.persist_failed.v1",
                payload={
                    "route": "/worker/clicks",
                    "status_code": 500,
                    "payload": {"error": str(exc), "batch_size": len(raw_items)},
                },
            )
            time.sleep(0.25)
        finally:
            db.close()


if __name__ == "__main__":
    run()
