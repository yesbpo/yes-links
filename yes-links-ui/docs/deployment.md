# YES LINKS UI: Deployment Specification

## 1. Rule 1: Containerized
The project must build and run using Docker.

### Multi-stage Dockerfile
- **Stage 1 (Build):** Node.js 20-alpine, runs `npm install` and `next build`.
- **Stage 2 (Runner):** Minimal alpine image, serves the standalone Next.js build.

## 2. Rule 5: Reproducible Deployment
Artifacts required in `deploy/`:
- `docker/Dockerfile`
- `compose/docker-compose.yml` (Includes API + UI + Redis + MySQL)
- `kubernetes/deployment.yaml`, `service.yaml`, `ingress.yaml`

## 3. Environment Variables
| Variable | Default | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8001` | Backend API location. |
| `NEXT_PUBLIC_OTEL_ENDPOINT` | `http://localhost:4318` | OTLP Trace collector. |
| `SERVICE_NAME` | `yes-links-ui` | Identifying name for telemetry. |

## 4. Build Command
```bash
docker build -t yes-links-ui:latest -f deploy/docker/Dockerfile .
```
