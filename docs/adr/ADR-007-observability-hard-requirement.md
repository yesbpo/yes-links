# ADR-007: Observability as a Hard Requirement

- Status: Accepted
- Date: 2026-03-09

## Context
YES engineering standards require every request to emit trace, log, and metric data. This is mandatory for production support and shared-platform diagnostics.

## Decision
Enforce observability primitives in API and worker:
- Structured JSON logs with required fields.
- OpenTelemetry tracing support.
- Prometheus metrics for core request and click flows.

## Consequences
- Positive:
  - Faster debugging and incident triage.
  - Better SLO tracking and capacity planning.
  - Contract-level consistency with Yes constitution.
- Negative:
  - Additional implementation and test surface.
  - Potential overhead if instrumentation is misconfigured.

## References
- `docs/services.md`
- `docs/testing.md`
- `docs/operations.md`
