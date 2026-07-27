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
# Si usas dominio:
SERVER_NAME=api.midominio.com
HOST_IP=0.0.0.0

# Si solo quieres acceso por IP (sin dominio):
# No necesitas SERVER_NAME — CORS funciona automáticamente con la IP del servidor
HOST_IP=0.0.0.0
```

Los puertos internos ya vienen configurados con valores no-estándar (3847 para web, 7823 para API). Puedes cambiarlos si lo necesitas.

## 3. Acceso sin dominio (solo IP)</Para pruebas o uso interno sin dominio:

```bash
HOST_IP=0.0.0.0
```

Accede directamente desde el navegador:
```
http://<ip-del-servidor>:3847
```

El wizard de setup funciona perfectamente — CORS se resuelve automáticamente con la IP de origen.

## 4. Crear túnel de Cloudflare

1. Instala `cloudflared` en tu servidor: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/install-and-setup/tunnel-guide/
2. Crea un túnel en [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. Apunta el túnel a tu servidor: `http://localhost:3847`
4. Configura el subdomain: `api.midominio.com` → túnel

## 5. Arrancar

```bash
docker compose up -d
```

Docker Compose:
- Levanta **PostgreSQL** automáticamente (puerto interno 5432)
- Levanta la **API** (backend) en puerto interno 7823
- Levanta el **Frontend** (nginx + static) en puerto 3847 (externo)
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
    ↓ (http :3847)
nginx (proxy inverso)
    ├── /          → frontend (static)
    └── /api/     → api (Bun :7823)
                        └── PostgreSQL (:5432)
```

## Cambiar puertos

```bash
# En .env
PORT_WEB=4000
PORT_API=9000
```

Los puertos externos e internos usan los mismos valores. Nginx siempre conecta al API en el puerto interno 7823 (o el que definas con `PORT_API`).

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
| `PORT_WEB` | `3847` | Puerto externo del frontend |
| `PORT_API` | `7823` | Puerto interno de la API |
| `DATABASE_URL` | interno de Docker | Solo cambiar si usas DB externa |
| `POSTGRES_PASSWORD` | `cambiar_en_produccion` | Contraseña de PostgreSQL |
