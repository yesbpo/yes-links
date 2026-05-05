from datetime import UTC, datetime, timedelta

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from src.models.click import Click
from src.models.link import Link


class AnalyticsService:
    @staticmethod
    def summary(db: Session) -> dict:
        """Global KPI summary across all links."""
        # total_links
        total_links: int = db.execute(select(func.count(Link.id))).scalar_one()

        # total_clicks
        total_clicks: int = db.execute(select(func.count(Click.id))).scalar_one()

        # avg_clicks_per_link
        avg_clicks = round(total_clicks / total_links, 4) if total_links else 0.0

        # top_campaigns (exclude NULL, top 5 by click count)
        top_stmt = (
            select(Link.campaign.label("campaign"), func.count(Click.id).label("clicks"))
            .join(Click, Click.link_id == Link.id)
            .where(Link.campaign.isnot(None))
            .group_by(Link.campaign)
            .order_by(func.count(Click.id).desc())
            .limit(5)
        )
        top_campaigns = [
            {"campaign": row.campaign, "clicks": int(row.clicks)}
            for row in db.execute(top_stmt)
        ]

        # trends: last 7d vs prev 7d (days 8-14 ago)
        now = datetime.now(UTC)
        window_start = now - timedelta(days=7)
        prev_start = now - timedelta(days=14)

        last_7d: int = db.execute(
            select(func.count(Click.id)).where(Click.timestamp >= window_start)
        ).scalar_one()

        prev_7d: int = db.execute(
            select(func.count(Click.id)).where(
                Click.timestamp >= prev_start,
                Click.timestamp < window_start,
            )
        ).scalar_one()

        pct_change: float | None = None
        if prev_7d > 0:
            pct_change = round((last_7d - prev_7d) / prev_7d * 100, 2)

        return {
            "total_links": total_links,
            "total_clicks": total_clicks,
            "avg_clicks_per_link": avg_clicks,
            "top_campaigns": top_campaigns,
            "trends": {
                "clicks_last_7d": last_7d,
                "clicks_prev_7d": prev_7d,
                "pct_change": pct_change,
            },
        }

    @staticmethod
    def campaigns_stats(
        db: Session,
        *,
        from_dt: datetime | None = None,
        to_dt: datetime | None = None,
    ) -> list[dict]:
        """Per-campaign aggregation: total_links, total_clicks, last_click_at.

        Only campaigns with a non-NULL name are included.
        Optional from_dt / to_dt filter the Click.timestamp range.
        Results ordered by total_clicks DESC.
        """
        # Subquery: click counts (and last click) per link, filtered by date range
        click_q = select(
            Click.link_id,
            func.count(Click.id).label("click_count"),
            func.max(Click.timestamp).label("last_click"),
        )
        if from_dt is not None:
            click_q = click_q.where(Click.timestamp >= from_dt)
        if to_dt is not None:
            click_q = click_q.where(Click.timestamp < to_dt)
        click_q = click_q.group_by(Click.link_id).subquery()

        # Main query: LEFT JOIN so links with 0 clicks still appear
        stmt = (
            select(
                Link.campaign.label("campaign"),
                func.count(Link.id).label("total_links"),
                func.coalesce(func.sum(click_q.c.click_count), 0).label("total_clicks"),
                func.max(click_q.c.last_click).label("last_click_at"),
            )
            .outerjoin(click_q, click_q.c.link_id == Link.id)
            .where(Link.campaign.isnot(None))
            .group_by(Link.campaign)
            .order_by(func.coalesce(func.sum(click_q.c.click_count), 0).desc())
        )

        return [
            {
                "campaign": row.campaign,
                "total_links": int(row.total_links),
                "total_clicks": int(row.total_clicks),
                "last_click_at": row.last_click_at,
            }
            for row in db.execute(stmt)
        ]

    @staticmethod
    def get_stats(db: Session, link_id: str) -> dict:
        total_stmt = select(func.count(Click.id)).where(Click.link_id == link_id)
        total_clicks = db.execute(total_stmt).scalar_one()

        day_stmt = (
            select(func.date(Click.timestamp).label("day"), func.count(Click.id).label("count"))
            .where(Click.link_id == link_id)
            .group_by(func.date(Click.timestamp))
            .order_by(func.date(Click.timestamp))
        )
        clicks_by_day = [
            {"day": str(row.day), "count": int(row.count)} for row in db.execute(day_stmt)
        ]

        campaign_stmt = (
            select(Link.campaign.label("campaign"), func.count(Click.id).label("count"))
            .join(Click, Click.link_id == Link.id)
            .where(Link.id == link_id)
            .group_by(Link.campaign)
        )
        clicks_by_campaign = [
            {"campaign": row.campaign or "", "count": int(row.count)}
            for row in db.execute(campaign_stmt)
        ]

        return {
            "link_id": link_id,
            "total_clicks": int(total_clicks),
            "clicks_by_day": clicks_by_day,
            "clicks_by_campaign": clicks_by_campaign,
        }
