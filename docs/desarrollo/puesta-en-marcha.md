# Puesta en marcha

## Desarrollo local

```bash
cp .env.example .env
bun install
bun --cwd apps/api run db:migrate
bun run dev:api
bun run dev
```

API: `http://localhost:3000`

Frontend: `http://localhost:5173`

## Variables críticas

- `QLIK_TENANT_HOST`: host del tenant sin rutas.
- `QLIK_CLIENT_ID`, `QLIK_CLIENT_SECRET`, `QLIK_REDIRECT_URI`: cliente OAuth Web.
- `QLIK_OAUTH_SCOPES`: scopes permitidos por el cliente y consentidos por el usuario.
- `CIFRADO_CLAVE_PRINCIPAL`: 32 bytes codificados en Base64.
- `DATABASE_URL`: PostgreSQL, fuente de verdad.

## Comandos de calidad

```bash
bun run typecheck
bun run test
bun run lint
bun run build
```

## PostgreSQL

La migración `0001_arquitectura_modular.sql` incorpora:

- `solicitudes_idempotentes`
- `eventos_outbox`

La auditoría reutiliza `auditoria_eventos`.

## Cloudflare Worker

`apps/api/src/entradas/worker.ts` expone el handler Hono. El adaptador PostgreSQL actual necesita conectividad compatible con PostgreSQL desde Worker, por ejemplo Hyperdrive, y `nodejs_compat` porque la capa de cifrado y el driver usan APIs de Node. La arquitectura permite sustituir esos adaptadores desde `app.ts` sin tocar dominio ni HTTP.

## Automatizaciones por modo

El administrador configura las plantillas por modo en **Administración → Tenants** (dos plantillas, una por modo) y el modo global activo en **Administración → Plataforma**.

Variables obligatorias por modo:

```
Modo 1: DataflowId, DataflowScriptContenido, ConexionesContenido, EjecucionId, TablaDestino
Modo 2: DataflowId, RutasSftpContenido, EsquemaTablaDestino, EjecucionId, TablaDestino
```

El JSON de secretos (`MOTOR_SECRETOS_JSON`): el administrador pega el JSON de secretos obtenido con "Copiar JSON de secretos para el job" en el **parámetro protegido del job**; **nunca** debe agregarlo a una variable del workspace Qlik (quedaría expuesto en el workspace). Los secretos solo aparecen con nombres cifrados (variables `*_secreto` o similar sin valores) en las variables del workspace.

La card de "Secreto configurado" y el diálogo de revelación admin en el catálogo de orígenes permiten verificar que la lista normal de conexiones nunca muestra valores secretos.
