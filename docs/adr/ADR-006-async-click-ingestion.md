# ADR-006: Async Click Ingestion With Sync Fallback

- Status: Accepted
- Date: 2026-03-09

## Context
Redirect endpoints must stay fast while still registering click analytics. Synchronous writes on every redirect can increase latency at scale.

## Decision
Default to async click ingestion using Redis queue + worker. If queue path is unavailable, fallback to synchronous DB write to preserve analytics continuity.

## Consequences
- Positive:
  - Better redirect responsiveness under load.
  - Click persistence remains available during partial failures.
  - Worker can batch writes for DB efficiency.
- Negative:
  - Operational complexity increases (queue + worker management).
  - Eventual consistency window for analytics with async mode.

## References
- `docs/services.md`
- `src/workers/click_worker.py`
- `docs/operations.md`
