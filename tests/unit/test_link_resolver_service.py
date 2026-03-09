import json
from types import SimpleNamespace

from src.services.link_resolver_service import LinkResolverService


class FakeRedis:
    def __init__(self):
        self.store: dict[str, str] = {}

    def get(self, key: str) -> str | None:
        return self.store.get(key)

    def setex(self, key: str, ttl: int, value: str) -> bool:  # noqa: ARG002
        self.store[key] = value
        return True

    def delete(self, key: str) -> int:
        existed = key in self.store
        self.store.pop(key, None)
        return 1 if existed else 0


def test_cache_hit_resolves_without_db(monkeypatch):
    fake_redis = FakeRedis()
    fake_redis.setex(
        "link:abc12",
        120,
        json.dumps({"id": "link-1", "target_url": "https://example.com/hit"}),
    )

    monkeypatch.setattr(
        "src.services.link_resolver_service.get_redis_client",
        lambda: fake_redis,
    )

    def _db_must_not_be_called(*_args, **_kwargs):
        raise AssertionError("DB lookup should not run on cache hit")

    monkeypatch.setattr(
        "src.services.link_resolver_service.LinkRepository.get_by_short_code",
        _db_must_not_be_called,
    )

    resolved = LinkResolverService.resolve_by_short_code(None, "abc12")

    assert resolved is not None
    assert resolved.id == "link-1"
    assert resolved.target_url == "https://example.com/hit"


def test_cache_miss_fills_cache_from_db(monkeypatch):
    fake_redis = FakeRedis()
    db_link = SimpleNamespace(id="link-2", target_url="https://example.com/miss")

    monkeypatch.setattr(
        "src.services.link_resolver_service.get_redis_client",
        lambda: fake_redis,
    )
    monkeypatch.setattr(
        "src.services.link_resolver_service.LinkRepository.get_by_short_code",
        lambda _db, _code: db_link,
    )

    resolved = LinkResolverService.resolve_by_short_code(None, "xyz99")

    assert resolved is not None
    assert resolved.id == "link-2"
    assert resolved.target_url == "https://example.com/miss"
    assert "link:xyz99" in fake_redis.store


def test_invalidate_short_code_removes_cache_key(monkeypatch):
    fake_redis = FakeRedis()
    fake_redis.setex(
        "link:to-delete",
        300,
        json.dumps({"id": "link-3", "target_url": "https://example.com/delete"}),
    )

    monkeypatch.setattr(
        "src.services.link_resolver_service.get_redis_client",
        lambda: fake_redis,
    )

    LinkResolverService.invalidate_short_code("to-delete")

    assert "link:to-delete" not in fake_redis.store
