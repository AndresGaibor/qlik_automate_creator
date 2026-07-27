# Superadministradores y OAuth configurable por tenant

## Objetivo

Permitir que la configuración OAuth de Qlik se administre desde la aplicación por cada tenant Qlik, eliminar la dependencia permanente de `SUPERADMINMAIL` para autorizar privilegios y ofrecer instrucciones claras al superadministrador y a los administradores de organización.

## Estado actual

- El host Qlik se resuelve dinámicamente desde `tenants_qlik`.
- `QLIK_CLIENT_ID`, `QLIK_CLIENT_SECRET`, `QLIK_REDIRECT_URI` y los scopes son globales.
- El primer superadministrador se crea mediante bootstrap y continúa reconociéndose desde variables de entorno.
- Los administradores y usuarios de una organización ya se gestionan desde la aplicación.
- Los tokens OAuth de usuarios se guardan cifrados por identidad Qlik.

## Decisiones principales

1. La configuración OAuth pertenece a un `tenant_qlik`, no a la organización completa.
2. Cada tenant puede tener exactamente una configuración OAuth activa.
3. `SUPERADMINMAIL` se utiliza únicamente para el bootstrap inicial y compatibilidad transitoria.
4. La base de datos será la fuente de verdad para reconocer superadministradores.
5. El secreto OAuth nunca se devuelve al frontend ni se escribe en logs o auditoría.
## Modelo de datos

`usuarios` incorpora `es_superadmin boolean not null default false`.

`configuraciones_oauth_qlik` contiene una fila única por tenant: cliente ID, secreto cifrado, scopes, estado, fecha de verificación, último error, autores y fechas. La URI de callback se calcula desde la configuración pública del backend y no se guarda como dato editable.

Estados permitidos: `pendiente`, `verificada`, `error` y `desactivada`.

## Resolución OAuth

1. Autenticación resuelve el tenant por host, correo o ID.
2. Busca la configuración OAuth activa del tenant.
3. Si existe, descifra el secreto y crea el cliente OAuth específico.
4. Durante la transición, si no existe configuración usa las variables globales.
5. El callback marca la configuración utilizada como verificada o con error.
6. La configuración usada nunca aparece en respuestas públicas con el secreto.

## Permisos

- Superadmin: puede configurar, verificar, desactivar y eliminar OAuth de cualquier organización.
- Admin de organización: puede ver, crear, actualizar, verificar y desactivar OAuth únicamente en su organización.
- Usuario: no accede a la configuración OAuth.
- Solo el superadmin puede eliminar una configuración OAuth.
- No se permite degradar o eliminar al último superadmin activo.
## API administrativa

- `GET /api/admin/organizaciones/:organizacionId/tenants-qlik/:tenantQlikId/oauth`
- `PUT /api/admin/organizaciones/:organizacionId/tenants-qlik/:tenantQlikId/oauth`
- `DELETE /api/admin/organizaciones/:organizacionId/tenants-qlik/:tenantQlikId/oauth`

GET devuelve cliente ID, scopes, estado, origen (`tenant` o `entorno_global`), fechas y una máscara del secreto. PUT crea o actualiza y deja el estado en `pendiente`. DELETE requiere superadmin.

## Experiencia administrativa

La pantalla del detalle de organización muestra una sección OAuth por cada tenant Qlik. Incluye instrucciones para crear un cliente Web en Qlik, la URI exacta de callback, scopes requeridos, campos de cliente y secreto, estado visible y la acción `Guardar y conectar con Qlik`.

La conexión real reutiliza el flujo OAuth existente y vuelve al detalle de la organización. Un callback exitoso marca la configuración como verificada.

## Compatibilidad y retirada

Las variables globales siguen funcionando como fallback y se muestran como configuración heredada. No se guardan ni exponen sus valores. Cuando todos los tenants tengan configuración propia, podrán hacerse opcionales y retirarse en una fase posterior.

## Verificación

- Pruebas unitarias de resolución OAuth específica y fallback.
- Pruebas de esquema, bootstrap y múltiples superadministradores.
- Pruebas HTTP de permisos y ausencia del secreto.
- Typecheck, suite Bun, Biome y build completos.