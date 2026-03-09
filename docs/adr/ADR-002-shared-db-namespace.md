# ADR-002: Shared DB Isolation by Namespace

- Status: Accepted
- Date: 2026-03-09

## Context
YES LINKS runs against a MySQL instance that can also be used by other applications. The service must avoid side effects on non-owned objects and keep its schema footprint strictly bounded.

## Decision
All service-owned DB objects must be namespaced with `yes_links_*`, controlled by `DB_TABLE_PREFIX=yes_links`.

## Consequences
- Positive:
  - Clear ownership boundary in a shared schema.
  - Lower risk of accidental collisions with existing tables.
  - Easier audit for impact analysis.
- Negative:
  - Queries and migrations must consistently honor prefix conventions.
  - Drift risk if contributors bypass central table naming helpers.

## References
- `docs/README.md`
- `docs/operations.md`
- `docs/architecture.md`
