"""
API tests for GET /links — list endpoint with filters, pagination, and CORS.
TF:YL-S1-T1 — RED phase
"""
import pytest
from tests.conftest import client  # noqa: F401


def _create(client, *, target="https://example.com", campaign=None, tags=None):
    r = client.post(
        "/links",
        json={"target_url": target, "campaign": campaign, "tags": tags or []},
    )
    assert r.status_code == 201
    return r.json()


# ── shape ──────────────────────────────────────────────────────────────────────

def test_list_returns_200_and_shape(client):
    response = client.get("/links")
    assert response.status_code == 200
    body = response.json()
    assert "items" in body
    assert "total" in body
    assert isinstance(body["items"], list)
    assert isinstance(body["total"], int)


def test_list_empty_db(client):
    response = client.get("/links")
    assert response.status_code == 200
    body = response.json()
    assert body["items"] == []
    assert body["total"] == 0


def test_list_includes_created_link(client):
    link = _create(client, target="https://example.com/page", campaign="q1", tags=["a"])
    response = client.get("/links")
    body = response.json()
    assert body["total"] == 1
    item = body["items"][0]
    assert item["id"] == link["id"]
    assert item["short_code"] == link["short_code"]
    assert item["target_url"] == "https://example.com/page"
    assert item["campaign"] == "q1"
    assert item["tags"] == ["a"]


# ── filters ────────────────────────────────────────────────────────────────────

def test_filter_by_campaign(client):
    _create(client, campaign="summer")
    _create(client, campaign="summer")
    _create(client, campaign="winter")

    r = client.get("/links?campaign=summer")
    body = r.json()
    assert body["total"] == 2
    assert all(i["campaign"] == "summer" for i in body["items"])


def test_filter_by_search_matches_short_code(client):
    link = _create(client, target="https://promo.example.com")
    code = link["short_code"]

    r = client.get(f"/links?search={code[:3]}")
    body = r.json()
    assert any(i["id"] == link["id"] for i in body["items"])


def test_filter_by_search_matches_target_url(client):
    _create(client, target="https://landing.example.com/offer")
    _create(client, target="https://docs.example.com/api")

    r = client.get("/links?search=landing")
    body = r.json()
    assert body["total"] == 1
    assert "landing" in body["items"][0]["target_url"]


def test_filter_by_tags(client):
    _create(client, tags=["promo", "featured"])
    _create(client, tags=["promo"])
    _create(client, tags=["featured"])

    r = client.get("/links?tags=promo,featured")
    body = r.json()
    assert body["total"] == 1
    item = body["items"][0]
    assert "promo" in item["tags"]
    assert "featured" in item["tags"]


def test_filter_no_match_returns_empty(client):
    _create(client, campaign="real")
    r = client.get("/links?campaign=nonexistent")
    body = r.json()
    assert body["total"] == 0
    assert body["items"] == []


# ── pagination ─────────────────────────────────────────────────────────────────

def test_pagination_limit(client):
    for i in range(5):
        _create(client, target=f"https://example.com/{i}")

    r = client.get("/links?limit=2")
    body = r.json()
    assert body["total"] == 5
    assert len(body["items"]) == 2


def test_pagination_offset(client):
    for i in range(5):
        _create(client, target=f"https://example.com/{i}")

    p1 = client.get("/links?limit=2&offset=0").json()
    p2 = client.get("/links?limit=2&offset=2").json()
    p3 = client.get("/links?limit=2&offset=4").json()

    ids_p1 = {i["id"] for i in p1["items"]}
    ids_p2 = {i["id"] for i in p2["items"]}
    ids_p3 = {i["id"] for i in p3["items"]}

    assert ids_p1.isdisjoint(ids_p2)
    assert ids_p2.isdisjoint(ids_p3)
    assert ids_p1.isdisjoint(ids_p3)
    assert len(ids_p3) == 1  # last page


def test_limit_max_100(client):
    r = client.get("/links?limit=999")
    assert r.status_code == 422  # FastAPI Query validation


def test_limit_min_1(client):
    r = client.get("/links?limit=0")
    assert r.status_code == 422


# ── CORS ───────────────────────────────────────────────────────────────────────

def test_cors_header_on_get(client):
    r = client.get("/links", headers={"Origin": "http://localhost:3000"})
    assert r.status_code == 200
    assert "access-control-allow-origin" in r.headers


def test_cors_preflight(client):
    r = client.options(
        "/links",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "content-type",
        },
    )
    assert r.status_code in (200, 204)
    assert "access-control-allow-origin" in r.headers
