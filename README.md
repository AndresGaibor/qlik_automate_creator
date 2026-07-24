# Qlik Automate Creator

Aplicación web para consultar, ejecutar y crear automatizaciones de Qlik a partir de una automatización base. El backend conserva los tokens OAuth en PostgreSQL cifrados y expone una API de negocio en español, además de un proxy validado para las operaciones administrativas de Qlik Automate.

## Arquitectura

El backend es un **monolito modular con Clean Architecture, arquitectura hexagonal y DDD**:

```text
apps/api/src/
├── app.ts                    # único composition root
├── entradas/                 # Bun, Node y Cloudflare Worker
├── plataforma/               # HTTP, configuración, errores, contexto, logs y persistencia
├── nucleo/                   # auditoría, eventos, idempotencia, tiempo y valores
└── modulos/
    ├── autenticacion-qlik/
    ├── automatizaciones/
    ├── destinos/
    ├── flujos/
    └── qlik/

packages/contratos/src/       # Zod y DTO compartidos con React
apps/web/src/
├── app/
├── compartido/
└── modulos/                  # frontend feature-based
```

Cada módulo del backend contiene `dominio`, `aplicacion`, `aplicacion/puertos`, `infraestructura`, `http` y `publico.ts`. Las dependencias se dirigen hacia el dominio y `app.ts` es el único lugar donde se construyen adaptadores concretos.

Más detalle:

- [Decisiones y reglas de arquitectura](docs/arquitectura/README.md)
- [Matriz de rutas Qlik](docs/arquitectura/rutas-qlik.md)
- [Puesta en marcha](docs/desarrollo/puesta-en-marcha.md)

## Superficies HTTP

### API estable para el frontend

```text
GET  /api/automatizaciones
GET  /api/automatizaciones/espacios
POST /api/automatizaciones/desde-plantilla
GET  /api/automatizaciones/:id
POST /api/automatizaciones/:id/ejecuciones
POST /api/automatizaciones/:id/ejecuciones/:ejecucionId/detener

GET  /api/flujos
GET  /api/destinos/bases-datos
GET  /api/destinos/bases-datos/:baseDatos/tablas
GET  /api/destinos/bases-datos/:baseDatos/tablas/:tabla/columnas
GET  /api/destinos/flujos-datos
```

Las respuestas de negocio usan el contrato común:

```json
{
  "exito": true,
  "datos": {}
}
```

### Proxy Qlik

El prefijo `/api/qlik` replica, valida y reenvía las APIs relacionadas con:

- Automations: 21 endpoints.
- Automation Connections: 8 endpoints.
- Automation Connectors: 2 endpoints.
- Spaces: 17 endpoints.
- Users: 9 endpoints.

En respuestas exitosas, el proxy conserva el código HTTP, cuerpo y encabezados relevantes de Qlik. Los errores pasan por el manejador central y se normalizan con el contrato común. El bearer token nunca llega desde el navegador: se obtiene de la sesión OAuth cifrada.

## Creación desde una automatización base

`POST /api/automatizaciones/desde-plantilla` ejecuta:

```text
copiar automatización
→ cambiar espacio opcional
→ obtener y reemplazar rutas JSON Pointer existentes en workspace
→ actualizar la definición completa
→ cambiar propietario opcional (al final)
→ auditoría + outbox + idempotencia
```

Ejemplo:

```json
{
  "nombre": "Creación de carpetas - Empresa A",
  "plantillaIdQlik": "ID_AUTOMATIZACION_BASE",
  "espacioIdQlik": "ID_ESPACIO_DESTINO",
  "reemplazosWorkspace": [
    {
      "ruta": "/blocks/0/settings/table",
      "valor": "carpetas_empresa_a"
    }
  ]
}
```

También acepta `Idempotency-Key`. Si una etapa posterior a la copia falla, el caso de uso intenta eliminar la copia incompleta.

## Tecnologías

- React 18, Vite, TanStack Router y TanStack Query.
- Hono con entrypoints para Bun, Node y Cloudflare Worker.
- PostgreSQL y Drizzle ORM.
- OAuth 2.0 Authorization Code + PKCE.
- AES-256-GCM para tokens OAuth.
- Zod para contratos y validación.
- Outbox, auditoría e idempotencia persistentes.

## Inicio local

```bash
cp .env.example .env
bun install
docker compose up -d
bun --cwd apps/api run db:migrate
bun run dev:api
bun run dev
```

- API: `http://localhost:3000`
- Frontend: `http://localhost:5173`

## Variables principales

```env
DATABASE_URL=postgres://qlik_app:desarrollo@localhost:5432/qlik_automatizaciones
QLIK_TENANT_HOST=miempresa.eu.qlikcloud.com
QLIK_CLIENT_ID=...
QLIK_CLIENT_SECRET=...
QLIK_REDIRECT_URI=http://localhost:3000/api/auth/qlik/callback
QLIK_OAUTH_SCOPES="user_default offline_access identity.name:read identity.email:read identity.subject:read identity.picture:read automations automations.private automations.shared spaces:read"
CIFRADO_CLAVE_PRINCIPAL=...
REMOTE_API_URL=https://api.example.com
REMOTE_API_KEY=...
```

Genera la clave de cifrado con:

```bash
openssl rand -base64 32
```

## Calidad

```bash
bun run typecheck
bun run test
bun run lint
bun run build
```

La migración `apps/api/drizzle/0001_arquitectura_modular.sql` agrega las tablas `solicitudes_idempotentes` y `eventos_outbox`.

## Cloudflare Worker

`apps/api/src/entradas/worker.ts` contiene el handler Worker. Para PostgreSQL se debe enlazar Hyperdrive o reemplazar el adaptador desde `app.ts`; el bundle necesita compatibilidad de Node porque el cifrado y el driver PostgreSQL usan esas APIs.
