# YES LINKS Deployment

## 1. Reproducible deployment requirements
Mandatory artifacts:
- Dockerfile
- Docker Compose
- Kubernetes manifests

Required commands:
```bash
docker build
docker run
docker compose up
```

## 2. Container baseline
Provided baseline:
```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY pyproject.toml .
RUN pip install .

COPY src ./src

CMD ["uvicorn","src.main:app","--host","0.0.0.0","--port","8000"]
```

## 3. Docker Compose baseline
```yaml
services:
 api:
  build: .
  ports:
   - "8001:8000"

 click-worker:
  build: .
  command: python -m src.workers.click_worker

 mysql:
  image: mysql:8.4

  redis:
    image: redis:7
```

## 4. Kubernetes components
Required:
- Deployment
- Service
- Ingress
- ConfigMap
- Secret

Suggested layout:
```text
deploy/
  docker/
  compose/
  kubernetes/
```

## 5. Environment variables and secrets
Required secrets:
- `DATABASE_URL`
- `OTEL_ENDPOINT`
- `JWT_SECRET`

Required config:
- `DB_TABLE_PREFIX` (default: `yes_links`) to isolate tables in shared MySQL databases.

Best practice:
- Never store secrets in repo.
- Inject via Kubernetes Secret / secret manager.

## 6. DNS and TLS operations
Manual setup:
- Configure short domain (example `y.es`).
- Configure TLS with cert-manager + letsencrypt.

## 7. Observability deployment
- OpenTelemetry exporter enabled by env.
- Structured logs shipped to centralized backend.
- Prometheus metrics endpoint scraped.

## 8. Operational SLO/alerts (initial)
SLI:
- Redirect latency p95.
- Redirect error rate.
- Click throughput.

Alert examples:
- p95 latency > threshold for N minutes.
- redirect error rate > threshold.
- click ingest lag or drop anomaly.

## 9. Promotion strategy
Environments:
- dev
- stage
- prod

Release gates:
- lint pass
- test pass
- security checks pass
- deploy approval for prod
