import json
import logging
from datetime import UTC, datetime
from typing import Any


class JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        payload: dict[str, Any] = {
            "timestamp": datetime.now(UTC).isoformat(),
            "service": getattr(record, "service", "yes-links"),
            "request_id": getattr(record, "request_id", "-"),
            "route": getattr(record, "route", "-"),
            "event": getattr(record, "event", record.getMessage()),
            "user_agent": getattr(record, "user_agent", "-"),
            "ip": getattr(record, "ip", "-"),
            "duration": getattr(record, "duration", 0),
            "status_code": getattr(record, "status_code", 0),
            "message": record.getMessage(),
            "level": record.levelname,
        }
        return json.dumps(payload, ensure_ascii=True)


def configure_logging() -> logging.Logger:
    logger = logging.getLogger("yes-links")
    logger.setLevel(logging.INFO)
    logger.handlers.clear()
    handler = logging.StreamHandler()
    handler.setFormatter(JsonFormatter())
    logger.addHandler(handler)
    return logger
