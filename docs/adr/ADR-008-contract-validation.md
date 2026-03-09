# ADR-008: OpenAPI Contract Validation in Code

- Status: Accepted
- Date: 2026-03-09

## Context
API consumers and embedded wrappers depend on stable endpoint contracts. Drift between runtime behavior, docs, and tests causes integration failures.

## Decision
Endpoint lifecycle changes are valid only when all three are aligned:
1. Runtime implementation.
2. `docs/openapi.yaml` and `docs/api.md`.
3. API contract tests.

## Consequences
- Positive:
  - Lower risk of undocumented breaking changes.
  - Better handoff quality for frontend-wrapper and external teams.
  - Clear release readiness criteria.
- Negative:
  - Slightly slower development when skipping docs/tests would be faster.
  - Requires discipline on every endpoint change.

## References
- `docs/openapi.yaml`
- `docs/api.md`
- `tests/api/`
