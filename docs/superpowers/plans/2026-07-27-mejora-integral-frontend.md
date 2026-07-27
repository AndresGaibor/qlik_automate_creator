# Mejora Integral del Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unificar el sistema visual, mejorar los estados funcionales y dividir los tres componentes más grandes sin alterar contratos de negocio.

**Architecture:** Primero se crean primitivas compartidas y se migran pantallas representativas. Después se corrigen estados y navegación. Finalmente se extraen componentes grandes manteniendo las páginas como coordinadores de datos.

**Tech Stack:** React, TypeScript, TanStack Query/Router, Tailwind CSS v4, Biome, Bun, Vitest.

## Global Constraints

- No añadir Storybook.
- Mantener nombres y copy en español salvo términos oficiales.
- No modificar contratos API ni persistencia.
- No usar gradientes, emojis o pulsos decorativos.
- Verificar cada tarea con Biome, typecheck, pruebas y build.

---

### Task 1: Primitivas visuales y diálogos

**Files:**
- Create: `apps/web/src/compartido/componentes/ui/dialogo.tsx`
- Create: `apps/web/src/compartido/componentes/ui/estado-etiqueta.tsx`
- Modify: `apps/web/src/compartido/componentes/ui/estado-carga.tsx`
- Modify: `apps/web/src/compartido/componentes/feedback/estado-error.tsx`
- Modify: `apps/web/src/compartido/componentes/ui/confirm-dialog.tsx`
- Test: `apps/web/src/compartido/componentes/ui/primitivas-visuales.test.ts`

**Interfaces:**
- Produces: `Dialogo`, `EstadoEtiqueta`, `EstadoCarga`, `EstadoError`.

- [ ] Escribir pruebas de clases, roles y etiquetas accesibles.
- [ ] Ejecutar la prueba y confirmar fallo inicial.
- [ ] Implementar primitivas sin lógica de negocio.
- [ ] Migrar `ConfirmDialog` a `Dialogo`.
- [ ] Ejecutar prueba, lint y typecheck web.

### Task 2: Consistencia visual en modales y estados

**Files:**
- Modify: modales de administración, automatizaciones y flujos.
- Modify: listas de organizaciones, superadministradores, flujos y automatizaciones.

**Interfaces:**
- Consumes: primitivas de Task 1.

- [ ] Reemplazar overlays y paneles duplicados por `Dialogo`.
- [ ] Reemplazar badges y puntos pulsantes por `EstadoEtiqueta`.
- [ ] Sustituir colores directos por tokens.
- [ ] Ejecutar búsqueda de gradientes, pulsos y colores no permitidos.
- [ ] Ejecutar lint, typecheck y pruebas.

### Task 3: Estados funcionales y navegación

**Files:**
- Create: `apps/web/src/compartido/componentes/feedback/estado-vacio.tsx`
- Create: `apps/web/src/compartido/componentes/feedback/estado-dependencia.tsx`
- Modify: páginas de flujos, automatizaciones, tablas y administración.

**Interfaces:**
- Produces: estados explícitos para vacío, permisos y configuración faltante.

- [ ] Escribir pruebas de contenido y acciones.
- [ ] Implementar estados compartidos.
- [ ] Migrar listas y páginas para diferenciar carga/error/vacío/configuración.
- [ ] Revisar filtros, totales y botones de limpiar.
- [ ] Ejecutar lint, typecheck, pruebas y build.

### Task 4: Extraer página de tablas

**Files:**
- Create: `apps/web/src/modulos/tablas/componentes/lista-tablas-destino.tsx`
- Create: `apps/web/src/modulos/tablas/componentes/detalle-tabla-destino.tsx`
- Create: `apps/web/src/modulos/tablas/componentes/modal-solicitar-tabla.tsx`
- Modify: `apps/web/src/modulos/tablas/pagina-tablas-destino.tsx`

**Interfaces:**
- Página coordina consultas y mutaciones; componentes reciben datos y callbacks tipados.

- [ ] Extraer tipos compartidos sin duplicarlos.
- [ ] Extraer lista y verificar comportamiento.
- [ ] Extraer detalle y modal.
- [ ] Confirmar reducción de tamaño y ausencia de cambios de red.
- [ ] Ejecutar verificación completa.

### Task 5: Extraer visor de workspace

**Files:**
- Create: `apps/web/src/modulos/automatizaciones/componentes/editor-json-workspace.tsx`
- Create: `apps/web/src/modulos/automatizaciones/componentes/topologia-workspace.tsx`
- Create: `apps/web/src/modulos/automatizaciones/componentes/dialogo-workspace.tsx`
- Modify: `apps/web/src/modulos/automatizaciones/componentes/visor-workspace-modal.tsx`

**Interfaces:**
- Visor conserva consultas/mutaciones; hijos reciben datos serializables y callbacks.

- [ ] Extraer editor JSON con validación.
- [ ] Extraer topología y panel de bloques.
- [ ] Migrar diálogo a primitiva compartida.
- [ ] Ejecutar pruebas y build.

### Task 6: Extraer setup técnico y cierre

**Files:**
- Create: `apps/web/src/modulos/admin/componentes/setup-tecnico/paso-qlik.tsx`
- Create: `apps/web/src/modulos/admin/componentes/setup-tecnico/paso-plantilla.tsx`
- Create: `apps/web/src/modulos/admin/componentes/setup-tecnico/paso-impala.tsx`
- Modify: `apps/web/src/modulos/admin/componentes/seccion-setup-tecnico.tsx`

**Interfaces:**
- Sección conserva consultas y mutaciones; pasos reciben estados y callbacks.

- [ ] Extraer cada paso con props explícitas.
- [ ] Eliminar estados duplicados y comentarios obsoletos.
- [ ] Ejecutar matriz completa, Docker y audit.
- [ ] Revisar diff, escaneo de secretos y publicar commits.
