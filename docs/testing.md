# YES LINKS Testing Strategy

## 1. Testing constitution
Mandatory loop before feature code:
```text
test -> fail
code -> pass
refactor
```

Mandatory test types:
- unit
- integration
- api
- ui (playwright)

Minimum coverage targets:
- core logic >= 90%
- api >= 80%

## 2. Test stack
- `pytest`
- `pytest-asyncio`
- `httpx`
- `playwright`

## 3. Phase plan (granular TDD)

### Phase 0 - bootstrap repo
Tasks:
- create repository
- configure pyproject
- configure dockerfile
- configure pytest
- configure linting
- configure precommit

Tests:
- test project imports
- test health endpoint

### Phase 1 - database layer
Tasks:
- define link model
- define click model
- setup alembic migrations
- create database session

Tests:
- test link creation in db
- test click creation
- test foreign key integrity

### Phase 2 - link creation
Tests first:
- test_create_link_success
- test_create_link_invalid_url
- test_duplicate_target_url_allowed
- test_shortcode_generation

Implementation:
- link_service.create()
- repository.insert()
- shortcode generator

### Phase 3 - redirect logic
Tests:
- test_redirect_valid_code
- test_redirect_invalid_code
- test_redirect_returns_302
- test_click_logged

Implementation:
- redirect controller
- tracking service

### Phase 4 - analytics
Tests:
- test_click_count
- test_click_by_day
- test_click_by_campaign

Implementation:
- aggregation queries
- stats endpoint

### Phase 5 - observability
Tests:
- test_log_structure
- test_trace_exists
- test_metric_increment

Implementation:
- structured logger
- otel tracing
- prom metrics

### Phase 6 - ui tests
Playwright tests:
- redirect works in browser
- headers preserved
- latency acceptable

### Phase 7 - performance
Benchmarks:
- 1000 req/sec redirect

Tools:
- k6
- locust

Reproducible benchmark command (local):
```bash
./scripts/perf-redirect.sh
```
The script uses local `k6` when available; if not, it falls back to dockerized `grafana/k6`.
When host port access is restricted, it can still bootstrap via internal API calls inside the `api` container.

Configurable env vars:
- `BASE_URL` (default: `http://localhost:8001`)
- `PERF_RPS` (default: `1000`)
- `PERF_DURATION` (default: `60s`)
- `TARGET_URL` (default: `https://example.com/performance`)
- `RESET_STACK` (default: `1`, hace `docker compose down -v` antes del benchmark)
- `WORKER_REPLICAS` (default: `1`)
- `CLICK_WORKER_BATCH_SIZE` (default: `500`)

Example (lower load for laptop smoke run):
```bash
PERF_RPS=200 PERF_DURATION=30s ./scripts/perf-redirect.sh
```

Skip stack reset (reuse running DB/containers):
```bash
RESET_STACK=0 ./scripts/perf-redirect.sh
```

Control run with single worker:
```bash
WORKER_REPLICAS=1 CLICK_WORKER_BATCH_SIZE=500 ./scripts/perf-redirect.sh
```

Manual locust alternative:
```bash
TARGET_SHORT_CODE=<short_code> locust -f scripts/locustfile.py --host http://localhost:8001
```

## 4. Test execution policy
- Pull requests without tests are rejected.
- API contract changes require OpenAPI + API tests update.
- Performance baseline must be reproducible in CI or dedicated perf env.

## 5. CI gates
Recommended gates for merge to main:
1. lint
2. unit tests
3. integration tests
4. api tests
5. ui tests (or nightly with blocking policy as defined)
6. coverage thresholds
7. security scan
