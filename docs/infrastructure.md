# YES Links - Guía de Infraestructura y Operaciones

Este documento detalla la infraestructura de producción para **YES Links**, describiendo su modelo de Despliegue Continuo (CD) altamente seguro y basado en "Pull", el enrutamiento de red, y los pasos para reproducir o migrar el entorno a otro Droplet de DigitalOcean.

---

## 1. Resumen de la Arquitectura (CD Basado en Pull)

Para maximizar la seguridad en un entorno de servidor compartido, YES Links utiliza un modelo de despliegue **Pull-Based** impulsado por **Watchtower**.

*   **GitHub Actions (CI):** Responsable *únicamente* de construir las imágenes de Docker (API y Worker) y empujarlas al DigitalOcean Container Registry (DOCR). GitHub tiene **cero acceso por SSH** al servidor de producción.
*   **DO Container Registry (DOCR):** Aloja las imágenes privadas `yes-links-api` y `yes-links-worker`.
*   **Watchtower:** Un contenedor que se ejecuta en el Droplet y que consulta el DOCR cada 60 segundos. Si detecta un nuevo hash de imagen, la descarga automáticamente y realiza un reinicio limpio (graceful restart) de los contenedores de YES Links.
*   **Nginx & SSL:** Nginx actúa como un proxy inverso, recibiendo tráfico externo HTTPS (vía Let's Encrypt / Certbot) en el puerto 443 y enrutándolo internamente al puerto 8001 (FastAPI).

### Red y Mapeo de Puertos
*   **Puerto Host 8001:** Mapeado al puerto 8000 del contenedor de la API.
*   **Redis:** Aislado completamente dentro de la red de Docker `yes-links-net`. No se exponen puertos al host para evitar conflictos con otras instancias de Redis en el servidor.
*   **MySQL:** Se conecta externamente a una Base de Datos Gestionada de DigitalOcean usando un estricto espaciado de nombres en las tablas (`yes_links_*`).

---

## 2. Migración a un Nuevo Droplet

Si necesitas mover YES Links a un nuevo servidor, sigue estos pasos exactos.

### Fase 1: Preparación de DNS y SSL
1.  **Actualizar DNS:** En GoDaddy (o tu proveedor de DNS), apunta los registros `A` para `y3s.cc` y `www.y3s.cc` a la **IP del nuevo Droplet**.
2.  **Esperar la Propagación:** Asegúrate de que no haya IPs conflictivas (como antiguos reenvíos de dominio o páginas de parking). Verifica con:
    ```bash
    dig +short A y3s.cc
    ```

### Fase 2: Configuración Inicial del Servidor (Bootstrapping)
Conéctate al nuevo Droplet vía SSH y ejecuta lo siguiente:

1.  **Instalar Docker y Docker Compose** (si no están instalados).
2.  **Autenticarse con el Registro de DigitalOcean (DOCR):**
    Instala `doctl` y autentica el demonio de Docker para que Watchtower pueda descargar tus imágenes privadas.
    ```bash
    cd /tmp
    curl -sL https://github.com/digitalocean/doctl/releases/download/v1.122.0/doctl-1.122.0-linux-amd64.tar.gz | tar -xz
    mv doctl /usr/local/bin/
    doctl auth init -t <TU_DO_PERSONAL_ACCESS_TOKEN>
    doctl registry login
    ```
3.  **Preparar el Directorio de la Aplicación:**
    ```bash
    mkdir -p /app/yes-links
    cd /app/yes-links
    ```

### Fase 3: Archivos de Configuración
Crea los archivos `.env` y `docker-compose.yml` en `/app/yes-links`.

**Archivo `.env`:**
```env
# Base de Datos
DATABASE_URL=mysql+pymysql://doadmin:<PASSWORD>@<MANAGED_DB_HOST>:25060/apimasivyes
DB_TABLE_PREFIX=yes_links

# Redis
REDIS_URL=redis://redis:6379/0

# Configuración de la App
SERVICE_NAME=yes-links-api
JWT_SECRET=<GENERA_UN_SECRETO_ALEATORIO>
CLICK_INGEST_MODE=async
CLICK_WORKER_BATCH_SIZE=500
BASE_URL=https://y3s.cc

# Notificaciones por Correo de Watchtower (Requiere Contraseña de App si usas Google Workspace)
# Reemplaza 'tu_correo%40yesbpo.co' y 'password_de_app'
WATCHTOWER_NOTIFICATION_URL=smtp://tu_correo%40yesbpo.co:password_de_app@smtp.gmail.com:587/?fromAddress=tu_correo@yesbpo.co&toAddress=admin@yesbpo.co&subject=Watchtower+YES+Links
```

**Archivo `docker-compose.yml`:**
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

### Fase 4: Nginx y SSL
Crea la configuración del proxy para enrutar el tráfico de forma segura sin afectar a otras aplicaciones en el servidor.

1.  **Crear Configuración de Nginx (`/etc/nginx/sites-available/y3s.cc`):**
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
2.  **Habilitarlo y asegurarlo:**
    ```bash
    ln -s /etc/nginx/sites-available/y3s.cc /etc/nginx/sites-enabled/
    nginx -t
    systemctl reload nginx
    certbot --nginx -d y3s.cc -d www.y3s.cc --non-interactive --agree-tos -m admin@yesbpo.com --redirect
    ```

### Fase 5: Iniciar la Aplicación
```bash
cd /app/yes-links
docker compose pull
docker compose up -d
```

---

## 3. Comandos Útiles

**Revisar Logs de la API:**
```bash
docker compose logs -f --tail 100 api
```

**Revisar Logs de Watchtower (para ver si detecta nuevas imágenes):**
```bash
docker compose logs -f watchtower
```

**Ejecutar Migraciones de Base de Datos Manualmente (si es necesario fuera del inicio de la app):**
```bash
docker compose exec api alembic upgrade head
```

**Probar Configuración de Nginx:**
```bash
nginx -t
```

---

## 4. Mejores Prácticas de Seguridad y Aislamiento

1.  **Etiquetado Estricto (Strict Labeling):** Watchtower debe ejecutarse siempre con `--label-enable`. Esto asegura que solo toque contenedores marcados explícitamente con `com.centurylinklabs.watchtower.enable=true`, evitando que reinicie accidentalmente otras aplicaciones de la empresa en el Droplet compartido.
2.  **Sin Puertos Inter-servicio Expuestos:** Nunca vincules el contenedor interno de Redis a un puerto del host (ej. evita `6379:6379` en el `docker-compose`). Mantenlo aislado dentro de `yes-links-net`.
3.  **Configuración de Docker de Solo Lectura:** Al montar `.docker/config.json` en Watchtower, usa siempre `:ro` (read-only) para evitar que el contenedor altere el estado de autenticación del host.
4.  **Espaciado de Nombres de Base de Datos:** Asegúrate de que `DB_TABLE_PREFIX=yes_links` esté siempre configurado en el `.env` cuando te conectes a una base de datos gestionada compartida, para garantizar cero colisiones con otras tablas.
