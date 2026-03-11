import time
import uuid

from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse, PlainTextResponse
from fastapi.staticfiles import StaticFiles
from opentelemetry import trace

from src.api.routes_health import router as health_router
from src.api.routes_links import router as links_router
from src.core.config import settings
from src.core.logging import configure_logging
from src.core.metrics import metrics_payload, redirect_latency_ms
from src.core.tracing import configure_tracing, instrument_fastapi


def create_app() -> FastAPI:
    app = FastAPI(title="YES LINKS", version="0.1.0")

    app.state.logger = configure_logging()
    configure_tracing(settings.service_name, settings.otel_endpoint)
    instrument_fastapi(app)

    @app.exception_handler(ValueError)
    async def value_error_handler(request: Request, exc: ValueError):
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={"detail": str(exc)},
        )

    @app.exception_handler(RuntimeError)
    async def runtime_error_handler(request: Request, exc: RuntimeError):
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={"detail": str(exc)},
        )

    @app.middleware("http")
    async def request_observability_middleware(request: Request, call_next):
        request_id = request.headers.get("x-request-id", str(uuid.uuid4()))
        request.state.request_id = request_id

        start = time.perf_counter()
        response = await call_next(request)
        duration_ms = (time.perf_counter() - start) * 1000
        redirect_latency_ms.observe(duration_ms)

        app.state.logger.info(
            "request.completed",
            extra={
                "service": settings.service_name,
                "request_id": request_id,
                "route": request.url.path,
                "event": "request.completed",
                "user_agent": request.headers.get("user-agent", ""),
                "ip": request.client.host if request.client else "",
                "duration": round(duration_ms, 3),
                "status_code": response.status_code,
            },
        )

        span_context = trace.get_current_span().get_span_context()
        if span_context and span_context.trace_id:
            trace_id = format(span_context.trace_id, "032x")
        else:
            try:
                trace_id = uuid.UUID(request_id).hex
            except ValueError:
                trace_id = uuid.uuid4().hex

        response.headers["x-request-id"] = request_id
        response.headers["x-trace-id"] = trace_id
        return response

    @app.get("/metrics", include_in_schema=False)
    def metrics() -> PlainTextResponse:
        payload, content_type = metrics_payload()
        return PlainTextResponse(payload.decode("utf-8"), media_type=content_type)

    app.include_router(health_router)

    # Serve UI Storybook
    try:
        app.mount("/storybook", StaticFiles(directory="static/storybook", html=True), name="storybook")
    except Exception:
        # Graceful failure if storybook folder doesn't exist (local dev)
        pass

    app.include_router(links_router)

    return app


app = create_app()
