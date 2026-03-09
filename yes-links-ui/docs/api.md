# YES LINKS UI: API & Contract Specification

## 1. Internal API (PostMessage)
The UI communicates with its host application via the `window.postMessage` API.

### Inbound Events (Host -> UI)
| Event | Payload | Description |
| :--- | :--- | :--- |
| `INIT_SESSION` | `{ token: string, theme: ThemeTokens }` | Authenticates and styles the UI. |
| `THEME_UPDATE` | `{ theme: Partial<ThemeTokens> }` | Updates styles at runtime. |
| `SET_CONTEXT` | `{ campaign_id?: string }` | Filters the view to a specific campaign. |

### Outbound Events (UI -> Host)
| Event | Payload | Description |
| :--- | :--- | :--- |
| `UI_READY` | `{ version: string }` | Sent when the UI is loaded and waiting for init. |
| `LINK_CREATED` | `{ short_url: string, id: string }` | Notifies host that a link was created. |
| `LINK_DELETED` | `{ id: string }` | Notifies host that a link was removed. |
| `BULK_UPLOAD_SUCCESS` | `{ count: number }` | Notifies host of a successful batch upload. |
| `DATA_EXPORTED` | `{ format: 'csv', records: number }` | Notifies host that user exported data. |
| `AUTH_EXPIRED` | `{}` | Requests the host to refresh the token. |

## 2. External API (UI -> backend)
The UI consumes the `yes-links-api` contract defined in `docs/openapi.yaml`.
- Base URL: `process.env.NEXT_PUBLIC_API_URL`.
- Headers: `Authorization: Bearer <token>`.

## 3. Theme Token Schema
```json
{
  "colors": {
    "primary": "#0070f3",
    "background": "#ffffff",
    "text": "#111111"
  },
  "radii": {
    "button": "0.5rem"
  },
  "fonts": {
    "sans": "Inter, sans-serif"
  }
}
```
## 4. Actionable Error Contract
To support "Resilient UX", the UI expects the following error structure from the backend (or mapping layer):

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "The provided target URL is invalid.",
    "remediation": "Ensure the URL starts with http:// or https:// and has a valid domain.",
    "field": "target_url"
  }
}
```
The UI will render the `message` and `remediation` directly in a toast to guide the user.
