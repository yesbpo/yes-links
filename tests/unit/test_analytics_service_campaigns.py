"""
Unit tests for AnalyticsService.campaigns_stats()
TF:YL-S1-T3 — RED phase
"""

import uuid
from datetime import UTC, datetime, timedelta


def _make_link(db, *, campaign=None):
    from src.models.link import Link

    link = Link(
        short_code=uuid.uuid4().hex[:8],
        target_url="https://example.com",
        campaign=campaign,
        tags=[],
        created_by="test",
    )
    db.add(link)
    db.commit()
    db.refresh(link)
    return link


def _make_click(db, link, *, days_ago=0):
    from src.models.click import Click

    ts = datetime.now(UTC) - timedelta(days=days_ago)
    click = Click(
        link_id=link.id,
        timestamp=ts,
        ip="1.2.3.4",
        user_agent="test-agent",
        referrer=None,
        geo={},
    )
    db.add(click)
    db.commit()
    db.refresh(click)
    return click


# ── empty ────────────────────────────────────────────────────────────────────


def test_campaigns_stats_empty(db_session):
    from src.services.analytics_service import AnalyticsService

    result = AnalyticsService.campaigns_stats(db_session)
    assert result == []


def test_campaigns_stats_no_clicks_returns_zero(db_session):
    from src.services.analytics_service import AnalyticsService

    _make_link(db_session, campaign="summer")
    result = AnalyticsService.campaigns_stats(db_session)
    # Links with no clicks still appear (total_clicks=0)
    assert len(result) == 1
    row = result[0]
    assert row["campaign"] == "summer"
    assert row["total_clicks"] == 0
    assert row["total_links"] == 1


# ── aggregation ───────────────────────────────────────────────────────────────


def test_campaigns_stats_groups_by_campaign(db_session):
    from src.services.analytics_service import AnalyticsService

    l1 = _make_link(db_session, campaign="summer")
    l2 = _make_link(db_session, campaign="summer")
    l3 = _make_link(db_session, campaign="winter")
    _make_click(db_session, l1)
    _make_click(db_session, l2)
    _make_click(db_session, l3)

    result = AnalyticsService.campaigns_stats(db_session)
    camps = {r["campaign"]: r for r in result}
    assert camps["summer"]["total_links"] == 2
    assert camps["summer"]["total_clicks"] == 2
    assert camps["winter"]["total_links"] == 1
    assert camps["winter"]["total_clicks"] == 1


def test_campaigns_stats_excludes_null_campaign(db_session):
    from src.services.analytics_service import AnalyticsService

    _make_link(db_session, campaign=None)  # no campaign
    _make_link(db_session, campaign="promo")
    result = AnalyticsService.campaigns_stats(db_session)
    names = [r["campaign"] for r in result]
    assert None not in names
    assert "promo" in names


def test_campaigns_stats_last_click_at_is_most_recent(db_session):
    from src.services.analytics_service import AnalyticsService

    lnk = _make_link(db_session, campaign="test")
    _make_click(db_session, lnk, days_ago=5)
    _make_click(db_session, lnk, days_ago=1)

    result = AnalyticsService.campaigns_stats(db_session)
    assert len(result) == 1
    last_click = result[0]["last_click_at"]
    # last_click_at should be closer to now than 3 days ago
    # SQLite may return naive datetimes; normalise before compare
    if isinstance(last_click, str):
        last_click = datetime.fromisoformat(last_click.replace("Z", "+00:00"))
    threshold = datetime.now(UTC) - timedelta(days=3)
    if last_click.tzinfo is None:
        threshold = threshold.replace(tzinfo=None)
    assert last_click > threshold


# ── date filters ──────────────────────────────────────────────────────────────


def test_campaigns_stats_from_filter(db_session):
    from src.services.analytics_service import AnalyticsService

    lnk = _make_link(db_session, campaign="promo")
    _make_click(db_session, lnk, days_ago=20)  # old — excluded
    _make_click(db_session, lnk, days_ago=2)  # recent — included

    cutoff = datetime.now(UTC) - timedelta(days=10)
    result = AnalyticsService.campaigns_stats(db_session, from_dt=cutoff)
    assert result[0]["total_clicks"] == 1


def test_campaigns_stats_to_filter(db_session):
    from src.services.analytics_service import AnalyticsService

    lnk = _make_link(db_session, campaign="promo")
    _make_click(db_session, lnk, days_ago=20)  # old — included
    _make_click(db_session, lnk, days_ago=2)  # recent — excluded

    cutoff = datetime.now(UTC) - timedelta(days=10)
    result = AnalyticsService.campaigns_stats(db_session, to_dt=cutoff)
    assert result[0]["total_clicks"] == 1


def test_campaigns_stats_ordered_by_total_clicks_desc(db_session):
    from src.services.analytics_service import AnalyticsService

    l1 = _make_link(db_session, campaign="low")
    l2 = _make_link(db_session, campaign="high")
    _make_click(db_session, l1)
    for _ in range(5):
        _make_click(db_session, l2)

    result = AnalyticsService.campaigns_stats(db_session)
    assert result[0]["campaign"] == "high"
    assert result[1]["campaign"] == "low"
