# YES LINKS UI: Testing Strategy

## 1. Constitution Rule 2 (Mandatory Tests)
- **Coverage Target:**
  - Core Logic (Hooks/Utils): 90%
  - UI Interactions (Components): 80%

## 2. Test Stack
- **Unit Testing:** `Vitest` + `React Testing Library`.
- **E2E/UI Testing:** `Playwright` (Mandatory).
- **Contract Testing:** `Zod` validation for all API responses.

## 3. Mandatory Playwright Scenarios
- **Embedding Handshake:** Verify the UI stays in "Loading" until `INIT_SESSION` is received.
- **Token Theming:** Capture screenshots and compare pixel diffs when theme tokens are injected.
- **Link Creation Flow:** Complete end-to-end flow from form entry to API mock success.
- **Chaos & Resilience:**
  - **API Error (500):** Verify toast displays "Internal error" with a "Retry" button.
  - **Validation Error (422):** Verify toast displays the specific "Remediation" provided by the API.
  - **Slow Network:** Verify skeleton loaders appear and remain stable under 3G simulation.
  - **Empty States:** Verify the "No links found" illustration and "Create your first link" CTA appear when the link list is empty.

## 4. Local Execution
```bash
# Run units
npm run test:unit

# Run UI tests (with local API mock)
npm run test:ui
```
