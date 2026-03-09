import json
import logging
import re


def _create_link(client, target="https://example.com/page", campaign="summer", tags=None):
    return client.post(
        "/links",
        json={
            "target_url": target,
            "campaign": campaign,
            "tags": tags or ["promo"],
        },
    )


def _metric_value(metrics_payload: str, metric_name: str) -> float:
    pattern = re.compile(
        rf"^{re.escape(metric_name)}(?:\{{[^}}]*\}})?\s+([0-9eE+\-.]+)$"
    )
    for line in metrics_payload.splitlines():
        match = pattern.match(line.strip())
        if match:
            return float(match.group(1))
    raise AssertionError(f"Metric {metric_name} not found")


def test_log_structure(client, caplog):
    with caplog.at_level(logging.INFO, logger="yes-links"):
        response = client.get("/health", headers={"user-agent": "pytest-observability"})
    assert response.status_code == 200

    request_record = next(
        (
            record
            for record in caplog.records
            if record.name == "yes-links"
            and record.getMessage() == "request.completed"
            and getattr(record, "route", None) == "/health"
        ),
        None,
    )
    assert request_record is not None

    formatter = logging.getLogger("yes-links").handlers[0].formatter
    request_log = json.loads(formatter.format(request_record))

    required_fields = {
        "timestamp",
        "service",
        "request_id",
        "route",
        "event",
        "user_agent",
        "ip",
        "duration",
        "status_code",
    }
    assert required_fields.issubset(set(request_log.keys()))
    assert request_log["status_code"] == 200
    assert request_log["user_agent"] == "pytest-observability"


def test_trace_exists(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert "x-trace-id" in response.headers
    assert re.fullmatch(r"[0-9a-f]{32}", response.headers["x-trace-id"])


def test_metric_increment(client):
    create = _create_link(client)
    assert create.status_code == 201
    short_code = create.json()["short_code"]

    metrics_before = client.get("/metrics")
    assert metrics_before.status_code == 200
    redirect_before = _metric_value(metrics_before.text, "redirect_requests_total")

    redirect = client.get(f"/{short_code}", follow_redirects=False)
    assert redirect.status_code == 302

    metrics_after = client.get("/metrics")
    assert metrics_after.status_code == 200
    redirect_after = _metric_value(metrics_after.text, "redirect_requests_total")

    assert redirect_after == redirect_before + 1
