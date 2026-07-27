# Despliegue en Producción

## Arquitectura

```
┌──────────────────────────────────────────────────────┐
│                     nginx :80/:443                    │
│          (sirve frontend, proxy /api)               │
└────────────────┬─────────────────┬───────────────────┘
                 │                 │
          ┌──────▼──────┐   ┌──────▼──────┐
          │  web (nginx) │   │  api (node) │
          │   :8080      │   │   :3000     │
          │  (estático)  │   │  Bun/Hono   │
          └──────────────┘   └──────┬──────┘
                                    │
                             ┌──────▼──────┐
                             │  postgres   │
                             │   :5432     │
                             └─────────────┘
```

## Requisitos previos

- **SO**: Ubuntu 22.04+ / Debian 12+ / macOS
- **Docker** 24+ y **Docker Compose** v2
- **Dominio** apontado al servidor (A/AAAA)
- **PostgreSQL** 17 (si no se usa Docker Compose)

---

## Opción A: Docker Compose (recomendado)

### 1. Preparar archivos

```bash
# En el servidor
git clone https://github.com/tu-usuario/qlik-automate-creator.git
cd qlik-automate-creator

# Copiar variables de producción
cp .env.production .env

# Generar clave de cifrado
openssl rand -base64 32
# Copiar el resultado en CIFRADO_CLAVE_PRINCIPAL del .env
```

### 2. Configurar variables críticas

Editar `.env` con los valores reales:

```env
DATABASE_URL=postgres://qlik_app:MI_PASSWORD@postgres:5432/qlik_automatizaciones
POSTGRES_PASSWORD=MI_PASSWORD

QLIK_CLIENT_ID=tu_client_id_de_qlik
QLIK_CLIENT_SECRET=tu_client_secret
QLIK_REDIRECT_URI=https://tu-dominio.com/api/auth/qlik/callback
QLIK_OAUTH_SCOPES=user_default offline_access identity.name:read identity.email:read identity.subject:read identity.picture:read automations automations.private automations.shared spaces:read apps:read data-integration

CIFRADO_CLAVE_PRINCIPAL=$(openssl rand -base64 32)
BOOTSTRAP_TENANT_HOST=tu-tenant.eu.qlikcloud.com
SUPERADMINMAIL=admin@tu-dominio.com
```

### 3. Desplegar

```bash
# Build y start (incluye PostgreSQL, API y Frontend)
docker compose --profile with-postgres --profile with-nginx up -d

# Ver logs
docker compose logs -f api
docker compose logs -f web

# Verificar salud
curl https://tu-dominio.com/api/salud
```

Resultado esperado:
```json
{"exito":true,"datos":{"estado":"ok","fecha":"...","arquitectura":"monolito-modular"}}
```

### 4. Migrar base de datos

```bash
# Ejecutar migraciones
docker compose exec api bun --env-file=/app/.env run drizzle-kit migrate

# Crear usuario bootstrap
docker compose exec api bun --env-file=/app/.env run drizzle-kit seed
```

---

## Opción B: Manual (systemd + nginx + PostgreSQL externo)

### 1. Instalar dependencias

```bash
# Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Bun
curl -fsSL https://bun.sh/install | bash

# PostgreSQL 17
sudo apt-get install -y postgresql-17

# Nginx
sudo apt-get install -y nginx certbot python3-certbot-nginx
```

### 2. Crear usuario del servicio

```bash
sudo useradd -r -s /usr/bin/nologin qlikapp
sudo mkdir -p /opt/qlik-automate-creator
sudo chown qlikapp:qlikapp /opt/qlik-automate-creator
```

### 3. Compilar aplicación

```bash
cd /opt/qlik-automate-creator
git clone https://github.com/tu-usuario/qlik-automate-creator.git .
cp .env.production .env

# Editar .env — DATABASE_URL apunta a PostgreSQL local
nano .env

bun install
bun run build
```

### 4. Base de datos

```bash
# Crear usuario y base de datos PostgreSQL
sudo -u postgres psql <<EOF
CREATE USER qlik_app WITH PASSWORD 'MI_PASSWORD';
CREATE DATABASE qlik_automatizaciones OWNER qlik_app;
GRANT ALL PRIVILEGES ON DATABASE qlik_automatizaciones TO qlik_app;
EOF

# Migrar
bun --cwd apps/api run db:migrate

# Seed bootstrap
bun --cwd apps/api run db:seed
```

### 5. Servicio systemd

```bash
# Copiar unidad
sudo cp deploy/qlik-api.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable qlik-api
sudo systemctl start qlik-api

# Verificar
sudo systemctl status qlik-api
```

### 6. Nginx con SSL

```bash
# Copiar configuración
sudo cp deploy/nginx.conf /etc/nginx/sites-available/qlik-automate-creator
sudo ln -s /etc/nginx/sites-available/qlik-automate-creator /etc/nginx/sites-enabled/

# Editar server_name en nginx.conf
sudo nano /etc/nginx/sites-available/qlik-automate-creator
# Cambiar: server_name tu-dominio.com;

# Probar y recargar
sudo nginx -t
sudo systemctl reload nginx

# Certbot (Let's Encrypt)
sudo certbot --nginx -d tu-dominio.com
```

---

## Configuración OAuth de Qlik Cloud

Independientemente del método de despliegue, necesitas registrar un cliente OAuth en Qlik:

1. Ir a **Qlik Cloud → Administration → Integrations → OAuth clients**
2. Crear cliente Web con:
   - **Name**: `Qlik Automate Creator`
   - **Redirect URI**: `https://tu-dominio.com/api/auth/qlik/callback`
   - **Scopes**: `user_default offline_access identity.name:read identity.email:read identity.subject:read identity.picture:read automations automations.private automations.shared spaces:read apps:read data-integration`
3. Copiar `Client ID` y `Client Secret` al `.env`

---

## Configurar el tenant en la aplicación

Después del primer login como superadministrador:

1. Ir a **Administración → Organizaciones**
2. Crear/editar la organización con el `tenant host` de Qlik Cloud (ej: `mi-empresa.eu.qlikcloud.com`)
3. En **Acceso OAuth**, registrar el `Client ID` y `Client Secret` de Qlik
4. Guardar y conectar

---

## Actualizaciones

### Docker Compose

```bash
git pull origin main
docker compose --profile with-postgres --profile with-nginx build
docker compose --profile with-postgres --profile with-nginx up -d
```

### Manual

```bash
cd /opt/qlik-automate-creator
git pull
bun install
bun run build
sudo systemctl restart qlik-api
```

---

## Monitoreo

```bash
# Logs del API
journalctl -u qlik-api -f

# Health check
curl https://tu-dominio.com/api/salud

# Ver consumo de recursos
docker stats  # si usas compose
```

---

## Troubleshooting

### La API devuelve 401 en todas las peticiones

1. Verificar que `CIFRADO_CLAVE_PRINCIPAL` sea el mismo que se usó cuando se guardaron las credenciales en BD
2. Verificar que las credenciales OAuth en BD no estén expiradas
3. Revisar logs: `docker compose logs api` o `journalctl -u qlik-api`

### El frontend no carga (blank page)

1. Verificar que nginx sirva los archivos estáticos: `curl https://tu-dominio.com/`
2. Ver que `/api/salud` responda desde el exterior
3. Revisar que `VITE_API_URL` (si aplica) esté configurado correctamente

### Migraciones fallan

```bash
# Ver estado de migraciones
docker compose exec api bun drizzle-kit status

# Forzar push del esquema ( Desarrollo — NO en producción con datos reales)
docker compose exec api bun drizzle-kit push
```

### Puerto 3000 ocupado

```bash
# Encontrar proceso
sudo lsof -i:3000

# Matar si es seguro
sudo kill -9 <PID>
```
