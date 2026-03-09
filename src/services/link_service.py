from pydantic import HttpUrl, TypeAdapter
from sqlalchemy.orm import Session

from src.repositories.link_repository import LinkRepository
from src.services.shortcode import generate_shortcode


class LinkService:
    def __init__(self, repo: LinkRepository):
        self.repo = repo
        self._url_adapter = TypeAdapter(HttpUrl)

    def create(
        self,
        db: Session,
        *,
        target_url: str,
        campaign: str | None,
        tags: list[str],
        created_by: str,
    ):
        self._url_adapter.validate_python(target_url)

        short_code = self._generate_unique_code(db)
        return self.repo.create(
            db,
            short_code=short_code,
            target_url=target_url,
            campaign=campaign,
            tags=tags,
            created_by=created_by,
        )

    def update(
        self,
        db: Session,
        *,
        link_id: str,
        target_url: str,
        campaign: str | None,
        tags: list[str],
    ):
        self._url_adapter.validate_python(target_url)

        link = self.repo.get_by_id(db, link_id)
        if not link:
            return None

        return self.repo.update(
            db,
            link,
            target_url=target_url,
            campaign=campaign,
            tags=tags,
        )

    def delete(self, db: Session, *, link_id: str):
        link = self.repo.get_by_id(db, link_id)
        if not link:
            return None

        self.repo.delete(db, link)
        return link

    def _generate_unique_code(self, db: Session) -> str:
        for _ in range(10):
            code = generate_shortcode(5, 8)
            if not self.repo.exists_short_code(db, code):
                return code
        raise RuntimeError("Could not generate unique short code after retries")
