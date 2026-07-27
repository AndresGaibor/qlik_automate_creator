# Despliegue en Producción

## Requisitos

- Docker y Docker Compose instalados
- Git para clonar el repositorio
- Un túnel de Cloudflare (u otro método para exponer el servicio)

---

## 1. Clonar y configurar

```bash
git clone https://github.com/AndresGaibor/qlik_automate_creator.git
cd qlik_automate_creator
cp .env.example .env
```

## 2. Configurar dominio y puertos

Edita `.env` según tu servidor:

```bash
# Tu dominio o subdomain
SERVER_NAME=api.midominio.com

# IP del servidor (0.0.0.0 = todas las interfaces)
HOST_IP=0.0.0.0

# Puertos internos (default funcionan)
PORT_API=3000
PORT_WEB=8080
```

## 3. Crear túnel de Cloudflare

1. Instala `cloudflared` en tu servidor: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/install-and-setup/tunnel-guide/
2. Crea un túnel en [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. Apunta el túnel a tu servidor: `http://localhost:8080`
4. Configura el subdomain: `api.midominio.com` → túnel

## 4. Arrancar

```bash
docker compose up -d
```

Docker Compose:
- Levanta **PostgreSQL** automáticamente
- Levanta la **API** (backend)
- Levanta el **Frontend** (nginx + static)
- Crea las tablas automáticamente al primer inicio

## 5. Completar el wizard

Abre `http://api.midominio.com` en tu navegador y completa el wizard de configuración inicial.

---

## Comandos útiles

```bash
# Ver logs
docker compose logs -f

# Ver logs de un servicio
docker compose logs -f api

# Reiniciar
docker compose restart

# Actualizar (reconstruir y reiniciar)
git pull
docker compose up -d --build

# Detener
docker compose down

# Base de datos: conectarse
docker compose exec postgres psql -U qlik_app -d qlik_automatizaciones

# Reset completo (¡borra todo!)
docker compose down -v
docker compose up -d
```

---

## Estructura de servicios

```
cloudflared (túnel)
    ↓ (http :8080)
nginx (proxy inverso)
    ├── /          → frontend (static)
    └── /api/      → api (Bun :3000)
                        └── PostgreSQL
```

---

## SSL / HTTPS

El app siempre corre en HTTP. SSL se maneja en:

**Opción A — Cloudflare (recomendada)**
- En Cloudflare Dashboard, activa "Proxy" para tu DNS
- El tráfico llega en HTTPS a Cloudflare, se reenvía en HTTP a tu servidor

**Opción B — nginx con SSL propio**
1. Genera certificados con Let's Encrypt:
   ```bash
   certbot --nginx -d api.midominio.com
   ```
2. Modifica `deploy/nginx.conf` para incluir los certificados SSL

---

## Variables de entorno disponibles

| Variable | Default | Descripción |
|---|---|---|
| `SERVER_NAME` | `localhost` | Dominio del servidor |
| `HOST_IP` | `127.0.0.1` | IP de bind (usa `0.0.0.0` para exponer) |
| `PORT_WEB` | `8080` | Puerto interno del frontend |
| `PORT_API` | `3000` | Puerto interno de la API |
| `DATABASE_URL` | interno de Docker | Solo cambiar si usas DB externa |
| `POSTGRES_PASSWORD` | `cambiar_en_produccion` | Contraseña de PostgreSQL |
