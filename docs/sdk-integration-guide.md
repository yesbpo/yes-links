# yes-links SDK Integration Guide

**Sprint 1 delivery model**: `@yes/links-ui` is an NPM-publishable React package. Host products declare two components — no fetch code, no postMessage, no iframe. The SDK handles all data fetching internally.

---

## Quick Start

```bash
npm install @yes/links-ui
```

```tsx
import { YesLinksProvider, YesLinksDashboard } from '@yes/links-ui'
import '@yes/links-ui/style.css'

export function MyPage() {
  return (
    <YesLinksProvider
      token={jwt}                       // Bearer token for API auth
      baseUrl="https://api.yes.com/v1"  // yes-links backend base URL
      theme="corporate"                 // "corporate" | "dark" | "midnight" | object
    >
      <YesLinksDashboard />
    </YesLinksProvider>
  )
}
```

That's it. The dashboard auto-fetches links, KPI stats, and campaign data from `baseUrl`.

---

## How it works

```
YesLinksProvider
  token + baseUrl → React context
         ↓
    useYesLinks()          ← any child can read token + baseUrl
         ↓
  createApiClient({ token, baseUrl })   ← memoized per context value
    ↙                  ↘
useLinks              useStats
  GET /links           GET /dashboard/summary
         ↓
  YesLinksDashboard   (managed mode — no props required)
```

The `token` is injected as `Authorization: Bearer {token}` on every API call. A unique `x-request-id` is also sent for distributed tracing.

---

## Provider props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `token` | `string` | ✅ | JWT or API key for the backend |
| `baseUrl` | `string` | ✅ | Base URL of the yes-links API (no trailing slash needed) |
| `theme` | `"corporate" \| "dark" \| "midnight" \| object` | — | Visual theme. Defaults to `"corporate"`. |
| `children` | `ReactNode` | ✅ | App tree |

---

## Dashboard props

All props are optional in managed mode.

| Prop | Type | Description |
|------|------|-------------|
| `sections` | `{ links?: boolean; stats?: boolean }` | Hide individual sections. Both visible by default. |
| `scope` | `DashboardScope` | Optional scope selector (campaign/tag/custom). Hidden when absent. |
| `dataSource` | `DashboardDataSource` | Host-supplied data override. When provided, SDK hooks are disabled (escape hatch). |
| `range` | `{ from?: string; to?: string }` | Date window for stats. ISO 8601 strings. |
| `initialViewMode` | `"list" \| "grid"` | Default view. |

### Managed mode (no dataSource)

When `dataSource` is absent the dashboard runs in **managed mode**: it reads `token` + `baseUrl` from the nearest `YesLinksProvider` and fetches all data automatically.

```tsx
// Managed mode — zero configuration
<YesLinksProvider token={jwt} baseUrl={apiUrl}>
  <YesLinksDashboard />
</YesLinksProvider>
```

### Override mode (explicit dataSource)

When `dataSource` is provided it wins over managed mode. Use this to inject mock data, add server-side pagination, or proxy through your own backend.

```tsx
<YesLinksProvider token={jwt} baseUrl={apiUrl}>
  <YesLinksDashboard
    scope={{ mode: 'campaign', options: [{ label: 'Q1', value: 'q1-2026' }] }}
    dataSource={{
      loadLinks: async ({ scope, filters }) => {
        return myProxy.getLinks({ ...filters, campaign: scope.value })
      },
      loadStats: async ({ scope }) => {
        return myProxy.getSummary({ campaign: scope.value })
      },
    }}
  />
</YesLinksProvider>
```

---

## Available hooks (advanced use)

Import directly when you need custom UI:

```tsx
import { useLinks, useStats, createApiClient, useYesLinks } from '@yes/links-ui'

function CustomWidget() {
  const { links, state } = useLinks({ campaign: 'q1-2026', limit: 5 })
  const { kpiData }      = useStats()
  // ...
}
```

### `useLinks(params?)`

| Field | Returns |
|-------|---------|
| `links` | `Link[]` — current page |
| `state` | `"idle" \| "loading" \| "success" \| "error"` |
| `error` | `Error \| null` |
| `mutate()` | Re-fetches |

Params: `campaign`, `tags`, `search`, `limit`, `enabled`.

### `useStats(options?)`

| Field | Returns |
|-------|---------|
| `kpiData` | `KPIStatsData \| null` |
| `trendData` | `TrendData[]` |
| `state` | `"loading" \| "success" \| "error"` |
| `error` | `Error \| null` |
| `mutate()` | Re-fetches |

### `createApiClient({ token, baseUrl })`

Pure factory — no React. Returns a typed client with:
- `getLinks(params)` → `GET /links`
- `getDashboardSummary()` → `GET /dashboard/summary`
- `getCampaignsStats(options?)` → `GET /campaigns/stats`
- `createLink(payload)` → `POST /links`
- `updateLink(id, payload)` → `PATCH /links/:id`
- `deleteLink(id)` → `DELETE /links/:id`

Non-2xx responses throw `ApiError` (with `.status` and `.message`).

---

## Backend endpoints consumed

| Method | Path | Consumed by |
|--------|------|-------------|
| `GET /links` | `?campaign&tags&search&limit&offset` | `useLinks` |
| `GET /dashboard/summary` | — | `useStats` |
| `GET /campaigns/stats` | `?from&to` | `getCampaignsStats()` |
| `POST /links` | — | `createLink()` |
| `PATCH /links/:id` | — | `updateLink()` |
| `DELETE /links/:id` | — | `deleteLink()` |

CORS must allow the host origin. The backend uses `CORS_ALLOWED_ORIGINS` env var.

---

## Theme

Pass a named preset or a custom token object:

```tsx
// Named preset
<YesLinksProvider theme="dark" ...>

// Custom tokens
<YesLinksProvider theme={{ colors: { primary: '#6200ea', background: '#1a1a2e' } }} ...>
```

Tokens are injected as CSS variables onto the `.yes-link-root` wrapper div.

---

## Build

```bash
cd yes-links-ui
npm run build:lib   # outputs dist/yes-links-ui.js + dist/yes-links-ui.umd.cjs + dist/index.d.ts
```

The `dist/` is the published package. Import paths follow the `exports` field in `package.json`.

---

## Security note (Sprint 2)

Sprint 1 assumes internal network trust (k3s cluster). The backend does not validate the Bearer token yet. **Add JWT verification middleware before any public exposure.** See `docs/sprints.md` Sprint 2 dependency note.
