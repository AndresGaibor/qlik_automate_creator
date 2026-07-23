# Qlik Automate API REST

Referencia rápida de la API REST oficial de **Qlik Automate** para automatizaciones, ejecuciones, conectores y conexiones.

> Namespace recomendado por Qlik para desarrollos nuevos: `https://<tu-tenant>.<region>.qlikcloud.com/api/workflows`

Ejemplo:

```text
https://miempresa.eu.qlikcloud.com/api/workflows/automations
```

La API antigua bajo `/api/v1/automations` sigue funcionando, pero Qlik recomienda migrar a `/api/workflows`.

## Automatizaciones

### Listar automatizaciones

```http
GET /api/workflows/automations
```

Parámetros útiles:

- `limit`
- `cursor`
- `filter`
- `sort`
- `listAll`

Filtros admitidos:

- `name`
- `runMode`
- `lastRunStatus`
- `ownerId`
- `spaceId`

Ejemplo:

```bash
curl \
  "https://TU_TENANT/api/workflows/automations?limit=100&sort=-updatedAt" \
  -H "Authorization: Bearer TU_TOKEN"
```

Como administrador:

```bash
curl \
  "https://TU_TENANT/api/workflows/automations?listAll=true" \
  -H "Authorization: Bearer TU_TOKEN"
```

### Crear / obtener / actualizar / eliminar

```http
POST   /api/workflows/automations
GET    /api/workflows/automations/{id}
PUT    /api/workflows/automations/{id}
DELETE /api/workflows/automations/{id}
```

### Acciones sobre automatizaciones

```http
POST /api/workflows/automations/{id}/actions/change-owner
POST /api/workflows/automations/{id}/actions/change-space
POST /api/workflows/automations/{id}/actions/copy
POST /api/workflows/automations/{id}/actions/disable
POST /api/workflows/automations/{id}/actions/enable
POST /api/workflows/automations/{id}/actions/move
```

## Ejecuciones

### Listar ejecuciones

```http
GET /api/workflows/automations/{id}/runs
```

### Ejecutar una automatización

```http
POST /api/workflows/automations/{id}/runs
```

### Obtener / operar sobre una ejecución

```http
GET    /api/workflows/automations/{id}/runs/{runId}
POST   /api/workflows/automations/{id}/runs/{runId}/actions/export
POST   /api/workflows/automations/{id}/runs/{runId}/actions/retry
POST   /api/workflows/automations/{id}/runs/{runId}/actions/stop
GET    /api/workflows/automations/{id}/runs/{runId}/debug
```

## Conectores y conexiones

### Conectores disponibles

```http
GET /api/workflows/automation-connectors
```

### Configuración de webhooks de un conector

```http
GET /api/workflows/automation-connectors/{connectorId}/webhooks/configuration
```

### Conexiones configuradas por el usuario

```http
GET /api/v1/automation-connections
```

## Notas para esta app

La UI actual usa estos campos como referencia para automatizaciones:

- `id`
- `name`
- `state`
- `runMode`
- `lastRunStatus`
- `lastRunAt`
- `owner`
- `spaceId`
- `description`

Si una tarjeta aparece vacía, normalmente falta mapear alguno de esos campos.
