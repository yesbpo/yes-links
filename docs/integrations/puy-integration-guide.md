# YES LINKS x PUY Integration Guide

- Last updated: 2026-03-09
- Scope: integrate YES LINKS into PUY with zero impact on shared DB objects and existing apps.

## 1. Why this guide exists
PUY already has a legacy URL shortener flow inside its Node service. YES LINKS is the new dedicated service for links, redirect tracking, and analytics. This guide defines how to migrate safely without breaking current PUY operations.

## 2. Ingestion summary of PUY
Reviewed sources:
- `PUY/ImplementacionSMS/index.js`
- `PUY/ImplementacionSMS/rutasSueltas.js`
- `PUY/ImplementacionSMS/serverfront1/middleware/authMiddleware.js`
- `PUY/FRONTEND PUY/AppCenterFrontend/components/createCamp.jsx`

Key findings:
1. PUY backend runs Express and mounts routes under `DB_ROUTE_SERVERFRONT` (usually `/db`).
2. PUY has legacy shortener endpoints in `rutasSueltas.js`:
   - `POST /db/url/shorten`
   - `GET /u/:code`
   - `POST /db/url/validate`
3. PUY frontend mainly calls backend with `Bearer` token and env-driven base URLs.
4. PUY and other apps share MySQL, so cross-service table safety is critical.

## 3. Integration target architecture (phase now)
Recommended flow:

`PUY Frontend -> PUY Backend Adapter -> YES LINKS API`

Reason:
- keep PUY auth model unchanged (`authenticateToken` middleware),
- avoid direct browser coupling to YES LINKS base URL/CORS,
- centralize retries, timeouts, and observability in backend adapter.

## 4. Endpoint compatibility map
Legacy endpoint compatibility should be preserved while moving logic to YES LINKS.

### 4.1 Create short URL
- Current PUY: `POST /db/url/shorten` body `{ url }`
- YES LINKS: `POST /links` body `{ target_url, campaign, tags }`

Mapping:
- `url` -> `target_url`
- optional PUY metadata -> `campaign`, `tags`

Response compatibility suggestion:
```json
{
  "success": true,
  "shortUrl": "https://y.es/abc12",
  "shortCode": "abc12",
  "id": "uuid"
}
```

### 4.2 Redirect
- Current PUY: `GET /u/:code` resolves DB table `url_shortener`.
- Migration target: 302 redirect from YES LINKS `GET /{short_code}`.

Safe migration path:
1. Keep `GET /u/:code`.
2. Internally proxy/redirect to YES LINKS.
3. Remove local DB lookup only after parity checks.

### 4.3 Stats
- Add PUY compatibility endpoint:
  - `GET /db/url/stats/:id` -> forwards to `GET /links/{id}/stats`.

### 4.4 URL validation
- `POST /db/url/validate` can remain local (HEAD check) or move later.

## 5. Required PUY adapter components
Add in PUY backend:
1. `serverfront1/services/yesLinksClient.js`
2. `serverfront1/controllers/yesLinksController.js`
3. `serverfront1/routes/yesLinksRouter.js`
4. mount router with `app.use(process.env.DB_ROUTE_SERVERFRONT, yesLinksRouter)`

Client behavior requirements:
- timeout (default 5s),
- retry policy for idempotent reads only,
- propagate `x-request-id`,
- structured logs with route and status code.

## 6. Environment variables (PUY side)
Define new vars in PUY:
- `YES_LINKS_BASE_URL` (example: `http://localhost:8001` for local)
- `YES_LINKS_TIMEOUT_MS` (example: `5000`)
- `YES_LINKS_API_KEY` (optional, if service-to-service auth is added)
- `YES_LINKS_REDIRECT_BASE` (example: `https://y.es`)

Keep existing:
- `DB_ROUTE_SERVERFRONT`
- `CLAVESECRETA`

## 7. Data safety and DB policy
Non-negotiable:
1. YES LINKS owns only `yes_links_*` tables.
2. Do not alter PUY tables from YES LINKS migrations.
3. Do not alter non-YES LINKS tables during rollout tests.
4. Keep Alembic table isolated: `yes_links_alembic_version`.

## 8. Observability contract for integration
Every adapter request must log:
- `timestamp`
- `service`
- `request_id`
- `route`
- `event`
- `user_agent`
- `ip`
- `duration`
- `status_code`

Metrics minimum:
- adapter request count,
- adapter error count,
- adapter latency histogram.

## 9. TDD task list for PUY integration
1. Failing unit tests for yes-links client mapping and timeout behavior.
2. Failing integration test for `POST /db/url/shorten` forwarding to YES LINKS.
3. Failing integration test for `GET /u/:code` redirect path.
4. Implement adapter and routes.
5. Pass tests and refactor.

## 10. Eventual UI wrapper integration (next phase)
Primary recommendation: `iframe first`.

Embed contract draft:
- URL: `https://<yes-links-wrapper>/embed?tenant_id=...&token=...`
- Host supplies short-lived signed token.
- Communication via `postMessage` with strict allowlist.

Needed backend API expansion before full dashboard embed:
- `GET /links` with filters + pagination.
- `GET /campaigns/stats`.
- `GET /dashboard/summary`.

## 11. Definition of done for PUY x YES LINKS API phase
1. PUY can create short links through YES LINKS behind existing auth.
2. Redirect works with no UX break for existing consumers.
3. Link stats are available from PUY surface.
4. No non-owned DB tables were modified.
5. OpenAPI + tests + docs stay synchronized.
