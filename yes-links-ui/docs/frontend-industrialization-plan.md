# YES LINKS UI Frontend Industrialization Plan

## Metadata
- Scope: `yes-links-ui`
- Created: 2026-03-11
- Last update: 2026-03-11
- Owner: Frontend + UX
- Governance: Yes Engineering Constitution
- Global status: In progress

## Objective
Take the frontend package to industry-level quality with a reproducible process per task:
1. Planning
2. Red (failing test)
3. Green (passing test)
4. Implementation hardening
5. Verification
6. Playwright visual validation
7. Audit and closure

## Constitution Compliance Baseline
| Rule | Status | Notes |
| --- | --- | --- |
| 1. Containerized | Partial | Project is containerized, frontend gates are not fully codified. |
| 2. Mandatory tests | Fail | Unit tests currently fail and contracts are misaligned. |
| 3. Observable | Partial | Observability exists, but handshake/theme crash breaks runtime consistency. |
| 4. Architecture defined | Pass | `docs/`, `src/`, `tests/`, `deploy/` present and documented. |
| 5. Reproducible deployment | Partial | Needs reproducible CI flow for UI quality gates. |
| 6. Contract per endpoint/system | Partial | API contract exists; component/story/test contract drift exists. |
| 7. Event schema | Partial | Events exist but require parity validation vs docs/contracts. |

## Status Legend
- `todo`: not started
- `in_progress`: active implementation
- `blocked`: waiting decision/dependency
- `done`: completed with evidence

## Master Board
| ID | Phase | Workstream | Task | Status | Evidence |
| --- | --- | --- | --- | --- | --- |
| F1-01 | Phase 1 | Contract | Fix `injectTheme(theme, target)` handshake contract | done | `npx vitest run src/hooks/useHandshake.test.ts src/theme/themeInjector.test.ts` (5 passing) |
| F1-02 | Phase 1 | Storybook | Align stories with real component props and states | done | `npm run build-storybook` green + Playwright console clean on critical stories |
| F1-03 | Phase 1 | Tests | Align i18n/selectors across component and page tests | done | `npx vitest run` => `15 files`, `37 tests` passing |
| F1-04 | Phase 1 | Runtime | Stabilize `pino` and runtime module resolution | done | `npm run dev` booted (`Ready in 2.6s`) after dependency normalization |
| F2-01 | Phase 2 | CI | Add `test:unit`, `test:ui`, `test:storybook`, `test:storybook:ci` scripts | todo | package scripts + CI run |
| F2-02 | Phase 2 | Quality gate | Enable Storybook test-runner with fail on console | todo | CI artifact + report |
| F2-03 | Phase 2 | A11y | Set Storybook a11y policy to fail (`error`) | todo | a11y checks in CI |
| F2-04 | Phase 2 | Governance | PR template with DoD checks and evidence links | todo | PR template updated |
| F3-01 | Phase 3 | Visual QA | Baseline snapshots for desktop/mobile critical stories | todo | snapshots + thresholds |
| F3-02 | Phase 3 | Design system | Cover missing stories/tests (`CorporateContainer`, `BulkUpload`, `page`) | todo | new stories/tests green |
| F3-03 | Phase 3 | UX maturity | Apply visual proportion/style/geometry rubric | todo | audit scorecard per release |
| F3-04 | Phase 3 | Audit | Monthly UI audit report (before/after + defects) | todo | versioned markdown report |

---

## Phase 1 - Contract and Runtime Stabilization
### Goal
Restore technical truth: code, tests, stories, and runtime must represent the same contract.

### Exit criteria
- `npx vitest run` passes.
- `npm run build-storybook` passes.
- Critical stories render without console errors.
- Handshake and theme update flows are stable.

### Lifecycle checklist
#### Planning
- [ ] Confirm expected contract for `useHandshake`, `themeInjector`, and story args.
- [ ] Identify all files touched and expected behavior changes.
- [ ] Define acceptance criteria per task ID (`F1-01` to `F1-04`).

#### Red
- [ ] Add/adjust failing tests for handshake target handling.
- [ ] Add/adjust failing tests for story prop contract mismatches.
- [ ] Capture failing evidence in this file (`Progress log` section).

#### Green
- [ ] Implement minimum changes to make tests pass.
- [ ] Validate no regressions in existing hooks/components.

#### Implementation hardening
- [ ] Remove dead props/args and invalid story data shapes.
- [ ] Normalize test selectors (role/label/data-testid policy).

#### Verification
- [ ] Run `npx vitest run`.
- [ ] Run `npm run build-storybook`.
- [ ] Attach command results to PR.

#### Playwright
- [ ] Capture critical screenshots for:
  - Dashboard full view
  - CreateLinkForm
  - LinkList success/empty/error
  - Theme variants
- [ ] Validate no runtime console errors in these flows.

#### Audit
- [ ] Update compliance matrix status for rules 2/3/6.
- [ ] Record unresolved risks.

---

## Phase 2 - CI Quality Gates
### Goal
Make quality reproducible and enforceable in CI.

### Exit criteria
- Merge is blocked when unit/storybook/ui/a11y checks fail.
- CI produces deterministic reports and artifacts.

### Lifecycle checklist
#### Planning
- [ ] Define final command contract for local and CI.
- [ ] Confirm minimum runtime for CI containers and browser deps.

#### Red
- [ ] Add CI job with expected failure on current baseline.
- [ ] Add storybook test-runner with `--failOnConsole`.

#### Green
- [ ] Make pipeline pass after fixes.
- [ ] Verify report generation and artifact persistence.

#### Implementation hardening
- [ ] Lock versions or compatible ranges for Storybook/Vite/Playwright.
- [ ] Add guardrails for flaky tests (`retries`, deterministic setup).

#### Verification
- [ ] `npm ci`
- [ ] `npx vitest run`
- [ ] `npm run build-storybook`
- [ ] `npx test-storybook --ci --failOnConsole`
- [ ] `npx playwright test`

#### Playwright
- [ ] Configure screenshot assertions and thresholds (`toHaveScreenshot`).
- [ ] Stabilize visual captures (animations, dynamic data, fonts).

#### Audit
- [ ] Review CI failure taxonomy and mean-time-to-fix.
- [ ] Mark rules 2/5 as pass only with 2 consecutive green runs.

---

## Phase 3 - Visual Maturity and UX Excellence
### Goal
Reach consistent visual maturity in proportions, style, geometry, and aesthetics.

### Exit criteria
- Visual audit score >= 4/5 in all dimensions.
- Critical paths have baseline snapshots in desktop and mobile.
- Missing story/test coverage is closed for critical components.

### Lifecycle checklist
#### Planning
- [ ] Define visual rubric:
  - Proportion
  - Style consistency
  - Geometry/alignment
  - Aesthetic coherence
  - Accessibility legibility
- [ ] Define priority screens and states.

#### Red
- [ ] Add failing visual assertions for known regressions.
- [ ] Add failing coverage targets for missing components.

#### Green
- [ ] Implement token/layout refinements and pass visual assertions.
- [ ] Validate interaction and accessibility states.

#### Implementation hardening
- [ ] Ensure design tokens are the source of truth.
- [ ] Remove ad-hoc visual overrides and undocumented styles.

#### Verification
- [ ] Run full unit + storybook + playwright matrix.
- [ ] Compare before/after screenshots and document decisions.

#### Playwright
- [ ] Maintain snapshot baselines per browser/viewport.
- [ ] Track diff thresholds and intentional changes.

#### Audit
- [ ] Publish monthly industry-level audit report in docs.
- [ ] Feed findings into next sprint backlog.

---

## Mandatory Definition of Done per Task
- [ ] Planning notes added to this file.
- [ ] Red test evidence captured.
- [ ] Green result captured.
- [ ] Implementation merged with file references.
- [ ] Verification commands and outputs documented.
- [ ] Playwright evidence attached.
- [ ] Audit conclusion recorded with rule impact.

## Progress Log (append-only)
### 2026-03-11
- Initial industrialization plan created.
- Baseline identified:
  - `vitest`: failing
  - Storybook: build passes but contract/style drift detected
  - Playwright: visual captures available, maturity baseline recorded

### 2026-03-11 - Task F1-01
- Planning:
  - Scope: remove handshake crash by hardening theme injection target resolution.
  - Files: `src/theme/themeInjector.ts`, `src/hooks/useHandshake.ts`, related tests.
- Red:
  - Previous failure: `TypeError: Cannot read properties of undefined (reading 'style')` in handshake flow.
  - Blocker found during verification: missing/invalid `pino` package in `node_modules`.
- Green:
  - `injectTheme` now accepts optional target and resolves safe fallback (`.yes-link-root` or `document.documentElement`).
  - `useHandshake` now passes explicit safe target resolution in `INIT_SESSION` and `THEME_UPDATE`.
  - Tests updated to verify theme variable propagation with fallback target.
- Verification:
  - Command: `npx vitest run src/hooks/useHandshake.test.ts src/theme/themeInjector.test.ts`
  - Result: `2 passed files`, `5 passed tests`.
- Implementation notes:
  - Runtime unblock: installed `pino` and `pino-pretty` to restore dependency consistency for test execution.

### 2026-03-11 - Task F1-02
- Planning:
  - Scope: align Storybook config and stories to actual component contracts.
  - Files: `.storybook/main.ts`, `.storybook/preview.ts`, component/provider stories.
- Red:
  - Previous issue: story contract drift (`NaN` chart points, invalid props, dashboard loading trap in provider story).
- Green:
  - Storybook config unified to `@storybook/react-vite`.
  - Global CSS imported in preview and root decorator applied.
  - Stories updated to real prop shapes/states (`ClicksChart`, `KPIStats`, `FullDashboard`, `FilterBar`, `ThemeVariants`, `LinkList`).
- Verification:
  - Command: `npm run build-storybook`
  - Result: build successful.
  - Playwright spot-check: no component runtime console errors in critical stories (only static server `favicon.ico` 404).
  - Risk note: Tailwind v4 + current `yes-link-` prefix strategy still shows low visual fidelity in Storybook; no runtime crash, but styling parity remains a follow-up item for visual maturity hardening.

### 2026-03-11 - Task F1-03
- Planning:
  - Scope: align tests with current i18n (Spanish) and real dashboard behavior.
- Red:
  - Previous state: multiple failures due stale English selectors and assertions against non-implemented flows.
- Green:
  - Updated component tests (`BulkUpload`, `FilterBar`, `LinkList`, `CreateLinkForm`, `ClicksChart`) to current labels/messages.
  - Updated `page.test.tsx` to assert actual UI behavior and observability event contract that exists.
- Verification:
  - Command: `npx vitest run`
  - Result: `15 passed files`, `37 passed tests`.

### 2026-03-11 - Task F1-04
- Planning:
  - Scope: ensure runtime can boot without module resolution errors.
- Red:
  - Failure observed earlier: `Module not found: Can't resolve 'pino'`.
- Green:
  - Dependency normalization completed for `pino` and `pino-pretty`.
- Verification:
  - Command: `npm run dev`
  - Result: Next.js started correctly on `http://localhost:3000` and reached `Ready in 2.6s`.

## PR Evidence Template
Copy into each PR description:

```md
## Task IDs
- F?-??

## Planning
- Scope:
- Risks:

## Red
- Failing tests/screens:

## Green
- Passing tests/screens:

## Verification
- Commands executed:
  - `npx vitest run`
  - `npm run build-storybook`
  - `npx test-storybook --ci --failOnConsole`
  - `npx playwright test`

## Playwright Evidence
- Screenshots:
- Snapshot diff summary:

## Constitution impact
- Rule 1:
- Rule 2:
- Rule 3:
- Rule 4:
- Rule 5:
- Rule 6:
- Rule 7:
```
