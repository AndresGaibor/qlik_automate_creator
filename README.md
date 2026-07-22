# Qlik Automate Creator

Sistema MVP de automatización Qlik Cloud con frontend React y backend Hono.

## Arquitectura

```
┌─────────────────────────────────────┐
│ React SPA (Vite + TanStack)         │
│ http://localhost:5173               │
└─────────────────┬───────────────────┘
                  │ /api/*
                  ▼
┌─────────────────────────────────────┐
│ Backend Hono + TypeScript           │
│ http://localhost:3000               │
│                                     │
│ • Autenticación OAuth Qlik          │
│ • Cliente API Qlik Cloud            │
│ • Cliente API Destinos              │
│ • Configuración automatizaciones     │
└───────┬──────────────────┬──────────┘
        │                  │
        ▼                  ▼
 PostgreSQL             Qlik Cloud
        │
        ▼
 API externa destinos
 (apiqd.andresgaibor.com)
```

## Tech Stack

- **Frontend:** React, Vite, TanStack Router, TanStack Query, Tailwind CSS
- **Backend:** Hono, TypeScript, Drizzle ORM
- **Base de datos:** PostgreSQL 17
- **Autenticación:** OAuth 2.0 (Authorization Code + PKCE)
- **Desarrollo:** Bun

---

## Requisitos

- [Bun](https://bun.sh) 1.x
- [Docker](https://docker.com) (para PostgreSQL)
- Cuenta en Qlik Cloud con acceso admin
- API de destinos accesible (apiqd.andresgaibor.com)

---

## Configuración

### 1. Variables de entorno

Copiar el template y completar:

```bash
cp .env.example .env
```

Editar `.env` con los valores correctos:

```env
# ============================================
# BASE DE DATOS
# ============================================
NODE_ENV=development
PORT=3000
DATABASE_URL=postgres://qlik_app:desarrollo@localhost:5432/qlik_automatizaciones

# ============================================
# OAUTH QLIK CLOUD
# ============================================
# Obtener de Qlik Cloud Console > OAuth Apps
QLIK_CLIENT_ID=tu_client_id_de_qlik
QLIK_CLIENT_SECRET=tu_client_secret_de_qlik
QLIK_REDIRECT_URI=http://localhost:3000/api/auth/qlik/callback

# ============================================
# CIFRADO (tokens OAuth)
# ============================================
# Generar con: openssl rand -base64 32
CIFRADO_CLAVE_PRINCIPAL=GENERAR_CON_OPENSSL

# ============================================
# API DESTINOS (ya configurado)
# ============================================
REMOTE_API_URL=https://apiqd.andresgaibor.com
REMOTE_API_KEY=clave-super-segura123
```

### 2. Generar clave de cifrado

```bash
openssl rand -base64 32
```

Copiar el resultado y asignarlo a `CIFRADO_CLAVE_PRINCIPAL` en `.env`.

### 3. Configurar OAuth en Qlik Cloud

1. Ir a [Qlik Cloud Console](https://cloud.qlik.com)
2. Seleccionar el tenant
3. Ir a **Apps** > **OAuth Apps** (o **Manage** > **OAuth**)
4. Crear nueva OAuth App:
   - **Name:** Qlik Automate Creator
   - **Type:** Web Application
   - **Redirect URIs:** `http://localhost:3000/api/auth/qlik/callback`
   - **Scopes:** `openid profile email offline_access`
   - **Note:** `offline_access` es necesario para obtener refresh tokens
5. Copiar `Client ID` y `Client Secret` al `.env`

### 4. Levantar PostgreSQL

```bash
docker-compose up -d
```

Verificar que está corriendo:

```bash
docker-compose ps
```

---

## Desarrollo

### Instalar dependencias

```bash
bun install
```

### Aplicar migraciones de base de datos

```bash
cd apps/api
bun drizzle-kit push
```

Esto crea todas las tablas en PostgreSQL.

### Levantar servicios

**Terminal 1 - Backend API:**

```bash
cd apps/api
bun run dev
```

**Terminal 2 - Frontend Web:**

```bash
cd apps/web
bun run dev
```

### URLs

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| API | http://localhost:3000 |
| Salud API | http://localhost:3000/api/salud |

---

## Uso

### 1. Abrir el navegador

Ir a http://localhost:5173

### 2. Iniciar sesión con Qlik

El flujo OAuth redirige a Qlik Cloud para autenticarse.

### 3. Gestionar automatizaciones

Una vez logueado:

- **Flujos:** Ver flujos disponibles en Qlik Cloud
- **Automatizaciones:** Crear y gestionar automatizaciones
- **Destinos:** Ver destinos disponibles (Impala)
- **Auditoría:** Ver historial de operaciones

---

## API Endpoints

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/auth/qlik/iniciar` | Inicia flujo OAuth |
| GET | `/api/auth/qlik/callback` | Callback de Qlik |
| GET | `/api/auth/sesion` | Verificar sesión |
| POST | `/api/auth/cerrar-sesion` | Cerrar sesión |

### Flujos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/flujos` | Listar flujos de Qlik |

### Automatizaciones

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/automatizaciones` | Listar configuraciones |
| POST | `/api/automatizaciones` | Crear configuración |
| GET | `/api/automatizaciones/:id` | Ver configuración |
| POST | `/api/automatizaciones/:id/ejecutar` | Ejecutar automatización |

### Destinos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/destinos` | Listar destinos |
| GET | `/api/destinos/databases` | Listar bases de datos |
| GET | `/api/destinos/databases/:db/tables` | Listar tablas |

### Auditoría

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/auditoria` | Listar eventos |

---

## Base de datos

### Esquema

```
organizaciones
    │
    ├── membresias_organizacion ── usuarios
    │
    ├── tenants_qlik
    │       │
    │       ├── identidades_qlik ── usuarios
    │       │       └── credenciales_qlik
    │       │
    │       ├── espacios_qlik_cache
    │       ├── flujos_qlik_cache
    │       └── automatizaciones_qlik_cache
    │
    ├── destinos_cache
    │
    └── configuraciones_automatizacion
            └── programaciones_automatizacion
```

### Tablas principales

| Tabla | Descripción |
|-------|-------------|
| `organizaciones` | Organizaciones del sistema |
| `usuarios` | Usuarios del sistema |
| `tenants_qlik` | Tenants de Qlik conectados |
| `identidades_qlik` | Identidad del usuario en Qlik |
| `credenciales_qlik` | Tokens OAuth cifrados |
| `sesiones_usuario` | Sesiones locales |
| `configuraciones_automatizacion` | Configuraciones de automatizaciones |
| `auditoria_eventos` | Log de eventos |

---

## Producción

### Build Docker

```bash
docker build -t qlik-automatizaciones .
```

### Variables de entorno productivas

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgres://user:pass@host:5432/db

QLIK_CLIENT_ID=...
QLIK_CLIENT_SECRET=...
QLIK_REDIRECT_URI=https://tu-dominio.com/api/auth/qlik/callback

CIFRADO_CLAVE_PRINCIPAL=...  # Debe ser secreto en producción
```

### Docker Compose completo

```yaml
services:
  base_datos:
    image: postgres:17-alpine
    environment:
      POSTGRES_DB: qlik_automatizaciones
      POSTGRES_USER: qlik_app
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_datos:/var/lib/postgresql/data

  aplicacion:
    build: .
    environment:
      NODE_ENV: production
      DATABASE_URL: postgres://qlik_app:${POSTGRES_PASSWORD}@base_datos:5432/qlik_automatizaciones
    ports:
      - "3000:3000"
    depends_on:
      base_datos:
        condition: service_healthy

volumes:
  postgres_datos:
```

---

## Troubleshooting

### Error de conexión a PostgreSQL

Verificar que PostgreSQL está corriendo:

```bash
docker-compose ps
```

Ver logs:

```bash
docker-compose logs base_datos
```

### Error OAuth "invalid client"

Verificar `QLIK_CLIENT_ID` y `QLIK_CLIENT_SECRET` en `.env`.

Verificar que el Redirect URI en Qlik Cloud coincide exactamente con `QLIK_REDIRECT_URI`.

### Error de cifrado

Si aparece error de descifrado, la clave `CIFRADO_CLAVE_PRINCIPAL` puede estar corrupta. Regenerar con:

```bash
openssl rand -base64 32
```

**Nota:** Esto invalidará todos los tokens almacenados.

### La API no responde

Verificar que el servidor está corriendo en el puerto correcto:

```bash
lsof -i :3000
```

---

## Limpiar

Para eliminar todo el estado local:

```bash
# Detener containers
docker-compose down

# Eliminar volúmenes (borra datos)
docker-compose down -v

# Reiniciar desde cero
docker-compose up -d
cd apps/api && bun drizzle-kit push
```
