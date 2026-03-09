import logging
from datetime import UTC, datetime


def emit_event(
    logger: logging.Logger, *, event_name: str, payload: dict, service: str = "yes-links"
):
    logger.info(
        event_name,
        extra={
            "event": event_name,
            "service": service,
            "request_id": payload.get("request_id", "-"),
            "route": payload.get("route", "-"),
            "user_agent": payload.get("user_agent", "-"),
            "ip": payload.get("ip", "-"),
            "duration": payload.get("duration", 0),
            "status_code": payload.get("status_code", 0),
            "event_name": event_name,
            "event_version": payload.get("event_version", "v1"),
            "timestamp": datetime.now(UTC).isoformat(),
            "payload": payload,
        },
    )
