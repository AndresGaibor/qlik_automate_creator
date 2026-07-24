# Organizaciones, tenants Qlik y OAuth dinámico Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Separar organizaciones de tenants Qlik, administrar un tenant principal por organización y autenticar contra el host registrado seleccionado en el login.

**Architecture:** Administración mantiene organizaciones y tenants Qlik mediante `RepositorioAdministracion`. OAuth recibe un host, lo resuelve contra persistencia, crea el cliente OAuth para ese host y guarda la sesión vinculada al tenant interno exacto. Las rutas HTTP solo coordinan contratos, cookies y casos de uso.

**Tech Stack:** Bun, TypeScript, Hono, Drizzle ORM, PostgreSQL, Zod, React, TanStack Query.

## Global Constraints

- Mantener compatibilidad temporal con las rutas antiguas `/api/admin/tenants`.
- No aceptar hosts OAuth que no existan activos en `tenants_qlik`.
- Solo puede existir un tenant principal por organización.
- El primer tenant creado para una organización se vuelve principal.
- Un tenant principal no puede eliminarse hasta designar reemplazo.
- Nombres, contratos y mensajes nuevos completamente en español.

---

### Task 1: Reglas de dominio y puertos
- [x] Escribir pruebas fallidas para selección de principal y OAuth por tenant registrado.
- [x] Incorporar tipos `TenantQlikAdministrable`, resultados de eliminación y resolución OAuth.
- [x] Ejecutar pruebas unitarias hasta verde.

### Task 2: Persistencia y casos de uso administrativos
- [x] Extender `RepositorioAdministracionPostgres` con listado, creación, principal y eliminación transaccional.
- [x] Crear casos de uso del módulo admin.
- [x] Exponer rutas `/organizaciones/:id/tenants-qlik` y mantener aliases heredados.

### Task 3: OAuth dinámico seguro
- [x] Resolver el tenant por host antes de generar autorización.
- [x] Guardar `tenantQlikId` en cookie temporal OAuth.
- [x] Usar el mismo tenant registrado durante callback y persistencia de sesión.
- [x] Eliminar dependencia funcional de `QLIK_TENANT_HOST`.

### Task 4: Contratos y frontend
- [x] Renombrar recursos visibles de administración a organizaciones.
- [x] Agregar gestión visual de tenants Qlik y tenant principal.
- [x] Solicitar host Qlik en el formulario de login.

### Task 5: Verificación y commit
- [x] Ejecutar tests, typecheck, Biome y builds.
- [x] Revisar migraciones y diff.
- [x] Crear commit único de la fase.
