import uuid
from datetime import UTC, datetime

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import JSON

from src.models.base import Base
from src.models.link import Link


def _now_utc() -> datetime:
    return datetime.now(UTC)


class Click(Base):
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    link_id: Mapped[str] = mapped_column(
        String(36), ForeignKey(f"{Link.__tablename__}.id", ondelete="CASCADE"), index=True
    )
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now_utc)
    ip: Mapped[str | None] = mapped_column(String(128), nullable=True)
    user_agent: Mapped[str | None] = mapped_column(String(512), nullable=True)
    referrer: Mapped[str | None] = mapped_column(String(2048), nullable=True)
    geo: Mapped[dict] = mapped_column(JSON(), default=dict)

    link = relationship("Link", back_populates="clicks")
