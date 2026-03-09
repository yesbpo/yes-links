# ADR-003: Dedicated Alembic Version Table

- Status: Accepted
- Date: 2026-03-09

## Context
Default Alembic uses `alembic_version`, which can conflict in shared database scenarios when multiple services use migrations in the same schema.

## Decision
YES LINKS uses an isolated Alembic version table: `yes_links_alembic_version`.

## Consequences
- Positive:
  - Migration state is service-specific.
  - No migration-state overwrite risk across services.
  - Safer independent lifecycle for deployment and rollback.
- Negative:
  - Extra setup required in Alembic configuration.
  - Operators must avoid assumptions based on default table names.

## References
- `docs/operations.md`
- `docs/deployment.md`
- `alembic/`
