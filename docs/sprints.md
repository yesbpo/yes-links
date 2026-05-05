# yes-links Sprint Tracker

---

## Sprint 1 — SDK Self-Contained Integration

**Goal**: A developer in any internal product writes `<YesLinksProvider token={jwt} baseUrl={url}><YesLinksDashboard /></YesLinksProvider>` and gets a fully functional, data-connected link management UI with zero fetch code on their side.

**Success criteria**:
1. `@yes/links-ui` can be installed, imported, and rendered with only `token` + `baseUrl` props — no `dataSource` wiring required
2. All 13 tasks at 🟢 DONE with no regressions on existing tests (T1.1–T1.9 done ✅)
3. `npm run build:lib` produces a `dist/` that a fresh host app can consume
4. Live data flows end-to-end: list links, create link, view KPI stats, view campaign breakdown

**Dates**: 2026-05-05 → 2026-05-18

**Test baseline** (recorded 2026-05-04, before T1.1):
- pytest: `python3 -m pytest --tb=no -q` → 34 collected (pre-T1.1)
- vitest: `npm run test -- --run` → (SDK tests not yet measured)

**⚠️ Sprint 2 dependency (out of scope here)**: Backend auth middleware (Bearer token validation on FastAPI routes). Sprint 1 assumes internal network trust (k3s cluster). Add JWT verification before any public exposure.

---

### Backend Tasks — FastAPI / Python

| Task | Description | Status | Notes |
|------|-------------|--------|-------|
| T1.1 | CORS middleware + `GET /links` (list, filters, pagination) | 🟢 DONE ✅ 2026-05-05 | `CORSMiddleware` wired to `settings.cors_allowed_origins`. `GET /links` with campaign/tags/search/limit/offset. `LinkRepository.list()`. `LinksListResponse` schema. 58 pytest passing (34→58, +24 tests). CORS preflight 200. Live HTTP on 127.0.0.1:8001 verified. |
| T1.2 | `GET /dashboard/summary` — KPI aggregation | 🟢 DONE ✅ 2026-05-05 | `AnalyticsService.summary()` + `GET /dashboard/summary` route + `DashboardSummaryResponse` schema. 79 pytest passing (58→79, +21 tests). Live HTTP verified: total_links, total_clicks, avg_clicks_per_link, top_campaigns (top 5, ordered), trends (7d windows + pct_change). |
| T1.3 | `GET /campaigns/stats` — per-campaign aggregation | 🟢 DONE ✅ 2026-05-05 | `AnalyticsService.campaigns_stats()` + `GET /campaigns/stats` route + `CampaignStatsRow` schema. Optional `?from=` / `?to=` ISO datetime filters. LEFT JOIN so 0-click links appear. 94 pytest passing (79→94, +15 tests). Live HTTP verified. |

---

### SDK Tasks — TypeScript / yes-links-ui

| Task | Description | Status | Notes |
|------|-------------|--------|-------|
| T1.4 | `YesLinksProvider`: add `baseUrl` prop to context | 🟢 DONE ✅ 2026-05-05 | `baseUrl: string` added to `YesLinksContextType` + provider props + context value. Default context safe outside provider. `useYesLinks()` simplified (no longer throws). 4 tests (was 2, +2). |
| T1.5 | SDK internal API client (`src/lib/apiClient.ts`) | 🟢 DONE ✅ 2026-05-05 | `createApiClient({token, baseUrl})` factory. Methods: `getLinks`, `getDashboardSummary`, `getCampaignsStats`, `createLink`, `updateLink`, `deleteLink`. `ApiError` class. Auto-injects `Authorization: Bearer` + `x-request-id`. 16 tests (was 0, +16). |
| T1.6 | Wire `useLinks` to SDK client (remove raw fetch) | 🟢 DONE ✅ 2026-05-05 | Replaced raw fetch with `apiClient.getLinks()`. Reads token+baseUrl from `useYesLinks()`. `useMemo` for stable client. Token-null guard. `enabled` option. 6 tests (was 4, +2). |
| T1.7 | `useStats` hook (`src/hooks/useStats.ts`) | 🟢 DONE ✅ 2026-05-05 | New hook. Calls `getDashboardSummary()`, maps backend → `KPIStatsData` + `TrendData[]`. `enabled` option. 11 tests (was 0, +11). |
| T1.8 | `dataSource` + `scope` optional in `YesLinksDashboard` with internal fallback | 🟢 DONE ✅ 2026-05-05 | `scope?` and `dataSource?` now optional. Managed mode uses `useLinks`+`useStats` hooks. DataSource escape hatch preserved. Scope selector hidden when absent. 8 tests (was 5, +3). |
| T1.9 | Add `useStats` + `useLinks` to public SDK surface | 🟢 DONE ✅ 2026-05-05 | Exported `useLinks`, `useStats`, `createApiClient`, `ApiError` from `src/index.ts`. Added to `expectedExports` in contract test. 4 contract tests (was 3, +1). |
| T1.10 | Playwright E2E: SDK integration smoke test | 🟢 DONE ✅ 2026-05-04 | 3/3 E2E smoke tests green. Fixed port conflict (3001), wired managed createLink to apiClient, fixed CORS default. tests:92→+3 Playwright. |
| T1.11 | Delete legacy standalone app (useHandshake + app/page.tsx) | 🟢 DONE ✅ 2026-05-04 | Deleted useHandshake.ts, useHandshake.test.ts, handshake.spec.ts, page.test.tsx. Replaced page.tsx with SDK harness. Updated layout.tsx title. tsc clean. tests:92→86 vitest (removed 8 legacy tests, 3 pre-existing failures remain). |
| T1-demo | yes-links-demo: minimal Vite+React 19 SDK integration app | 🟢 DONE ✅ 2026-05-05 | New `yes-links-demo/` package. Consumes `@yes/links-ui` via `file:` reference (dist copy). Layer B: `YesLinksDashboard` zero-config. Layer C: `useLinks`+`useStats` custom widget. Playwright route mocking — no live backend. tests:0→16 (7 Vitest + 9 Playwright). Report: `test_reports/T_demo_REVALIDATE_20260505-0936.md`. |
| T1.14 | `clientScope` + `mode` multi-tenant SDK props | 🟢 DONE ✅ 2026-05-05 | `clientScope?: {campaign?, tags?[]}` scopes all GET /links + GET /dashboard/summary to a client's data subset. `mode?: 'internal'\|'external'` hides campaign/tags in Create Link overlay for end-user portals. Fixed `buildUrl→URL` + `appendArrayParam()` to avoid `%5B%5D%5B%5D` double-encoding. Fixed demo E2E route glob (`**/links**`→origin-scoped) that intercepted Vite module loading. tests:86→106 vitest (+20), +7 E2E scope-mode, demo 10/10 E2E green. Report: `test_reports/T1.14_REVALIDATE_20260505-1040.md`. |

---

### Docs Tasks

| Task | Description | Status | Notes |
|------|-------------|--------|-------|
| T1.12 | Update `docs/openapi.yaml` + `docs/api.md` for new endpoints | 🟢 DONE ✅ 2026-05-05 | Added GET /links, GET /dashboard/summary, GET /campaigns/stats to openapi.yaml with full schemas. Updated api.md §2.6–2.8. |
| T1.13 | Rewrite `docs/frontend-wrapper-plan.md` → `docs/sdk-integration-guide.md` | 🟢 DONE ✅ 2026-05-05 | Created docs/sdk-integration-guide.md with SDK-first model, full code examples, managed vs override modes, hook API table. Deprecated frontend-wrapper-plan.md. Updated agent-context.json. |

---

## Dependency Chain

```
Backend (all independent, run in parallel):
  T1.1 ─────────────────────── T1.12
  T1.2 ─────────────────────── T1.12
  T1.3 ─────────────────────── T1.12

SDK (sequential):
  T1.4 → T1.5 → T1.6 ──────── T1.8 → T1.10 → T1.11
                 T1.7 → T1.9 ↗

Integration gate:
  T1.10 requires T1.8 (SDK) + T1.1 + T1.2 (backend) — first moment of real end-to-end
```

**Parallel execution strategy**: One dev takes T1.1 → T1.2 → T1.3 (backend stream). Another takes T1.4 → T1.5 → T1.6 → T1.7 → T1.8 → T1.9 (SDK stream). T1.10 merges both streams and validates the full path.
