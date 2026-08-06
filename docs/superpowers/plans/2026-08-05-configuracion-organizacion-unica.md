# Configuración de organización única — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Convertir la administración multi-organización visible en una única pantalla de configuración con el diseño de `qlik_reportes_creator` y ocultar superadministradores.

**Architecture:** `/configuracion` resolverá automáticamente la organización activa o la primera disponible. La página de detalle conservará sus mutaciones y formularios, pero añadirá resumen de estado, navegación anclada y secciones responsivas. Las rutas heredadas redirigirán o renderizarán la misma configuración.

**Tech Stack:** React 18, TypeScript, TanStack Router, TanStack Query, Tailwind CSS, Vitest.

## Global Constraints

- Trabajar directamente en el repositorio actual y conservar cambios locales existentes.
- No modificar la API ni eliminar datos de organizaciones o superadministradores.
- Impala reemplaza a BigQuery en el resumen y navegación del proyecto de referencia.
- La URL `/admin/tenants/$tenantId` debe adoptar el mismo diseño que `/configuracion`.

---

### Task 1: Contrato visual y estado de configuración

**Files:**
- Create: `apps/web/src/modulos/admin/utiles-configuracion.ts`
- Create: `apps/web/src/modulos/admin/utiles-estado-configuracion.ts`
- Create: `apps/web/src/modulos/admin/componentes/navegacion-configuracion.tsx`
- Create: `apps/web/src/modulos/admin/componentes/resumen-configuracion.tsx`
- Test: pruebas unitarias de selección, resumen y navegación.

- [ ] Escribir pruebas que exijan seis secciones: General, Qlik Cloud, OAuth, Plantilla base, Impala y Usuarios.
- [ ] Ejecutar pruebas y confirmar el fallo por módulos inexistentes.
- [ ] Implementar selección de organización principal y resumen de estados.
- [ ] Adaptar los componentes visuales del proyecto de reportes.
- [ ] Ejecutar pruebas focalizadas.

### Task 2: Página única de configuración

**Files:**
- Create: `apps/web/src/modulos/admin/pagina-configuracion.tsx`
- Modify: `apps/web/src/modulos/admin/pagina-detalle-tenant.tsx`
- Modify: `apps/web/src/modulos/admin/rutas.tsx`

- [ ] Añadir `/configuracion` y resolver automáticamente la organización principal.
- [ ] Añadir encabezado, estado, resumen y navegación lateral/anclada.
- [ ] Envolver las secciones existentes sin cambiar sus contratos ni mutaciones.
- [ ] Hacer que `/admin/tenants` y `/admin/tenants/$tenantId` usen la experiencia única.
- [ ] Redirigir `/admin/superadmins` a `/configuracion`.

### Task 3: Navegación y regresión

**Files:**
- Modify: `apps/web/src/app/layout-principal.tsx`
- Modify: `apps/web/src/app/layout-principal.test.tsx`
- Modify: enlaces internos que aún apunten al listado de organizaciones.

- [ ] Eliminar “Organizaciones” y “Superadministradores” de la navegación.
- [ ] Mantener únicamente “Configuración” para administradores.
- [ ] Ejecutar suite completa, typecheck, build y lint focalizado.
