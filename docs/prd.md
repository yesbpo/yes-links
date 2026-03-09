# YES LINKS PRD

## 1. Product summary
- Internal name: `yes-links`
- Service goal: short URL creation, click registration, and analytics.
- Public example: `https://y.es/abc12`
- Scale target: handle millions of redirects.

## 2. Problem statement
Yes needs a reliable and observable URL shortener for internal and external campaigns. The system must support high read traffic (redirects), write click events safely, and expose analytics for campaign decisions.

## 3. Scope
In scope:
- Create short links.
- Redirect by short code with 302.
- Register click events with request metadata.
- Expose aggregate stats endpoint.

Out of scope (initial release):
- Link expiration enforcement.
- Fraud scoring engine.
- QR code generation.
- Advanced geo analytics dashboards.

## 4. Users and use cases
Primary users:
- Growth/marketing teams creating campaign links.
- Product and analytics teams consuming click data.

Core flows:
1. User creates a short link via API.
2. End user visits the short URL.
3. Service resolves target, logs click, and redirects.
4. Team queries stats per link/campaign/day.

## 5. Functional requirements
- Create link: `POST /links` with `target_url`, `campaign`, `tags`.
- Redirect: `GET /{short_code}` with 302 to `target_url`.
- Stats: `GET /links/{id}/stats`.
- Short code algorithm: Base62, length 5-8.
- Duplicate target URLs are allowed.

## 6. Non-functional requirements
- Reproducibility: full local run with Docker and deterministic setup.
- Observability: trace + structured log + metric per request.
- Portability: container-first deployment on Docker/Kubernetes.
- Availability target (initial): 99.9% monthly for redirect path.
- Performance target (initial): 1000 redirect req/sec benchmark in controlled env.

## 7. Data requirements
Entities:
- `links`: id, short_code, target_url, campaign, tags, created_at, created_by.
- `clicks`: id, link_id, timestamp, ip, user_agent, referrer, geo.

Retention baseline:
- Click events retained for analytics policy window (to be defined by data governance).

## 8. Success metrics
- Redirect latency p95.
- Redirect error rate.
- Click throughput.
- Link creation success rate.

## 9. Delivery phases (TDD)
- Phase 0: bootstrap repo and platform wiring.
- Phase 1: DB layer and migrations.
- Phase 2: link creation.
- Phase 3: redirect logic + click tracking.
- Phase 4: analytics queries.
- Phase 5: observability stack integration.
- Phase 6: UI/browser tests with Playwright.
- Phase 7: performance benchmarks.

## 10. Constitution compliance matrix
1. Containerized project: required (`docker build`, `docker run`, `docker compose up`).
2. Mandatory tests: TDD by phase; unit/integration/api/ui required.
3. Observability: trace/log/metric per request; JSON structured logs.
4. Defined architecture: docs/src/tests/deploy directories present.
5. Reproducible deployment: Dockerfile + Compose + Kubernetes manifests.
6. Endpoint contracts: OpenAPI + API tests required.
7. Event emission: universal event schema required for create/redirect/click.
