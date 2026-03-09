# YES LINKS Frontend Wrapper Plan

This document defines the next major milestone: a frontend wrapper for embedded and non-technical usage.

## 1. Mission
Build a frontend wrapper that:
1. Embeds inside other projects.
2. Provides a non-technical interface to create/manage links.
3. Shows dashboards for campaigns, links, and click behavior.

## 2. Product outcomes
- Enable business users to create and manage links without API clients.
- Make stats visible without SQL or ad-hoc scripts.
- Allow host products to embed the experience quickly.

## 3. Proposed architecture

## 3.1 Wrapper delivery model
- Option A: iframe embed (fastest integration, best isolation).
- Option B: JS SDK + web component (deeper host integration).
- Recommendation for phase 1: iframe first, SDK second.

## 3.2 Frontend app responsibilities
- Auth/session handling (or token pass-through from host).
- Link CRUD UI.
- Redirect analytics dashboards.
- Basic filters: date range, campaign, tag, link.

## 3.3 Backend requirements to support dashboards
Current API supports:
- Create link.
- Update/delete link.
- Redirect.
- Stats by link id.

Additional endpoints recommended:
- `GET /links` with pagination and filters.
- `GET /campaigns/stats` aggregated by campaign/date.
- `GET /dashboard/summary` totals and KPIs.
- `GET /links/{id}/events` optional drill-down view.

## 4. UX modules (phase 1)
- Dashboard home:
  - Total links.
  - Total clicks.
  - Top campaigns.
  - Top links.
- Links manager:
  - Create/edit/delete link.
  - Copy short URL.
  - Search by campaign/tag.
- Analytics view:
  - Clicks by day.
  - Clicks by campaign.
  - Link-level detail.

## 5. Embedding contract
- Embed URL format:
  - `https://<wrapper-host>/embed?tenant_id=...&token=...`
- Required host inputs:
  - tenant id
  - signed token
  - theme hints (optional)
- Isolation:
  - strict postMessage API
  - no direct host DOM mutation

## 6. Security and multi-tenant controls
- Signed, short-lived embed tokens.
- Tenant-scoped queries in backend.
- CORS policy restricted by allowed origins.
- Audit logs for link mutations.

## 7. Delivery plan

## 7.1 Phase A: foundations
- Define wrapper PRD + API extensions.
- Build auth and embedding skeleton.
- Add contract tests for new API endpoints.

## 7.2 Phase B: link management UI
- CRUD forms + validations.
- Campaign/tag filters.
- Error handling and loading states.

## 7.3 Phase C: analytics dashboards
- Time-series and campaign charts.
- Export CSV for business users.
- Link detail view.

## 7.4 Phase D: embed hardening
- Host integration docs.
- Theming support.
- Performance tuning.

## 8. Definition of done (phase 1)
- Host app can embed wrapper and authenticate users.
- Non-technical user can create/edit/delete links from UI.
- Dashboard shows campaign and link metrics with filters.
- OpenAPI and tests updated for any new backend endpoints.
- Docs updated in `docs/services.md`, `docs/api.md`, `docs/openapi.yaml`, `docs/operations.md`.

