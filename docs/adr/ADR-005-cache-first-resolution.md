# ADR-005: Redirect Cache-First Resolution

- Status: Accepted
- Date: 2026-03-09

## Context
Redirect traffic is the highest-volume path in YES LINKS. DB-only reads increase latency and load under burst usage.

## Decision
Use Redis cache-first lookup for short code resolution, with MySQL fallback when cache misses or cache errors occur.

## Consequences
- Positive:
  - Lower median redirect latency.
  - Reduced DB read pressure on hot links.
  - Graceful behavior when cache is temporarily unavailable.
- Negative:
  - Cache invalidation must be handled correctly on link updates/deletes.
  - Additional runtime dependency (Redis) to operate at target scale.

## References
- `docs/services.md`
- `docs/architecture.md`
- `docs/operations.md`
