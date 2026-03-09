# ADR-001: MySQL Is the Primary Database

- Status: Accepted
- Date: 2026-03-09

## Context
YES LINKS started with a generic relational model, but must run aligned with backend-app-center infrastructure. The active shared environment is MySQL, and local-first development must mirror that target to reduce deployment mismatch.

## Decision
Use MySQL as the primary and mandatory relational database for YES LINKS in all environments (local, CI, and deployment).

## Consequences
- Positive:
  - Environment parity with shared backend DB stack.
  - Lower integration risk at handoff time.
  - Single operational runbook for SQL behavior.
- Negative:
  - MySQL-specific behavior must be considered in schema and query design.
  - Migration and testing tooling must remain MySQL-compatible.

## References
- `docs/README.md`
- `docs/architecture.md`
- `docs/deployment.md`
