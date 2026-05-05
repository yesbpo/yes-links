"""
Unit tests for LinkRepository.list()
TF:YL-S1-T1 — RED phase
"""
import pytest
from tests.conftest import db_session  # noqa: F401


def _make_link(db, *, target="https://example.com", campaign=None, tags=None, short_code=None):
    from src.models.link import Link

    import uuid
    link = Link(
        short_code=short_code or uuid.uuid4().hex[:6],
        target_url=target,
        campaign=campaign,
        tags=tags or [],
        created_by="test",
    )
    db.add(link)
    db.commit()
    db.refresh(link)
    return link


def test_list_empty(db_session):
    from src.repositories.link_repository import LinkRepository

    items, total = LinkRepository.list(db_session)
    assert items == []
    assert total == 0


def test_list_returns_all(db_session):
    from src.repositories.link_repository import LinkRepository

    _make_link(db_session, target="https://a.com")
    _make_link(db_session, target="https://b.com")
    _make_link(db_session, target="https://c.com")

    items, total = LinkRepository.list(db_session)
    assert total == 3
    assert len(items) == 3


def test_list_filter_by_campaign(db_session):
    from src.repositories.link_repository import LinkRepository

    _make_link(db_session, campaign="summer")
    _make_link(db_session, campaign="summer")
    _make_link(db_session, campaign="winter")

    items, total = LinkRepository.list(db_session, campaign="summer")
    assert total == 2
    assert all(l.campaign == "summer" for l in items)


def test_list_filter_by_search_short_code(db_session):
    from src.repositories.link_repository import LinkRepository

    _make_link(db_session, short_code="PROMO1", target="https://example.com/a")
    _make_link(db_session, short_code="SALE99", target="https://example.com/b")

    items, total = LinkRepository.list(db_session, search="PROMO")
    assert total == 1
    assert items[0].short_code == "PROMO1"


def test_list_filter_by_search_target_url(db_session):
    from src.repositories.link_repository import LinkRepository

    _make_link(db_session, target="https://landing.example.com/offer")
    _make_link(db_session, target="https://docs.example.com/api")

    items, total = LinkRepository.list(db_session, search="landing")
    assert total == 1
    assert "landing" in items[0].target_url


def test_list_filter_by_single_tag(db_session):
    from src.repositories.link_repository import LinkRepository

    _make_link(db_session, tags=["promo", "summer"])
    _make_link(db_session, tags=["promo"])
    _make_link(db_session, tags=["winter"])

    items, total = LinkRepository.list(db_session, tags=["promo"])
    assert total == 2
    assert all("promo" in l.tags for l in items)


def test_list_filter_by_multiple_tags(db_session):
    from src.repositories.link_repository import LinkRepository

    _make_link(db_session, tags=["promo", "summer"])
    _make_link(db_session, tags=["promo"])
    _make_link(db_session, tags=["summer"])

    items, total = LinkRepository.list(db_session, tags=["promo", "summer"])
    assert total == 1
    assert "promo" in items[0].tags
    assert "summer" in items[0].tags


def test_list_pagination_limit(db_session):
    from src.repositories.link_repository import LinkRepository

    for i in range(5):
        _make_link(db_session, target=f"https://example.com/{i}")

    items, total = LinkRepository.list(db_session, limit=2)
    assert total == 5
    assert len(items) == 2


def test_list_pagination_offset(db_session):
    from src.repositories.link_repository import LinkRepository

    for i in range(5):
        _make_link(db_session, target=f"https://example.com/{i}")

    items_p1, total = LinkRepository.list(db_session, limit=2, offset=0)
    items_p2, _ = LinkRepository.list(db_session, limit=2, offset=2)

    assert total == 5
    assert len(items_p1) == 2
    assert len(items_p2) == 2
    ids_p1 = {l.id for l in items_p1}
    ids_p2 = {l.id for l in items_p2}
    assert ids_p1.isdisjoint(ids_p2)


def test_list_combined_filters(db_session):
    from src.repositories.link_repository import LinkRepository

    _make_link(db_session, target="https://shop.com", campaign="sale", tags=["featured"])
    _make_link(db_session, target="https://shop.com/other", campaign="sale", tags=["normal"])
    _make_link(db_session, target="https://other.com", campaign="promo", tags=["featured"])

    items, total = LinkRepository.list(db_session, campaign="sale", tags=["featured"])
    assert total == 1
    assert items[0].campaign == "sale"
    assert "featured" in items[0].tags
