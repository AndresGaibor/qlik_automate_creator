# Espacios visibles para usuarios finales Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permitir que el administrador autorice espacios de Qlik Cloud y aplicar esa política de forma cerrada por defecto a Dataflows y automatizaciones de los usuarios finales.

**Architecture:** Una política persistida por tenant Qlik será resuelta en el backend a partir de la sesión y del encabezado de previsualización. Un servicio puro centralizará las decisiones de acceso; las rutas de Dataflows y automatizaciones lo usarán antes de listar, leer, ejecutar o crear recursos. La configuración administrativa consumirá endpoints propios y nunca dependerá del filtro visual para proteger datos.

**Tech Stack:** Bun, TypeScript 5.5, Hono, Zod, Drizzle ORM/PostgreSQL, React 18, TanStack Query/Router, Vitest y Testing Library.

## Global Constraints

- Trabajar directamente sobre `main`; no crear worktrees.
- El árbol ya contiene cambios no relacionados: no revertirlos ni incluirlos accidentalmente en commits.
- Antes de cada commit usar `git diff --cached --name-only`; realizar commits focalizados con `git commit --only <archivos>`.
- Acceso cerrado por defecto: sin política, sin espacios y sin recursos personales.
- La política se aplica a usuarios `usuario` y administradores con **Vista usuario final**.
- Un administrador en vista normal conserva acceso completo.
- En vista restringida no se renderiza el selector de espacio ni **Todos los espacios**; el listado combina todos los recursos autorizados.
- El filtro por espacio permanece únicamente para administradores en vista normal.
- El backend es autoritativo; frontend, URL directa y API deben coincidir.
- No añadir dependencias.
- Textos visibles en español.
- TDD obligatorio: observar RED antes de implementar y GREEN después.

---
## Mapa de archivos y responsabilidades

- `packages/contratos/src/admin/espacios-visibles.ts`: esquemas y tipos compartidos de política, catálogo y guardado.
- `apps/api/src/plataforma/persistencia/esquema.ts` y `apps/api/drizzle/0014_espacios_visibles_usuario_final.sql`: tablas y migración.
- `apps/api/src/modulos/espacios-visibles/aplicacion/puerto-configuracion-espacios-visibles.ts`: puerto de persistencia.
- `apps/api/src/modulos/espacios-visibles/infraestructura/repositorio-configuracion-espacios-visibles-postgres.ts`: lectura, reemplazo transaccional y caché.
- `apps/api/src/modulos/espacios-visibles/aplicacion/politica-acceso-recursos-qlik.ts`: decisión pura de autorización.
- `apps/api/src/modulos/espacios-visibles/http/resolver-politica-acceso.ts`: sesión, encabezado y política efectiva.
- `apps/api/src/modulos/admin/http/rutas-espacios-visibles.ts`: GET, PUT y sincronización administrativa.
- `apps/api/src/modulos/flujos/http/rutas.ts`: filtrado y protección de scripts/catálogos.
- `apps/api/src/modulos/automatizaciones/http/rutas-panel.ts`: filtrado y protección de operaciones.
- `apps/web/src/compartido/api/cliente.ts`: encabezado `X-Vista-Usuario-Final` para rutas no administrativas.
- `apps/web/src/modulos/admin/componentes/seccion-espacios-visibles.tsx`: selector administrativo.
- `apps/web/src/modulos/admin/pagina-detalle-tenant.tsx`: integración de la sección.
- `apps/web/src/modulos/flujos/pagina-flujos.tsx` y `apps/web/src/modulos/automatizaciones/pagina-automatizaciones.tsx`: estados cerrados, listado combinado y ocultamiento del selector en vista restringida.

---

### Task 1: Contratos, esquema y migración

**Files:**
- Create: `packages/contratos/src/admin/espacios-visibles.ts`
- Modify: `packages/contratos/src/admin/index.ts`
- Modify: `apps/api/src/plataforma/persistencia/esquema.ts`
- Create: `apps/api/drizzle/0014_espacios_visibles_usuario_final.sql`
- Modify: `apps/api/drizzle/meta/_journal.json`
- Modify: `apps/api/src/esquema.test.ts`
- Test: `packages/contratos/src/admin/espacios-visibles.test.ts`
**Interfaces:**
- Produces: `ConfiguracionEspaciosVisibles`, `EspacioConfigurable`, `CatalogoEspaciosVisibles`, `GuardarEspaciosVisibles`, `ResultadoGuardarEspaciosVisibles`.
- Produces tables: `configuracionEspaciosVisibles` and `espaciosVisiblesUsuarioFinal`.

- [ ] **Step 1: Write failing contract tests**

```ts
import { expect, test } from "bun:test";
import { esquemaGuardarEspaciosVisibles } from "./espacios-visibles.js";

test("normaliza IDs repetidos y mantiene acceso cerrado", () => {
  expect(
    esquemaGuardarEspaciosVisibles.parse({
      espaciosPermitidosIds: ["space-1", "space-1"],
      permitirRecursosSinEspacio: false,
    }),
  ).toEqual({
    espaciosPermitidosIds: ["space-1"],
    permitirRecursosSinEspacio: false,
  });
});
```

- [ ] **Step 2: Run the contract test and confirm RED**

Run: `bun test packages/contratos/src/admin/espacios-visibles.test.ts`
Expected: FAIL because `espacios-visibles.ts` does not exist.

- [ ] **Step 3: Add the shared schemas**

```ts
export const esquemaGuardarEspaciosVisibles = z.object({
  espaciosPermitidosIds: z.array(esquemaIdQlik).max(500).transform((ids) => [...new Set(ids)]),
  permitirRecursosSinEspacio: z.boolean(),
});
export const esquemaConfiguracionEspaciosVisibles = z.object({
  tenantQlikId: z.string().uuid(),
  espaciosPermitidosIds: z.array(esquemaIdQlik),
  permitirRecursosSinEspacio: z.boolean(),
  configurada: z.boolean(),
  actualizadoEn: z.string().datetime().nullable(),
});
```
Define `EspacioConfigurable` with `id`, `nombre`, `tipo`, `disponible`, `seleccionado`, and optional `cantidadFlujos`/`cantidadAutomatizaciones`. Define `CatalogoEspaciosVisibles` as `{ configuracion, espacios }` and `ResultadoGuardarEspaciosVisibles` as `{ configuracion, anadidos, retirados }`. Export all types from `admin/index.ts`.

- [ ] **Step 4: Write the failing schema test**

```ts
it("configuracionEspaciosVisibles tiene cierre por defecto y FK al tenant", () => {
  const config = getTableConfig(configuracionEspaciosVisibles);
  expect(config.columns.map((c) => c.name)).toEqual(
    expect.arrayContaining([
      "tenant_qlik_id",
      "permitir_recursos_sin_espacio",
      "actualizado_por_usuario_id",
    ]),
  );
});
```

- [ ] **Step 5: Add Drizzle tables and migration**

Use a one-to-one configuration table with `tenantQlikId` as primary key and a join table with a composite unique key:

```ts
export const configuracionEspaciosVisibles = pgTable("configuracion_espacios_visibles", {
  tenantQlikId: uuid("tenant_qlik_id").primaryKey().references(() => tenantsQlik.id, { onDelete: "cascade" }),
  permitirRecursosSinEspacio: boolean("permitir_recursos_sin_espacio").notNull().default(false),
  actualizadoEn: timestamp("actualizado_en").notNull().defaultNow(),
  actualizadoPorUsuarioId: uuid("actualizado_por_usuario_id").references(() => usuarios.id, { onDelete: "set null" }),
});
```

The SQL migration must create both tables, foreign keys, and the composite primary key. Add journal entry `idx: 14`, tag `0014_espacios_visibles_usuario_final`.

- [ ] **Step 6: Verify contracts and schema**

Run: `bun test packages/contratos/src/admin/espacios-visibles.test.ts apps/api/src/esquema.test.ts`
Expected: PASS.

- [ ] **Step 7: Commit only Task 1 files**

```bash
git commit --only packages/contratos/src/admin/espacios-visibles.ts packages/contratos/src/admin/espacios-visibles.test.ts packages/contratos/src/admin/index.ts apps/api/src/plataforma/persistencia/esquema.ts apps/api/src/esquema.test.ts apps/api/drizzle/0014_espacios_visibles_usuario_final.sql apps/api/drizzle/meta/_journal.json -m "feat: definir persistencia de espacios visibles"
```

---
### Task 2: Repositorio transaccional de la política

**Files:**
- Create: `apps/api/src/modulos/espacios-visibles/aplicacion/puerto-configuracion-espacios-visibles.ts`
- Create: `apps/api/src/modulos/espacios-visibles/infraestructura/repositorio-configuracion-espacios-visibles-postgres.ts`
- Create: `apps/api/src/modulos/espacios-visibles/infraestructura/repositorio-configuracion-espacios-visibles-postgres.test.ts`
- Create: `apps/api/src/modulos/espacios-visibles/publico.ts`

**Interfaces:**
- Consumes: Drizzle tables from Task 1.
- Produces:

```ts
interface PuertoConfiguracionEspaciosVisibles {
  obtener(tenantQlikId: string): Promise<ConfiguracionEspaciosVisibles>;
  reemplazar(tenantQlikId: string, entrada: GuardarEspaciosVisibles, usuarioId?: string): Promise<ResultadoGuardarEspaciosVisibles>;
  listarCatalogoCache(tenantQlikId: string): Promise<Array<{ id: string; nombre: string; tipo: string }>>;
  sincronizarCatalogo(tenantQlikId: string, espacios: EspacioConfigurable[]): Promise<void>;
}
```

- [ ] **Step 1: Write failing repository tests**

```ts
it("devuelve política cerrada cuando no existe fila", async () => {
  const politica = await repositorio.obtener(tenantId);
  expect(politica).toMatchObject({
    tenantQlikId: tenantId,
    espaciosPermitidosIds: [],
    permitirRecursosSinEspacio: false,
    configurada: false,
  });
});

it("reemplaza IDs dentro de una única transacción", async () => {
  const resultado = await repositorio.reemplazar(
    tenantId,
    { espaciosPermitidosIds: ["space-2"], permitirRecursosSinEspacio: true },
    usuarioId,
  );
  expect(resultado).toMatchObject({ anadidos: ["space-2"], retirados: ["space-1"] });
});
```
Use the existing database-test pattern or a transaction-aware fake; assert that a thrown insert leaves the old selection unchanged.

- [ ] **Step 2: Run repository tests and confirm RED**

Run: `bun test apps/api/src/modulos/espacios-visibles/infraestructura/repositorio-configuracion-espacios-visibles-postgres.test.ts`
Expected: FAIL because the repository and port do not exist.

- [ ] **Step 3: Implement closed-default reads**

`obtener()` must read the main row and selected IDs in parallel. When the main row is absent, return `configurada: false`, empty IDs, `false`, and `actualizadoEn: null`.

- [ ] **Step 4: Implement atomic replacement**

Inside `db.transaction`:

```ts
const anterior = await leerPolitica(tx, tenantQlikId);
await tx.insert(configuracionEspaciosVisibles).values({...}).onConflictDoUpdate({...});
await tx.delete(espaciosVisiblesUsuarioFinal).where(eq(...));
if (entrada.espaciosPermitidosIds.length) {
  await tx.insert(espaciosVisiblesUsuarioFinal).values(
    entrada.espaciosPermitidosIds.map((id) => ({ tenantQlikId, espacioIdQlik: id })),
  );
}
return calcularDiferencia(anterior, entrada);
```

`configurada` becomes `true` after an explicit save, including an intentionally empty policy. Access remains closed because the selected IDs and personal flag are empty/false.

- [ ] **Step 5: Implement catalog cache synchronization**

Upsert `espaciosQlikCache` by `(tenantQlikId, espacioIdQlik)`, clear `eliminadoEn` for current spaces, and mark missing cached rows with `eliminadoEn = now`. Do not modify the authorization tables.

- [ ] **Step 6: Run repository tests**

Run: `bun test apps/api/src/modulos/espacios-visibles/infraestructura/repositorio-configuracion-espacios-visibles-postgres.test.ts`
Expected: PASS, including rollback behavior.

- [ ] **Step 7: Commit only Task 2 files**

```bash
git commit --only apps/api/src/modulos/espacios-visibles -m "feat: persistir política de espacios visibles"
```

---

### Task 3: API administrativa y sincronización

**Files:**
- Create: `apps/api/src/modulos/admin/http/rutas-espacios-visibles.ts`
- Create: `apps/api/src/modulos/admin/http/rutas-espacios-visibles.test.ts`
- Modify: `apps/api/src/modulos/admin/http/rutas-admin.ts`
- Modify: `apps/api/src/app.ts`
**Interfaces:**
- Consumes: `PuertoConfiguracionEspaciosVisibles`, `RepositorioAdministracion`, `ResolverContextoAdmin`, `ServicioQlik`, `PuertoAuditoria`.
- Produces the three endpoints approved in the spec.

- [ ] **Step 1: Write failing route tests**

```ts
it("GET combina selección guardada con espacios disponibles", async () => {
  const respuesta = await app.request(`/organizaciones/${orgId}/tenants-qlik/${tenantId}/espacios-visibles`);
  expect(respuesta.status).toBe(200);
  expect((await respuesta.json()).datos.espacios).toEqual(
    expect.arrayContaining([expect.objectContaining({ id: "space-1", seleccionado: true })]),
  );
});

it("PUT reemplaza, audita y devuelve añadidos y retirados", async () => {
  const respuesta = await app.request(ruta, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ espaciosPermitidosIds: ["space-2"], permitirRecursosSinEspacio: false }),
  });
  expect(respuesta.status).toBe(200);
  expect(auditoria.registrar).toHaveBeenCalledWith(expect.objectContaining({ accion: "espacios_visibles.actualizar" }));
});
```

Add these route cases in the same file:

```ts
expect((await usuarioApp.request(ruta)).status).toBe(403);
expect((await adminApp.request(rutaTenantAjeno)).status).toBe(404);
expect((await guardar(["space-1", "space-1"])).datos.configuracion.espaciosPermitidosIds).toEqual(["space-1"]);
await expect(sincronizarConFallo()).resolves.toMatchObject({ status: 502 });
expect(await repositorio.obtener(tenantId)).toEqual(politicaAnterior);
```

- [ ] **Step 2: Run route tests and confirm RED**

Run: `bun test apps/api/src/modulos/admin/http/rutas-espacios-visibles.test.ts`
Expected: FAIL because routes are absent.

- [ ] **Step 3: Implement tenant ownership guard**

Resolve admin context, call `exigirAccesoOrganizacion`, and verify the path tenant is contained in `repositorio.listarTenantsQlik(organizacionId)`. Return `404` without revealing tenants from another organization.

- [ ] **Step 4: Implement GET and PUT**

GET combines current cache with selected IDs. Selected IDs missing from cache must be returned as `{ nombre: id, tipo: "desconocido", disponible: false, seleccionado: true }`.

PUT parses `esquemaGuardarEspaciosVisibles`, rejects unknown IDs only when the synchronized catalog is available, calls `reemplazar`, and records previous/new values through `PuertoAuditoria`.
- [ ] **Step 5: Implement synchronization without policy mutation**

The sync route must require that the path tenant equals the active session tenant used by `resolverQlik`; otherwise return `409` with code `TENANT_QLIK_NO_ACTIVO`. Fetch spaces with `qlik.listarEspacios({ limit: 100, sort: "+name" })`, map them, and call `sincronizarCatalogo`. Do not call `reemplazar`.

- [ ] **Step 6: Wire routes in the composition root**

Instantiate `RepositorioConfiguracionEspaciosVisiblesPostgres(db)` once in `app.ts`. Pass it, `resolverQlik`, a full session resolver, and `auditoria` through `crearRutasAdmin`.

- [ ] **Step 7: Run admin route tests**

Run: `bun test apps/api/src/modulos/admin/http/rutas-espacios-visibles.test.ts apps/api/src/app.test.ts`
Expected: PASS.

- [ ] **Step 8: Commit only Task 3 files**

```bash
git commit --only apps/api/src/modulos/admin/http/rutas-espacios-visibles.ts apps/api/src/modulos/admin/http/rutas-espacios-visibles.test.ts apps/api/src/modulos/admin/http/rutas-admin.ts apps/api/src/app.ts -m "feat: administrar espacios visibles de Qlik"
```

---

### Task 4: Política central y modo de previsualización

**Files:**
- Create: `apps/api/src/modulos/espacios-visibles/aplicacion/politica-acceso-recursos-qlik.ts`
- Create: `apps/api/src/modulos/espacios-visibles/aplicacion/politica-acceso-recursos-qlik.test.ts`
- Create: `apps/api/src/modulos/espacios-visibles/http/resolver-politica-acceso.ts`
- Create: `apps/api/src/modulos/espacios-visibles/http/resolver-politica-acceso.test.ts`
- Modify: `apps/api/src/nucleo/errores/error-aplicacion.ts`
- Modify: `apps/api/src/plataforma/http/middlewares/cors.ts`
- Modify: `apps/api/src/app.ts`

**Interfaces:**

```ts
interface ContextoSesionRecursos {
  tenantId: string;
  usuarioId: string;
  organizacionId: string;
  esSuperadmin: boolean;
  roles: Array<"admin" | "usuario">;
}
interface PoliticaAccesoRecursosQlik {
  restringida: boolean;
  configurada: boolean;
  espaciosPermitidosIds: string[];
  permitirRecursosSinEspacio: boolean;
  puedeVerEspacio(id?: string | null): boolean;
  filtrarPorEspacios<T extends { espacioId?: string }>(items: T[]): T[];
  exigirAcceso(id?: string | null): void;
}
```
- [ ] **Step 1: Write failing pure-policy tests**

```ts
const politicaCon = (
  cambios: Partial<ConfiguracionEspaciosVisibles>,
) => crearPoliticaAccesoRecursosQlik({
  contexto: { esSuperadmin: false, roles: ["usuario"] },
  vistaUsuarioFinal: false,
  configuracion: {
    tenantQlikId: "00000000-0000-4000-8000-000000000001",
    espaciosPermitidosIds: [],
    permitirRecursosSinEspacio: false,
    configurada: true,
    actualizadoEn: null,
    ...cambios,
  },
});

it("restringe usuario y cierra cuando no existe configuración", () => {
  const politica = crearPoliticaAccesoRecursosQlik({
    contexto: { esSuperadmin: false, roles: ["usuario"] },
    vistaUsuarioFinal: false,
    configuracion: null,
  });
  expect(politica.restringida).toBe(true);
  expect(politica.puedeVerEspacio("space-1")).toBe(false);
});

it("admin normal ve todo y admin en vista final queda restringido", () => {
  const configuracion = {
    tenantQlikId: "00000000-0000-4000-8000-000000000001",
    espaciosPermitidosIds: [],
    permitirRecursosSinEspacio: false,
    configurada: true,
    actualizadoEn: null,
  };
  const normal = crearPoliticaAccesoRecursosQlik({
    contexto: { esSuperadmin: false, roles: ["admin"] },
    vistaUsuarioFinal: false,
    configuracion,
  });
  const previsualizacion = crearPoliticaAccesoRecursosQlik({
    contexto: { esSuperadmin: false, roles: ["admin"] },
    vistaUsuarioFinal: true,
    configuracion,
  });
  expect(normal.puedeVerEspacio("x")).toBe(true);
  expect(previsualizacion.puedeVerEspacio("x")).toBe(false);
});

it("controla los recursos personales de forma independiente", () => {
  expect(politicaCon({ permitirRecursosSinEspacio: false }).puedeVerEspacio()).toBe(false);
  expect(politicaCon({ permitirRecursosSinEspacio: true }).puedeVerEspacio()).toBe(true);
});
```

- [ ] **Step 2: Run pure-policy tests and confirm RED**

Run: `bun test apps/api/src/modulos/espacios-visibles/aplicacion/politica-acceso-recursos-qlik.test.ts`
Expected: FAIL because the service does not exist.

- [ ] **Step 3: Implement the pure policy and 403 error**

Add `ErrorEspacioNoAutorizado extends ErrorAplicacion` with status `403` and code `ESPACIO_NO_AUTORIZADO`. `exigirAcceso()` throws it; `filtrarPorEspacios()` never throws and returns only authorized items.

- [ ] **Step 4: Write failing resolver tests**

```ts
it("X-Vista-Usuario-Final solo agrega restricciones", async () => {
  const politica = await resolverPolitica(contextoConHeader("1", admin));
  expect(politica.restringida).toBe(true);
});

it("un usuario sigue restringido aunque el encabezado falte o sea 0", async () => {
  expect((await resolverPolitica(contextoSinHeader(usuario))).restringida).toBe(true);
});
```

- [ ] **Step 5: Implement the HTTP resolver and full session resolver**

Expand the resource-session resolver in `app.ts` to return `esSuperadmin` and `roles` from `ContextoSolicitudAutenticado`. Parse the preview header strictly as `c.req.header("x-vista-usuario-final") === "1"`, load policy by active tenant ID, and create the pure service.
- [ ] **Step 6: Allow the preview header in CORS**

Configure every branch of `crearMiddlewareCors` with `allowHeaders` containing `Content-Type`, `Authorization`, `Idempotency-Key`, and `X-Vista-Usuario-Final`.

- [ ] **Step 7: Run policy and resolver tests**

Run: `bun test apps/api/src/modulos/espacios-visibles/aplicacion/politica-acceso-recursos-qlik.test.ts apps/api/src/modulos/espacios-visibles/http/resolver-politica-acceso.test.ts`
Expected: PASS.

- [ ] **Step 8: Commit only Task 4 files**

```bash
git commit --only apps/api/src/modulos/espacios-visibles apps/api/src/nucleo/errores/error-aplicacion.ts apps/api/src/plataforma/http/middlewares/cors.ts apps/api/src/app.ts -m "feat: centralizar acceso por espacio de Qlik"
```

---

### Task 5: Proteger Dataflows

**Files:**
- Modify: `apps/api/src/modulos/flujos/http/rutas.ts`
- Create: `apps/api/src/modulos/flujos/http/rutas-espacios-visibles.test.ts`
- Modify: `apps/api/src/modulos/flujos/publico.ts`
- Modify: `apps/api/src/app.ts`

**Interfaces:**
- Consumes: `resolverPoliticaAcceso(c)` from Task 4.
- Produces: listados filtrados and `403 ESPACIO_NO_AUTORIZADO` for direct operations.
- [ ] **Step 1: Write failing Dataflow route tests**

Create cases that assert:

```ts
const denied = await app.request("/?espacioId=space-denied");
expect(denied.status).toBe(403);
expect(consulta.listar).not.toHaveBeenCalled();

const listado = (await (await app.request("/")).json()).datos;
expect(listado.map((item: { id: string }) => item.id)).toEqual(["flow-allowed"]);

const script = await app.request("/flow-denied/script");
expect(script.status).toBe(403);
expect(qlik.obtenerScriptApp).not.toHaveBeenCalled();
```

Add equivalent coverage for `catalogo-spark` and for personal resources when the special permission is enabled.

- [ ] **Step 2: Run Dataflow tests and confirm RED**

Run: `bun test apps/api/src/modulos/flujos/http/rutas-espacios-visibles.test.ts`
Expected: FAIL because routes do not consume the policy.

- [ ] **Step 3: Protect the list endpoint**

Resolve the policy before calling Qlik. When the requested `espacioId` is present, call `politica.exigirAcceso(espacioId)` first. Without an explicit filter, load the list and apply `politica.filtrarPorEspacios(lista)` before text search.

- [ ] **Step 4: Protect direct Dataflow operations**

Create a local helper that loads `consulta.listar()` without a space filter, locates the Dataflow by ID, returns `404` when absent, then calls `politica.exigirAcceso(flujo.espacioId)`. Invoke it before `obtenerScriptApp` and before parsing the Spark catalog.

- [ ] **Step 5: Wire the resolver and run tests**

Run: `bun test apps/api/src/modulos/flujos/http/rutas-espacios-visibles.test.ts apps/api/src/modulos/flujos`
Expected: PASS.

- [ ] **Step 6: Commit only Task 5 files**

```bash
git commit --only apps/api/src/modulos/flujos apps/api/src/app.ts -m "feat: restringir Dataflows por espacios visibles"
```

---
### Task 6: Proteger automatizaciones, ejecuciones y creación

**Files:**
- Modify: `apps/api/src/modulos/automatizaciones/http/rutas-panel.ts`
- Create: `apps/api/src/modulos/automatizaciones/http/rutas-panel-espacios-visibles.test.ts`
- Modify: `packages/contratos/src/automatizaciones/panel.ts`
- Modify: `apps/api/src/app.ts`

**Interfaces:**
- Consumes: `resolverPoliticaAcceso(c)` and `ContextoSesionRecursos`.
- Extends `ConfiguracionTenant` with:

```ts
accesoEspacios: {
  restringido: boolean;
  configurada: boolean;
  espaciosPermitidosIds: string[];
  permitirRecursosSinEspacio: boolean;
}
```

- [ ] **Step 1: Write failing automation route tests**

Cover these exact expectations:

```ts
expect(ids(await get("/?espacioId=space-denied"))).toRejectWithStatus(403);
expect(ids(await get("/"))).toEqual(["automation-allowed"]);
expect((await get("/automation-denied")).status).toBe(403);
expect((await post("/automation-denied/ejecuciones")).status).toBe(403);
expect((await get("/automation-denied/workspace")).status).toBe(403);
```

Also test update workspace, clone, stop execution, allowed personal resource, blocked personal resource, and admin normal access.

- [ ] **Step 2: Write failing creation tests**

A request containing a known hidden `flujoId` must return `403` before `prepararParametrosPlantilla` or copying the template. For a restricted request using an allowed Dataflow, the route must override `espacioIdQlik` with the Dataflow's authorized `espacioId`; personal Dataflows keep it undefined only when personal access is enabled.
- [ ] **Step 3: Run automation tests and confirm RED**

Run: `bun test apps/api/src/modulos/automatizaciones/http/rutas-panel-espacios-visibles.test.ts`
Expected: FAIL because no route enforces the policy.

- [ ] **Step 4: Add authorization helpers**

Create route-local helpers:

```ts
async function obtenerAutomatizacionAutorizada(c, id) {
  const qlik = await dependencias.resolverQlik(c);
  const politica = await dependencias.resolverPoliticaAcceso(c);
  const automatizacion = await qlik.obtenerAutomatizacion(id);
  politica.exigirAcceso(automatizacion.spaceId);
  return { qlik, automatizacion, politica };
}
```

For list and spaces endpoints, filter mapped results. For an explicit forbidden `espacioId`, reject before querying Qlik.

- [ ] **Step 5: Apply the helper to every direct operation**

Use it for detail, workspace GET/PUT, clone, execute, stop execution, and any route that returns automation metadata. Perform authorization before mutations and before returning schedules or execution history.

- [ ] **Step 6: Protect creation from a hidden Dataflow**

Before preparing template parameters, call `qlik.listarFlujos()` and find `flujoId`. Return `404` when absent; call `politica.exigirAcceso(flujo.spaceId)` when present. For restricted access, construct the parsed request with `espacioIdQlik: flujo.spaceId` instead of trusting the client.

- [ ] **Step 7: Expose effective policy in tenant configuration**

Return the `accesoEspacios` object from `/configuracion-tenant`. Administrators in normal view receive `restringido: false`; users and previewing admins receive the persisted policy.

- [ ] **Step 8: Run automation tests**

Run: `bun test apps/api/src/modulos/automatizaciones/http/rutas-panel-espacios-visibles.test.ts apps/api/src/modulos/automatizaciones`
Expected: PASS.

- [ ] **Step 9: Commit only Task 6 files**

```bash
git commit --only apps/api/src/modulos/automatizaciones/http/rutas-panel.ts apps/api/src/modulos/automatizaciones/http/rutas-panel-espacios-visibles.test.ts packages/contratos/src/automatizaciones/panel.ts apps/api/src/app.ts -m "feat: restringir automatizaciones por espacios visibles"
```

---
### Task 7: Enviar la Vista usuario final al backend

**Files:**
- Modify: `apps/web/src/compartido/api/cliente.ts`
- Modify: `apps/web/src/compartido/api/cliente.test.ts`
- Modify: `apps/web/src/app/contexto-vista.tsx`
- Modify: `apps/web/src/app/contexto-vista.test.tsx`
- Modify: `apps/web/src/app/layout-principal.tsx`
- Modify: `apps/web/src/app/layout-principal.test.tsx`

**Interfaces:**
- Produces: `clienteApi.setVistaUsuarioFinal(activa: boolean): void`.
- The header is added only when active and the API route does not start with `/admin/`.

- [ ] **Step 1: Write failing client tests**

```ts
cliente.setVistaUsuarioFinal(true);
await cliente.get("/flujos");
expect(fetch).toHaveBeenCalledWith(
  expect.any(URL),
  expect.objectContaining({ headers: expect.objectContaining({ "X-Vista-Usuario-Final": "1" }) }),
);

await cliente.get("/admin/tenants");
expect(lastRequestHeaders()).not.toHaveProperty("X-Vista-Usuario-Final");
```

- [ ] **Step 2: Run client tests and confirm RED**

Run: `bun run --cwd apps/web test:run src/compartido/api/cliente.test.ts`
Expected: FAIL because the setter does not exist.

- [ ] **Step 3: Implement client header state**

Store a private boolean in `ClienteApi`. During `solicitar`, merge the preview header after defaults and before explicit per-call headers. Never add it for `/admin` routes.

- [ ] **Step 4: Write layout/context tests**

Verify that toggling the checkbox calls the setter and invalidates resource queries with prefixes `flujos` and `automatizaciones`, while leaving `admin-*` queries intact.

- [ ] **Step 5: Connect the toggle**

In `ContenidoLayoutPrincipal`, use an effect on `estado.modoUsuarioFinal` to update `clienteApi`, remove persisted space filters by invalidation/validation in Task 9, and invalidate Qlik resource queries so the same page reloads under the stricter backend policy.

- [ ] **Step 6: Run web client/layout tests**

Run: `bun run --cwd apps/web test:run src/compartido/api/cliente.test.ts src/app/contexto-vista.test.tsx src/app/layout-principal.test.tsx`
Expected: PASS.

- [ ] **Step 7: Commit only Task 7 files**

```bash
git commit --only apps/web/src/compartido/api/cliente.ts apps/web/src/compartido/api/cliente.test.ts apps/web/src/app/contexto-vista.tsx apps/web/src/app/contexto-vista.test.tsx apps/web/src/app/layout-principal.tsx apps/web/src/app/layout-principal.test.tsx -m "feat: propagar vista de usuario final a la API"
```

---
### Task 8: Cliente y sección administrativa de Espacios visibles

**Files:**
- Modify: `apps/web/src/modulos/admin/api.ts`
- Create: `apps/web/src/modulos/admin/componentes/seccion-espacios-visibles.tsx`
- Create: `apps/web/src/modulos/admin/componentes/seccion-espacios-visibles.test.tsx`
- Create: `apps/web/src/modulos/admin/utiles-espacios-visibles.ts`
- Create: `apps/web/src/modulos/admin/utiles-espacios-visibles.test.ts`

**Interfaces:**
- Produces API functions `obtenerEspaciosVisibles`, `guardarEspaciosVisibles`, `sincronizarEspaciosVisibles`.
- Produces helpers `filtrarEspaciosConfigurables`, `seleccionarTodosVisibles`, `calcularImpactoRetiro`.

- [ ] **Step 1: Write failing helper tests**

```ts
expect(
  seleccionarTodosVisibles(["space-previous"], espacios, "ventas"),
).toEqual(["space-previous", "space-sales"]);

expect(calcularImpactoRetiro(["space-1"], [], espacios)).toEqual({
  espacios: 1,
  flujos: 2,
  automatizaciones: 3,
});
```

- [ ] **Step 2: Implement pure helpers and run tests**

Run first: `bun run --cwd apps/web test:run src/modulos/admin/utiles-espacios-visibles.test.ts`
Expected RED, then implement accent-insensitive name/type search, stable deduplication, visible-only selection, and optional impact counts. Run again and expect PASS.

- [ ] **Step 3: Write failing component tests**

Render the section with a catalog and assert:

```ts
expect(screen.getByText("1 de 3 espacios habilitados")).toBeInTheDocument();
fireEvent.change(screen.getByRole("searchbox"), { target: { value: "ventas" } });
fireEvent.click(screen.getByRole("button", { name: "Seleccionar todos los visibles" }));
expect(screen.getByLabelText("Ventas")).toBeChecked();
expect(screen.getByLabelText(/recursos personales/i)).not.toBeChecked();
```

Also cover empty catalog, unavailable selected space, pending changes, save disabled without changes, loading, sync failure, and removal confirmation with counts.

- [ ] **Step 4: Run component tests and confirm RED**

Run: `bun run --cwd apps/web test:run src/modulos/admin/componentes/seccion-espacios-visibles.test.tsx`
Expected: FAIL because the component does not exist.
- [ ] **Step 5: Implement API functions and query/mutation flow**

Use query key `["admin-espacios-visibles", organizacionId, tenantQlikId]`. Save replaces the complete selection; sync calls POST then invalidates the same query. Notifications must say `Espacios visibles guardados` and `Espacios actualizados desde Qlik Cloud`.

- [ ] **Step 6: Implement the accessible section**

Use the existing `Card`, `Button`, `ConfirmDialog`, and checkbox styles. Keep local draft state initialized from query data. Show:

- search field with `type="search"`;
- count `N de M espacios habilitados`;
- per-space checkbox, type, unavailable badge, and optional resource counts;
- visible-only selection and clear actions;
- independent personal/sin-space checkbox;
- pending-change status;
- sync and save buttons.

Register `beforeunload` only while draft differs from persisted data. On removing selected spaces, open `ConfirmDialog` before calling the save mutation.

- [ ] **Step 7: Run component and helper tests**

Run: `bun run --cwd apps/web test:run src/modulos/admin/utiles-espacios-visibles.test.ts src/modulos/admin/componentes/seccion-espacios-visibles.test.tsx`
Expected: PASS.

- [ ] **Step 8: Commit only Task 8 files**

```bash
git commit --only apps/web/src/modulos/admin/api.ts apps/web/src/modulos/admin/componentes/seccion-espacios-visibles.tsx apps/web/src/modulos/admin/componentes/seccion-espacios-visibles.test.tsx apps/web/src/modulos/admin/utiles-espacios-visibles.ts apps/web/src/modulos/admin/utiles-espacios-visibles.test.ts -m "feat: configurar espacios visibles desde administración"
```

---

### Task 9: Integrar configuración y experiencia de usuario final

**Files:**
- Modify: `apps/web/src/modulos/admin/pagina-detalle-tenant.tsx`
- Modify: `apps/web/src/modulos/admin/utiles-estado-configuracion.ts`
- Modify: `apps/web/src/modulos/admin/utiles-estado-configuracion.test.ts`
- Modify: `apps/web/src/modulos/admin/componentes/resumen-configuracion.tsx`
- Modify: `apps/web/src/modulos/admin/pagina-detalle-tenant-configuracion.test.tsx`
- Modify: `apps/web/src/modulos/automatizaciones/api.ts`
- Modify: `apps/web/src/modulos/automatizaciones/pagina-automatizaciones.tsx`
- Modify: `apps/web/src/modulos/automatizaciones/componentes/barra-filtros-automatizaciones.tsx`
- Create: `apps/web/src/modulos/automatizaciones/componentes/barra-filtros-automatizaciones.test.tsx`
- Modify: `apps/web/src/modulos/flujos/pagina-flujos.tsx`
- Modify: `apps/web/src/modulos/flujos/componentes/barra-filtros-flujos.tsx`
- Create: `apps/web/src/modulos/flujos/componentes/barra-filtros-flujos.test.tsx`
- Modify: `apps/web/src/compartido/hooks/use-filtro-espacio-con-persistencia.ts`
- Create: `apps/web/src/compartido/hooks/use-filtro-espacio-con-persistencia.test.tsx`
- Create: `apps/web/src/compartido/componentes/feedback/estado-sin-espacios-qlik.tsx`
- Create: `apps/web/src/compartido/componentes/feedback/estado-sin-espacios-qlik.test.tsx`
**Interfaces:**
- Adds section ID `espacios` between `qlik` and `oauth`.
- `useFiltroEspacioConPersistencia(tenantId, { habilitado })` returns `""` and removes URL/storage state whenever `habilitado` is `false`.
- Both filter bars accept `mostrarFiltroEspacio: boolean`; when false they render only the name search and never render **Todos los espacios**.

- [ ] **Step 1: Write failing configuration-summary tests**

```ts
const items = crearResumenConfiguracion({
  ...base,
  espacios: { cargados: true, cantidadPermitidos: 0, permitirSinEspacio: false },
});
expect(items.find((item) => item.id === "espacios")).toMatchObject({
  estado: "Pendiente",
  completo: false,
});
```

Also assert `3 espacios habilitados` and completeness when only personal resources are allowed.

- [ ] **Step 2: Integrate the administrative section**

Query the principal tenant policy in `PaginaDetalleTenant`, pass its state into `crearResumenConfiguracion`, add the icon mapping, and render:

```tsx
<SeccionAnclada id="espacios">
  <SeccionEspaciosVisibles organizacionId={tenantId} tenantQlikId={tenantQlikPrincipal.id} />
</SeccionAnclada>
```

Place it immediately after Qlik Cloud and before OAuth. When no principal tenant exists, render a compact disabled state instructing the admin to connect Qlik first.

- [ ] **Step 3: Write failing restricted-filter tests**

Initialize URL and `localStorage` with `space-allowed`, render the hook with `{ habilitado: false }`, and assert the returned value is empty, the URL parameter disappears, and storage is cleared even though the space is authorized.

Render both filter bars with `mostrarFiltroEspacio={false}` and assert:

```ts
expect(screen.queryByText(/Filtrar por espacio/i)).not.toBeInTheDocument();
expect(screen.queryByText("Todos los espacios")).not.toBeInTheDocument();
expect(screen.queryByText(/Personales o sin espacio/i)).not.toBeInTheDocument();
expect(screen.getByRole("searchbox")).toBeInTheDocument();
```

- [ ] **Step 4: Implement disabled persistence and conditional filter bars**

When `habilitado` is false, derive the initial value as `""`, remove `espacioId` from URL/storage synchronously before resource queries, and ignore attempts to persist a space. When true, preserve the existing administrator behavior.

Add `mostrarFiltroEspacio` to both filter bars. Use a single-column search layout when false; do not mount `SelectBuscable`, so **Todos los espacios** cannot appear in the DOM.

- [ ] **Step 5: Write failing final-user page tests**

For both pages, mock `ConfiguracionTenant.accesoEspacios` as restricted and closed, then assert the heading `No tienes espacios de Qlik Cloud habilitados`, no resource cards, and no create action.

With two allowed spaces, assert resources from both appear in one list, `Filtrar por espacio de Qlik Cloud` and `Todos los espacios` are absent, and API calls contain no `espacioId`. In administrator normal view, assert the selector remains visible.

- [ ] **Step 6: Implement the shared closed-access state**

`EstadoSinEspaciosQlik` must render the approved message and no administrative link for ordinary users. An admin in preview may see a secondary instruction to exit preview or configure spaces, but the component must not reveal hidden resource names.
- [ ] **Step 7: Update Dataflow and automation pages**

Load `obtenerConfiguracionTenant()` before issuing resource queries. Call the persistence hook with `{ habilitado: !accesoEspacios.restringido }`.

When access is restricted and configured:

- request the unfiltered list without `espacioId` so the backend combines all authorized spaces;
- render the name search;
- pass `mostrarFiltroEspacio={false}`;
- do not request the spaces catalog for UI filtering.

When the policy is closed, render `EstadoSinEspaciosQlik` instead of filters, lists, and create buttons. Administrator normal view keeps the existing selector and `espacioId` behavior.

Do not duplicate security filtering in React; the page behavior is presentation and request hygiene only.

- [ ] **Step 8: Handle direct 403 responses**

In Dataflow and automation detail screens, map `ErrorClienteApi.codigo === "ESPACIO_NO_AUTORIZADO"` to a dedicated `No tienes acceso a este recurso` state. Do not show the resource ID, name, script, workspace, or executions.

- [ ] **Step 9: Run all configuration and final-view tests**

Run:

```bash
bun run --cwd apps/web test:run \
  src/modulos/admin/utiles-estado-configuracion.test.ts \
  src/modulos/admin/pagina-detalle-tenant-configuracion.test.tsx \
  src/compartido/hooks/use-filtro-espacio-con-persistencia.test.tsx \
  src/compartido/componentes/feedback/estado-sin-espacios-qlik.test.tsx \
  src/modulos/flujos/componentes/barra-filtros-flujos.test.tsx \
  src/modulos/automatizaciones/componentes/barra-filtros-automatizaciones.test.tsx \
  src/modulos/flujos \
  src/modulos/automatizaciones
```

Expected: PASS.

- [ ] **Step 10: Commit only Task 9 files**

```bash
git commit --only \
  apps/web/src/modulos/admin/pagina-detalle-tenant.tsx \
  apps/web/src/modulos/admin/utiles-estado-configuracion.ts \
  apps/web/src/modulos/admin/utiles-estado-configuracion.test.ts \
  apps/web/src/modulos/admin/componentes/resumen-configuracion.tsx \
  apps/web/src/modulos/admin/pagina-detalle-tenant-configuracion.test.tsx \
  apps/web/src/modulos/automatizaciones/api.ts \
  apps/web/src/modulos/automatizaciones/pagina-automatizaciones.tsx \
  apps/web/src/modulos/automatizaciones/componentes/barra-filtros-automatizaciones.tsx \
  apps/web/src/modulos/automatizaciones/componentes/barra-filtros-automatizaciones.test.tsx \
  apps/web/src/modulos/flujos/pagina-flujos.tsx \
  apps/web/src/modulos/flujos/componentes/barra-filtros-flujos.tsx \
  apps/web/src/modulos/flujos/componentes/barra-filtros-flujos.test.tsx \
  apps/web/src/compartido/hooks/use-filtro-espacio-con-persistencia.ts \
  apps/web/src/compartido/hooks/use-filtro-espacio-con-persistencia.test.tsx \
  apps/web/src/compartido/componentes/feedback/estado-sin-espacios-qlik.tsx \
  apps/web/src/compartido/componentes/feedback/estado-sin-espacios-qlik.test.tsx \
  -m "feat: aplicar espacios visibles en vista de usuario final"
```

---

### Task 10: Verificación integral, migración y revisión manual

**Files:**
- Modify only when a gate reveals a defect in Tasks 1–9.
- Update: `docs/superpowers/plans/2026-08-06-espacios-visibles-usuario-final.md` checkboxes while executing.

- [ ] **Step 1: Inspect commit and working-tree boundaries**

Run:

```bash
git log --oneline -10
git status --short
git diff --cached --name-only
```

Expected: task commits are present; no unrelated file is staged.
- [ ] **Step 2: Validate the migration against the development database**

Run:

```bash
bun run db:check
bun run db:migrate
bun run db:check
```

Expected: migration `0014_espacios_visibles_usuario_final` applies once, both tables exist, and a second check reports a healthy schema. Do not point these commands at production.

- [ ] **Step 3: Run all automated gates**

```bash
bun test
bun run typecheck
bun run build
bun run lint
git diff --check
```

Expected: zero failed tests, zero TypeScript errors, successful API/web builds, zero Biome errors, and no whitespace errors. The existing Vite chunk-size warning is non-blocking unless the feature increases the bundle materially.

- [ ] **Step 4: Perform manual administrative verification**

At `http://localhost:5173/configuracion#espacios` verify:

1. Qlik spaces load after synchronization.
2. Search and visible-only selection behave correctly.
3. Saving zero spaces keeps access closed.
4. Saving one or more spaces updates the summary/navigation state.
5. Removing a space shows impact confirmation when counts are available.
6. A failed synchronization leaves the saved selection unchanged.

- [ ] **Step 5: Perform manual access verification**

Using an ordinary user and an administrator preview:

1. No configured spaces shows the approved closed-access state.
2. Two allowed shared spaces produce one combined Dataflow list and one combined automation list.
3. Neither page renders **Filtrar por espacio de Qlik Cloud**, **Todos los espacios**, or a personal-space filter option.
4. Name search remains available and network requests do not contain `espacioId`.
5. Personal resources remain hidden until the special option is enabled, then appear in the combined list without a selector.
6. A denied direct URL shows `No tienes acceso a este recurso`.
7. Manual execution, workspace access, cloning, and creation remain blocked for denied resources.
8. Returning the administrator to normal view restores all Qlik-visible resources and the space selector.

- [ ] **Step 6: Review security invariants**

Confirm from network responses that hidden names, scripts, workspace JSON, schedules, and execution history are absent from `403` payloads. Confirm the preview header never appears on `/api/admin/*` requests.

- [ ] **Step 7: Commit verification fixes only when necessary**

Use a focused commit per discovered defect. Do not create an empty “verification” commit and do not include the plan file with implementation changes unless intentionally versioning the completed checklist.
