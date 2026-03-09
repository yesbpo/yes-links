from sqlalchemy import func, select

from src.core.config import settings
from src.models.click import Click
from src.services.click_ingest_service import ClickIngestService


class FakeRedis:
    def __init__(self):
        self.items: list[tuple[str, str]] = []

    def rpush(self, key: str, value: str) -> int:
        self.items.append((key, value))
        return len(self.items)


def _click_count(db_session) -> int:
    stmt = select(func.count(Click.id))
    return int(db_session.execute(stmt).scalar_one())


def test_async_mode_queues_click_without_immediate_db_write(db_session, monkeypatch):
    fake_redis = FakeRedis()
    monkeypatch.setattr(settings, "click_ingest_mode", "async")
    monkeypatch.setattr(
        "src.services.click_ingest_service.get_redis_client",
        lambda: fake_redis,
    )

    result = ClickIngestService.record_click(
        db_session,
        link_id="link-1",
        ip="127.0.0.1",
        user_agent="pytest",
        referrer="https://example.com",
        geo={"country": "CO"},
    )

    assert result["mode"] == "async"
    assert _click_count(db_session) == 0
    assert len(fake_redis.items) == 1


def test_async_mode_fallbacks_to_sync_insert_when_queue_fails(db_session, monkeypatch):
    def _raise_queue_error():
        raise RuntimeError("redis unavailable")

    monkeypatch.setattr(settings, "click_ingest_mode", "async")
    monkeypatch.setattr(
        "src.services.click_ingest_service.get_redis_client",
        _raise_queue_error,
    )

    result = ClickIngestService.record_click(
        db_session,
        link_id="link-1",
        ip="127.0.0.1",
        user_agent="pytest",
        referrer=None,
        geo={},
    )

    assert result["mode"] == "sync_fallback"
    assert _click_count(db_session) == 1
