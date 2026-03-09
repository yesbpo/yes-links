import pytest
from pydantic import ValidationError

from src.repositories.link_repository import LinkRepository
from src.services.link_service import LinkService


def test_create_link_invalid_url(db_session):
    service = LinkService(LinkRepository())

    with pytest.raises(ValidationError):
        service.create(
            db_session,
            target_url="invalid-url",
            campaign="c1",
            tags=["tag"],
            created_by="test",
        )
