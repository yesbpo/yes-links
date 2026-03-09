# YES LINKS Deployment & Environment Configuration

This document contains the required environment variables and secrets to host the **YES LINKS API** on a Digital Ocean Droplet.

## 1. Environment Variables Template

Create a `.env` file on your Droplet with the following content. Replace `<PLACEHOLDER>` with your actual values.

```bash
# --- Infrastructure ---
# MySQL Configuration
DATABASE_URL=mysql+pymysql://yes_links:<DB_PASSWORD>@<DB_HOST>:3306/yes_links
DB_TABLE_PREFIX=yes_links

# Redis Configuration
REDIS_URL=redis://<REDIS_HOST>:6379/0

# --- Service Configuration ---
SERVICE_NAME=yes-links-api
JWT_SECRET=<STRONG_RANDOM_SECRET>
CLICK_INGEST_MODE=async
CLICK_WORKER_BATCH_SIZE=500

# --- Observability ---
# Endpoint for OpenTelemetry Collector (optional)
OTEL_ENDPOINT=http://otel-collector:4317

# --- Domain & Public Access ---
# Base URL for generated short links
BASE_URL=https://y.es
```

## 2. Secrets Management

The following secrets must be configured in your **GitHub Repository Secrets**:

| Secret Name | Description |
| :--- | :--- |
| `DIGITALOCEAN_ACCESS_TOKEN` | Personal Access Token for DO API/Registry |
| `DOCR_REGISTRY_URL` | Your DO Container Registry URL (e.g., `registry.digitalocean.com/my-registry`) |
| `DROPLET_SSH_KEY` | Private SSH Key to access the Droplet |
| `DROPLET_IP` | Public IP address of your Digital Ocean Droplet |
| `DROPLET_USER` | SSH User (usually `root`) |

---

## 3. Automated Deployment Workflow

The deployment follows a strict **YES Engineering** pipeline:

1.  **PR to `main`**: Triggers `ruff check` and `pytest`.
2.  **Merge to `main`**:
    -   Builds the `yes-links-api` image.
    -   Compiles **Storybook** from `yes-links-ui`.
    -   Pushes the unified image to **Digital Ocean Container Registry**.
    -   Triggers a `docker compose pull && docker compose up -d` on the Droplet via SSH.

## 4. Exposed Services

Once deployed, the following endpoints will be available:

-   **Redirect Engine**: `https://y.es/{short_code}`
-   **API (OpenAPI)**: `https://api.y.es/docs`
-   **UI Storybook**: `https://api.y.es/storybook`
-   **Metrics**: `https://api.y.es/metrics`
