from sqlalchemy import func, select
from sqlalchemy.orm import Session

from src.models.click import Click
from src.models.link import Link


class AnalyticsService:
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
