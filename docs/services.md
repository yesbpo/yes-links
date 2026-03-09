# YES LINKS Service Catalog

This document describes all runtime components and their responsibilities.

## 1. API service (`yes-links-api`)
- Entrypoint: `src/main.py`
- Framework: FastAPI
- Core responsibilities:
  - Link CRUD + redirect APIs.
  - Request middleware for observability fields.
  - Prometheus `/metrics` endpoint.
  - Domain event emission for lifecycle actions.

Main modules:
- `src/api/routes_health.py`: health endpoint.
- `src/api/routes_links.py`: link endpoints.
- `src/services/link_service.py`: create/update/delete business rules.
- `src/services/link_resolver_service.py`: cache-first resolution.
- `src/services/click_ingest_service.py`: sync/async click ingest.
- `src/services/analytics_service.py`: aggregation queries.

## 2. Click worker (`yes-links-click-worker`)
- Entry point: `src/workers/click_worker.py`
- Responsibilities:
  - Consume queued click events from Redis list `yes-links:click-events`.
  - Persist clicks in batches.
  - Requeue batch on transient failure.
  - Emit worker events:
    - `link.click_persisted.v1`
    - `click.worker.persist_failed.v1`

## 3. MySQL
- Type: primary relational store.
- Ownership boundary:
  - Owned tables:
    - `yes_links_links`
    - `yes_links_clicks`
    - `yes_links_alembic_version`
  - Non-owned tables: all others in schema (must not be modified).

## 4. Redis
- Responsibilities:
  - Redirect cache (`link:{short_code}`).
  - Click queue (`yes-links:click-events`) in async ingest mode.

Failure behavior:
- Cache failures: DB fallback.
- Queue failures: sync DB write fallback for click ingest.

## 5. Telemetry backends
- Structured JSON logs emitted to stdout.
- OpenTelemetry tracing export optional through `OTEL_ENDPOINT`.
- Prometheus metrics exposed by API service.

## 6. Endpoint-to-service map
- `GET /health`
  - Health check only.
- `POST /links`
  - `LinkService.create`
  - Emits `link.created.v1`
- `PUT /links/{id}`
  - `LinkService.update`
  - Cache invalidation
  - Emits `link.updated.v1`
- `DELETE /links/{id}`
  - `LinkService.delete`
  - Cache invalidation
  - Emits `link.deleted.v1`
- `GET /links/{id}/stats`
  - `AnalyticsService.get_stats`
- `GET /{short_code}`
  - `LinkResolverService.resolve_by_short_code`
  - `ClickIngestService.record_click`
  - Emits `link.redirected.v1`, `link.click_logged.v1`, or `link.redirect_failed.v1`

## 7. Config surface
Required runtime env:
- `DATABASE_URL`
- `DB_TABLE_PREFIX` (expected `yes_links`)
- `REDIS_URL`
- `CLICK_INGEST_MODE` (`sync` or `async`)
- `CLICK_WORKER_BATCH_SIZE`
- `OTEL_ENDPOINT` (optional)
- `JWT_SECRET`
- `SERVICE_NAME`

