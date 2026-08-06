# Nueva automatización UI/UX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rediseñar `/automatizaciones/nueva` como formulario guiado con resumen lateral y dependencias claras.

**Architecture:** Mantener `PaginaNuevaAutomatizacion` como coordinador de datos y mutación. Extraer la presentación del resumen y los cálculos de progreso/requisitos a unidades pequeñas, y extender `SelectBuscable` con estado deshabilitado accesible.

**Tech Stack:** React 18, TypeScript, TanStack Query/Router, Tailwind, Vitest, Testing Library.

## Global Constraints
- Mantener contratos de API y lógica de creación.
- No añadir dependencias.
- Textos en español y accesibilidad por teclado/ARIA.
- TDD obligatorio.

---

### Task 1: Estado del formulario y resumen
**Files:** Create `apps/web/src/modulos/automatizaciones/componentes/resumen-nueva-automatizacion.tsx`; Create test correspondiente.
- [ ] Escribir pruebas fallidas para progreso, ruta, faltantes y botón principal.
- [ ] Ejecutar pruebas y confirmar RED.
- [ ] Implementar componente y helper mínimo.
- [ ] Ejecutar pruebas y confirmar GREEN.

### Task 2: Pasos guiados y dependencias
**Files:** Modify `formulario-crear-automatizacion.tsx`; Modify `select-buscable.tsx`; Create/modify tests.
- [ ] Escribir pruebas fallidas para diseño de dos columnas, estados de pasos y select bloqueado.
- [ ] Ejecutar pruebas y confirmar RED.
- [ ] Implementar estructura guiada y estado disabled accesible.
- [ ] Ejecutar pruebas y confirmar GREEN.

### Task 3: Integración y protección de salida
**Files:** Modify `pagina-nueva-automatizacion.tsx`; Modify `pagina-nueva-automatizacion.test.tsx`.
- [ ] Escribir prueba fallida para aviso de salida con cambios.
- [ ] Ejecutar prueba y confirmar RED.
- [ ] Implementar `beforeunload` sin alterar creación.
- [ ] Ejecutar pruebas y confirmar GREEN.

### Task 4: Verificación visual y técnica
- [ ] Ejecutar suite completa, typecheck, build, Biome focalizado y `git diff --check`.
- [ ] Capturar `/automatizaciones/nueva` en Brave y revisar 1440 px.
