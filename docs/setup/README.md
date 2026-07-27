# Setup Wizard — 100% Interfaz, Cero Configuración Manual

## Resumen

Qlik Automate Creator **no requiere ninguna configuración en archivos `.env`** para funcionar. Toda la configuración de negocio se realiza vía interfaz de usuario después del primer arranque.

---

## Variables de entorno requeridas (solo infraestructura)

| Variable | Valor | Propósito |
|---|---|---|
| `DATABASE_URL` | `postgres://user:pass@host:5432/db` | Conexión a PostgreSQL |
| `FRONTEND_URL` | `http://localhost:8080` | Configuración CORS (solo en desarrollo) |

### Docker Compose — configuración mínima

```yaml
# compose.yaml
services:
  postgres:
    image: postgres:17-alpine
    environment:
      POSTGRES_DB: qlik_automatizaciones
      POSTGRES_USER: ${POSTGRES_USER:-qlik_app}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-contraseña_segura}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U qlik_app -d qlik_automatizaciones"]
      interval: 10s
      retries: 5

  api:
    build: .
    restart: unless-stopped
    environment:
      NODE_ENV: production
      PORT: 3000
      DATABASE_URL: ${DATABASE_URL}
      FRONTEND_URL: ${FRONTEND_URL:-http://localhost:8080}
    ports:
      - "127.0.0.1:3000:3000"
    depends_on:
      postgres:
        condition: service_healthy

  web:
    build: .
    restart: unless-stopped
    depends_on:
      api:
        condition: service_healthy
    ports:
      - "127.0.0.1:8080:80"

volumes:
  postgres_data:
```

### Arrancar

```bash
docker compose up -d postgres
docker compose run --rm api
# o en segundo plano:
docker compose up -d
```

La API arranca en `http://localhost:3000`. La UI en `http://localhost:8080`.

---

## Wizard de Configuración Inicial

Al acceder a la aplicación por primera vez, el sistema detecta que no hay configuración y redirige automáticamente a `/setup`.

### Paso 1 — Organización

- **Nombre de la organización**: nombre libre para identificar tu empresa u organización.

### Paso 2 — Conexión Qlik Cloud

- **Dirección del Tenant Qlik Cloud**: host de tu tenant, ej. `miempresa.us.qlikcloud.com`
- **Client ID de OAuth**: identificador de tu aplicación OAuth registrada en Qlik Cloud
- **Client Secret de OAuth**: secreto de tu aplicación OAuth
- **Scopes**: lista editable de permisos OAuth (marcados por defecto con los scopes estándar para automatizaciones — puedes desmarcar los que no necesites)
- **URI de redirección OAuth**: URL que debes configurar en tu aplicación OAuth de Qlik Cloud

### Paso 3 — Superadministrador

- **Nombre completo**: nombre del administrador principal
- **Correo electrónico**: email del superadministrador (debe coincidir con el email configurado en el cliente OAuth de Qlik Cloud)

---

## Todo lo que se configura desde la UI

| Configuración | Ubicación |
|---|---|
| Organización y tenant inicial | `/setup` |
| Client ID / Client Secret OAuth | `/setup` |
| Scopes OAuth editables | `/setup` |
| URI de redirección OAuth | `/setup` (calculada automáticamente) |
| `CIFRADO_CLAVE_PRINCIPAL` | **Auto-generada** al primer inicio |
| Superadministradores adicionales | `/admin/superadmins` |
| Destinos, tenants, automatizaciones | Sus páginas respectivas |

---

## Gestión de Superadministradores

Accede a `/admin/superadmins` para:

- **Ver** la lista de todos los superadministradores
- **Agregar** nuevos superadministradores (nombre + correo)
- **Eliminar** superadministradores existentes

Reglas de negocio:
- No puedes eliminarte a ti mismo si eres el último superadministrador
- Si el correo ingresado ya existe como usuario, se promueve a superadministrador

---

## Arquitectura de seguridad

- `CIFRADO_CLAVE_PRINCIPAL` se genera automáticamente en el primer arranque (32 bytes, codificada en Base64) y se persiste en la tabla `app_config` de la base de datos
- Los secretos OAuth se cifran con AES-256-GCM antes de almacenarse
- Los tokens de acceso Qlik se cifran con la misma clave

---

## Flujo completo

```
1. docker compose up
2. Navegar a http://localhost:8080
3. → Redirige automáticamente a /setup
4. Completar wizard (3 pasos)
5. → Redirige a /login
6. Iniciar sesión con OAuth de Qlik
7. → Accede a la aplicación
```
