"""
API tests for GET /campaigns/stats
TF:YL-S1-T3 — RED phase
"""


def _create_link(client, *, target="https://example.com", campaign=None):
    r = client.post("/links", json={"target_url": target, "campaign": campaign, "tags": []})
    assert r.status_code == 201
    return r.json()


def _hit(client, short_code: str):
    r = client.get(f"/{short_code}", follow_redirects=False)
    assert r.status_code == 302


# ── shape ──────────────────────────────────────────────────────────────────────


def test_campaigns_stats_returns_200(client):
    r = client.get("/campaigns/stats")
    assert r.status_code == 200


def test_campaigns_stats_empty_db(client):
    r = client.get("/campaigns/stats")
    assert r.json() == []


def test_campaigns_stats_shape(client):
    lnk = _create_link(client, campaign="test")
    _hit(client, lnk["short_code"])
    body = client.get("/campaigns/stats").json()
    assert len(body) == 1
    row = body[0]
    assert "campaign" in row
    assert "total_links" in row
    assert "total_clicks" in row
    assert "last_click_at" in row


# ── aggregation ────────────────────────────────────────────────────────────────


def test_campaigns_stats_groups_campaigns(client):
    l1 = _create_link(client, campaign="summer")
    l2 = _create_link(client, campaign="summer")
    l3 = _create_link(client, campaign="winter")
    _hit(client, l1["short_code"])
    _hit(client, l2["short_code"])
    _hit(client, l3["short_code"])

    body = client.get("/campaigns/stats").json()
    camps = {r["campaign"]: r for r in body}
    assert camps["summer"]["total_links"] == 2
    assert camps["summer"]["total_clicks"] == 2
    assert camps["winter"]["total_links"] == 1
    assert camps["winter"]["total_clicks"] == 1


def test_campaigns_stats_excludes_null_campaign(client):
    _create_link(client, campaign=None)  # no campaign — excluded
    lnk = _create_link(client, campaign="promo")
    _hit(client, lnk["short_code"])

    body = client.get("/campaigns/stats").json()
    names = [r["campaign"] for r in body]
    assert None not in names
    assert "promo" in names


def test_campaigns_stats_ordered_by_clicks_desc(client):
    l1 = _create_link(client, campaign="low")
    l2 = _create_link(client, campaign="high")
    _hit(client, l1["short_code"])
    for _ in range(3):
        _hit(client, l2["short_code"])

    body = client.get("/campaigns/stats").json()
    assert body[0]["campaign"] == "high"


# ── CORS ───────────────────────────────────────────────────────────────────────


def test_campaigns_stats_cors(client):
    r = client.get("/campaigns/stats", headers={"Origin": "http://localhost:3000"})
    assert r.status_code == 200
    assert "access-control-allow-origin" in r.headers
