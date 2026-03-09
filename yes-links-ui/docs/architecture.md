# YES LINKS UI: SDK Architecture Specification

## 1. Technical Stack
- **Framework:** React + TypeScript (Optimized for library delivery via Vite/Rollup).
- **Styling:** Tailwind CSS (Prefixed: `yes-`) + Radix UI.
- **Delivery:** Versioned NPM package.

## 2. Integration Model (The Provider)
The SDK replaces the iframe handshake with a **React Context Provider**:
1. **Host Action:** `npm install @yes/links-ui`.
2. **Implementation:**
   ```tsx
   <YesLinksProvider token={jwt} theme={themeTokens}>
     <YesLinksDashboard />
   </YesLinksProvider>
   ```

## 3. Styling Isolation (Zero Hardcoding)
- **Prefixing:** All Tailwind classes are prefixed with `yes-` (e.g., `yes-bg-primary`).
- **CSS Variable Bridge:** The `YesLinksProvider` injects the CSS variables into its own root container instead of `document.documentElement`, ensuring isolation.

## 4. Observability & Resilience (Rule 3)
- **Notification & Remediation Engine:**
  - **Global Toast System:** Centralized state for user feedback. Toasts are token-styled and support "Actionable Remediation" (e.g., a "Retry" button for network timeouts).
  - **Error Boundaries:** Each major dashboard module (Analytics, Link List, Form) is wrapped in a dedicated Error Boundary to isolate failures.
  - **State Machine UI:** Components must implement a standardized state union: `idle | loading | success | error | empty`.

## 5. Advanced Batch & File Processing (Phase 2)
- **Client-Side CSV Parsing:** To keep the SDK portable and lightweight, CSV parsing is handled in the browser. 
- **Progress Tracking:** Batch operations emit real-time progress percentages to the UI via state hooks.
- **Isomorphic Export:** Data export utility generates CSV blobs in-memory, ensuring zero backend dependency for reporting tasks.
- **Logs:** Uses `pino-nextjs` for structured JSON output to `stdout`.
- **Telemetry:** OpenTelemetry (OTel) Web SDK for tracing user journeys (e.g., `link_creation_span`).
- **Metrics:** Custom counters for `redirect_click_through` and `ui_error_rate`.

## 5. Directory Structure (Rule 4)
```text
yes-links-ui/
├── docs/               # PRD, Arch, API, Testing, Deployment
├── src/
│   ├── app/            # Next.js App Router (Pages & Layouts)
│   ├── components/     # UI Components (Radix + Tailwind)
│   ├── theme/          # Token definitions & Dynamic CSS logic
│   ├── lib/            # OTel, Pino, API Client
│   └── hooks/          # Handshake & State management
├── tests/
│   ├── unit/           # Vitest (Logic)
│   └── ui/             # Playwright (Handshake & E2E)
├── deploy/
│   ├── docker/         # Multi-stage Dockerfile
│   ├── compose/        # Local full-stack environment
│   └── kubernetes/     # Manifests
```
