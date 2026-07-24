# API Qlik — Investigación

> **Nota:** Esta sección fue investigada antes de que el usuario decidiera que otro agente haría la investigación y pruebas. Dejar como referencia inicial.

---

## APIs descubiertas

| API | Base URL | Docs |
|-----|----------|------|
| Automations (legacy) | `/api/v1/automations` | https://qlik.dev/apis/rest/automations |
| Automations (workflows) | `/api/workflows/automations` | https://qlik.dev/apis/rest/workflows/automations |
| Webhooks | `/api/v1/webhooks` | https://qlik.dev/apis/rest/webhooks |
| Data connections | `/api/v1/data-connections` | https://qlik.dev/apis/rest/data-connections |
| Data integration projects | `/api/v1/di-projects` | https://qlik.dev/apis/rest/di-projects |
| OAuth | `/oauth` | https://qlik.dev/authenticate |
| Users | `/api/v1/users/me` | — |

---

## Autenticación

### OAuth 2.0 Authorization Code + PKCE (recomendado)

Scopes necesarios:
```
user_default offline_access identity.name:read identity.email:read identity.subject:read identity.picture:read
```

### API Key

Simple, misma permisos que el usuario que la creó.

---

## Automations — Endpoints clave

### Listar automatizaciones
```
GET /api/workflows/automations
GET /api/v1/automations (legacy)
```

### Duplicar automatización
```
POST /api/workflows/automations/{id}/actions/copy
POST /api/v1/automations/{id}/actions/copy (legacy)
```

### Ejecutar automatización
```
POST /api/workflows/automations/{id}/runs
```

### Obtener ejecución
```
GET /api/workflows/automations/{id}/runs
GET /api/workflows/automations/{id}/runs/{runId}
```

### Schedules
- Se crean con `POST /api/workflows/automations` o `PUT /api/workflows/automations/{id}`
- Parámetros: `startAt`, `stopAt`, `interval`, `timezone`

### Estados de ejecución
```
failed | finished | finished with warnings | must stop | not started | running | starting | stopped | exceeded limit | queued
```

---

## Webhooks

### Crear webhook
```
POST /api/v1/webhooks
```

Parámetros:
- `name`, `url`, `eventTypes`, `enabled`, `headers`, `description`
- `level`: "tenant" | "user"
- `filter`: SCIM filter syntax

### Tipos de eventos
Consultar con `GET /api/v1/webhooks/event-types`

---

## Rate Limits

| Tier | Límite |
|------|--------|
| Tier 1 (GET) | 1000 req/min |
| Tier 2 (POST/PUT/PATCH/DELETE) | 100 req/min |

Manejo: Retry con backoff exponencial en 429.

---

## Pending Investigation

- [ ] Dataflow JSON — cómo extraer metadata de archivos de salida
- [ ] Impala schema — si hay endpoint en Qlik o se hace via API propia
- [ ] Webhook authentication — si soporta headers autenticados o solo URL pública
- [ ] Schedule editing — qué endpoints permiten editar schedules
- [ ] Spaces — cómo listar automations por space

---

## Referencias

- Portal desarrollo: https://qlik.dev
- Docs REST: https://qlik.dev/apis/rest
- Autenticación: https://qlik.dev/authenticate
- Comunidad: https://community.qlik.com
