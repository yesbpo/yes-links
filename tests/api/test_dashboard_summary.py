"""
API tests for GET /dashboard/summary
TF:YL-S1-T2 — RED phase
"""
import pytest
from tests.conftest import client  # noqa: F401


def _create_link(client, *, target="https://example.com", campaign=None, tags=None):
    r = client.post(
        "/links",
        json={"target_url": target, "campaign": campaign, "tags": tags or []},
    )
    assert r.status_code == 201
    return r.json()


def _hit(client, short_code: str):
    """Trigger a redirect (generates a Click record)."""
    r = client.get(f"/{short_code}", follow_redirects=False)
    assert r.status_code == 302


# ── shape ──────────────────────────────────────────────────────────────────────

def test_summary_returns_200(client):
    r = client.get("/dashboard/summary")
    assert r.status_code == 200


def test_summary_shape_empty_db(client):
    r = client.get("/dashboard/summary")
    body = r.json()
    assert body["total_links"] == 0
    assert body["total_clicks"] == 0
    assert body["avg_clicks_per_link"] == 0.0
    assert body["top_campaigns"] == []
    assert "trends" in body
    trends = body["trends"]
    assert "clicks_last_7d" in trends
    assert "clicks_prev_7d" in trends
    assert "pct_change" in trends


def test_summary_counts_created_links(client):
    _create_link(client, campaign="summer")
    _create_link(client, campaign="winter")
    body = client.get("/dashboard/summary").json()
    assert body["total_links"] == 2


def test_summary_counts_clicks_after_redirect(client):
    link = _create_link(client)
    _hit(client, link["short_code"])
    _hit(client, link["short_code"])
    body = client.get("/dashboard/summary").json()
    assert body["total_clicks"] == 2


def test_summary_avg_clicks_per_link(client):
    l1 = _create_link(client)
    l2 = _create_link(client)
    _hit(client, l1["short_code"])
    _hit(client, l1["short_code"])
    _hit(client, l2["short_code"])
    body = client.get("/dashboard/summary").json()
    assert body["avg_clicks_per_link"] == 1.5


# ── top_campaigns ──────────────────────────────────────────────────────────────

def test_summary_top_campaigns_present_and_ordered(client):
    l1 = _create_link(client, campaign="promo")
    l2 = _create_link(client, campaign="docs")
    _hit(client, l1["short_code"])
    _hit(client, l1["short_code"])
    _hit(client, l2["short_code"])
    body = client.get("/dashboard/summary").json()
    camps = body["top_campaigns"]
    assert len(camps) >= 1
    assert camps[0]["campaign"] == "promo"
    assert camps[0]["clicks"] == 2


def test_summary_top_campaigns_max_5(client):
    for i in range(7):
        lnk = _create_link(client, campaign=f"camp{i}")
        _hit(client, lnk["short_code"])
    body = client.get("/dashboard/summary").json()
    assert len(body["top_campaigns"]) <= 5


# ── CORS ───────────────────────────────────────────────────────────────────────

def test_summary_cors_header(client):
    r = client.get("/dashboard/summary", headers={"Origin": "http://localhost:3000"})
    assert r.status_code == 200
    assert "access-control-allow-origin" in r.headers
