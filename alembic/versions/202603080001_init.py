"""initial tables

Revision ID: 202603080001
Revises:
Create Date: 2026-03-08
"""

import os

import sqlalchemy as sa

from alembic import op

revision = "202603080001"
down_revision = None
branch_labels = None
depends_on = None

TABLE_PREFIX = os.getenv("DB_TABLE_PREFIX", "yes_links")


def _normalized_prefix() -> str:
    return TABLE_PREFIX.rstrip("_")


def _links_table() -> str:
    prefix = _normalized_prefix()
    return f"{prefix}_links" if prefix else "links"


def _clicks_table() -> str:
    prefix = _normalized_prefix()
    return f"{prefix}_clicks" if prefix else "clicks"


def _has_index(inspector, table_name: str, index_name: str) -> bool:
    return any(index.get("name") == index_name for index in inspector.get_indexes(table_name))


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    links_table = _links_table()
    clicks_table = _clicks_table()

    if not inspector.has_table(links_table):
        op.create_table(
            links_table,
            sa.Column("id", sa.String(length=36), primary_key=True),
            sa.Column("short_code", sa.String(length=8), nullable=False, unique=True),
            sa.Column("target_url", sa.String(length=2048), nullable=False),
            sa.Column("campaign", sa.String(length=255), nullable=True),
            sa.Column("tags", sa.JSON(), nullable=False),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
            sa.Column("created_by", sa.String(length=255), nullable=False),
        )
        inspector = sa.inspect(bind)

    if inspector.has_table(links_table) and not _has_index(inspector, links_table, "ix_links_short_code"):
        op.create_index("ix_links_short_code", links_table, ["short_code"], unique=True)

    if not inspector.has_table(clicks_table):
        op.create_table(
            clicks_table,
            sa.Column("id", sa.String(length=36), primary_key=True),
            sa.Column(
                "link_id",
                sa.String(length=36),
                sa.ForeignKey(f"{links_table}.id", ondelete="CASCADE"),
                nullable=False,
            ),
            sa.Column("timestamp", sa.DateTime(timezone=True), nullable=False),
            sa.Column("ip", sa.String(length=128), nullable=True),
            sa.Column("user_agent", sa.String(length=512), nullable=True),
            sa.Column("referrer", sa.String(length=2048), nullable=True),
            sa.Column("geo", sa.JSON(), nullable=False),
        )
        inspector = sa.inspect(bind)

    if inspector.has_table(clicks_table) and not _has_index(inspector, clicks_table, "ix_clicks_link_id"):
        op.create_index("ix_clicks_link_id", clicks_table, ["link_id"], unique=False)


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    links_table = _links_table()
    clicks_table = _clicks_table()

    if inspector.has_table(clicks_table):
        if _has_index(inspector, clicks_table, "ix_clicks_link_id"):
            op.drop_index("ix_clicks_link_id", table_name=clicks_table)
        op.drop_table(clicks_table)
        inspector = sa.inspect(bind)

    if inspector.has_table(links_table):
        if _has_index(inspector, links_table, "ix_links_short_code"):
            op.drop_index("ix_links_short_code", table_name=links_table)
        op.drop_table(links_table)
