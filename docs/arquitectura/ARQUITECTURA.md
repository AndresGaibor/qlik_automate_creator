# Arquitectura — Qlik Automatizaciones

## Decisión principal

El sistema es un **monolito modular on-premise**. El backend se ejecuta principalmente con Bun, genera una entrada compatible con Node.js y usa PostgreSQL como fuente de verdad. Hono es la capa HTTP; Drizzle queda confinado a adaptadores de persistencia.

Una organización puede conectar varios tenants de Qlik Cloud. PostgreSQL garantiza que como máximo uno esté marcado como principal mediante el índice parcial `uq_tenant_principal_por_organizacion`.

## Estructura

```text
apps/api/src/
├── app.ts                 # Composition root
├── entradas/              # Bun, Node y adaptación opcional
├── plataforma/            # HTTP, configuración, persistencia, seguridad y observabilidad
├── nucleo/                # Errores, eventos, auditoría, idempotencia, tiempo y valores
└── modulos/
    ├── autenticacion-qlik/
    ├── qlik/
    ├── flujos/
    ├── destinos/
    ├── automatizaciones/
    └── admin/
```

Cada módulo expone únicamente `publico.ts` y organiza su código en `dominio`, `aplicacion`, `infraestructura` y `http` según lo que necesite. Ningún módulo debe importar detalles internos de infraestructura de otro módulo.

El frontend mantiene módulos verticales equivalentes bajo `apps/web/src/modulos`, mientras los clientes HTTP, componentes y hooks reutilizables viven en `apps/web/src/compartido`.

## Flujo de una solicitud

```text
HTTP → middleware → validación de contrato → sesión/organización/tenant
→ caso de uso → dominio → puerto → adaptador PostgreSQL/Qlik/API de destinos
→ auditoría/outbox → respuesta normalizada
```

Las respuestas usan el contrato común `{ exito, datos }` o `{ exito, error }`. Los errores internos no se exponen al cliente.

## Persistencia y seguridad

- PostgreSQL 17 es la fuente de verdad.
- Los tokens Qlik se almacenan cifrados con AES-256-GCM.
- Las sesiones guardan únicamente el hash del token.
- OAuth usa Authorization Code, PKCE y `state` de un solo uso.
- Todas las configuraciones de automatización incluyen `organizacionId` y `tenantQlikId`.
- Las operaciones mutables críticas usan idempotencia, auditoría y outbox.
- Solo puede existir un tenant principal por organización; una organización también puede no tener principal durante una migración o desconexión.

## Integraciones

Qlik Cloud y la API externa de destinos son puertos reemplazables. El frontend nunca consume directamente esas integraciones: todas las llamadas atraviesan el backend.

## Despliegue

El artefacto de producción se construye con Bun y se ejecuta con Node.js 22 dentro de Docker. `compose.yaml` proporciona PostgreSQL para desarrollo y despliegues simples. Cloudflare Worker no forma parte de la plataforma principal.
