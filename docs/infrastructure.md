# YES Links Infrastructure & Operations Guide

This document outlines the production infrastructure for **YES Links**, describing its highly secure, pull-based Continuous Deployment (CD) model, network routing, and steps to reproduce or migrate the environment to another DigitalOcean Droplet.

---

## 1. Architecture Overview (Pull-Based CD)

To maximize security in a shared server environment, YES Links uses a **Pull-Based** deployment model powered by **Watchtower**.

*   **GitHub Actions (CI):** Responsible *only* for building the Docker images (API and Worker) and pushing them to the DigitalOcean Container Registry (DOCR). GitHub has **zero SSH access** to the production server.
*   **DO Container Registry (DOCR):** Hosts the private `yes-links-api` and `yes-links-worker` images.
*   **Watchtower:** A container running on the Droplet that polls the DOCR every 60 seconds. If it detects a new image hash, it automatically downloads it and performs a graceful restart of the YES Links containers.
*   **Nginx & SSL:** Nginx acts as a reverse proxy, receiving external HTTPS traffic (via Let's Encrypt / Certbot) on port 443 and routing it internally to port 8001 (FastAPI).

### Network & Port Mapping
*   **Host Port 8001:** Mapped to the API container's port 8000.
*   **Redis:** Isolated entirely within the `yes-links-net` Docker network. No ports are exposed to the host to prevent conflicts with other Redis instances on the server.
*   **MySQL:** Connects externally to a DigitalOcean Managed Database using strict table namespacing (`yes_links_*`).

---

## 2. Migrating to a New Droplet

If you need to move YES Links to a new server, follow these exact steps.

### Phase 1: DNS & SSL Preparation
1.  **Update DNS:** In GoDaddy (or your DNS provider), point the `A` records for `y3s.cc` and `www.y3s.cc` to the **new Droplet IP**.
2.  **Wait for Propagation:** Ensure there are no conflicting IPs (like old domain forwards or parking pages). Verify with:
    ```bash
    dig +short A y3s.cc
    ```

### Phase 2: Server Bootstrapping
Connect to the new Droplet via SSH and execute the following:

1.  **Install Docker & Docker Compose** (if not already installed).
2.  **Authenticate with DigitalOcean Registry (DOCR):**
    Install `doctl` and authenticate the Docker daemon so Watchtower can pull your private images.
    ```bash
    cd /tmp
    curl -sL https://github.com/digitalocean/doctl/releases/download/v1.122.0/doctl-1.122.0-linux-amd64.tar.gz | tar -xz
    mv doctl /usr/local/bin/
    doctl auth init -t <YOUR_DO_PERSONAL_ACCESS_TOKEN>
    doctl registry login
    ```
3.  **Prepare Application Directory:**
    ```bash
    mkdir -p /app/yes-links
    cd /app/yes-links
    ```

### Phase 3: Configuration Files
Create the `.env` and `docker-compose.yml` files in `/app/yes-links`.

**`.env` file:**
```env
# Database
DATABASE_URL=mysql+pymysql://doadmin:<PASSWORD>@<MANAGED_DB_HOST>:25060/apimasivyes
DB_TABLE_PREFIX=yes_links

# Redis
REDIS_URL=redis://redis:6379/0

# App Config
SERVICE_NAME=yes-links-api
JWT_SECRET=<GENERATE_A_RANDOM_SECRET>
CLICK_INGEST_MODE=async
CLICK_WORKER_BATCH_SIZE=500
BASE_URL=https://y3s.cc

# Watchtower Email Notifications (Requires App Password if using Google Workspace)
# Replace 'your_email%40yesbpo.co' and 'app_password'
WATCHTOWER_NOTIFICATION_URL=smtp://your_email%40yesbpo.co:app_password@smtp.gmail.com:587/?fromAddress=your_email@yesbpo.co&toAddress=admin@yesbpo.co&subject=Watchtower+YES+Links
```

**`docker-compose.yml` file:**
```yaml
services:
  api:
    image: registry.digitalocean.com/yes4-cr/yes-links-api:latest
    restart: always
    ports:
      - "8001:8000"
    env_file: .env
    depends_on:
      - redis
    networks:
      - yes-links-net
    labels:
      - "com.centurylinklabs.watchtower.enable=true"

  click-worker:
    image: registry.digitalocean.com/yes4-cr/yes-links-worker:latest
    restart: always
    env_file: .env
    depends_on:
      - redis
    networks:
      - yes-links-net
    labels:
      - "com.centurylinklabs.watchtower.enable=true"

  redis:
    image: redis:7-alpine
    restart: always
    networks:
      - yes-links-net
    labels:
      - "com.centurylinklabs.watchtower.enable=false"

  watchtower:
    image: containrrr/watchtower:latest
    restart: always
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /root/.docker/config.json:/config.json:ro
    environment:
      - WATCHTOWER_LIFECYCLE_HOOKS=1
      - WATCHTOWER_NOTIFICATIONS=shoutrrr
      - WATCHTOWER_NOTIFICATION_URL=${WATCHTOWER_NOTIFICATION_URL}
    command: --interval 60 --label-enable --cleanup

networks:
  yes-links-net:
    driver: bridge
```

### Phase 4: Nginx & SSL
Create the proxy configuration to route traffic safely without impacting other apps on the server.

1.  **Create Nginx Config (`/etc/nginx/sites-available/y3s.cc`):**
    ```nginx
    server {
        listen 80;
        server_name y3s.cc www.y3s.cc;

        location / {
            proxy_pass http://localhost:8001;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
    ```
2.  **Enable and secure it:**
    ```bash
    ln -s /etc/nginx/sites-available/y3s.cc /etc/nginx/sites-enabled/
    nginx -t
    systemctl reload nginx
    certbot --nginx -d y3s.cc -d www.y3s.cc --non-interactive --agree-tos -m admin@yesbpo.com --redirect
    ```

### Phase 5: Start the App
```bash
cd /app/yes-links
docker compose pull
docker compose up -d
```

---

## 3. Useful Commands

**Check API Logs:**
```bash
docker compose logs -f --tail 100 api
```

**Check Watchtower Logs (to see if it's detecting new images):**
```bash
docker compose logs -f watchtower
```

**Run Database Migrations Manually (if required outside of app startup):**
```bash
docker compose exec api alembic upgrade head
```

**Test Nginx Configuration:**
```bash
nginx -t
```

---

## 4. Security & Isolation Best Practices

1.  **Strict Labeling:** Watchtower must always run with `--label-enable`. This ensures it only touches containers explicitly marked with `com.centurylinklabs.watchtower.enable=true`, preventing it from accidentally restarting other company applications on the shared droplet.
2.  **No Exposed Inter-service Ports:** Never bind the internal Redis container to a host port (e.g., avoid `6379:6379` in `docker-compose`). Keep it isolated within the `yes-links-net`.
3.  **Read-Only Docker Config:** When mounting `.docker/config.json` into Watchtower, always use `:ro` (read-only) to prevent the container from altering the host's authentication state.
4.  **Database Namespacing:** Ensure `DB_TABLE_PREFIX=yes_links` is always set in `.env` when connecting to a shared managed database to guarantee zero collision with other tables.
