from datetime import datetime

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from src.api.schemas import CampaignStatsRow, DashboardSummaryResponse
from src.core.database import get_db
from src.services.analytics_service import AnalyticsService

router = APIRouter(tags=["dashboard"])


@router.get(
    "/dashboard/summary",
    response_model=DashboardSummaryResponse,
    summary="Global KPI summary",
)
def get_dashboard_summary(db: Session = Depends(get_db)) -> DashboardSummaryResponse:
    data = AnalyticsService.summary(db)
    return DashboardSummaryResponse(**data)


@router.get(
    "/campaigns/stats",
    response_model=list[CampaignStatsRow],
    summary="Per-campaign aggregation",
)
def get_campaigns_stats(
    from_date: datetime | None = Query(
        None, alias="from", description="ISO 8601 start datetime (inclusive)"
    ),
    to_date: datetime | None = Query(
        None, alias="to", description="ISO 8601 end datetime (exclusive)"
    ),
    db: Session = Depends(get_db),
) -> list[CampaignStatsRow]:
    rows = AnalyticsService.campaigns_stats(db, from_dt=from_date, to_dt=to_date)
    return [CampaignStatsRow(**row) for row in rows]
