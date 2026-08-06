# Estilos de Qlik Reportes en Automatizaciones — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aplicar en `qlik_automate_creator` el sistema visual y los patrones responsivos de `qlik_reportes_creator` sin cambiar rutas, contratos, APIs ni reglas de negocio.

**Architecture:** La transferencia se limita a componentes compartidos de presentación y a las vistas equivalentes del módulo de automatizaciones. Los cambios se adaptan sobre el código actual del destino; no se copian módulos de reportes, BigQuery ni lógica administrativa exclusiva del proyecto de referencia.

**Tech Stack:** React 18, TypeScript, Tailwind CSS 4, TanStack Router/Query, Vitest y Testing Library.

## Global Constraints

- Mantener intactos los endpoints, hooks de datos y contratos de `qlik_automate_creator`.
- No modificar los cambios locales existentes de `qlik_reportes_creator`.
- Conservar accesibilidad semántica y diseño responsive.
- Verificar con pruebas focalizadas, typecheck y build.

---

### Task 1: Estados y encabezados compartidos

**Files:**
- Modify: `apps/web/src/compartido/componentes/ui/estado-carga.tsx`
- Modify: `apps/web/src/compartido/componentes/ui/page-header.tsx`
- Modify: `apps/web/src/compartido/componentes/feedback/estado-error.tsx`
- Create: `apps/web/src/compartido/componentes/ui/estilos-compartidos.test.tsx`

- [ ] Escribir pruebas que exijan spinner accesible, acciones responsivas y estado de error visual con reintento.
- [ ] Ejecutar la prueba focalizada y confirmar que falla por el marcado anterior.
- [ ] Adaptar los tres componentes desde el proyecto de referencia.
- [ ] Ejecutar la prueba focalizada y confirmar que pasa.

---

### Task 2: Listados y detalle de automatizaciones

**Files:**
- Modify: `apps/web/src/modulos/automatizaciones/componentes/barra-filtros-automatizaciones.tsx`
- Modify: `apps/web/src/modulos/automatizaciones/componentes/lista-automatizaciones.tsx`
- Modify: `apps/web/src/modulos/automatizaciones/componentes/lista-ejecuciones.tsx`
- Modify: `apps/web/src/modulos/automatizaciones/componentes/paginacion-lista.tsx`
- Modify: `apps/web/src/modulos/automatizaciones/componentes/tarjeta-detalle-automatizacion.tsx`
- Modify: `apps/web/src/modulos/automatizaciones/pagina-automatizaciones.tsx`
- Modify: `apps/web/src/modulos/automatizaciones/pagina-detalle-automatizacion.tsx`

- [ ] Añadir o adaptar pruebas de estructura para filtros, lista responsive y estados de ejecución.
- [ ] Ejecutarlas y confirmar el fallo contra la presentación anterior.
- [ ] Portar la jerarquía visual del módulo `reportes`, conservando callbacks y datos del módulo `automatizaciones`.
- [ ] Ejecutar las pruebas focalizadas y corregir regresiones.

---

### Task 3: Pantallas comunes y verificación integral

**Files:**
- Modify only when compatible: páginas de flujos, configuración, tablas y login equivalentes.
- Verify: `apps/web/src/index.css` remains aligned with the reference tokens.

- [ ] Aplicar únicamente diferencias visuales compatibles en pantallas comunes.
- [ ] Ejecutar `bun run --cwd apps/web test:run`.
- [ ] Ejecutar `bun run typecheck`.
- [ ] Ejecutar `bun run build`.
- [ ] Revisar `git diff --check` y confirmar que no se introdujo lógica de reportes/BigQuery.
