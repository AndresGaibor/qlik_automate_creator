# Qlik Automate Creator

Sistema MVP de automatización Qlik Cloud con frontend React y backend Hono.

## Arquitectura

```
┌─────────────────────────────────────────────┐
│ React SPA (Vite + TanStack Router/Query)    │
│ http://localhost:5173                        │
│                                             │
│ • PaginaLogin (oauth_error → toast)         │
│ • PaginaFlujos (listar dataflows Qlik)      │
│ • PaginaAutomatizaciones (CRUD configs)     │
│ • NotificacionesProvider (toast auto-5s)    │
│ • EstadoError (reintentar)                  │
└───────────────────┬─────────────────────────┘
                    │ fetch(*, { credentials: 'include' })
                    │ /api/*
                    ▼
┌─────────────────────────────────────────────┐
│ Backend Hono + TypeScript                   │
│ http://localhost:3000                        │
│                                             │
│ Middleware:                                  │
│   • CORS (localhost:5173 en dev)            │
│   • Logger JSON (method, path, status, ms)  │
│                                             │
│ Módulos:                                    │
│   • autenticacion-qlik/ (OAuth + sesiones)  │
│   • flujos/ (dataflows Qlik)               │
│   • automatizaciones/ (CRUD + ejecución)    │
│   • destinos/ (bases de datos externas)     │
│                                             │
│ Infraestructura:                            │
│   • base-datos/ (Drizzle ORM + PostgreSQL)  │
│   • cifrado/ (AES-256-GCM tokens)          │
│   • qlik/ (ClienteQlik API REST)           │
│   • destinos-api/ (ClienteDestinos Impala)  │
└───────┬──────────────────┬──────────────────┘
        │                  │
        ▼                  ▼
 PostgreSQL             Qlik Cloud API
        │                  (OAuth Bearer)
        ▼
 API externa destinos
 (apiqd.andresgaibor.com)
```

## Tech Stack

| Capa | Tecnología |
|------|------------|
| Frontend | React 18, Vite, TanStack Router, TanStack Query, Tailwind CSS v4 |
| Backend | Hono, TypeScript, Drizzle ORM |
| Base de datos | PostgreSQL 17 |
| Autenticación | OAuth 2.0 Authorization Code + PKCE (Qlik Cloud) |
| Cifrado | AES-256-GCM (tokens OAuth en DB) |
| Desarrollo | Bun (runtime + test runner) |
| Linting | Biome |
| Containerización | Docker + Docker Compose |

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
# API DESTINOS
# ============================================
REMOTE_API_URL=https://apiqd.andresgaibor.com
REMOTE_API_KEY=tu_api_key_de_destinos
```

> **Nunca commitear `.env`** — está en `.gitignore`.

### 2. Generar clave de cifrado

```bash
openssl rand -base64 32
```

El resultado es exactamente 32 bytes codificados en base64 (44 caracteres). Copiar a `CIFRADO_CLAVE_PRINCIPAL` en `.env`.

> **Importante:** Esta clave se usa para cifrar/descifrar los tokens OAuth con AES-256-GCM. Si se pierde o cambia, todos los tokens almacenados quedan inutilizables y los usuarios deben re-autenticarse. Ver [Cifrado de tokens](#cifrado-de-tokens) para más detalles.

### 3. Configurar OAuth en Qlik Cloud

1. Ir a [Qlik Cloud Console](https://cloud.qlik.com)
2. Seleccionar el tenant
3. Ir a **Manage** > **OAuth**
4. Crear nueva OAuth App:
   - **Name:** Qlik Automate Creator
   - **Type:** Web Application
   - **Redirect URIs:** `http://localhost:3000/api/auth/qlik/callback`
   - **Consent:** Trusted (para evitar pantalla de consentimiento en desarrollo)
   - **Allowed grant types:** Authorization Code
   - **Allowed auth methods:** Client Secret (Basic o POST)
   - **Scopes:** (ver sección siguiente)
5. Copiar `Client ID` y `Client Secret` al `.env`

#### Scopes OAuth requeridos

El sistema utiliza los siguientes scopes para la autenticación y obtención de identidad del usuario:

| Scope | Propósito |
|-------|-----------|
| `user_default` | Acceso básico del usuario a APIs de Qlik |
| `offline_access` | Habilita refresh tokens para renovar sesiones sin re-autenticar |
| `identity.name:read` | Lee el nombre del usuario desde `/api/v1/users/me` |
| `identity.email:read` | Lee el correo electrónico del usuario |
| `identity.subject:read` | Lee el ID único del usuario (subject) |
| `identity.picture:read` | Lee el avatar del usuario |

> **Nota:** El scope `openid` **no es soportado** por Qlik Cloud y no debe incluirse.

**Scopes para copiar/pegar en Qlik Cloud:**

```
user_default offline_access identity.name:read identity.email:read identity.subject:read identity.picture:read
```

#### Orígenes permitidos (Allowed Origins)

```
http://localhost:5173
```

### 4. Levantar PostgreSQL

```bash
docker compose up -d
```

Verificar que está corriendo:

```bash
docker compose ps
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

Esto crea todas las tablas en PostgreSQL usando el esquema Drizzle.

### Levantar servicios

**Terminal 1 — Backend API:**

```bash
cd apps/api
bun run dev
```

**Terminal 2 — Frontend Web:**

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

### Comandos disponibles

| Comando | Descripción |
|---------|-------------|
| `bun run dev` | Iniciar frontend (Vite, hot reload) |
| `bun run dev:api` | Iniciar backend API (Bun, hot reload) |
| `bun test` | Ejecutar todos los tests (Bun test runner) |
| `bun run lint` | Verificar linting con Biome |
| `bun run lint:fix` | Auto-corregir linting con Biome |
| `bun run build` | Build del API para producción |

---

## Flujo OAuth — Autorización Code + PKCE

El sistema implementa OAuth 2.0 Authorization Code con PKCE (Proof Key for Code Exchange) para autenticación segura contra Qlik Cloud.

### Diagrama del flujo

```
Frontend              Backend API             Qlik Cloud
   │                      │                      │
   │ 1. Click "Login"     │                      │
   ├─────────────────────►│                      │
   │                      │                      │
   │                      │ 2. generarEstado()   │
   │                      │ 3. generarVerifier() │
   │                      │ 4. challenge=SHA256  │
   │                      │ 5. Guardar cookies:  │
   │                      │    oauth_estado      │
   │                      │    oauth_verifier    │
   │                      │                      │
   │  302 → Qlik Auth URL │                      │
   │◄─────────────────────┤                      │
   │─────────────────────────────────────────────►│
   │                      │                      │
   │                      │  302 callback?code=  │
   │                      │  &state=...          │
   │─────────────────────►│                      │
   │                      │                      │
   │                      │ 6. Verificar state   │
   │                      │ 7. POST /oauth/token │
   │                      │    + code_verifier   │
   │                      │─────────────────────►│
   │                      │                      │
   │                      │ 8. access_token      │
   │                      │    refresh_token     │
   │                      │◄─────────────────────│
   │                      │                      │
   │                      │ 9. GET /api/v1/      │
   │                      │    users/me          │
   │                      │─────────────────────►│
   │                      │                      │
   │                      │ 10. Usuario Qlik     │
   │                      │◄─────────────────────│
   │                      │                      │
   │                      │ 11. Crear/actualizar:│
   │                      │   - organizacion     │
   │                      │   - tenant           │
   │                      │   - usuario          │
   │                      │   - identidad Qlik   │
   │                      │   - membresia        │
   │                      │   - credenciales     │
   │                      │   - sesion           │
   │                      │                      │
   │  302 → frontend/     │  (cookie sesion)     │
   │◄─────────────────────┤                      │
```

### Detalles de implementación

**PKCE:**
- `code_verifier`: 64 bytes aleatorios, codificados en base64url
- `code_challenge`: SHA-256 del verifier, codificado en base64url
- Método: `S256` (no se usa `plain`)

---

## Referencias Qlik Automate

- [API REST de Qlik Automate](docs/qlik-automate-api.md)
- [Guía OAuth Qlik](docs/oauth-qlik.md)

**Cookies de estado (httpOnly):**
- `oauth_estado`: state parameter, TTL 600s
- `oauth_verifier`: PKCE code_verifier, TTL 600s
- En producción: `secure: true`, `sameSite: "Lax"`

**Mapeo de tokens (snake_case Qlik → camelCase interno):**

| Qlik (snake_case) | Interno (camelCase) |
|--------------------|---------------------|
| `access_token` | `accessToken` |
| `refresh_token` | `refreshToken` |
| `expires_in` | `expiresIn` |
| `scope` | `scope` |

### Callback y manejo de errores

El callback (`/api/auth/qlik/callback`) maneja errores de forma que el usuario vea información útil:

1. **State inválido** → JSON 400 con `"OAuth state inválido"`
2. **Error 401 en `/api/v1/users/me`** → Redirige a `/login?oauth_error=identity_scope_error` (falta scope de identidad)
3. **Cualquier otro error** → Redirige a `/login?oauth_error=login_failed`

El frontend (`PaginaLogin`) lee `oauth_error` de la URL, lo mapea a un mensaje seguro usando un allowlist (`MENSAJES_PERMITIDOS`), muestra un toast, y limpia el query param del URL.

### Organización / Tenant / Membresía

El callback crea automáticamente la siguiente estructura en la base de datos:

```
organizacion (auto-creada por host del tenant)
  └── tenant_qlik (host = l676lvg3emfvcq2.us.qlikcloud.com)
        └── identidad_qlik (usuarioIdQlik = id de Qlik)
              └── credenciales_qlik (tokens cifrados, scopes)
  
usuario (por email)
  └── membresia_organizacion (rol: "usuario")

sesion_usuario (token hash SHA-256, expira 7 días)
```

- Si el tenant ya existe, se reutiliza la organización existente.
- Si el usuario ya existe (por correo), se actualiza nombre/avatar/último acceso.
- La membresía usuario-organización se crea una sola vez (sin duplicar).

---

## Cifrado de tokens

Los tokens OAuth (access y refresh) se almacenan cifrados en la tabla `credenciales_qlik` usando **AES-256-GCM**.

### Generación de la clave

```bash
openssl rand -base64 32
# Ejemplo de salida (NO usar este valor):
# k8J3z7X2mN9pQ4vR6tY1wB5cD0eF8gH2iJ4kL6mO0
```

La clave debe ser exactamente **32 bytes** codificados en base64 (44 caracteres ASCII).

### Almacenamiento en DB

Cada token se almacena como un JSON con tres campos:

```json
{
  "cifrado": "base64 del texto cifrado",
  "iv": "base64 del initialization vector (16 bytes)",
  "tag": "base64 del auth tag (16 bytes)"
}
```

### Regenerar la clave

Si se cambia `CIFRADO_CLAVE_PRINCIPAL`:
1. Todos los tokens cifrados con la clave anterior quedan inutilizables
2. Los usuarios afectados deben cerrar sesión y re-autenticarse
3. No hay pérdida de datos (solo tokens de sesión)

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
    ├── configuraciones_automatizacion
    │       └── programaciones_automatizacion
    │
    └── auditoria_eventos
```

### Tablas principales

| Tabla | Descripción | Estado/Checks |
|-------|-------------|---------------|
| `organizaciones` | Organizaciones del sistema | `activa`, `suspendida` |
| `usuarios` | Usuarios del sistema | `activo`, `suspendido` |
| `membresias_organizacion` | Relación usuario↔organización | Roles: `administrador`, `editor`, `usuario`, `auditor` |
| `tenants_qlik` | Tenants de Qlik conectados | `activo`, `desconectado`, `suspendido` |
| `identidades_qlik` | Identidad del usuario en Qlik | Única por (tenant, usuarioIdQlik) |
| `credenciales_qlik` | Tokens OAuth cifrados | `activa`, `expirada`, `revocada`, `requiere_reconexion` |
| `sesiones_usuario` | Sesiones httpOnly (hash SHA-256) | TTL 7 días, indexada por usuario y expiración |
| `intentos_oauth_qlik` | Intentos OAuth pendientes | PKCE verifier cifrado, TTL configurable |
| `configuraciones_automatizacion` | Configs de automatizaciones | `pendiente`, `creando`, `activa`, `error`, `desactivada`, `eliminada` |
| `programaciones_automatizacion` | Programación de ejecuciones | `manual`, `intervalo`, `cron`, `qlik` |
| `auditoria_eventos` | Log de eventos | `exito`, `error`, `denegado` |
| `espacios_qlik_cache` | Cache de espacios Qlik | Soft delete |
| `flujos_qlik_cache` | Cache de dataflows Qlik | Soft delete |
| `automatizaciones_qlik_cache` | Cache de automatizaciones Qlik | Soft delete |
| `destinos_cache` | Cache de destinos externos | Por organización + proveedor |

### Migraciones

```bash
# Generar migraciones desde el esquema
cd apps/api
bun drizzle-kit generate

# Aplicar migraciones
bun drizzle-kit migrate

# Push directo del esquema (desarrollo)
bun drizzle-kit push
```

---

## API Endpoints

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/auth/qlik/iniciar` | Inicia flujo OAuth (genera state + PKCE, redirige a Qlik) |
| GET | `/api/auth/qlik/callback` | Callback de Qlik (intercambia código por tokens, crea sesión) |
| GET | `/api/auth/qlik/sesion` | Verificar sesión activa (requiere cookie `sesion_usuario`) |
| POST | `/api/auth/qlik/cerrar-sesion` | Cerrar sesión (revoca cookie y registro en DB) |

### Flujos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/flujos` | Listar dataflows de Qlik (requiere sesión) |

### Automatizaciones

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/automatizaciones` | Listar configuraciones (requiere sesión) |
| POST | `/api/automatizaciones` | Crear configuración + automatización en Qlik |
| GET | `/api/automatizaciones/:id` | Ver configuración |
| POST | `/api/automatizaciones/:id/ejecutar` | Ejecutar automatización en Qlik |

### Destinos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/destinos/bases-datos` | Listar bases de datos (Impala) |
| GET | `/api/destinos/bases-datos/:database/tablas` | Listar tablas de una base de datos |
| GET | `/api/destinos/bases-datos/:database/tablas/:tabla/columnas` | Listar columnas de una tabla |
| GET | `/api/destinos/dataflows` | Listar dataflows del API de destinos |

### Salud

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/salud` | Health check (siempre 200 si el servidor está activo) |

---

## Logs y seguridad

### Logger middleware

Cada request se registra como JSON estructurado en `stdout`:

```json
{
  "method": "GET",
  "path": "/api/auth/qlik/sesion",
  "status": 200,
  "durationMs": 45
}
```

**Propiedades de seguridad del logger:**
- El `path` nunca incluye query strings (se extrae antes del log)
- No se loguean cookies, tokens, secrets ni headers sensibles
- Los errores OAuth se sanitizan antes de loguear

### Sanitización de errores

Los errores en el flujo OAuth pasan por un pipeline de sanitización:

1. **Tokens**: `AccessToken...` → `[TOKEN]`
2. **Códigos OAuth**: `code=abc123...` → `code=[CODIGO]`
3. **Verifiers**: `code_verifier=xyz...` → `code_verifier=[VERIFIER]`
4. **Secrets**: `client_secret=...` → `client_secret=[SECRET]`
5. **HTML**: Cualquier tag HTML se elimina
6. **Truncado**: Mensajes se limitan a 200 caracteres

### Cómo leer los logs

```bash
# Ver logs del API en desarrollo
cd apps/api && bun run dev

# Buscar errores OAuth
grep "OAuth error" logs.txt

# Buscar eventos de sesión
grep "OAuth sesión" logs.txt

# Ver tiempos de respuesta lentos (>1s)
grep '"durationMs"' logs.txt | jq 'select(.durationMs > 1000)'
```

---

## Troubleshooting

### 401 en `/api/auth/qlik/sesion`

**Causa:** No hay sesión válida o la cookie expiró.

**Solución:**
1. Verificar que el navegador acepta cookies (no modo incógnito estricto)
2. Hacer clic en "Iniciar sesión con Qlik" para autenticarse nuevamente
3. Si persiste, verificar los logs del API para errores en la DB

### 401 en endpoints de flujos/automatizaciones

**Causa:** La sesión existe pero no se puede derivar el tenant.

**Solución:**
1. Cerrar sesión y volver a autenticarse
2. Verificar que `identidades_qlik` tiene un registro para el usuario y tenant actual

### Error de cifrado / descifrado

**Causa:** `CIFRADO_CLAVE_PRINCIPAL` no coincide con la usada al cifrar los tokens.

**Solución:**
1. Verificar que `CIFRADO_CLAVE_PRINCIPAL` en `.env` es exactamente 44 caracteres (32 bytes en base64)
2. Si se cambió la clave, los usuarios deben cerrar sesión y re-autenticarse
3. Regenerar con: `openssl rand -base64 32`

### `organizacion_id` no encontrado

**Causa:** La membresía usuario-organización no se creó durante el callback.

**Solución:**
1. Cerrar sesión completamente
2. Autenticarse de nuevo (el callback recrea la membresía)
3. Verificar logs del API durante el callback

### HMR (Hot Module Replacement) no funciona

**Causa:** Configuración de Vite o cache corrupta.

**Solución:**
1. Detener ambos servidores
2. Limpiar cache: `rm -rf apps/web/node_modules/.vite`
3. Reiniciar: `bun run dev` (frontend) y `bun run dev:api` (backend)

### Tests fallan

**Causa:** Tests de DB requieren mocks o conexión real.

**Solución:**
```bash
# Ejecutar tests del API (usa mocks internos)
cd apps/api && bun test

# Ejecutar tests del frontend
cd apps/web && bun run test:run

# Ejecutar todos los tests
bun test
```

### Error "invalid client" en OAuth

**Causa:** `QLIK_CLIENT_ID` o `QLIK_CLIENT_SECRET` incorrectos.

**Solución:**
1. Verificar valores en `.env` contra Qlik Cloud Console
2. Verificar que el Redirect URI en Qlik Cloud coincide exactamente: `http://localhost:3000/api/auth/qlik/callback`
3. Verificar que la OAuth App está en estado activo

### Error `identity_scope_error` al autenticar

**Causa:** Faltan los scopes de identidad en la OAuth App de Qlik.

**Solución:**
1. Verificar que la OAuth App tiene los scopes: `identity.name:read identity.email:read identity.subject:read identity.picture:read`
2. Verificar que el scope `openid` **no** está incluido (Qlik no lo soporta)
3. Guardar cambios en Qlik Cloud Console y re-intentar

### La API no responde

```bash
# Verificar que el servidor está corriendo
lsof -i :3000

# Verificar PostgreSQL
docker compose ps

# Ver logs del contenedor
docker compose logs base_datos --tail=20
```

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

## Limpiar

Para eliminar todo el estado local:

```bash
# Detener containers
docker compose down

# Eliminar volúmenes (borra datos)
docker compose down -v

# Reiniciar desde cero
docker compose up -d
cd apps/api && bun drizzle-kit push
```
