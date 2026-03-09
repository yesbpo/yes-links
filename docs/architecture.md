# YES LINKS Architecture

## 1. High-level architecture

```text
client
  |
  | http
  v
ingress
  |
  v
fastapi service
  |\
  | \-- redis queue (click events)
  |\
  | \-- redis (cache)
  |
  \-- click-worker --> mysql (click persistence)
  |
  \-- telemetry
```

## 2. Components
- Ingress: receives public traffic and routes to API.
- FastAPI service: business logic, validation, and contracts.
- Click worker: consumes click queue and persists events asynchronously.
- MySQL: source of truth for links and clicks.
- Redis: hot cache for short_code -> target_url lookups.
- Telemetry pipeline: logs, metrics, traces, alerts.

## 3. Domain model
`links`
- id (uuid)
- short_code (unique)
- target_url (string)
- campaign (string)
- tags (array<string>)
- created_at (timestamp)
- created_by (string)
- physical_table: `${DB_TABLE_PREFIX}_links`

`clicks`
- id (uuid)
- link_id (fk -> links.id)
- timestamp (timestamp)
- ip (string)
- user_agent (string)
- referrer (string)
- geo (json)
- physical_table: `${DB_TABLE_PREFIX}_clicks`

## 4. Redirect flow
1. Request enters ingress.
2. Service reads `short_code`.
3. Lookup sequence: Redis, then MySQL fallback.
4. Emit telemetry span + log + counters.
5. Enqueue click event to Redis queue.
6. Click worker persists click into MySQL.
7. Return HTTP 302 with `Location: target_url`.

Shared DB isolation rules:
- Never read/write tables outside `${DB_TABLE_PREFIX}*`.
- Migrations are idempotent and only create missing namespaced tables.

## 5. Short code generation
- Encoding: Base62.
- Length: 5-8 chars.
- Constraints:
  - Unique code enforced by DB unique index.
  - Retry generation on collision.
  - Deterministic validation regex at API boundary.

## 6. Caching strategy
- Read-through cache for redirect path.
- Cache key: `link:{short_code}`.
- TTL configurable via env.
- Invalidate/update cache on link creation or mutation.

## 7. Event model (mandatory)
All events follow:
- event_name
- event_version
- timestamp
- service
- payload

Initial events:
- `link.created.v1`
- `link.redirected.v1`
- `link.click_logged.v1`
- `link.redirect_failed.v1`

## 8. Observability contract
Each request must generate:
- trace
- structured JSON log
- metric

Required log fields:
- timestamp
- service
- request_id
- route
- event
- user_agent
- ip
- duration
- status_code

Metrics baseline:
- `redirect_requests_total`
- `redirect_errors_total`
- `redirect_latency_ms`
- `click_events_total`

## 9. Security and governance
- Input URL validation and allow/block policies.
- Rate limiting at ingress for abuse control.
- Tenant/client quotas (roadmap if multi-tenant enabled).
- Secrets via secret manager/Kubernetes secrets only.

## 10. Repository structure (constitution)
```text
yes-links/
  docs/
  src/
  tests/
  deploy/
  scripts/
```
