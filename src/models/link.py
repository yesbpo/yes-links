import uuid
from datetime import UTC, datetime

from sqlalchemy import DateTime, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import JSON

from src.models.base import Base
from src.models.naming import table_name


def _now_utc() -> datetime:
    return datetime.now(UTC)


class Link(Base):
    __tablename__ = table_name("links")

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    short_code: Mapped[str] = mapped_column(String(8), unique=True, index=True, nullable=False)
    target_url: Mapped[str] = mapped_column(String(2048), nullable=False)
    campaign: Mapped[str | None] = mapped_column(String(255), nullable=True)
    tags: Mapped[list[str]] = mapped_column(JSON(), default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now_utc)
    created_by: Mapped[str] = mapped_column(String(255), nullable=False, default="system")

    clicks = relationship("Click", back_populates="link", cascade="all, delete-orphan")
