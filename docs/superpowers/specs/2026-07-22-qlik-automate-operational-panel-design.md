# Qlik Automate Operational Panel

## Objetivo
Extender la app para operar Qlik Automate desde el propio proyecto: listar automatizaciones con metadatos reales, ver ejecuciones, ejecutar una automatización, bloquear ejecución concurrente cuando ya está corriendo y mostrar información útil de espacios, dueño y fechas.

## Alcance
- Listado de automatizaciones con campos legibles.
- Detalle/inspección de una automatización y sus ejecuciones.
- Acción de ejecutar desde la UI.
- Bloqueo de ejecutar mientras exista una ejecución en curso.
- Visualización de `space`, `owner`, `createdAt`, `modifiedAt` y estado.
- Manejo explícito de estados vacíos / error / sin permisos.

## Decisión de diseño
1. Mantener el contrato interno de la app y mapear la respuesta de Qlik en el backend.
2. Usar el namespace `workflows` para automatizaciones y `runs` para ejecución/historial.
3. Derivar el estado visible en frontend desde `state`, `isEnabled`, `lastRunStatus` y/o la última ejecución.
4. Bloquear la acción “Ejecutar” si la automatización está en estado de ejecución o si la última ejecución sigue activa.

## Vista principal
La pantalla de automatizaciones debe mostrar una lista con:
- nombre
- estado legible
- disparador
- espacio
- dueño
- fecha de creación
- fecha de modificación

Cada tarjeta debe incluir acciones:
- ver detalle
- ejecutar
- refrescar estado

## Vista de detalle
Una vista de detalle debe mostrar:
- metadatos completos de la automatización
- ejecuciones recientes
- estado de cada ejecución
- hora de inicio / fin / duración
- acción para detener o reintentar ejecuciones si la API lo permite

## Reglas de ejecución
- Si hay una ejecución `running` / `queued` / `pending`, deshabilitar el botón Ejecutar.
- Si Qlik responde con `403` / `404` / `401`, mostrar un error útil, no vacío.
- Si una ejecución termina, permitir ejecutar de nuevo.

## Fuentes de datos
- `GET /api/workflows/automations`
- `GET /api/workflows/automations/{id}`
- `GET /api/workflows/automations/{id}/runs`
- `POST /api/workflows/automations/{id}/runs`
- `GET /api/workflows/automation-connectors`
- `GET /api/v1/automation-connections`

## Implementación sugerida
### Backend
- Adaptar el cliente de Qlik para automatizaciones, ejecución y runs.
- Exponer endpoints internos para detalle/lista/ejecutar.
- Mantener los errores de Qlik con status real.

### Frontend
- Mejorar la lista de automatizaciones.
- Agregar una vista de detalle de automatización.
- Mostrar ejecuciones y estado de ejecución en curso.
- Deshabilitar ejecutar cuando corresponda.

## Riesgos
- El payload real de Qlik puede variar entre tenants o permisos.
- Algunos campos pueden venir vacíos y requieren fallback visual.
- La ejecución puede ser eventual-consistent; el bloqueo debe basarse en polling o en el último estado conocido.

## Verificación
- Tests de cliente Qlik.
- Tests de rutas backend.
- Tests de UI para estado legible, bloqueo de ejecución y ejecuciones recientes.
