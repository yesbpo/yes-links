from sqlalchemy import or_, select
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

    @staticmethod
    def list(
        db: Session,
        *,
        campaign: str | None = None,
        tags: list[str] | None = None,
        search: str | None = None,
        limit: int = 20,
        offset: int = 0,
    ) -> tuple[list[Link], int]:
        """Return (page, total) with optional filters.

        campaign — exact match on Link.campaign
        tags     — all supplied tags must be present in Link.tags (Python-side; DB-agnostic)
        search   — case-insensitive substring on short_code OR target_url
        limit    — page size (max enforced at route layer)
        offset   — zero-based record offset
        """
        stmt = select(Link)

        if campaign is not None:
            stmt = stmt.where(Link.campaign == campaign)

        if search is not None:
            stmt = stmt.where(
                or_(
                    Link.short_code.ilike(f"%{search}%"),
                    Link.target_url.ilike(f"%{search}%"),
                )
            )

        stmt = stmt.order_by(Link.created_at.desc())
        all_links: list[Link] = list(db.execute(stmt).scalars())

        # Tag filtering is done in Python to stay DB-agnostic (SQLite tests + MySQL prod).
        # For production scale, replace with DB-level JSON_CONTAINS in a future sprint.
        if tags:
            all_links = [lnk for lnk in all_links if all(t in (lnk.tags or []) for t in tags)]

        total = len(all_links)
        page = all_links[offset : offset + limit]
        return page, total
