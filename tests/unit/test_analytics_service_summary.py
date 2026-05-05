"""
Unit tests for AnalyticsService.summary()
TF:YL-S1-T2 — RED phase
"""
import uuid
from datetime import UTC, datetime, timedelta

import pytest
from tests.conftest import db_session  # noqa: F401


def _make_link(db, *, campaign=None, tags=None):
    from src.models.link import Link
    link = Link(
        short_code=uuid.uuid4().hex[:8],
        target_url="https://example.com",
        campaign=campaign,
        tags=tags or [],
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
    return click


# ── empty state ──────────────────────────────────────────────────────────────

def test_summary_empty_db(db_session):
    from src.services.analytics_service import AnalyticsService
    result = AnalyticsService.summary(db_session)
    assert result["total_links"] == 0
    assert result["total_clicks"] == 0
    assert result["avg_clicks_per_link"] == 0.0
    assert result["top_campaigns"] == []
    assert "trends" in result


# ── total_links / total_clicks ────────────────────────────────────────────────

def test_summary_counts_links(db_session):
    from src.services.analytics_service import AnalyticsService
    _make_link(db_session, campaign="a")
    _make_link(db_session, campaign="b")
    result = AnalyticsService.summary(db_session)
    assert result["total_links"] == 2


def test_summary_counts_total_clicks(db_session):
    from src.services.analytics_service import AnalyticsService
    lnk = _make_link(db_session)
    _make_click(db_session, lnk)
    _make_click(db_session, lnk)
    result = AnalyticsService.summary(db_session)
    assert result["total_clicks"] == 2


def test_summary_avg_clicks_per_link(db_session):
    from src.services.analytics_service import AnalyticsService
    l1 = _make_link(db_session)
    l2 = _make_link(db_session)
    _make_click(db_session, l1)
    _make_click(db_session, l1)
    _make_click(db_session, l2)
    # 3 clicks / 2 links = 1.5
    result = AnalyticsService.summary(db_session)
    assert result["avg_clicks_per_link"] == 1.5


def test_summary_avg_zero_when_no_links(db_session):
    from src.services.analytics_service import AnalyticsService
    result = AnalyticsService.summary(db_session)
    assert result["avg_clicks_per_link"] == 0.0


# ── top_campaigns ─────────────────────────────────────────────────────────────

def test_summary_top_campaigns_ordered_by_clicks(db_session):
    from src.services.analytics_service import AnalyticsService
    l1 = _make_link(db_session, campaign="summer")
    l2 = _make_link(db_session, campaign="winter")
    _make_click(db_session, l1)
    _make_click(db_session, l1)
    _make_click(db_session, l1)
    _make_click(db_session, l2)
    result = AnalyticsService.summary(db_session)
    camps = result["top_campaigns"]
    assert camps[0]["campaign"] == "summer"
    assert camps[0]["clicks"] == 3
    assert camps[1]["campaign"] == "winter"
    assert camps[1]["clicks"] == 1


def test_summary_top_campaigns_capped_at_5(db_session):
    from src.services.analytics_service import AnalyticsService
    for i in range(7):
        lnk = _make_link(db_session, campaign=f"camp{i}")
        _make_click(db_session, lnk)
    result = AnalyticsService.summary(db_session)
    assert len(result["top_campaigns"]) <= 5


def test_summary_top_campaigns_excludes_null_campaign(db_session):
    from src.services.analytics_service import AnalyticsService
    lnk_no_camp = _make_link(db_session, campaign=None)
    lnk_with_camp = _make_link(db_session, campaign="promo")
    _make_click(db_session, lnk_no_camp)
    _make_click(db_session, lnk_with_camp)
    result = AnalyticsService.summary(db_session)
    campaign_names = [c["campaign"] for c in result["top_campaigns"]]
    assert None not in campaign_names
    assert "promo" in campaign_names


# ── trends ────────────────────────────────────────────────────────────────────

def test_summary_trends_structure(db_session):
    from src.services.analytics_service import AnalyticsService
    result = AnalyticsService.summary(db_session)
    trends = result["trends"]
    assert "clicks_last_7d" in trends
    assert "clicks_prev_7d" in trends
    assert "pct_change" in trends


def test_summary_trends_last_7d_counts_recent(db_session):
    from src.services.analytics_service import AnalyticsService
    lnk = _make_link(db_session)
    _make_click(db_session, lnk, days_ago=1)   # in window
    _make_click(db_session, lnk, days_ago=3)   # in window
    _make_click(db_session, lnk, days_ago=10)  # outside
    result = AnalyticsService.summary(db_session)
    assert result["trends"]["clicks_last_7d"] == 2


def test_summary_trends_prev_7d_counts_prior_window(db_session):
    from src.services.analytics_service import AnalyticsService
    lnk = _make_link(db_session)
    _make_click(db_session, lnk, days_ago=1)   # last 7d
    _make_click(db_session, lnk, days_ago=8)   # prev 7d (8-14 days ago)
    _make_click(db_session, lnk, days_ago=10)  # prev 7d
    _make_click(db_session, lnk, days_ago=20)  # outside both windows
    result = AnalyticsService.summary(db_session)
    assert result["trends"]["clicks_last_7d"] == 1
    assert result["trends"]["clicks_prev_7d"] == 2


def test_summary_trends_pct_change_positive(db_session):
    from src.services.analytics_service import AnalyticsService
    lnk = _make_link(db_session)
    _make_click(db_session, lnk, days_ago=1)
    _make_click(db_session, lnk, days_ago=2)
    _make_click(db_session, lnk, days_ago=8)  # prev window: 1
    result = AnalyticsService.summary(db_session)
    # last=2, prev=1 → +100%
    assert result["trends"]["pct_change"] == 100.0


def test_summary_trends_pct_change_zero_when_no_prev(db_session):
    from src.services.analytics_service import AnalyticsService
    lnk = _make_link(db_session)
    _make_click(db_session, lnk, days_ago=1)
    result = AnalyticsService.summary(db_session)
    # prev=0 → pct_change is None (can't divide by zero)
    assert result["trends"]["pct_change"] is None
