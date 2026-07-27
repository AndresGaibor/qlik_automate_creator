# Superadministradores y OAuth por tenant Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Persistir superadministradores y permitir configurar, usar y verificar credenciales OAuth propias por cada tenant Qlik desde administración.

**Architecture:** La base de datos será fuente de verdad para privilegios y configuración OAuth. Administración cifra y guarda secretos; autenticación consume una consulta de solo lectura que resuelve credenciales por tenant y mantiene fallback temporal al entorno global.

**Tech Stack:** Bun, TypeScript, Hono, Drizzle ORM, PostgreSQL, Zod, React y TanStack Query.

## Global Constraints

- Nombres de negocio, contratos y mensajes en español.
- Nunca devolver, registrar o auditar secretos OAuth.
- Mantener fallback temporal a `QLIK_CLIENT_ID` y `QLIK_CLIENT_SECRET`.
- Un tenant Qlik tiene como máximo una configuración OAuth.
- Aplicar TDD y no ejecutar `git commit` ni `git push` automáticamente.

---

### Task 1: Persistencia de superadministradores y OAuth

**Files:** `apps/api/src/plataforma/persistencia/esquema.ts`, `apps/api/src/esquema.test.ts`, `apps/api/drizzle/0007_superadmin_oauth_por_tenant.sql`.

- [ ] Agregar pruebas fallidas para `usuarios.es_superadmin` y `configuraciones_oauth_qlik`.
- [ ] Ejecutar `bun test apps/api/src/esquema.test.ts` y confirmar el fallo esperado.
- [ ] Implementar columnas, restricciones, índices y migración.
- [ ] Ejecutar la prueba hasta verde.
### Task 2: Superadmin persistido

**Files:** bootstrap, repositorio de autenticación, consultas de identidad y sus pruebas.

- [ ] Escribir pruebas para bootstrap con `esSuperadmin=true`, correos normalizados y múltiples superadmins heredados.
- [ ] Confirmar que fallan por depender todavía del texto completo de `SUPERADMINMAIL`.
- [ ] Marcar el usuario del bootstrap como superadmin y usar la columna como fuente primaria.
- [ ] Conservar el entorno solo como fallback de migración.
- [ ] Ejecutar pruebas de bootstrap y autenticación hasta verde.

### Task 3: Resolución de credenciales OAuth por tenant

**Files:** nuevo puerto/consulta OAuth, servicio de autenticación, `app.ts` y pruebas.

- [ ] Escribir pruebas donde la fábrica OAuth recibe la configuración del tenant seleccionado.
- [ ] Probar fallback global cuando no exista fila propia.
- [ ] Implementar lectura y descifrado del secreto sin exponerlo.
- [ ] Marcar `verificada` o `error` al terminar el callback.
- [ ] Ejecutar pruebas de autenticación hasta verde.

### Task 4: API administrativa OAuth

**Files:** contratos compartidos, repositorio admin, casos de uso, rutas y pruebas HTTP.

- [ ] Escribir pruebas de GET/PUT/DELETE y permisos.
- [ ] Implementar resumen seguro con máscara del secreto.
- [ ] Cifrar el secreto al guardar y dejar el estado `pendiente`.
- [ ] Permitir eliminar solo al superadmin.
- [ ] Integrar rutas en `crearRutasAdmin`.
### Task 5: Interfaz guiada

**Files:** `apps/web/src/modulos/admin/api.ts`, nueva sección OAuth, página de detalle y pruebas/typecheck.

- [ ] Agregar funciones API tipadas.
- [ ] Mostrar instrucciones, callback, scopes, estado y formulario por tenant.
- [ ] Implementar `Guardar` y `Guardar y conectar con Qlik`.
- [ ] No conservar el secreto en caché después de guardarlo.
- [ ] Mostrar origen heredado cuando se use configuración global.

### Task 6: Verificación integral y documentación

- [ ] Ejecutar `bun test`.
- [ ] Ejecutar `bun run typecheck`.
- [ ] Ejecutar `bun run lint`.
- [ ] Ejecutar `bun run build`.
- [ ] Revisar `git diff` buscando secretos, imports internos y cambios fuera de alcance.
- [ ] Actualizar README y `.env.example` explicando el fallback y el bootstrap inicial.
