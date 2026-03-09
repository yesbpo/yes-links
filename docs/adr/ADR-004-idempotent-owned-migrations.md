# ADR-004: Idempotent Migrations for Owned Tables Only

- Status: Accepted
- Date: 2026-03-09

## Context
Migration execution against a shared MySQL schema must never alter non-owned objects. Re-runs and partial-run scenarios must remain safe.

## Decision
Migration scripts must be idempotent and scoped only to `yes_links_*` objects owned by this service.

## Consequences
- Positive:
  - Reduced blast radius in shared environments.
  - Safer reruns in CI/local and handoff scenarios.
  - Clear compliance with zero-impact requirement for other apps.
- Negative:
  - Migration authoring takes additional care and review.
  - Some schema evolution patterns require multi-step safe migrations.

## References
- `docs/operations.md`
- `docs/architecture.md`
- `alembic/versions/`
