# YES LINKS UI: SDK Product Requirements Document (PRD)

## 1. Mission
Build a high-performance, versioned React Component Library (`@yes/links-ui`) that allows Yes developers to "install and use" the link management dashboard directly within their host applications.

## 2. Core Features

### Phase 1: Foundations (Complete)
- **NPM Package:** Distributed as a modern ES module with TypeScript definitions.
- **Provider Pattern:** Host applications wrap the dashboard in a `<YesLinksProvider />`.
- **Zero-Conflict Styling:** Prefix `yes-link-` to prevent collisions.
- **Dynamic Theming:** Token-based styling via CSS Variables.
- **Link Management:** Basic CRUD with real-time validation.
- **Analytics Dashboards:** KPI Summary and Clicks Trend visuals.

### Phase 2: Advanced Campaign Management (In Progress)
- **Bulk Creation:** Upload CSV/JSON to generate links in batches with real-time progress feedback.
- **Advanced Filtering:** Multi-select tags and date-range pickers for analytics.
- **Data Export:** Generate and download CSV reports for campaign performance.
- **Resilient Batch Processing:** Handle partial failures in bulk uploads with a "fix-and-retry" interface.

## 3. Product Constraints (Yes Constitution)
- **Reproducibility:** Local setup must be possible with `docker compose up`.
- **Observability:** Every user interaction must generate a structured JSON log and trace.
- **Portability:** Container-first deployment; no environment-specific hardcoding.
- **Resilient User Experience (UX):** 
  - **Actionable Feedback:** No "silent" failures. Every error must indicate the reason and a path to remediation via toasts or inline alerts.
  - **State Clarity:** Explicit visual indicators for Loading, Success, Error, and Empty states for every data-bound component.
  - **Graceful Degradation:** The UI must remain functional (read-only or cached) during transient network or API failures.

## 4. User Experience (UX) Goals
- **Responsiveness:** Fluid layout from desktop down to mobile-within-iframe.
- **Performance:** Initial dashboard load < 800ms.
- **Accessibility:** WCAG 2.1 AA compliant.

## 5. Security Requirements
- **Secure Handshake:** Verify `origin` for all incoming `postMessage` events.
- **Token Isolation:** JWTs passed from the host must be stored securely and only used for `yes-links-api` requests.
- **CORS Management:** Strict allowed-origin policy for the UI and API interaction.
