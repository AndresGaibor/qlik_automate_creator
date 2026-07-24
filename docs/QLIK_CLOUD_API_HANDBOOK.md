---
title: "Manual Técnico: Operaciones y Automatización con Qlik Cloud REST API"
source_url: "https://l676lvg3emfvcq2.us.qlikcloud.com"
local_path: "docs/QLIK_CLOUD_API_HANDBOOK.md"
---

# 📖 Manual Técnico de Operaciones y Automatización: Qlik Cloud REST API

Este documento consolida todo el aprendizaje práctico, pruebas en vivo, especificaciones de endpoints, estructuras de datos y casos de uso probados contra la API REST de **Qlik Cloud** en el espacio **Bancolombia prueba** (`6a57a14cf89e2c4d4b4d83af`).

---

## 📌 1. Arquitectura de Autenticación y Conexión

### 🗝️ API Key vs. OAuth2 M2M
- **Cabecera HTTP requerida**:
  ```http
  Authorization: Bearer <API_KEY_O_TOKEN_OAUTH>
  Accept: application/json
  Content-Type: application/json
  ```
- **OAuth2 PKCE (Web App / SPA)**: Autenticación delegada multi-tenant basada en correo electrónico o resolución de host.

### 🗝️ Flujo de Autenticación por Correo Electrónico (PDR Multi-Tenant)
- **Endpoint**: `GET /api/auth/qlik/iniciar-por-correo?correo={correo_usuario}`
- **Comportamiento**:
  1. El usuario ingresa únicamente su correo (ej. `andres.gaibor@aliwareint.com`).
  2. El backend consulta la base de datos PostgreSQL y resuelve el tenant de Qlik Cloud asociado (`l676lvg3emfvcq2.us.qlikcloud.com`).
  3. Redirige automáticamente al usuario al portal OAuth2 PKCE de su tenant correspondiente (`HTTP 302 Found`).
  4. Al autenticarse en Qlik, la API procesa el callback y almacena la sesión con su token de acceso.

---

## 🔍 2. Endpoints de Lectura y Descubrimiento (GET)

### 2.1 Información del Usuario (`GET /api/v1/users/me`)
> **Nota técnica**: Qlik Cloud devuelve un estado `HTTP 301/302 Redirect` a `/api/v1/users/{userId}`. El cliente HTTP debe seguir redirecciones automáticamente.

```json
{
  "id": "6a5434b3c00f988d0ff453aa",
  "name": "Andrés Gaibor Apunte",
  "email": "andres.gaibor@aliwareint.com",
  "roles": [ "AnalyticsAdmin" ]
}
```

### 2.2 Inspección del Espacio (`GET /api/v1/spaces/{spaceId}`)
```json
{
  "id": "6a57a14cf89e2c4d4b4d83af",
  "type": "shared",
  "name": "Bancolombia prueba",
  "description": "Espacio para prueba para el proyecto bancolombia",
  "meta": {
    "actions": [ "change_owner", "create", "delete", "read", "update" ]
  }
}
```

### 2.3 Catálogo de Recursos (`GET /api/v1/items?spaceId={spaceId}`)
Permite filtrar todos los ítems catalogados dentro del espacio.

| Tipo de Recurso (`resourceType` / `resourceSubType`) | Descripción |
| :--- | :--- |
| `app` + `usage: "DATAFLOW_PREP"` | Dataflow de preparación de datos |
| `automation` | Automatización no-code de Qlik Automate |
| `app` + `usage: "ANALYTICS"` | Aplicación analítica Qlik Sense |

---

## 📜 3. Extracción y Modificación de Scripts de Dataflows

Los **Dataflows** (`resourceSubType: "dataflow-prep"`) son técnicamente aplicaciones Qlik. Su código fuente o script ETL (Qlik Load Script) es accesible y editable vía REST API.

### 3.1 Leer Script Actual (`GET /api/v1/apps/{appId}/scripts/current`)
```http
GET /api/v1/apps/c354be8c-9ed9-4467-ba2f-bfb00f19b4a5/scripts/current
```
**Respuesta JSON**:
```json
{
  "script": "///$tab Main\r\nSET ThousandSep=',';\r\n...\r\n///$tab Generated\r\nLIB CONNECT TO [Bancolombia prueba:Postgres_BanColombia_Prueba];\r\n...",
  "versionMessage": "Carga incremental"
}
```

### 3.2 Modificar el Load Script (`POST /api/v1/apps/{appId}/scripts`)
```http
POST /api/v1/apps/{appId}/scripts
Content-Type: application/json

{
  "script": "///$tab Main\nSET DateFormat='YYYY-MM-DD';\n\n///$tab Transformacion\nLIB CONNECT TO [Bancolombia prueba:Postgres_BanColombia_Prueba];\n[ventas]:\nLOAD *;\nSELECT * FROM \"public\".\"ventas\";\nSTORE [ventas] INTO [lib://Bancolombia prueba:SFTP//upload/ventas.csv] (txt);\nDROP TABLE [ventas];\n",
  "versionMessage": "Script modificado vía API REST"
}
```

---

## ⚡ 4. Clonación, Evaluación y Ejecución de Dataflows (ETL Reloads)

### 4.1 Clonar/Duplicar Dataflow (`POST /api/v1/apps/{appId}/copy`)
```http
POST /api/v1/apps/f16387d7-63af-484f-b267-f3856540dbe6/copy
Content-Type: application/json

{
  "attributes": {
    "name": "BanColombia_Dataflow_Copia_API",
    "spaceId": "6a57a14cf89e2c4d4b4d83af",
    "description": "Copia generada programáticamente"
  }
}
```

### 4.2 Evaluación de Rendimiento y Tamaño en Memoria (1.C) (`POST /api/analytics/apps/{appId}/evaluations`)
Genera un análisis de rendimiento y volumen de memoria del Dataflow.

```http
POST /api/analytics/apps/f16387d7-63af-484f-b267-f3856540dbe6/evaluations
```

**Respuesta HTTP 201 Created**:
```json
{
  "id": "6a638a128996c7cdc62761b2",
  "appName": "BanColombia_Prueba_1",
  "status": "enqueued",
  "result": {
    "documentSizeMiB": 0,
    "hasSectionAccess": false,
    "rowCount": 0,
    "topTablesByBytes": [],
    "topFieldsByBytes": []
  }
}
```

### 4.3 Disparar Recarga (Reload) del Dataflow (`POST /api/v1/reloads`)
```http
POST /api/v1/reloads
Content-Type: application/json

{
  "appId": "34d272b9-8f60-40d7-93a3-a68c5591bd2d",
  "partial": false
}
```
**Respuesta HTTP 201 Created**:
```json
{
  "id": "6a638861459862df731a185e",
  "appId": "34d272b9-8f60-40d7-93a3-a68c5591bd2d",
  "status": "QUEUED"
}
```

### 4.4 Monitorear Recarga (`GET /api/v1/reloads/{reloadId}`)
Devuelve el estado (`QUEUED`, `RELOADING`, `SUCCEEDED`, `FAILED`) y el log detallado de la recarga.
```json
{
  "id": "6a638861459862df731a185e",
  "status": "SUCCEEDED",
  "log": "ReloadID: 6a638861459862df731a185e\nStarted loading data\nReload finished successfully\n",
  "startTime": "2026-07-24T15:44:34.86Z",
  "endTime": "2026-07-24T15:44:35.657Z"
}
```

---

## 🤖 5. Gestión Avanzada de Qlik Automate (Automatizaciones No-Code)

### 5.1 Duplicar Automatización (`POST /api/v1/automations/{id}/actions/copy`)
```http
POST /api/v1/automations/17b889aa-0426-44d5-bca8-9b8baa104a41/actions/copy
Content-Type: application/json

{ "name": "Mi_Automatizacion_Copia" }
```
Retorna `{ "id": "cd035fef-2e74-4832-b869-8b73fb027187" }`.

### 5.2 Mover a Espacio Compartido (`POST /api/v1/automations/{id}/actions/change-space`)
```http
POST /api/v1/automations/{id}/actions/change-space
Content-Type: application/json

{ "spaceId": "6a57a14cf89e2c4d4b4d83af" }
```
Retorna `HTTP 204 No Content`.

### 5.3 Modificar Definición, Horario (Schedule) y Variables (`PUT /api/v1/automations/{id}`)
Permite cambiar el modo de ejecución (`runMode`), la programación temporal (`schedules`) y los bloques de trabajo (`workspace`).

```http
PUT /api/v1/automations/cd035fef-2e74-4832-b869-8b73fb027187
Content-Type: application/json

{
  "name": "Automation_Programada_API",
  "description": "Automatización con horario actualizado vía API REST",
  "spaceId": "6a57a14cf89e2c4d4b4d83af",
  "runMode": "scheduled",
  "schedules": [
    {
      "type": "interval",
      "interval": 120,
      "startAt": "2026-07-25 08:00:00",
      "stopAt": "2026-12-31 23:59:59",
      "timezone": "America/Bogota"
    }
  ],
  "workspace": {
    "blocks": [ ... ],
    "variables": [ ... ]
  }
}
```

### 5.4 Deshabilitar y Habilitar Automatizaciones (2.C)
- **Deshabilitar**: `POST /api/v1/automations/{id}/actions/disable` (Retorna `HTTP 204`, cambia `state` a `"disabled"`).
- **Habilitar**: `POST /api/v1/automations/{id}/actions/enable` (Retorna `HTTP 204`, cambia `state` a `"available"`).
- **Transferencia de Propiedad**: `POST /api/v1/automations/{id}/actions/change-owner` (Requiere body `{"userId": "..."}`).

### 5.5 Consultar Historial de Ejecuciones, Logs y Métricas por Bloque (2.A) (`GET /api/v1/automations/{id}/runs`)
Obtiene todas las ejecuciones pasadas con el desglose de métricas de red, llamadas a la API y bloques ejecutados.

```http
GET /api/v1/automations/17b889aa-0426-44d5-bca8-9b8baa104a41/runs
```

**Respuesta JSON**:
```json
{
  "data": [
    {
      "id": "06bac58f-8d6b-4ed3-9a14-57e0b1328b96",
      "status": "finished",
      "context": "editor",
      "startTime": "2026-07-16T19:44:14.000000Z",
      "stopTime": "2026-07-16T19:44:20.000000Z",
      "metrics": {
        "network": { "rxBytes": 10152, "txBytes": 10933 },
        "totalApiCalls": 1,
        "blocks": [
          {
            "type": "endpointBlock",
            "connectorId": "61a87510-c7a3-11ea-95da-0fb0c241e75c",
            "apiCalls": 1
          }
        ]
      }
    }
  ]
}
```

### 5.6 Disparar Ejecución de Automatización (`POST /api/v1/automations/{id}/runs`)
```http
POST /api/v1/automations/cd035fef-2e74-4832-b869-8b73fb027187/runs
Content-Type: application/json

{
  "context": "api"
}
```

---

## 🛠️ 6. Casos de Borde (Edge Cases) y Buenas Prácticas

1. **Redirecciones HTTP**: Endpoints como `/api/v1/users/me` devuelven HTTP 301. Asegurar que las librerías cliente sigan la cabecera `Location`.
2. **Contexto Obligatorio en Runs de Automatización**: Llamar a `/api/v1/automations/{id}/runs` sin `{ "context": "api" }` retornará un HTTP 422 Unprocessable Entity.
3. **Sintaxis de TRACE en Qlik Scripts**: Al escribir scripts programáticamente, evitar caracteres especiales sueltos (ej. `TRACE ***`) sin comillas dobles, ya que la Engine lanzará un error `EngineReloadScriptError`.
4. **Deshabilitar Automatizaciones**: Usar `/actions/disable` detiene temporalmente la ejecución programada sin alterar la configuración del flujo ni los conectores.
