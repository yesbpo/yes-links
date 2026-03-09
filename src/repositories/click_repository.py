from sqlalchemy.orm import Session

from src.models.click import Click


class ClickRepository:
    @staticmethod
    def create(
        db: Session,
        *,
        link_id: str,
        ip: str | None,
        user_agent: str | None,
        referrer: str | None,
        geo: dict | None = None,
    ) -> Click:
        click = Click(
            link_id=link_id,
            ip=ip,
            user_agent=user_agent,
            referrer=referrer,
            geo=geo or {},
        )
        db.add(click)
        db.commit()
        db.refresh(click)
        return click

    @staticmethod
    def create_many(db: Session, items: list[dict]) -> int:
        if not items:
            return 0

        db.bulk_insert_mappings(Click, items)
        db.commit()
        return len(items)
