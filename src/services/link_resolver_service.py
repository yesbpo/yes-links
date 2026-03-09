import json
from dataclasses import dataclass

from sqlalchemy.orm import Session

from src.core.config import settings
from src.core.redis_client import get_redis_client
from src.repositories.link_repository import LinkRepository


@dataclass(frozen=True)
class ResolvedLink:
    id: str
    target_url: str


class LinkResolverService:
    @staticmethod
    def _cache_key(short_code: str) -> str:
        return f"link:{short_code}"

    @staticmethod
    def invalidate_short_code(short_code: str) -> None:
        try:
            redis_client = get_redis_client()
            redis_client.delete(LinkResolverService._cache_key(short_code))
        except Exception:
            pass

    @staticmethod
    def resolve_by_short_code(db: Session, short_code: str) -> ResolvedLink | None:
        cache_key = LinkResolverService._cache_key(short_code)

        try:
            redis_client = get_redis_client()
            payload = redis_client.get(cache_key)
            if payload:
                data = json.loads(payload)
                return ResolvedLink(id=data["id"], target_url=data["target_url"])
        except Exception:
            pass

        link = LinkRepository.get_by_short_code(db, short_code)
        if not link:
            return None

        resolved = ResolvedLink(id=link.id, target_url=link.target_url)

        try:
            redis_client = get_redis_client()
            redis_client.setex(
                cache_key,
                settings.redirect_cache_ttl_seconds,
                json.dumps({"id": resolved.id, "target_url": resolved.target_url}),
            )
        except Exception:
            pass

        return resolved
