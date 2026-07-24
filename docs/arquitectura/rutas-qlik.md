# Cobertura del proxy Qlik

Prefijo local:

```text
/api/qlik
```

Ejemplo:

```text
GET /api/qlik/workflows/automations
       ↓
GET https://TENANT/api/workflows/automations
```

El token se obtiene desde la sesión cifrada del backend. Nunca se recibe desde el navegador.

## Automations — 21 endpoints

```text
GET    /workflows/automations
POST   /workflows/automations
GET    /workflows/automations/:id
PUT    /workflows/automations/:id
DELETE /workflows/automations/:id
POST   /workflows/automations/:id/actions/change-owner
POST   /workflows/automations/:id/actions/change-space
POST   /workflows/automations/:id/actions/copy
POST   /workflows/automations/:id/actions/disable
POST   /workflows/automations/:id/actions/enable
POST   /workflows/automations/:id/actions/move
GET    /workflows/automations/:id/runs
POST   /workflows/automations/:id/runs
GET    /workflows/automations/:id/runs/:runId
POST   /workflows/automations/:id/runs/:runId/actions/export
POST   /workflows/automations/:id/runs/:runId/actions/retry
POST   /workflows/automations/:id/runs/:runId/actions/stop
GET    /workflows/automations/:id/runs/:runId/debug
GET    /workflows/automations/settings
PUT    /workflows/automations/settings
GET    /workflows/automations/usage
```

## Automation Connections — 8 endpoints

```text
GET    /workflows/automation-connections
POST   /workflows/automation-connections
GET    /workflows/automation-connections/:id
PUT    /workflows/automation-connections/:id
DELETE /workflows/automation-connections/:id
POST   /workflows/automation-connections/:id/actions/change-owner
POST   /workflows/automation-connections/:id/actions/change-space
POST   /workflows/automation-connections/:id/actions/check
```

## Automation Connectors — 2 endpoints

```text
GET /workflows/automation-connectors
GET /workflows/automation-connectors/:connectorId/webhooks/configuration
```

## Spaces — 17 endpoints

```text
GET    /v1/spaces
POST   /v1/spaces
GET    /v1/spaces/:spaceId
PATCH  /v1/spaces/:spaceId
PUT    /v1/spaces/:spaceId
DELETE /v1/spaces/:spaceId
GET    /v1/spaces/types
GET    /v1/spaces/:spaceId/assignments
POST   /v1/spaces/:spaceId/assignments
GET    /v1/spaces/:spaceId/assignments/:assignmentId
PUT    /v1/spaces/:spaceId/assignments/:assignmentId
DELETE /v1/spaces/:spaceId/assignments/:assignmentId
GET    /v1/spaces/:spaceId/shares
POST   /v1/spaces/:spaceId/shares
GET    /v1/spaces/:spaceId/shares/:shareId
PATCH  /v1/spaces/:spaceId/shares/:shareId
DELETE /v1/spaces/:spaceId/shares/:shareId
```

## Users — 9 endpoints

```text
GET    /v1/users
POST   /v1/users
GET    /v1/users/:userId
PATCH  /v1/users/:userId
DELETE /v1/users/:userId
GET    /v1/users/actions/count
POST   /v1/users/actions/filter
POST   /v1/users/actions/invite
GET    /v1/users/me
```

## Rutas de negocio para el frontend

```text
GET  /api/automatizaciones
GET  /api/automatizaciones/espacios
POST /api/automatizaciones/desde-plantilla
GET  /api/automatizaciones/:id
POST /api/automatizaciones/:id/ejecuciones
POST /api/automatizaciones/:id/ejecuciones/:ejecucionId/detener
```

`POST /api/automatizaciones/desde-plantilla` acepta `Idempotency-Key` y este cuerpo:

```json
{
  "nombre": "Creación de carpetas - Empresa A",
  "plantillaIdQlik": "ID_AUTOMATIZACION_BASE",
  "espacioIdQlik": "ID_ESPACIO_DESTINO",
  "propietarioIdQlik": "ID_USUARIO_OPCIONAL",
  "reemplazosWorkspace": [
    {
      "ruta": "/blocks/0/settings/table",
      "valor": "carpetas_empresa_a"
    }
  ]
}
```
