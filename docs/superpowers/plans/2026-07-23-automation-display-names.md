# Nombres legibles en automatizaciones Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mostrar nombres legibles de espacios y propietarios en la pantalla de automatizaciones, resolviendo los IDs desde Qlik en el backend.

**Architecture:** El endpoint backend de automatizaciones enriquecerá el payload real de Qlik antes de mapearlo a la UI. Resolverá IDs únicos con lookups individuales/bulk y degradará al ID cuando Qlik no permita obtener el nombre. La UI seguirá usando `espacioNombre` y `ownerNombre`, sin llamadas directas a Qlik.

**Tech Stack:** Bun, TypeScript, Hono, React, Vitest/Bun test, Qlik Cloud REST APIs.

## Global Constraints

- Resolver espacios mediante `/api/v1/spaces` y `/api/v1/spaces/{spaceId}`.
- Resolver propietarios mediante `/api/v1/users/{ownerId}`.
- Usar `Promise.allSettled` para tolerar fallos parciales.
- Mostrar el nombre legible; usar el ID únicamente como fallback.
- No añadir dependencias, persistencia ni cache local.
- No exponer tokens ni detalles internos de errores al cliente.

## Archivos y responsabilidades

- `apps/api/src/infraestructura/qlik/cliente.ts`: cliente HTTP para lookups de Spaces y Users.
- `apps/api/src/infraestructura/qlik/tipos.ts`: shapes tolerantes del payload de Qlik, incluyendo nombres opcionales.
- `apps/api/src/modulos/qlik-automatizaciones/mapeador.ts`: transforma datos Qlik a nombres consumibles por la UI.
- `apps/api/src/modulos/qlik-automatizaciones/rutas.ts`: obtiene y deduplica lookups durante list/detail.
- `apps/api/src/modulos/qlik-automatizaciones/rutas.test.ts`: pruebas de enriquecimiento y degradación.
- `apps/api/src/infraestructura/qlik/cliente.test.ts`: pruebas de rutas y query params del cliente HTTP.
- `apps/web/src/modulos/automatizaciones/pagina-automatizaciones.tsx`: renderiza únicamente los campos enriquecidos existentes.
- `apps/web/src/__tests__/pagina-automatizaciones.test.tsx`: verifica que no se rendericen IDs cuando hay nombres.

---

### Task 1: Cubrir el contrato real de los lookups

**Files:**
- Modify: `apps/api/src/infraestructura/qlik/cliente.test.ts`
- Modify: `apps/api/src/modulos/qlik-automatizaciones/rutas.test.ts`
- Modify: `apps/web/src/__tests__/pagina-automatizaciones.test.tsx`

**Interfaces:**
- `ClienteQlik.obtenerEspacio(id: string): Promise<EspacioQlik>`
- `ClienteQlik.obtenerUsuario(id: string, campos?: string): Promise<UsuarioQlik>`
- `GET /api/qlik/automatizaciones` devuelve `ResumenAutomatizacion[]` con `espacioNombre` y `ownerNombre`.

- [ ] **Step 1: Añadir pruebas del query de Users API**

  Verificar que `obtenerUsuario("usr-1", "name,email,subject")` llame a `/api/v1/users/usr-1?fields=name,email,subject` y preserve la respuesta.

- [ ] **Step 2: Añadir prueba de payload real enriquecido**

  Usar una automatización con `spaceId` y `ownerId`, simular respuestas con `name`, y afirmar `espacioNombre`/`ownerNombre` legibles.

  Cubrir también que `GET /api/v1/spaces/{id}` pueda devolver tanto `{ data: espacio }` como el espacio directo.

- [ ] **Step 3: Añadir pruebas de fallos parciales**

  Simular `403` y `404` en Users o Spaces y afirmar HTTP `200`, con fallback al ID y sin excepción, tanto en list como en detail.

- [ ] **Step 4: Añadir prueba de no exposición del ID en UI**

  Renderizar una automatización con `spaceId: "sp-123"`, `espacioNombre: "Producción"` y comprobar que el texto contiene `Espacio: Producción` pero no `sp-123`.

- [ ] **Step 5: Ejecutar las pruebas nuevas para confirmar el contrato**

  Run: `bun test apps/api/src/infraestructura/qlik/cliente.test.ts apps/api/src/modulos/qlik-automatizaciones/rutas.test.ts`

  Expected: las pruebas nuevas fallan solo si falta la implementación correspondiente; las pruebas preexistentes no deben ocultar regresiones.

### Task 2: Implementar el enriquecimiento tolerante en backend

**Files:**
- Modify: `apps/api/src/infraestructura/qlik/cliente.ts`
- Modify: `apps/api/src/infraestructura/qlik/tipos.ts`
- Modify: `apps/api/src/modulos/qlik-automatizaciones/mapeador.ts`
- Modify: `apps/api/src/modulos/qlik-automatizaciones/rutas.ts`

**Interfaces:**
- `listarEspacios(): Promise<EspacioQlik[]>` se usa como lookup bulk.
- `obtenerEspacio(id)` completa los espacios que no aparecen en el listado.
- `obtenerUsuario(id, "name,email,subject")` resuelve el propietario.
- `aResumen(auto, mapaEsp, mapaUsr?)` mantiene la salida estable para la UI.

- [ ] **Step 1: Implementar el query opcional de Users API**

  Construir `?fields=${campos}` solo cuando `campos` exista y mantener la URL sin query para llamadas existentes.

- [ ] **Step 2: Resolver espacios únicos**

  Extraer `spaceId` no vacíos, deduplicarlos, intentar `listarEspacios()`, y completar faltantes con `Promise.allSettled` de `obtenerEspacio(id)`.

- [ ] **Step 3: Resolver propietarios únicos**

  Extraer `ownerId` no vacíos, deduplicarlos, llamar `obtenerUsuario(id, "name,email,subject")`, y guardar el primer valor no vacío en el orden `name`, `email`, `subject`.

- [ ] **Step 4: Aplicar fallback seguro en el mapeador**

  Usar `space.name` antes de `spaceId`, y `owner.name`, nombre resuelto, email, subject o ID para que una respuesta incompleta no cause `TypeError`.

- [ ] **Step 5: Enriquecer list y detail en paralelo**

  Obtener primero la automatización o lista; después ejecutar los resolvers de espacios y usuarios con `Promise.all`, sin hacer que los fallos internos de lookup fallen la ruta principal.

- [ ] **Step 6: Cubrir el mapeador y ejecutar pruebas backend**

  Crear `apps/api/src/modulos/qlik-automatizaciones/mapeador.test.ts` para probar nombres vacíos o con espacios y ejecutar:

  Run: `bun test apps/api/src/infraestructura/qlik/cliente.test.ts apps/api/src/modulos/qlik-automatizaciones/rutas.test.ts apps/api/src/modulos/qlik-automatizaciones/mapeador.test.ts`

  Expected: PASS, incluyendo fallos parciales, deduplicación, schema real y schema legacy.

### Task 3: Verificar la representación de la pantalla

**Files:**
- Modify only if required: `apps/web/src/modulos/automatizaciones/pagina-automatizaciones.tsx`
- Modify: `apps/web/src/__tests__/pagina-automatizaciones.test.tsx`

**Interfaces:**
- La página consume `ResumenAutomatizacion.espacioNombre` y `ResumenAutomatizacion.ownerNombre`.
- No debe realizar fetch adicional a `/api/v1/spaces` ni `/api/v1/users`.

- [ ] **Step 1: Confirmar que el componente no use IDs como etiqueta principal**

  Mantener `Espacio: {auto.espacioNombre}` y `Propietario: {auto.ownerNombre}`; solo cambiar el componente si el contrato de tipos obliga a un fallback visual.

- [ ] **Step 2: Ejecutar pruebas frontend**

  Run: `bun test apps/web/src/__tests__/pagina-automatizaciones.test.tsx`

  Expected: PASS, incluyendo nombres legibles, fechas, estados y ausencia del ID cuando existe nombre.

### Task 4: Validación completa y revisión

**Files:**
- Inspect: todos los archivos modificados y `docs/superpowers/specs/2026-07-23-automation-display-names-design.md`

- [ ] **Step 1: Ejecutar type-check y formatter/linter**

  Run: `bunx tsc --noEmit -p apps/api/tsconfig.json && bunx tsc --noEmit -p apps/web/tsconfig.json && bunx biome check apps/api/src apps/web/src`

  Expected: sin errores de tipos, lint ni formato.

- [ ] **Step 2: Ejecutar la suite del proyecto**

  Run: `bun test`

  Expected: todas las pruebas pasan.

- [ ] **Step 3: Solicitar revisión independiente**

  Revisar específicamente regresiones de permisos, exposición de datos, llamadas duplicadas y compatibilidad con schema real/legacy antes de declarar terminado.

- [ ] **Step 4: Inspeccionar diff final**

  Run: `git diff --check && git status --short`

  Expected: solo cambios relacionados con esta funcionalidad; no incluir `.env`, tokens ni artefactos generados.
