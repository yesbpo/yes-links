# yes-links — Agent Context

Single entry point for any agent working on this project. Read it fully before touching code.

---

## What this product is

**yes-links** is a URL shortener with first-class analytics and observability. It issues short codes for long URLs, redirects with sub-50ms latency, captures click events (UA, IP, referrer, geo), and exposes analytics via API. A separate `yes-links-ui` package ships the embeddable frontend.

**Org**: 4Yes | **Code**: `YL` | **Tag**: `#yes-links` | **Area**: `#delivery`

---

## Tech Stack (Yes Approved)

- **Backend**: FastAPI, Pydantic, SQLAlchemy 2.x, Alembic
- **Database**: MySQL (PyMySQL driver)
- **Cache / Queues**: Redis
- **Observability**: OpenTelemetry (API + SDK + OTLP exporter), Prometheus client, structured JSON logs
- **Testing**: pytest, pytest-asyncio, httpx, Playwright
- **Frontend**: `yes-links-ui/` — Storybook-driven component package, NPM-publishable as `@yes/links-ui`
- **Infra**: Docker, docker-compose, k3s on DigitalOcean
- **CI/CD**: GitHub Actions

Deviations from the approved stack require explicit justification in `docs/decisions.md`.

---

## Project Layout (Yes Mandatory Structure)

```
yes-links/
├── docs/                      # prd.md, architecture.md, api.md, deployment.md,
│   │                          # testing.md, openapi.yaml, decisions.md, adr/
│   └── integrations/
├── src/                       # Application source
│   ├── api/                   # FastAPI routers
│   ├── core/                  # config, telemetry, security
│   ├── models/                # SQLAlchemy models
│   ├── repositories/          # Data access layer
│   ├── services/              # Business logic
│   ├── workers/               # Background jobs
│   └── main.py                # FastAPI app entrypoint
├── tests/
│   ├── unit/                  # Pure-logic tests
│   ├── integration/           # DB + service tests (real MySQL)
│   ├── api/                   # HTTP contract tests (httpx)
│   └── ui/                    # Playwright E2E
├── deploy/                    # Dockerfile, compose, k8s manifests
├── alembic/                   # DB migrations
├── scripts/                   # bootstrap / migrate / ops
├── yes-links-ui/              # Frontend component package (NPM)
└── pyproject.toml
```

The four directories `docs/`, `src/`, `tests/`, `deploy/` are **non-negotiable** per Yes Project Structure. Every new module lands inside one of them.

---

## Yes TDD Cycle (Mandatory)

Every feature, bugfix, and refactor follows this 6-phase cycle. **No exceptions. PRs without tests are rejected.**

```
PLAN → 🔴 RED → IMPLEMENT → 🟢 GREEN → OPTIMIZE → AUTOMATE
```

| Phase | Action | Exit criterion |
|-------|--------|----------------|
| `PLAN` | Read PRD/ADR, define contract in `docs/`, sketch architecture | Doc updated, contract clear |
| `RED` | Write the failing test(s) **before** any implementation code | `pytest` shows the new test failing |
| `IMPLEMENT` | Minimum code to make the test pass | Compiles, no regressions in adjacent tests |
| `GREEN` | Run full task suite | `make test-{task}` passes, full suite green |
| `OPTIMIZE` | Refactor for SOLID, simplicity, framework idioms | Same green; cleaner diff |
| `AUTOMATE` | CI gates: lint → tests → security scan → coverage check | GitHub Actions pipeline green |

### Coverage minimums

- Core logic ≥ 90%
- API surface ≥ 80%
- Required suites: unit, integration, API, UI (Playwright)

### Test evidence per task

Every completed task records baseline → new test count and writes a delta report:

```
test_reports/T{N}.{M}_REVALIDATE_{YYYYMMDD-HHMM}.md
```

The tracker entry's `tests:` field encodes the delta (e.g., `tests:120→134`). A task is **not** done until the delta is recorded and the new baseline is committed.

### Non-negotiable rules

1. Write the failing test first. If you cannot describe the test, you cannot describe the feature.
2. Never disable, skip, or comment out a test to make a build pass — fix the root cause.
3. Real MySQL for integration tests — no SQLite, no in-memory shortcuts.
4. Every endpoint has an OpenAPI contract in `docs/openapi.yaml` and a test in `tests/api/`.
5. Every request must emit trace + log + metric (OpenTelemetry wired from day one).
6. After GREEN, refactor before merging. Merging dirty code is technical debt.

---

## TaskForge Sync Configuration

This project's tasks are tracked in the workspace PARA vault and synced via the `/task-sync` skill.

**Workspace File**: `~/Documents/workspace/1 - Projects/4Yes/yes-links.md`

### Tracker Files

| File | Format | Contains |
|------|--------|----------|
| `docs/sprints.md` *(create when sprint 1 starts)* | `4yes-tdd-table` | Master sprint tracker |
| `claudedocs/sprint{N}_tracker.md` *(per active sprint)* | `4yes-tdd-table` | Sprint TDD detail (living doc) |

> Until structured sprint trackers exist, the registry format is `readme` (manual sync only). When the first sprint tracker lands, update `~/Documents/workspace/3 - Resources/Project-Registry.md` to point at it and switch the format to `4yes-tdd-table`.

### Task ID Format

```
TF:YL-S{N}-T{seq}     →  TF:YL-S1-T1, TF:YL-S2-T7
```

- `YL` — project code (fixed)
- `S{N}` — sprint identifier (e.g. `S1`, `mvp1-s2`)
- `T{seq}` — sequential, 1-indexed within sprint

### TASKFORGE Two-Line Format

Every task in any tracker file or in the workspace file uses the canonical two-line format from `~/Documents/workspace/3 - Resources/TaskForge-Schema.md`:

```markdown
- [ ] {TITLE} #yes-links #delivery #{type} {priority} {status} ➕ {created} ⏳ {scheduled}
  > TF:YL-S{N}-T{seq} | src:{tracker-path}#{anchor} | dep:{deps|—} | sprint:S{N} | tests:{baseline}→{current|TBD} | phase:{TDD-PHASE}
```

**Example — active TDD task:**

```markdown
- [ ] Embeddable link widget — script tag bootstrap #yes-links #delivery #feature 🔼 🔴 ➕ 2026-05-04 ⏳ 2026-05-18
  > TF:YL-S1-T1 | src:docs/sprints.md#T1.1 | dep:— | sprint:S1 | tests:0→TBD | phase:RED
```

**Example — completed:**

```markdown
- [x] POST /links endpoint — create short code #yes-links #delivery #tdd 🔼 🟢 ➕ 2026-05-04 ✅ 2026-05-06
  > TF:YL-S1-T2 | src:docs/sprints.md#T1.2 | dep:— | sprint:S1 | tests:120→134 | phase:AUTOMATE
```

### Status Encoding

| Status | Line 1 | When to set |
|--------|--------|-------------|
| TODO | `- [ ]` + `🔴` | Task created, not started |
| IN_PROGRESS | `- [/]` + `🟡` | Currently active (one task at a time per agent) |
| BLOCKED | `- [ ]` + `⛔` | Waiting on dep — note dep TF in `dep:` |
| DONE | `- [x]` + `🟢` + `✅ {date}` | Tests green, delta recorded, merged |

### TDD Phase Values (in `phase:` field)

`PLAN` → `RED` → `IMPLEMENT` → `GREEN` → `OPTIMIZE` → `AUTOMATE` (or `—` if N/A)

The `phase:` field must always reflect current position in the cycle. Update it as you move through phases — this is the canonical signal of where the task stands.

### Sync Commands

```bash
/task-sync pull yes-links     # pull tracker → workspace view
/task-sync push yes-links     # push workspace status changes → tracker (asks per change)
/task-sync status yes-links   # diff between tracker and workspace
```

**Rules:**

- Workspace file is a **VIEW**. The repo tracker (`docs/sprints.md` etc.) is source of truth for task content.
- Never edit a repo tracker file silently — every status change requires per-task confirmation.
- Always reference tasks across tools by their `TF:` ID (`TF:YL-S1-T1`), not by title.
- When a task moves phase, both line 1 (status emoji) and line 2 (`phase:` field) must update.

---

## Code Philosophy

Yes code is **SOLID, simple, elegant, framework-optimized**.

- Single responsibility per function/class — one job, done well.
- KISS + YAGNI. Build only what the current task requires. No speculative features.
- Use FastAPI dependency injection, Pydantic models, SQLAlchemy ORM idioms — don't fight the framework.
- `snake_case` for Python, `camelCase` for JS/TS.
- No placeholders, no `TODO`, no stub implementations. **Start it = finish it.**
- No enterprise bloat (auth/monitoring/deployment) unless the task explicitly asks for it.

---

## Observability Requirements

Every request must produce **trace + log + metric**. Structured JSON logs include:

```
timestamp · service · request_id · route · event · user_agent · ip · duration_ms · status_code
```

Wire OpenTelemetry from day one — never as an afterthought.

---

## Source of Truth Documents

| Document | Purpose |
|----------|---------|
| `docs/prd.md` | Product requirements |
| `docs/architecture.md` | System architecture |
| `docs/api.md` + `docs/openapi.yaml` | API contract |
| `docs/decisions.md` + `docs/adr/` | Architectural decisions |
| `docs/testing.md` | Test strategy and coverage targets |
| `docs/deployment.md` | k3s + DigitalOcean deployment |
| `docs/sprints.md` | Master sprint tracker (TaskForge source) |

---

## Agent Behavior Rules

1. **Read this file fully** before any code change.
2. **Run `/task-sync status yes-links`** at session start if working on a tracked task.
3. **Update `phase:` field** on every TDD transition — not at the end.
4. **Never skip RED.** If a test doesn't exist for the change you're making, write one first.
5. **Record test deltas** in `test_reports/` and update `tests:` field before marking DONE.
6. **Workspace is a view** — confirm before pushing changes back to repo trackers.
7. **Reference tasks by TF ID** in commits, PRs, and chat: `feat(api): TF:YL-S1-T2 create-link endpoint`.
