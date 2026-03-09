from sqlalchemy import select
from sqlalchemy.orm import Session

from src.models.link import Link


class LinkRepository:
    @staticmethod
    def create(
        db: Session,
        *,
        short_code: str,
        target_url: str,
        campaign: str | None,
        tags: list[str],
        created_by: str,
    ) -> Link:
        link = Link(
            short_code=short_code,
            target_url=target_url,
            campaign=campaign,
            tags=tags,
            created_by=created_by,
        )
        db.add(link)
        db.commit()
        db.refresh(link)
        return link

    @staticmethod
    def get_by_short_code(db: Session, short_code: str) -> Link | None:
        stmt = select(Link).where(Link.short_code == short_code)
        return db.execute(stmt).scalar_one_or_none()

    @staticmethod
    def get_by_id(db: Session, link_id: str) -> Link | None:
        stmt = select(Link).where(Link.id == link_id)
        return db.execute(stmt).scalar_one_or_none()

    @staticmethod
    def exists_short_code(db: Session, short_code: str) -> bool:
        stmt = select(Link.id).where(Link.short_code == short_code)
        return db.execute(stmt).scalar_one_or_none() is not None

    @staticmethod
    def update(
        db: Session,
        link: Link,
        *,
        target_url: str,
        campaign: str | None,
        tags: list[str],
    ) -> Link:
        link.target_url = target_url
        link.campaign = campaign
        link.tags = tags
        db.commit()
        db.refresh(link)
        return link

    @staticmethod
    def delete(db: Session, link: Link) -> None:
        db.delete(link)
        db.commit()
