from prometheus_client import CONTENT_TYPE_LATEST, Counter, Histogram, generate_latest

redirect_requests_total = Counter("redirect_requests_total", "Total redirect requests")
redirect_errors_total = Counter("redirect_errors_total", "Total redirect errors")
click_events_total = Counter("click_events_total", "Total click events")
redirect_latency_ms = Histogram("redirect_latency_ms", "Redirect latency in ms")


def metrics_payload() -> tuple[bytes, str]:
    return generate_latest(), CONTENT_TYPE_LATEST
