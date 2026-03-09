# YES LINKS Agent Context Pack

Use this file as a compact brief for other LLM agents before they modify the project.

## 1. Project identity
- Name: `yes-links`
- Domain: URL shortener + click analytics.
- Backend stack: FastAPI, SQLAlchemy, Alembic, Redis, OpenTelemetry.
- Infra: Docker, Kubernetes, MySQL.

## 2. Non-negotiable constraints
- Keep reproducibility, observability, portability.
- Do not touch non-owned DB tables in shared schemas.
- Owned DB objects must remain namespaced under `yes_links_*`.
- Use `DB_TABLE_PREFIX=yes_links`.
- Alembic version table must remain isolated: `yes_links_alembic_version`.
- Endpoint changes require both OpenAPI and tests updates.

## 3. What exists today
- API endpoints:
  - `GET /health`
  - `POST /links`
  - `PUT /links/{id}`
  - `DELETE /links/{id}`
  - `GET /links/{id}/stats`
  - `GET /{short_code}`
- Worker:
  - `click-worker` consumes Redis queue and persists click batches.
- Observability:
  - JSON logs with Yes-required fields.
  - Prometheus counters/histograms.
  - OpenTelemetry tracing exporter support.

## 4. Repository map
- `src/`: runtime code.
- `alembic/`: migrations.
- `tests/`: unit, integration, api, ui.
- `deploy/`: docker/compose/kubernetes manifests.
- `docs/`: product, architecture, API, deployment, testing, operations.

## 5. Known integration posture
- Service can run locally with local MySQL.
- Service can run locally against remote MySQL for contract checks.
- Shared-DB compatibility is implemented through table namespacing + idempotent migrations.

## 6. Next mission (frontend wrapper)
Goal:
1. Embed in other projects.
2. Serve non-technical users.
3. Provide campaign/link dashboards.

Primary reference: `docs/frontend-wrapper-plan.md`.

## 7. Mandatory workflow for new changes
1. Write failing tests.
2. Implement.
3. Pass tests.
4. Refactor.
5. Update docs.

## 8. Fast quality gate commands
```bash
ruff check .
pytest -q
```

## 9. Suggested prompt seed for external agents
```text
You are working on YES LINKS. Keep strict shared-DB isolation:
- only yes_links_* objects are owned
- DB_TABLE_PREFIX must remain yes_links
- update OpenAPI + tests on endpoint changes
- preserve structured logs + metrics + tracing
Read docs/README.md, docs/decisions.md, docs/services.md, docs/frontend-wrapper-plan.md before coding.
```

