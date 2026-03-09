# YES LINKS Technical Decisions Index

Decision records are stored in `docs/adr/` as one file per ADR.

## ADR list
- [ADR-001: MySQL is the primary database](./adr/ADR-001-mysql-primary.md)
- [ADR-002: Shared DB isolation by namespace](./adr/ADR-002-shared-db-namespace.md)
- [ADR-003: Dedicated Alembic version table](./adr/ADR-003-alembic-version-isolation.md)
- [ADR-004: Idempotent migrations for owned tables only](./adr/ADR-004-idempotent-owned-migrations.md)
- [ADR-005: Redirect cache-first resolution](./adr/ADR-005-cache-first-resolution.md)
- [ADR-006: Async click ingestion with sync fallback](./adr/ADR-006-async-click-ingestion.md)
- [ADR-007: Observability as hard requirement](./adr/ADR-007-observability-hard-requirement.md)
- [ADR-008: OpenAPI contract validation in code](./adr/ADR-008-contract-validation.md)

## How to add a new ADR
1. Create `docs/adr/ADR-00X-<slug>.md`.
2. Include: `Status`, `Date`, `Context`, `Decision`, `Consequences`, `References`.
3. Link it in this index.
4. If public behavior changes, update:
   - `docs/api.md`
   - `docs/openapi.yaml`
   - related tests in `tests/api/`.
