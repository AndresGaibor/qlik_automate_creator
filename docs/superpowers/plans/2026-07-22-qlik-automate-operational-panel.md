# Qlik Automate Operational Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the app into an operational Qlik Automate panel that can inspect automatizaciones, ver ejecuciones, ejecutar desde la UI, bloquear ejecuciones concurrentes y mostrar espacio, dueño y fechas.

**Architecture:** Expose a dedicated Qlik-operational API namespace so the frontend can read live Qlik data without colliding with the existing local config routes. The backend will enrich Qlik responses with space names, current run state, and execution guards; the frontend will render a list/detail workflow with execution controls and clear fallbacks.

**Tech Stack:** TypeScript, Hono, Bun test runner, React 18, TanStack Router, TanStack Query, Qlik Cloud REST API.

## Global Constraints

- Use Qlik Cloud REST under `/api/workflows` for new Automate functionality.
- Never expose OAuth tokens, cookies, or raw bearer tokens in UI or logs.
- Keep error responses useful and preserve HTTP status from Qlik when possible.
- Frontend fetches must keep `credentials: "include"` for existing session-based auth.
- No database migration is required for this phase.

---

### Task 1: Backend Qlik operational API

**Files:**
- Create: `apps/api/src/modulos/qlik-automatizaciones/tipos.ts`
- Create: `apps/api/src/modulos/qlik-automatizaciones/rutas.ts`
- Create: `apps/api/src/modulos/qlik-automatizaciones/mapeador.ts`
- Modify: `apps/api/src/infraestructura/qlik/cliente.ts`
- Modify: `apps/api/src/app.ts`
- Test: `apps/api/src/modulos/qlik-automatizaciones/rutas.test.ts`
- Test: `apps/api/src/infraestructura/qlik/cliente.test.ts`

**Interfaces:**
- Consumes: `ClienteQlik`, `obtenerTenantDesdeSesion()`, `obtenerCredencialesQlik()`.
- Produces: internal endpoints for list/detail/runs/execute/stop; helpers that map Qlik payloads into UI-friendly summaries.

- [ ] **Step 1: Write the failing tests**

Create tests that describe the new behavior:
- `GET /api/qlik/automatizaciones` returns automatizaciones enriched with `espacioNombre`, `ownerNombre`, `creadoEn`, `modificadoEn`, `ejecucionActiva`, `puedeEjecutar`.
- `GET /api/qlik/automatizaciones/:id` returns a detail payload with automation metadata + recent runs.
- `GET /api/qlik/automatizaciones/:id/runs` returns executions.
- `POST /api/qlik/automatizaciones/:id/run` returns `409` when the last run is active (`running`, `queued`, `pending`).
- `POST /api/qlik/automatizaciones/:id/run` triggers Qlik when no run is active.
- `POST /api/qlik/automatizaciones/:id/runs/:runId/stop` reaches the stop endpoint.

Run:
`bun test apps/api/src/modulos/qlik-automatizaciones/rutas.test.ts apps/api/src/infraestructura/qlik/cliente.test.ts`

Expected: FAIL until the new namespace and methods exist.

- [ ] **Step 2: Implement the minimal backend changes**

Add Qlik client methods for the missing operations:
- fetch automation detail by id
- fetch executions for an automation
- fetch a single execution if needed by the detail view
- stop an execution

Add a new backend router under `apps/api/src/modulos/qlik-automatizaciones/rutas.ts` that:
- resolves the session and Qlik credentials
- loads spaces once and maps `spaceId -> spaceName`
- maps Qlik automations to a UI-friendly summary object
- computes `ejecucionActiva` from recent runs
- blocks execution with `409` if a run is active
- preserves Qlik status codes for auth/permission/resource errors

Mount the router in `apps/api/src/app.ts` under `/api/qlik/automatizaciones`.

- [ ] **Step 3: Verify the backend tests pass**

Run:
`bun test apps/api/src/modulos/qlik-automatizaciones/rutas.test.ts apps/api/src/infraestructura/qlik/cliente.test.ts`

Expected: PASS.

- [ ] **Step 4: Commit the backend slice**

```bash
git add apps/api/src/infraestructura/qlik/cliente.ts apps/api/src/modulos/qlik-automatizaciones apps/api/src/app.ts apps/api/src/infraestructura/qlik/cliente.test.ts
git commit -m "feat: add qlik automate operational api"
```

---

### Task 2: Frontend operational list + detail

**Files:**
- Modify: `apps/web/src/app/router.tsx`
- Modify: `apps/web/src/modulos/automatizaciones/pagina-automatizaciones.tsx`
- Create: `apps/web/src/modulos/automatizaciones/pagina-detalle-automatizacion.tsx`
- Create: `apps/web/src/modulos/automatizaciones/api.ts`
- Test: `apps/web/src/__tests__/pagina-automatizaciones.test.tsx`
- Test: `apps/web/src/__tests__/pagina-detalle-automatizacion.test.tsx`

**Interfaces:**
- Consumes: `/api/qlik/automatizaciones`, `/api/qlik/automatizaciones/:id`, `/api/qlik/automatizaciones/:id/runs`, `/api/qlik/automatizaciones/:id/run`, `/api/qlik/automatizaciones/:id/runs/:runId/stop`.
- Produces: operational list card UI, detail page, execution table, disabled execute button when `ejecucionActiva` is true.

- [ ] **Step 1: Write the failing tests**

Add UI tests covering:
- list cards show `Nombre`, `Estado`, `Disparador`, `Espacio`, `Dueño`, `Creado`, `Modificado`.
- execute button is disabled and labeled when `ejecucionActiva` is true.
- detail page renders automation metadata and a list of executions.
- detail page shows empty state when there are no runs.
- execute action is unavailable while status is running.

Run:
`bun run --cwd apps/web test:run src/__tests__/pagina-automatizaciones.test.tsx src/__tests__/pagina-detalle-automatizacion.test.tsx`

Expected: FAIL until the new detail page and API calls exist.

- [ ] **Step 2: Implement the minimal frontend changes**

Update the router to add `/automatizaciones/:id`.

Create a small API helper module that wraps the new backend endpoints and normalizes response shapes.

Update the list page so each card:
- links to the detail view
- shows owner, space, creation and modification dates
- disables the execute button when the backend marks the automation as active/running

Implement the detail page to:
- fetch automation detail and recent runs
- show the latest run state and timestamps
- provide an execute button that refreshes state after success
- provide a stop button for active runs when available

- [ ] **Step 3: Verify the frontend tests pass**

Run:
`bun run --cwd apps/web test:run src/__tests__/pagina-automatizaciones.test.tsx src/__tests__/pagina-detalle-automatizacion.test.tsx`

Expected: PASS.

- [ ] **Step 4: Commit the frontend slice**

```bash
git add apps/web/src/app/router.tsx apps/web/src/modulos/automatizaciones apps/web/src/__tests__/pagina-automatizaciones.test.tsx apps/web/src/__tests__/pagina-detalle-automatizacion.test.tsx
git commit -m "feat: add qlik automate operational ui"
```

---

### Task 3: Docs and verification sweep

**Files:**
- Modify: `README.md`
- Modify: `docs/qlik-automate-api.md`
- Modify: `docs/oauth-qlik.md` if needed for endpoint references

**Interfaces:**
- Consumes: the final backend/frontend endpoint names and response shapes.
- Produces: updated developer docs for the new operational panel.

- [ ] **Step 1: Write the failing doc check**

Add a short doc checklist in the plan or a testable note in the README so the new namespace and UI route are discoverable.

- [ ] **Step 2: Update the docs**

Document:
- `/api/qlik/automatizaciones`
- `/api/qlik/automatizaciones/:id`
- `/api/qlik/automatizaciones/:id/runs`
- execution blocking behavior
- fields shown in the UI

- [ ] **Step 3: Verify the full slice**

Run:
`bun test apps/api/src/modulos/qlik-automatizaciones/rutas.test.ts apps/api/src/infraestructura/qlik/cliente.test.ts && bun run --cwd apps/web test:run src/__tests__/pagina-automatizaciones.test.tsx src/__tests__/pagina-detalle-automatizacion.test.tsx`

Expected: PASS.
