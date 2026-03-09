from src.repositories.click_repository import ClickRepository
from src.repositories.link_repository import LinkRepository


def test_link_creation_in_db(db_session):
    link = LinkRepository.create(
        db_session,
        short_code="abc12",
        target_url="https://example.com",
        campaign="test",
        tags=["a"],
        created_by="tester",
    )
    assert link.id is not None


def test_click_creation(db_session):
    link = LinkRepository.create(
        db_session,
        short_code="abc13",
        target_url="https://example.com",
        campaign="test",
        tags=["a"],
        created_by="tester",
    )
    click = ClickRepository.create(
        db_session,
        link_id=link.id,
        ip="127.0.0.1",
        user_agent="pytest",
        referrer="https://ref.example",
        geo={"country": "CO"},
    )
    assert click.id is not None
    assert click.link_id == link.id


def test_foreign_key_integrity(db_session):
    link = LinkRepository.create(
        db_session,
        short_code="abc14",
        target_url="https://example.com",
        campaign="test",
        tags=["a"],
        created_by="tester",
    )
    click = ClickRepository.create(
        db_session,
        link_id=link.id,
        ip=None,
        user_agent=None,
        referrer=None,
        geo={},
    )
    assert click.link_id == link.id


def test_click_batch_creation(db_session):
    link = LinkRepository.create(
        db_session,
        short_code="abc15",
        target_url="https://example.com",
        campaign="test",
        tags=["a"],
        created_by="tester",
    )

    inserted = ClickRepository.create_many(
        db_session,
        [
            {
                "link_id": link.id,
                "ip": "127.0.0.1",
                "user_agent": "pytest-1",
                "referrer": None,
                "geo": {},
            },
            {
                "link_id": link.id,
                "ip": "127.0.0.2",
                "user_agent": "pytest-2",
                "referrer": "https://ref.example",
                "geo": {"country": "CO"},
            },
        ],
    )

    assert inserted == 2
