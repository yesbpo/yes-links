from datetime import datetime

from pydantic import BaseModel, Field


class CreateLinkRequest(BaseModel):
    target_url: str
    campaign: str | None = None
    tags: list[str] = Field(default_factory=list)


class UpdateLinkRequest(BaseModel):
    target_url: str
    campaign: str | None = None
    tags: list[str] = Field(default_factory=list)


class LinkResponse(BaseModel):
    id: str
    short_code: str
    short_url: str
    target_url: str
    campaign: str | None
    tags: list[str]
    created_at: datetime
    created_by: str


class ClickByDay(BaseModel):
    day: str
    count: int


class ClickByCampaign(BaseModel):
    campaign: str
    count: int


class StatsResponse(BaseModel):
    link_id: str
    total_clicks: int
    clicks_by_day: list[ClickByDay]
    clicks_by_campaign: list[ClickByCampaign]


class LinksListResponse(BaseModel):
    items: list[LinkResponse]
    total: int


class HealthResponse(BaseModel):
    status: str


class DeleteLinkResponse(BaseModel):
    id: str
    deleted: bool


class TopCampaign(BaseModel):
    campaign: str
    clicks: int


class ClickTrends(BaseModel):
    clicks_last_7d: int
    clicks_prev_7d: int
    pct_change: float | None


class DashboardSummaryResponse(BaseModel):
    total_links: int
    total_clicks: int
    avg_clicks_per_link: float
    top_campaigns: list[TopCampaign]
    trends: ClickTrends


class CampaignStatsRow(BaseModel):
    campaign: str
    total_links: int
    total_clicks: int
    last_click_at: datetime | None
