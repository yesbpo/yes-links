#!/bin/sh
set -eu

BASE_URL="${BASE_URL:-http://localhost:8001}"
PERF_RPS="${PERF_RPS:-1000}"
PERF_DURATION="${PERF_DURATION:-60s}"
TARGET_URL="${TARGET_URL:-https://example.com/performance}"
RESET_STACK="${RESET_STACK:-1}"
WORKER_REPLICAS="${WORKER_REPLICAS:-1}"
CLICK_WORKER_BATCH_SIZE="${CLICK_WORKER_BATCH_SIZE:-500}"
API_INTERNAL_URL="http://127.0.0.1:8000"

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

require_cmd docker
require_cmd curl
require_cmd python3

K6_RUNNER="local"
if ! command -v k6 >/dev/null 2>&1; then
  K6_RUNNER="docker"
fi

health_check_internal() {
  docker compose exec -T api python - <<PY >/dev/null 2>&1
import urllib.request
urllib.request.urlopen("${API_INTERNAL_URL}/health", timeout=2)
print("ok")
PY
}

create_seed_link_internal() {
  docker compose exec -T api python - <<PY
import json
import urllib.request

payload = {
    "target_url": "${TARGET_URL}",
    "campaign": "perf",
    "tags": ["benchmark"],
}
req = urllib.request.Request(
    "${API_INTERNAL_URL}/links",
    data=json.dumps(payload).encode("utf-8"),
    headers={"Content-Type": "application/json"},
    method="POST",
)
with urllib.request.urlopen(req, timeout=5) as resp:
    print(resp.read().decode("utf-8"))
PY
}

echo "Starting stack with docker compose..."
if [ "${RESET_STACK}" = "1" ]; then
  echo "Resetting stack and volumes for reproducible benchmark run..."
  docker compose down -v --remove-orphans >/dev/null 2>&1 || true
fi
CLICK_WORKER_BATCH_SIZE="${CLICK_WORKER_BATCH_SIZE}" docker compose up -d --build \
  --scale "click-worker=${WORKER_REPLICAS}" \
  mysql redis api click-worker

API_CONTAINER_ID="$(docker compose ps -q api)"
if [ -z "${API_CONTAINER_ID}" ]; then
  echo "Could not resolve API container ID." >&2
  exit 1
fi

echo "Waiting for API health at ${BASE_URL}/health ..."
attempt=0
while [ "$attempt" -lt 60 ]; do
  if curl -fsS "${BASE_URL}/health" >/dev/null 2>&1 || health_check_internal; then
    break
  fi
  attempt=$((attempt + 1))
  sleep 1
done

if [ "$attempt" -ge 60 ]; then
  echo "API did not become healthy in time." >&2
  exit 1
fi

echo "Creating seed link..."
if CREATE_RESPONSE="$(curl -fsS -X POST "${BASE_URL}/links" \
  -H "Content-Type: application/json" \
  -d "{\"target_url\":\"${TARGET_URL}\",\"campaign\":\"perf\",\"tags\":[\"benchmark\"]}" 2>/dev/null)"; then
  :
else
  CREATE_RESPONSE="$(create_seed_link_internal)"
fi

SHORT_CODE="$(python3 -c 'import json,sys; print(json.loads(sys.stdin.read())["short_code"])' <<EOF
${CREATE_RESPONSE}
EOF
)"

if [ -z "${SHORT_CODE}" ]; then
  echo "Could not parse short_code from create response." >&2
  exit 1
fi

echo "Running k6 benchmark with short code: ${SHORT_CODE}"
echo "Target rate: ${PERF_RPS} req/s, duration: ${PERF_DURATION}"
if [ "${K6_RUNNER}" = "local" ]; then
  TARGET_BASE_URL="${BASE_URL}" \
  TARGET_SHORT_CODE="${SHORT_CODE}" \
  PERF_RPS="${PERF_RPS}" \
  PERF_DURATION="${PERF_DURATION}" \
    k6 run scripts/k6-redirect.js
else
  API_NETWORK="$(docker inspect "${API_CONTAINER_ID}" --format '{{range $k, $_ := .NetworkSettings.Networks}}{{println $k}}{{end}}' | head -n 1)"
  if [ -z "${API_NETWORK}" ]; then
    echo "Could not resolve API docker network." >&2
    exit 1
  fi

  K6_BASE_URL="http://api:8000"
  echo "Local k6 not found. Using dockerized k6 (grafana/k6)."
  TARGET_BASE_URL="${K6_BASE_URL}" \
  TARGET_SHORT_CODE="${SHORT_CODE}" \
  PERF_RPS="${PERF_RPS}" \
  PERF_DURATION="${PERF_DURATION}" \
    docker run --rm -i \
      --network "${API_NETWORK}" \
      -e TARGET_BASE_URL \
      -e TARGET_SHORT_CODE \
      -e PERF_RPS \
      -e PERF_DURATION \
      -v "$(pwd)/scripts:/scripts" \
      grafana/k6 run /scripts/k6-redirect.js
fi
