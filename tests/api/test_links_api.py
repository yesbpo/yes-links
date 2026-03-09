def _create_link(client, target="https://example.com/page", campaign="summer", tags=None):
    return client.post(
        "/links",
        json={
            "target_url": target,
            "campaign": campaign,
            "tags": tags or ["promo"],
        },
    )


def test_create_link_success(client):
    response = _create_link(client)
    assert response.status_code == 201
    body = response.json()
    assert body["short_code"]


def test_create_link_invalid_url(client):
    response = _create_link(client, target="not-a-url")
    assert response.status_code == 422


def test_duplicate_target_url_allowed(client):
    first = _create_link(client, target="https://example.com/dup")
    second = _create_link(client, target="https://example.com/dup")

    assert first.status_code == 201
    assert second.status_code == 201
    assert first.json()["id"] != second.json()["id"]


def test_shortcode_generation(client):
    response = _create_link(client)
    assert response.status_code == 201
    code = response.json()["short_code"]
    assert 5 <= len(code) <= 8


def test_redirect_valid_code(client):
    create = _create_link(client)
    code = create.json()["short_code"]

    response = client.get(f"/{code}", follow_redirects=False)
    assert response.status_code == 302


def test_redirect_invalid_code(client):
    response = client.get("/zzzzzz", follow_redirects=False)
    assert response.status_code == 404


def test_redirect_returns_302(client):
    create = _create_link(client)
    code = create.json()["short_code"]

    response = client.get(f"/{code}", follow_redirects=False)
    assert response.status_code == 302


def test_click_logged(client):
    create = _create_link(client)
    body = create.json()

    client.get(f"/{body['short_code']}", follow_redirects=False)
    stats = client.get(f"/links/{body['id']}/stats")

    assert stats.status_code == 200
    assert stats.json()["total_clicks"] == 1


def test_click_count(client):
    create = _create_link(client)
    body = create.json()

    client.get(f"/{body['short_code']}", follow_redirects=False)
    client.get(f"/{body['short_code']}", follow_redirects=False)

    stats = client.get(f"/links/{body['id']}/stats")
    assert stats.status_code == 200
    assert stats.json()["total_clicks"] == 2


def test_click_by_day(client):
    create = _create_link(client)
    body = create.json()

    client.get(f"/{body['short_code']}", follow_redirects=False)
    stats = client.get(f"/links/{body['id']}/stats")

    assert stats.status_code == 200
    assert len(stats.json()["clicks_by_day"]) >= 1


def test_click_by_campaign(client):
    create = _create_link(client, campaign="cmp-1")
    body = create.json()

    client.get(f"/{body['short_code']}", follow_redirects=False)
    stats = client.get(f"/links/{body['id']}/stats")

    assert stats.status_code == 200
    assert stats.json()["clicks_by_campaign"][0]["campaign"] == "cmp-1"


def test_update_link_success(client):
    create = _create_link(client, target="https://example.com/original", campaign="old", tags=["a"])
    body = create.json()

    response = client.put(
        f"/links/{body['id']}",
        json={
            "target_url": "https://example.com/updated",
            "campaign": "new",
            "tags": ["x", "y"],
        },
    )

    assert response.status_code == 200
    updated = response.json()
    assert updated["id"] == body["id"]
    assert updated["target_url"] == "https://example.com/updated"
    assert updated["campaign"] == "new"
    assert updated["tags"] == ["x", "y"]


def test_update_link_not_found(client):
    response = client.put(
        "/links/not-found",
        json={
            "target_url": "https://example.com/updated",
            "campaign": "new",
            "tags": ["x"],
        },
    )

    assert response.status_code == 404


def test_delete_link_success(client):
    create = _create_link(client, target="https://example.com/to-delete")
    body = create.json()

    deleted = client.delete(f"/links/{body['id']}")
    assert deleted.status_code == 200
    assert deleted.json()["id"] == body["id"]
    assert deleted.json()["deleted"] is True

    redirect = client.get(f"/{body['short_code']}", follow_redirects=False)
    assert redirect.status_code == 404


def test_delete_link_not_found(client):
    response = client.delete("/links/not-found")
    assert response.status_code == 404
