# OAuth 2.0 con Qlik Cloud — Guía Completa

Guía detallada de la implementación OAuth 2.0 Authorization Code + PKCE para autenticación contra Qlik Cloud.

---

## Índice

1. [Visión general](#visión-general)
2. [Configuración en Qlik Cloud Console](#configuración-en-qlik-cloud-console)
3. [Variables de entorno](#variables-de-entorno)
4. [Flujo paso a paso](#flujo-paso-a-paso)
5. [Scopes](#scopes)
6. [Mapeo de tokens](#mapeo-de-tokens)
7. [Cifrado de tokens](#cifrado-de-tokens)
8. [Sesiones de usuario](#sesiones-de-usuario)
9. [Estructura de base de datos](#estructura-de-base-de-datos)
10. [Errores y troubleshooting](#errores-y-troubleshooting)
11. [Seguridad](#seguridad)

---

## Visión general

El sistema autentica usuarios contra Qlik Cloud usando **OAuth 2.0 Authorization Code Flow con PKCE**. Esto permite:

- Autenticación segura sin exponer secrets en el frontend
- Obtención de identidad del usuario (nombre, email, avatar)
- Tokens de larga duración (refresh tokens) para llamadas API persistentes
- Cifrado de tokens en base de datos con AES-256-GCM

```
Frontend                  Backend                     Qlik Cloud
   │                         │                           │
   │  GET /api/auth/qlik/    │                           │
   │       iniciar           │                           │
   ├────────────────────────►│                           │
   │                         │  Generar state + PKCE     │
   │                         │  Guardar en cookies       │
   │  302 → Qlik Auth URL    │                           │
   │◄────────────────────────┤                           │
   │───────────────────────────────────────────────────►│
   │                         │                           │
   │  302 callback?code=...  │                           │
   │────────────────────────►│                           │
   │                         │  POST /oauth/token        │
   │                         │──────────────────────────►│
   │                         │  { access_token, ... }    │
   │                         │◄──────────────────────────│
   │                         │  GET /api/v1/users/me     │
   │                         │──────────────────────────►│
   │                         │  { id, name, email }      │
   │                         │◄──────────────────────────│
   │                         │  Guardar en DB            │
   │  302 → frontend/        │  (cookie sesion)          │
   │◄────────────────────────┤                           │
```

---

## Configuración en Qlik Cloud Console

### Crear OAuth App

1. Ir a [Qlik Cloud Console](https://cloud.qlik.com)
2. Seleccionar tu tenant
3. Ir a **Manage** > **OAuth**
4. Hacer clic en **Create new OAuth app**

### Configuración requerida

| Campo | Valor |
|-------|-------|
| **Name** | Qlik Automate Creator |
| **Type** | Web Application |
| **Redirect URIs** | `http://localhost:3000/api/auth/qlik/callback` |
| **Consent** | Trusted |
| **Allowed grant types** | Authorization Code |
| **Allowed auth methods** | Client Secret (Basic o POST) |

### Scopes

Copiar y pegar en el campo de scopes:

```
user_default offline_access identity.name:read identity.email:read identity.subject:read identity.picture:read
```

> **IMPORTANTE:** No incluir `openid` — Qlik Cloud no lo soporta y rechazará la petición.

### Allowed Origins

```
http://localhost:5173
```

### Obtener credenciales

Después de crear la app, copiar:
- **Client ID** → `QLIK_CLIENT_ID` en `.env`
- **Client Secret** → `QLIK_CLIENT_SECRET` en `.env`

---

## Variables de entorno

```env
# OAuth Qlik Cloud
QLIK_CLIENT_ID=tu_client_id          # De Qlik Cloud Console
QLIK_CLIENT_SECRET=tu_client_secret   # De Qlik Cloud Console
QLIK_REDIRECT_URI=http://localhost:3000/api/auth/qlik/callback

# Cifrado de tokens
CIFRADO_CLAVE_PRINCIPAL=...           # openssl rand -base64 32

# Frontend URL (para redirects post-login)
FRONTEND_URL=http://localhost:5173    # Opcional, default: http://localhost:5173
```

### Generar `CIFRADO_CLAVE_PRINCIPAL`

```bash
openssl rand -base64 32
```

Resultado: 44 caracteres (32 bytes en base64). Ejemplo:

```
k8J3z7X2mN9pQ4vR6tY1wB5cD0eF8gH2iJ4kL6mO0=
```

> **Nunca usar** el valor de ejemplo. Generar uno propio.

---

## Flujo paso a paso

### 1. Inicio de sesión (`GET /api/auth/qlik/iniciar`)

1. Backend genera `state` (32 bytes hex aleatorios)
2. Backend genera `code_verifier` (64 bytes base64url)
3. Backend calcula `code_challenge` = `BASE64URL(SHA256(code_verifier))`
4. Backend guarda `state` y `code_verifier` en cookies httpOnly (TTL 600s)
5. Backend redirige a:

```
https://{host}/oauth/authorize
  ?response_type=code
  &client_id={QLIK_CLIENT_ID}
  &redirect_uri={QLIK_REDIRECT_URI}
  &state={state}
  &code_challenge={challenge}
  &code_challenge_method=S256
  &scope=user_default offline_access identity.name:read identity.email:read identity.subject:read identity.picture:read
```

### 2. Autenticación en Qlik

El usuario se autentica en Qlik Cloud. Si la OAuth App tiene consent "Trusted", no se muestra pantalla de consentimiento.

### 3. Callback (`GET /api/auth/qlik/callback`)

Qlik redirige a:

```
http://localhost:3000/api/auth/qlik/callback?code={authorization_code}&state={state}
```

El backend:

1. **Valida state**: compara con cookie `oauth_estado`
2. **Elimina cookies** de estado y verifier
3. **Intercambia código por tokens**: `POST /oauth/token` con `grant_type=authorization_code`
4. **Obtiene identidad**: `GET /api/v1/users/me` con el access token
5. **Persiste en DB**: crea/actualiza organización, tenant, usuario, identidad, credenciales, membresía y sesión
6. **Redirige a frontend**: `http://localhost:5173/` con cookie `sesion_usuario` (httpOnly, 7 días)

### 4. Sesión verificada

El frontend verifica la sesión llamando `GET /api/auth/qlik/sesion`. Si la cookie `sesion_usuario` es válida y no expirada, retorna los datos del usuario.

---

## Scopes

### Scopes implementados

| Scope | API Qlik que habilita | Descripción |
|-------|----------------------|-------------|
| `user_default` | Todas las APIs | Acceso básico del usuario |
| `offline_access` | Token endpoint | Habilita refresh tokens |
| `identity.name:read` | `/api/v1/users/me` | Nombre del usuario |
| `identity.email:read` | `/api/v1/users/me` | Correo electrónico |
| `identity.subject:read` | `/api/v1/users/me` | ID único (subject) |
| `identity.picture:read` | `/api/v1/users/me` | URL del avatar |

### Scopes NO soportados

| Scope | Motivo |
|-------|--------|
| `openid` | Qlik Cloud no implementa OIDC estándar |

### Scopes opcionales (no implementados actualmente)

Si en el futuro se necesitan automatizaciones o gestión de espacios:

| Scope | Propósito |
|-------|-----------|
| `automations` | Leer/escribir automatizaciones |
| `automations.private` | Automatizaciones en espacio personal |
| `automations.shared` | Automatizaciones en espacios compartidos |
| `spaces.data` | Espacios de datos |
| `spaces.shared` | Espacios compartidos |
| `spaces.managed` | Espacios administrados |
| `data-connections` | Conexiones de datos |
| `apps` | Leer apps (dataflows) |

---

## Mapeo de tokens

Qlik Cloud retorna tokens en formato **snake_case**. El cliente OAuth los convierte a **camelCase** internamente:

| Qlik Cloud (snake_case) | Cliente interno (camelCase) | Tipo |
|--------------------------|----------------------------|------|
| `access_token` | `accessToken` | `string` |
| `refresh_token` | `refreshToken` | `string \| undefined` |
| `expires_in` | `expiresIn` | `number` (segundos) |
| `scope` | `scope` | `string` (espacios separados) |

### Ejemplo de respuesta de Qlik

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIs...",
  "refresh_token": "dGhpcyBpcyBhIHJlZnJlc2g...",
  "expires_in": 3600,
  "scope": "user_default offline_access identity.name:read"
}
```

### Validaciones

El cliente valida que:
- `access_token` esté presente y sea string
- `expires_in` esté presente y sea number
- Si falta `scope`, usa string vacío `""`

---

## Cifrado de tokens

### Algoritmo

**AES-256-GCM** (Authenticated Encryption with Associated Data)

- **Clave**: 256 bits (32 bytes), derivada de `CIFRADO_CLAVE_PRINCIPAL`
- **IV**: 16 bytes aleatorios por cada operación de cifrado
- **Tag**: 16 bytes de autenticación (integridad)

### Almacén en DB

Cada token se almacena como JSON en columnas `token_acceso_cifrado` y `token_refresco_cifrado`:

```json
{
  "cifrado": "base64 del texto cifrado",
  "iv": "base64 del initialization vector",
  "tag": "base64 del authentication tag"
}
```

### Flujo de cifrado

```
Token en texto plano (access_token de Qlik)
        │
        ▼
servicioCifrado.cifrar(token)
        │
        ├── iv = randomBytes(16)
        ├── cipher = createCipheriv('aes-256-gcm', clave, iv)
        ├── cifrado = cipher.update(token) + cipher.final()
        └── tag = cipher.getAuthTag()
        │
        ▼
{ cifrado, iv, tag } → JSON.stringify → DB
```

### Flujo de descifrado

```
DB → JSON.parse → { cifrado, iv, tag }
        │
        ▼
servicioCifrado.descifrar(cifrado, iv, tag)
        │
        ├── decipher = createDecipheriv('aes-256-gcm', clave, Buffer.from(iv))
        ├── decipher.setAuthTag(Buffer.from(tag))
        └── texto = decipher.update(cifrado) + decipher.final()
        │
        ▼
Token en texto plano (listo para usar en API)
```

### Regeneración de clave

Si se cambia `CIFRADO_CLAVE_PRINCIPAL`:

1. Todos los tokens cifrados con la clave anterior quedan inutilizables
2. El descifrado fallará con error de autenticación (GCM tag mismatch)
3. Los usuarios afectados deben cerrar sesión y re-autenticarse
4. No hay pérdida de datos estructurales (solo tokens de sesión)

---

## Sesiones de usuario

### Creación de sesión

Después del callback exitoso:

1. Se genera un token aleatorio: `crypto.randomBytes(32).toString("hex")`
2. Se calcula su hash SHA-256: `SHA256(token)`
3. Se almacena solo el **hash** en `sesiones_usuario` (nunca el token en claro)
4. El token se envía al frontend como cookie `sesion_usuario`

### Cookie de sesión

| Propiedad | Valor |
|-----------|-------|
| Nombre | `sesion_usuario` |
| HttpOnly | `true` |
| Secure | `true` en producción |
| SameSite | `Lax` |
| MaxAge | 7 días (604800 segundos) |
| Path | `/` |

### Verificación de sesión

El endpoint `GET /api/auth/qlik/sesion`:

1. Lee la cookie `sesion_usuario`
2. Calcula SHA-256 del token
3. Busca en `sesiones_usuario`:
   - `token_sesion_hash` = hash calculado
   - `expira_en` > NOW()
   - `revocada_en` IS NULL
4. Si es válida, retorna datos del usuario e identidad Qlik
5. Si no, retorna 401 y elimina la cookie

### Cierre de sesión

El endpoint `POST /api/auth/qlik/cerrar-sesion`:

1. Calcula hash del token de la cookie
2. Marca la sesión como revocada (`revocada_en = NOW()`)
3. Elimina la cookie

### Cómo derivar el tenant

El middleware `obtenerTenantDesdeSesion()` resuelve:

```
sesion_usuario → identidad_qlik → tenants_qlik → { tenantId, tenantHost }
```

Este `tenantHost` se usa para construir las URLs de la API de Qlik Cloud.

---

## Estructura de base de datos

### Diagrama de entidades

```
┌──────────────────┐     ┌──────────────────────────┐
│  organizaciones  │────<│  membresias_organizacion  │
│                  │     │                          │
│  id (uuid, PK)  │     │  organizacion_id (FK)    │
│  nombre          │     │  usuario_id (FK)         │
│  estado          │     │  rol                     │
└────────┬─────────┘     └────────────┬─────────────┘
         │                            │
         │                            ▼
         │                   ┌──────────────────┐
         │                   │    usuarios      │
         │                   │                  │
         │                   │  id (uuid, PK)  │
         │                   │  nombre          │
         │                   │  correo          │
         │                   │  avatar_url      │
         │                   │  estado          │
         │                   │  ultimo_acceso   │
         │                   └────────┬─────────┘
         │                            │
         ▼                            │
┌──────────────────┐                  │
│  tenants_qlik    │                  │
│                  │                  │
│  id (uuid, PK)  │                  │
│  organizacion_id │                  │
│  tenant_id_qlik  │                  │
│  host            │                  │
└────────┬─────────┘                  │
         │                            │
         ▼                            │
┌──────────────────┐                  │
│ identidades_qlik │◄─────────────────┘
│                  │
│  id (uuid, PK)  │
│  usuario_id (FK) │
│  tenant_qlik_id  │
│  usuario_id_qlik │
│  nombre_qlik     │
│  correo_qlik     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐    ┌──────────────────────────┐
│ credenciales_qlik│    │   sesiones_usuario       │
│                  │    │                          │
│  id (uuid, PK)  │    │  id (uuid, PK)           │
│  identidad_qlik  │    │  usuario_id (FK)         │
│  token_acceso_   │    │  identidad_qlik_id (FK)  │
│    cifrado       │    │  token_sesion_hash       │
│  token_refresco_ │    │  expira_en               │
│    cifrado       │    │  revocada_en             │
│  scopes          │    └──────────────────────────┘
│  token_expira_en │
│  version         │
└──────────────────┘
```

### Flujo de datos durante el callback

```
1. Buscar tenant por host
   └─ Si no existe → crear organización + tenant

2. Crear/actualizar usuario por email
   └─ Si nuevo → INSERT; Si existe → UPDATE nombre, avatar, ultimo_acceso

3. Crear/actualizar identidad Qlik
   └─ Por (tenantQlikId, usuarioIdQlik)
   └─ Si nuevo → INSERT; Si existe → UPDATE nombre, correo, avatar, sincronizado_en

4. Crear membresía usuario-organización
   └─ Solo si no existe (sin duplicar)

5. Crear/actualizar credenciales Qlik
   └─ Tokens cifrados con AES-256-GCM
   └─ Si existe → UPDATE tokens + incrementar version

6. Crear sesión
   └─ Token aleatorio → SHA-256 → almacenar hash
   └─ Cookie httpOnly al frontend
```

---

## Errores y troubleshooting

### Errores del flujo OAuth

| Error | Causa | Solución |
|-------|-------|----------|
| `OAuth state inválido` | Cookie de estado no coincide | Re-intentar login (las cookies expiran en 600s) |
| `identity_scope_error` | Falta scope de identidad | Agregar scopes `identity.*:read` en Qlik Cloud Console |
| `login_failed` | Error genérico en callback | Ver logs del API para detalles |
| `Token exchange: access_token ausente` | Qlik no retornó access_token | Verificar client_id/client_secret |
| `Token exchange: expires_in ausente` | Qlik no retornó expires_in | Verificar configuración de la OAuth App |

### Errores de sesión

| Error | HTTP | Causa | Solución |
|-------|------|-------|----------|
| `No hay sesión` | 401 | Cookie no enviada | Verificar que el navegador acepta cookies |
| `Sesión inválida o expirada` | 401 | Hash no encontrado o expirada | Re-autenticarse |

### Errores de cifrado

| Error | Causa | Solución |
|-------|-------|----------|
| `La clave debe ser 32 bytes en base64` | `CIFRADO_CLAVE_PRINCIPAL` tiene longitud incorrecta | Regenerar con `openssl rand -base64 32` |
| `Unsupported state or unable to authenticate` (GCM) | Clave de cifrado cambió | Re-autenticarse (tokens con clave anterior son inutilizables) |

### Errores de API Qlik

| Error | Causa | Solución |
|-------|-------|----------|
| `Qlik API error: 401 Unauthorized` | Token expirado o inválido | Re-autenticarse (el refresh token debería renovarlo) |
| `Qlik API error: 403 Forbidden` | Scope insuficiente | Verificar scopes en Qlik Cloud Console |
| `Qlik API error: 404 Not Found` | Endpoint o recurso no existe | Verificar la URL del tenant |

---

## Seguridad

### Cookies

| Cookie | HttpOnly | Secure | SameSite | TTL | Propósito |
|--------|----------|--------|----------|-----|-----------|
| `sesion_usuario` | ✅ | ✅ (prod) | Lax | 7 días | Token de sesión (SHA-256) |
| `oauth_estado` | ✅ | ✅ (prod) | Lax | 600s | State parameter OAuth |
| `oauth_verifier` | ✅ | ✅ (prod) | Lax | 600s | PKCE code_verifier |

### Protecciones implementadas

1. **PKCE**: Previene ataques de intercepción del código de autorización
2. **State parameter**: Previene CSRF en el flujo OAuth
3. **Cookies httpOnly**: Tokens no accesibles via JavaScript (XSS)
4. **Cifrado AES-256-GCM**: Tokens cifrados en DB con autenticación de integridad
5. **Hash SHA-256 de sesiones**: El token de sesión nunca se almacena en claro
6. **Sanitización de logs**: Tokens, secrets, codes y verifiers se reemplazan por marcadores
7. **Truncado de errores**: Mensajes de error limitados a 200 caracteres
8. **Eliminación de HTML**: Tags HTML se eliminan de mensajes de error
9. **CORS restrictivo**: Solo permite origen del frontend en desarrollo
10. **Membresía por defecto**: Usuarios nuevos reciben rol `usuario` (no admin)

### Qué NO se loguea

- Tokens de acceso o refresh
- Client secrets
- Code verifiers
- Cookies completas
- Query strings en URLs de request
- Headers de autenticación
- HTML de respuestas de error

### Qué SÍ se loguea (sanitizado)

- Método, path (sin query), status, duración
- Etapa del error OAuth (token, users/me, callback)
- Status code de respuestas externas
- Mensajes de error sanitizados (sin tokens/secrets)
