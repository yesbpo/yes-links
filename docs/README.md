# YES LINKS Documentation Index

This folder is the canonical source of context for humans and LLM agents working on `yes-links`.

## 1. Read order for new contributors/agents
1. `docs/README.md` (this file)
2. `docs/prd.md`
3. `docs/decisions.md`
4. `docs/adr/` (full ADR records)
5. `docs/services.md`
6. `docs/architecture.md`
7. `docs/api.md` and `docs/openapi.yaml`
8. `docs/deployment.md` and `docs/operations.md`
9. `docs/testing.md`
10. `docs/frontend-wrapper-plan.md`
11. `docs/agent-context.md` + `docs/agent-context.json`
12. `docs/integrations/puy-integration-guide.md` + `docs/integrations/puy-agent-context.json`

## 2. Mission snapshot
- Build an observable and reproducible URL shortener for Yes campaigns.
- Keep it portable across Docker/Kubernetes.
- Preserve zero-impact coexistence in shared MySQL environments through strict table namespacing.

## 3. Project invariants (do not break)
- Database backend: MySQL.
- Shared DB safety: only `yes_links_*` tables are owned by this service.
- Alembic version table: `yes_links_alembic_version`.
- Runtime table prefix: `DB_TABLE_PREFIX=yes_links`.
- OpenAPI + tests are required for endpoint lifecycle changes.
- Structured JSON logs + metrics + traces are mandatory.

## 4. Commands that matter
```bash
# Local quality gates
ruff check .
pytest -q

# Local stack
docker compose up -d --build

# Migrations (intentional schema change only)
DB_TABLE_PREFIX=yes_links alembic upgrade head
```

## 5. Where to update docs when code changes
- Endpoint contract change:
  - `docs/openapi.yaml`
  - `docs/api.md`
  - `tests/api/test_openapi_contract.py`
- Data model/migration change:
  - `docs/architecture.md`
  - `docs/decisions.md`
  - `docs/adr/`
  - `docs/operations.md`
- New component/service:
  - `docs/services.md`
  - `docs/architecture.md`
- Build/deploy pipeline change:
  - `docs/deployment.md`
  - `docs/operations.md`

## 6. Current known gaps
- Runtime OpenAPI exposes `/health`, while prior contract focus was business paths; now documented in `docs/openapi.yaml`.
- Runtime may include automatic FastAPI `422` responses for path/validation errors; documented in contract.
