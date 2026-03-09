# YES LINKS Operations Runbook

This runbook is focused on safe day-2 operations, especially in shared DB environments.

## 1. Operating modes

## 1.1 Local full stack (self-contained)
```bash
docker compose up -d --build
curl -f http://localhost:8001/health
```

## 1.2 Local app against remote MySQL (safe contract checks)
Use this mode for OpenAPI/runtime checks when you must avoid schema changes.

Rules:
- Start app without migration command.
- Only call read-only endpoints (`/health`, `/openapi.json`, `/docs`).
- Do not run `POST/PUT/DELETE` in this mode unless explicitly approved.

## 2. Migration policy (shared DB)
- Prefix must be `DB_TABLE_PREFIX=yes_links`.
- Only `yes_links_*` objects are allowed.
- Alembic table must be `yes_links_alembic_version`.
- Never modify tables not owned by this service.

Intentional migration command:
```bash
DB_TABLE_PREFIX=yes_links alembic upgrade head
```

## 3. Safe pre-flight checklist
1. Confirm target DB and credentials.
2. Confirm `DB_TABLE_PREFIX=yes_links`.
3. Confirm migration scripts are idempotent.
4. Snapshot existing `yes_links_*` objects list.
5. Run migration.
6. Re-list `yes_links_*` objects and verify only expected changes.

## 4. Health and diagnostics
Basic probes:
```bash
curl -f http://localhost:8001/health
curl -f http://localhost:8001/metrics
curl -f http://localhost:8001/openapi.json
```

Container logs:
```bash
docker compose logs -f api
docker compose logs -f click-worker
```

## 5. Alert pivots
- Redirect failures rising:
  - Check DB connectivity.
  - Check cache resolution errors.
  - Check route/event logs for `link.redirect_failed.v1`.
- Click throughput drops:
  - Check Redis queue size.
  - Check worker errors `click.worker.persist_failed.v1`.
  - Verify DB insert latency.

## 6. Maintenance tasks
- Rotate secrets from external secret store.
- Rebuild images when dependencies change.
- Keep `docs/openapi.yaml` synchronized with runtime.
- Keep tests green before deployment:
  - `ruff check .`
  - `pytest -q`

## 7. Rollback guidance
- Application rollback:
  - Deploy previous container image tag.
- Schema rollback:
  - Only if rollback script affects owned `yes_links_*` objects.
  - Validate no cross-service dependency is impacted.

## 8. Explicit non-goals for operators
- Do not run broad DDL against shared schema.
- Do not drop or alter non-`yes_links_*` tables.
- Do not rely on default `alembic_version` table.

