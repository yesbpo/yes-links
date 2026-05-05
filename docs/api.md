# YES LINKS API Specification

## 1. API principles
- Protocol: HTTPS.
- Content type: `application/json`.
- Contract source of truth: OpenAPI.
- Contract enforcement: API test suite.

## 2. Endpoints

### 2.0 Health
`GET /health`

Response 200:
```json
{
  "status": "ok"
}
```

### 2.1 Create link
`POST /links`

Request body:
```json
{
  "target_url": "https://example.com/page",
  "campaign": "summer-2026",
  "tags": ["promo", "ig"]
}
```

Response 201:
```json
{
  "id": "uuid",
  "short_code": "abc12",
  "short_url": "https://y.es/abc12",
  "target_url": "https://example.com/page",
  "campaign": "summer-2026",
  "tags": ["promo", "ig"],
  "created_at": "2026-03-08T00:00:00Z",
  "created_by": "service-or-user"
}
```

Errors:
- 422 schema validation.

### 2.2 Redirect
`GET /{short_code}`

Behavior:
- Resolve short code.
- Log click metadata.
- Return HTTP 302 with `Location` header.

Responses:
- 302 redirect.
- 404 code not found.
- 422 validation error (path validation).

### 2.3 Link stats
`GET /links/{id}/stats`

Response 200:
```json
{
  "link_id": "uuid",
  "total_clicks": 12345,
  "clicks_by_day": [
    {"day": "2026-03-07", "count": 321}
  ],
  "clicks_by_campaign": [
    {"campaign": "summer-2026", "count": 12000}
  ]
}
```

Errors:
- 404 link not found.
- 422 validation error.

### 2.4 Update link
`PUT /links/{id}`

Request body:
```json
{
  "target_url": "https://example.com/new-page",
  "campaign": "fall-2026",
  "tags": ["promo", "email"]
}
```

Response 200:
```json
{
  "id": "uuid",
  "short_code": "abc12",
  "short_url": "https://y.es/abc12",
  "target_url": "https://example.com/new-page",
  "campaign": "fall-2026",
  "tags": ["promo", "email"],
  "created_at": "2026-03-08T00:00:00Z",
  "created_by": "service-or-user"
}
```

Errors:
- 404 link not found.
- 422 validation error.

### 2.5 Delete link
`DELETE /links/{id}`

Response 200:
```json
{
  "id": "uuid",
  "deleted": true
}
```

Errors:
- 404 link not found.
- 422 validation error.

### 2.6 List links
`GET /links`

Query params:

| Param | Type | Description |
|-------|------|-------------|
| `campaign` | string | Exact campaign match |
| `tags` | string | Comma-separated tags — all must be present |
| `search` | string | Substring search on short_code or target_url |
| `limit` | int (1–100, default 20) | Page size |
| `offset` | int (≥0, default 0) | Page offset |

Response 200:
```json
{
  "items": [
    {
      "id": "uuid",
      "short_code": "abc12",
      "short_url": "https://y.es/abc12",
      "target_url": "https://example.com",
      "campaign": "summer-2026",
      "tags": ["promo"],
      "created_at": "2026-05-05T00:00:00Z",
      "created_by": "service"
    }
  ],
  "total": 1
}
```

Errors:
- 422 validation error.

### 2.7 Dashboard summary
`GET /dashboard/summary`

Returns global KPI aggregation for the link inventory.

Response 200:
```json
{
  "total_links": 42,
  "total_clicks": 1337,
  "avg_clicks_per_link": 31.8,
  "top_campaigns": [
    {"campaign": "summer-2026", "clicks": 800},
    {"campaign": "promo-q1",   "clicks": 400}
  ],
  "trends": {
    "clicks_last_7d": 210,
    "clicks_prev_7d": 180,
    "pct_change": 16.7
  }
}
```

Notes:
- `top_campaigns` — up to 5 entries, ordered by clicks desc.
- `pct_change` — percentage change vs previous 7-day window; `null` if no prior data.

### 2.8 Campaign stats
`GET /campaigns/stats`

Returns per-campaign aggregation. Supports optional date window filters.

Query params:

| Param | Type | Description |
|-------|------|-------------|
| `from` | ISO 8601 datetime | Click window start (inclusive) |
| `to` | ISO 8601 datetime | Click window end (exclusive) |

Response 200 (array, ordered by total_clicks desc):
```json
[
  {
    "campaign": "summer-2026",
    "total_links": 6,
    "total_clicks": 120,
    "last_click_at": "2026-05-05T01:16:44Z"
  },
  {
    "campaign": "promo-q1",
    "total_links": 2,
    "total_clicks": 0,
    "last_click_at": null
  }
]
```

Notes:
- Uses LEFT JOIN so 0-click campaigns appear (total_clicks = 0).
- `last_click_at` is null for links with no clicks in the window.
- `from`/`to` filter clicks only — links are always included.

## 3. OpenAPI baseline
Required OpenAPI sections:
- `info`, `servers`, `paths`, `components.schemas`.
- Schemas: `CreateLinkRequest`, `LinkResponse`, `StatsResponse`, `ErrorResponse`, `LinksListResponse`, `DashboardSummaryResponse`, `CampaignStatsRow`.
- Response examples for all primary endpoints.

Suggested file:
- `docs/openapi.yaml`

## 4. Validation rules
- `target_url` must be absolute HTTP/HTTPS URL.
- `campaign` optional but normalized.
- `tags` optional, max size configurable.
- `short_code` pattern: Base62 chars only.

## 5. Contract tests (mandatory)
- `test_create_link_success`
- `test_create_link_invalid_url`
- `test_duplicate_target_url_allowed`
- `test_shortcode_generation`
- `test_redirect_valid_code`
- `test_redirect_invalid_code`
- `test_redirect_returns_302`
- `test_click_logged`
- `test_click_count`
- `test_click_by_day`
- `test_click_by_campaign`

## 6. Event emissions per endpoint
- `POST /links` -> `link.created.v1`
- `PUT /links/{id}` -> `link.updated.v1`
- `DELETE /links/{id}` -> `link.deleted.v1`
- `GET /{short_code}` success -> `link.redirected.v1` + `link.click_logged.v1`
- `GET /{short_code}` not found -> `link.redirect_failed.v1`

## 7. Logging requirements per request
Each endpoint must emit JSON logs with:
- timestamp
- service
- request_id
- route
- event
- user_agent
- ip
- duration
- status_code
