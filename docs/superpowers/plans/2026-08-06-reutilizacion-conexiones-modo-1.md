# Reutilización organizacional de conexiones en Modo 1 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reutilizar automáticamente conexiones de origen registradas para la misma organización, sin volver a solicitar host, puerto, usuario, base, contraseña o llave privada cuando otro usuario crea una automatización Modo 1.

**Architecture:** El preflight seguirá resolviendo requisitos por `(organizacionId, tipo, nombre exacto de Qlik)` y expondrá únicamente identidad, estado y fecha de prueba. El frontend distinguirá entre conexión faltante y conexión ya guardada: solo la primera muestra el formulario técnico; las demás usan una tarjeta segura que permite probar la conexión almacenada y refrescar el preflight.

**Tech Stack:** Bun, TypeScript, Hono, Drizzle/PostgreSQL, Zod, React 18, TanStack Query, TanStack Router, Vitest, Testing Library, Biome.

## Global Constraints

- Trabajar directamente sobre `main`; no crear worktrees.
- El árbol contiene cambios ajenos sin commit: no restaurar, stagear ni incluir archivos fuera de cada tarea.
- Aplicar TDD: prueba RED, implementación mínima, prueba GREEN y revisión antes de continuar.
- La identidad es exactamente `(organizacionId, tipo, nombre exacto de Qlik)`.
- Nunca reutilizar por host, URL, usuario, ruta o nombre aproximado.
- No exponer host, URL JDBC, usuario, contraseña, PEM ni nombres internos de secretos en el preflight.
- Usuarios finales pueden probar y reutilizar; solo administradores pueden editar o eliminar.
- No modificar el comportamiento de Modo 2.
- No se requiere migración de base de datos.

---
## Mapa de archivos

- `packages/contratos/src/automatizaciones/preflight.ts`: contrato público del requisito y su fecha de prueba.
- `packages/contratos/src/automatizaciones/panel.ts`: capacidad administrativa expuesta a la página de creación.
- `apps/api/src/modulos/automatizaciones/aplicacion/casos-de-uso/preflight-automatizacion.ts`: asociación organizacional exacta.
- `apps/api/src/modulos/automatizaciones/http/rutas-panel.ts`: proyección de permisos y endpoint de preflight.
- `apps/api/src/modulos/origenes/http/rutas-conexiones-origen.ts`: prueba segura de conexión existente.
- `apps/web/src/modulos/automatizaciones/api.ts`: cliente de preflight y prueba de conexión.
- `apps/web/src/modulos/automatizaciones/componentes/tarjeta-conexion-origen-guardada.tsx`: presentación segura de conexión reutilizada.
- `apps/web/src/modulos/automatizaciones/componentes/formulario-crear-automatizacion-modo-1.tsx`: decisión entre tarjeta y formulario.
- `apps/web/src/modulos/automatizaciones/pagina-nueva-automatizacion.tsx`: mutación, invalidación y permisos.

### Task 1: Ampliar los contratos públicos de preflight y permisos

**Files:**
- Modify: `packages/contratos/src/automatizaciones/preflight.ts`
- Modify: `packages/contratos/src/automatizaciones/panel.ts`
- Test: `packages/contratos/src/automatizaciones/preflight.test.ts`

**Interfaces:**
- Produces: `RequisitoConexionOrigen.probadaEn: string | null`.
- Produces: `ConfiguracionTenant.puedeAdministrarConexiones: boolean`.
- [ ] **Step 1: Escribir la prueba RED del contrato**

```ts
expect(
  esquemaRequisitoConexionOrigen.parse({
    tipo: "jdbc",
    nombre: "Ventas DB",
    estado: "sin_probar",
    conexionId: "11111111-1111-4111-8111-111111111111",
    probadaEn: null,
    mensaje: null,
  }),
).toMatchObject({ probadaEn: null });

expect(
  esquemaConfiguracionTenant.parse({
    modoAutomatizacionActivo: 1,
    plantillaEfectivaIdQlik: "plantilla-1",
    plantillaEfectivaNombre: "Modo 1",
    configurada: true,
    puedeAdministrarConexiones: false,
  }),
).toMatchObject({ puedeAdministrarConexiones: false });
```

- [ ] **Step 2: Ejecutar la prueba y comprobar RED**

Run: `bun test packages/contratos/src/automatizaciones/preflight.test.ts`

Expected: FAIL porque ambos campos todavía no forman parte de los esquemas.
- [ ] **Step 3: Implementar el contrato mínimo**

```ts
export const esquemaRequisitoConexionOrigen = z.object({
  tipo: z.enum(["jdbc", "sftp"]),
  nombre: z.string().min(1),
  estado: esquemaEstadoRequisitoConexion,
  conexionId: z.string().uuid().nullable(),
  probadaEn: z.string().datetime().nullable(),
  mensaje: z.string().nullable(),
});

export const esquemaConfiguracionTenant = z.object({
  modoAutomatizacionActivo: esquemaModoPlantilla,
  plantillaEfectivaIdQlik: z.string().nullable(),
  plantillaEfectivaNombre: z.string().nullable(),
  configurada: z.boolean(),
  puedeAdministrarConexiones: z.boolean(),
});
```

- [ ] **Step 4: Ejecutar pruebas y typecheck**

Run: `bun test packages/contratos/src/automatizaciones/preflight.test.ts && bun run --cwd packages/contratos typecheck`

Expected: PASS.

- [ ] **Step 5: Commit focalizado**

```bash
git add packages/contratos/src/automatizaciones/preflight.ts packages/contratos/src/automatizaciones/panel.ts packages/contratos/src/automatizaciones/preflight.test.ts
git commit -m "feat: ampliar preflight de conexiones reutilizables"
```
### Task 2: Hacer explícita la reutilización organizacional en el preflight

**Files:**
- Modify: `apps/api/src/modulos/automatizaciones/aplicacion/casos-de-uso/preflight-automatizacion.ts`
- Modify: `apps/api/src/modulos/automatizaciones/aplicacion/casos-de-uso/preflight-automatizacion.test.ts`

**Interfaces:**
- Consumes: `OrigenPreflight.probadaEn: Date | null`.
- Produces: requisitos con `conexionId`, `estado`, `probadaEn` y `mensaje` sin `config`.

- [ ] **Step 1: Añadir pruebas RED para los cuatro estados y aislamiento organizacional**

```ts
expect(resultado.conexionesRequeridas).toEqual([
  expect.objectContaining({
    tipo: "jdbc",
    nombre: "Bancolombia prueba:Postgres_BanColombia_Prueba",
    estado: "sin_probar",
    conexionId: "11111111-1111-4111-8111-111111111111",
    probadaEn: null,
  }),
  expect.objectContaining({
    tipo: "sftp",
    nombre: "Bancolombia prueba:SFTP",
    estado: "error",
    conexionId: "22222222-2222-4222-8222-222222222222",
    probadaEn: "2026-08-06T12:00:00.000Z",
    mensaje: "No fue posible abrir la conexión SFTP",
  }),
]);
```
Añadir también estos casos en la misma prueba:

```ts
expect(resultadoOtraOrganizacion.conexionesRequeridas[0]).toMatchObject({
  estado: "faltante",
  conexionId: null,
  probadaEn: null,
});
expect(resultadoMismoNombre.conexionesRequeridas).toEqual([
  expect.objectContaining({
    tipo: "jdbc",
    conexionId: "11111111-1111-4111-8111-111111111111",
  }),
  expect.objectContaining({
    tipo: "sftp",
    conexionId: "22222222-2222-4222-8222-222222222222",
  }),
]);
expect(JSON.stringify(resultado)).not.toMatch(
  /password|PRIVATE KEY|usuario:clave|jdbc:postgresql:\/\//,
);
```

- [ ] **Step 2: Ejecutar la prueba y comprobar RED**

Run: `bun test apps/api/src/modulos/automatizaciones/aplicacion/casos-de-uso/preflight-automatizacion.test.ts`

Expected: FAIL porque `probadaEn` no se proyecta todavía.

- [ ] **Step 3: Proyectar la fecha sin cambiar la coincidencia exacta**

```ts
return {
  tipo: requisito.tipo,
  nombre: requisito.nombre,
  estado: conexion?.estado ?? "faltante",
  conexionId: conexion?.id ?? null,
  probadaEn: conexion?.probadaEn?.toISOString() ?? null,
  mensaje: conexion?.mensajeError ?? null,
};
```

- [ ] **Step 4: Ejecutar prueba y typecheck API**

Run: `bun test apps/api/src/modulos/automatizaciones/aplicacion/casos-de-uso/preflight-automatizacion.test.ts && bun run --cwd apps/api typecheck`

Expected: PASS.
- [ ] **Step 5: Commit focalizado**

```bash
git add apps/api/src/modulos/automatizaciones/aplicacion/casos-de-uso/preflight-automatizacion.ts apps/api/src/modulos/automatizaciones/aplicacion/casos-de-uso/preflight-automatizacion.test.ts
git commit -m "feat: reutilizar conexiones organizacionales en preflight"
```

### Task 3: Exponer permisos administrativos y reforzar la prueba segura

**Files:**
- Modify: `apps/api/src/modulos/automatizaciones/http/rutas-panel.ts`
- Modify: `apps/api/src/modulos/automatizaciones/http/rutas-panel.test.ts`
- Modify: `apps/api/src/modulos/origenes/http/rutas-conexiones-origen.test.ts`

**Interfaces:**
- Produces: `GET /api/automatizaciones/configuracion-tenant` con `puedeAdministrarConexiones`.
- Preserves: `POST /api/conexiones-origen/:id/probar` sin aceptar credenciales en el cuerpo.

- [ ] **Step 1: Escribir pruebas RED de permisos**

```ts
expect((await obtenerConfiguracion(sesionAdmin)).datos).toMatchObject({
  puedeAdministrarConexiones: true,
});
expect((await obtenerConfiguracion(sesionUsuario)).datos).toMatchObject({
  puedeAdministrarConexiones: false,
});
```

La sesión se considera administradora cuando `esSuperadmin === true` o alguna membresía de la organización activa contiene el rol `admin`.
- [ ] **Step 2: Reforzar la regresión del endpoint de prueba**

```ts
const respuesta = await app.request(`/api/conexiones-origen/${conexionId}/probar`, {
  method: "POST",
  headers: { Origin: "http://localhost:5173" },
});
expect(respuesta.status).toBe(200);
expect(probar.ejecutar).toHaveBeenCalledWith({ organizacionId: "org-1", conexionId });
expect(JSON.stringify(await respuesta.json())).not.toMatch(
  /password|PRIVATE KEY|usuario:clave|host interno/,
);

const ajena = await appOtraOrganizacion.request(
  `/api/conexiones-origen/${conexionId}/probar`,
  { method: "POST", headers: { Origin: "http://localhost:5173" } },
);
expect(ajena.status).toBe(404);
```

- [ ] **Step 3: Ejecutar pruebas RED**

Run: `bun test apps/api/src/modulos/automatizaciones/http/rutas-panel.test.ts apps/api/src/modulos/origenes/http/rutas-conexiones-origen.test.ts`

Expected: al menos la proyección de permisos falla.

- [ ] **Step 4: Implementar la proyección mínima**

Usar el contexto autenticado que ya instala el middleware:

```ts
const contexto = obtenerContextoSolicitud(c);
const puedeAdministrarConexiones = Boolean(
  contexto.esSuperadmin || contexto.roles?.includes("admin"),
);
return responderExito(c, {
  modoAutomatizacionActivo,
  plantillaEfectivaIdQlik: plantilla?.id ?? null,
  plantillaEfectivaNombre: plantilla?.nombre ?? null,
  configurada: plantilla !== null,
  puedeAdministrarConexiones,
  accesoEspacios: {
    restringido: politicaEspacios?.restringida ?? false,
    configurado: politicaEspacios?.configurada ?? true,
    cerrado:
      Boolean(politicaEspacios?.restringida) &&
      (politicaEspacios?.espaciosPermitidosIds.length ?? 0) === 0 &&
      !politicaEspacios?.permitirRecursosSinEspacio,
    cantidadEspacios: politicaEspacios?.espaciosPermitidosIds.length ?? 0,
    permitirRecursosSinEspacio:
      politicaEspacios?.permitirRecursosSinEspacio ?? false,
  },
});
```

No ampliar `resolverSesion` ni consultar secretos. Conservar el cuerpo vacío del endpoint `/probar`.

- [ ] **Step 5: Verificar y commit**

Run: `bun test apps/api/src/modulos/automatizaciones/http/rutas-panel.test.ts apps/api/src/modulos/origenes/http/rutas-conexiones-origen.test.ts && bun run --cwd apps/api typecheck`

```bash
git add apps/api/src/modulos/automatizaciones/http/rutas-panel.ts apps/api/src/modulos/automatizaciones/http/rutas-panel.test.ts apps/api/src/modulos/origenes/http/rutas-conexiones-origen.test.ts
git commit -m "feat: exponer permisos para conexiones reutilizadas"
```
### Task 4: Crear la tarjeta segura de conexión guardada

**Files:**
- Create: `apps/web/src/modulos/automatizaciones/componentes/tarjeta-conexion-origen-guardada.tsx`
- Create: `apps/web/src/modulos/automatizaciones/componentes/tarjeta-conexion-origen-guardada.test.tsx`
- Modify: `apps/web/src/modulos/origenes/pagina-catalogo-origen.tsx`
- Modify: `apps/web/src/modulos/origenes/pagina-catalogo-origen.test.tsx`

**Interfaces:**
- Consumes: `RequisitoConexionOrigen`.
- Props: `requisito`, `puedeAdministrar`, `probando`, `onProbar(id: string): void`.

- [ ] **Step 1: Escribir pruebas RED de presentación**

```tsx
render(<TarjetaConexionOrigenGuardada requisito={sinProbar} puedeAdministrar={false} probando={false} onProbar={probar} />);
expect(screen.getByText("Conexión guardada")).toBeInTheDocument();
expect(screen.getByRole("button", { name: "Probar conexión guardada" })).toBeEnabled();
expect(screen.queryByLabelText("Servidor")).not.toBeInTheDocument();
expect(screen.queryByRole("link", { name: /editar/i })).not.toBeInTheDocument();

rerender(<TarjetaConexionOrigenGuardada requisito={conError} puedeAdministrar probando={false} onProbar={probar} />);
expect(screen.getByRole("button", { name: "Volver a probar" })).toBeEnabled();
expect(screen.getByText("No fue posible abrir la conexión SFTP")).toBeInTheDocument();
expect(screen.getByRole("link", { name: "Editar en Configuración" })).toHaveAttribute(
  "href",
  `/configuracion#conexion-origen-${conError.conexionId}`,
);

render(<PaginaCatalogoOrigen />);
expect(
  await screen.findByTestId(`conexion-origen-${conError.conexionId}`),
).toHaveAttribute("id", `conexion-origen-${conError.conexionId}`);
```

- [ ] **Step 2: Ejecutar y comprobar RED**

Run: `bun run --cwd apps/web test:run -- src/modulos/automatizaciones/componentes/tarjeta-conexion-origen-guardada.test.tsx src/modulos/origenes/pagina-catalogo-origen.test.tsx`

Expected: FAIL porque el componente no existe.
- [ ] **Step 3: Implementar el componente mínimo**

El componente debe:

```tsx
const esError = requisito.estado === "error";
const etiquetaAccion = esError ? "Volver a probar" : "Probar conexión guardada";
const fecha = requisito.probadaEn
  ? new Intl.DateTimeFormat("es-EC", { dateStyle: "medium", timeStyle: "short" }).format(new Date(requisito.probadaEn))
  : "Nunca probada";
```

Renderizar nombre, tipo, estado, fecha, mensaje seguro y botón. El enlace administrativo solo se monta cuando `puedeAdministrar` es `true`. No renderizar ninguna propiedad de configuración.

En `PaginaCatalogoOrigen`, asignar a cada contenedor de conexión:

```tsx
id={`conexion-origen-${conexion.id}`}
data-testid={`conexion-origen-${conexion.id}`}
```

No incluir secretos ni configuración en el fragmento URL.

- [ ] **Step 4: Ejecutar pruebas y typecheck web**

Run: `bun run --cwd apps/web test:run -- src/modulos/automatizaciones/componentes/tarjeta-conexion-origen-guardada.test.tsx src/modulos/origenes/pagina-catalogo-origen.test.tsx && bun run --cwd apps/web typecheck`

Expected: PASS.

- [ ] **Step 5: Commit focalizado**

```bash
git add \
  apps/web/src/modulos/automatizaciones/componentes/tarjeta-conexion-origen-guardada.tsx \
  apps/web/src/modulos/automatizaciones/componentes/tarjeta-conexion-origen-guardada.test.tsx \
  apps/web/src/modulos/origenes/pagina-catalogo-origen.tsx \
  apps/web/src/modulos/origenes/pagina-catalogo-origen.test.tsx
git commit -m "feat: mostrar conexiones de origen reutilizables"
```

### Task 5: Integrar la tarjeta en el formulario Modo 1

**Files:**
- Modify: `apps/web/src/modulos/automatizaciones/componentes/formulario-crear-automatizacion-modo-1.tsx`
- Modify: `apps/web/src/modulos/automatizaciones/componentes/formulario-crear-automatizacion-modo-1.test.tsx`

**Interfaces:**
- New props: `puedeAdministrarConexiones`, `conexionProbandoId`, `onProbarConexion(id: string): void`.
- [ ] **Step 1: Escribir pruebas RED de las cuatro ramas**

```tsx
expect(renderizar(disponible).queryByLabelText("Servidor")).not.toBeInTheDocument();
expect(renderizar(disponible).getByText("Disponible")).toBeInTheDocument();

expect(renderizar(sinProbar).getByRole("button", { name: "Probar conexión guardada" })).toBeEnabled();
expect(renderizar(sinProbar).queryByLabelText("Servidor")).not.toBeInTheDocument();

expect(renderizar(conError).getByRole("button", { name: "Volver a probar" })).toBeEnabled();
expect(renderizar(faltante).getByLabelText("Servidor")).toBeInTheDocument();
```

Añadir una aserción específica para el caso de la captura:

```tsx
expect(
  screen.getByText("Bancolombia prueba:Postgres_BanColombia_Prueba"),
).toBeInTheDocument();
expect(screen.queryByText("Credenciales (usuario:clave)")).not.toBeInTheDocument();
```

- [ ] **Step 2: Ejecutar y comprobar RED**

Run: `bun run --cwd apps/web test:run -- src/modulos/automatizaciones/componentes/formulario-crear-automatizacion-modo-1.test.tsx`

Expected: FAIL porque `sin_probar` y `error` aún renderizan `FormularioConexionOrigen`.

- [ ] **Step 3: Implementar la decisión de renderizado**

```tsx
if (requisito.estado === "faltante") {
  return <FormularioConexionOrigen requisito={...} onGuardada={props.onConexionGuardada} />;
}
return (
  <TarjetaConexionOrigenGuardada
    requisito={requisito}
    puedeAdministrar={props.puedeAdministrarConexiones}
    probando={props.conexionProbandoId === requisito.conexionId}
    onProbar={props.onProbarConexion}
  />
);
```
- [ ] **Step 4: Ejecutar pruebas y commit**

Run: `bun run --cwd apps/web test:run -- src/modulos/automatizaciones/componentes/formulario-crear-automatizacion-modo-1.test.tsx src/modulos/automatizaciones/componentes/tarjeta-conexion-origen-guardada.test.tsx`

Expected: PASS.

```bash
git add apps/web/src/modulos/automatizaciones/componentes/formulario-crear-automatizacion-modo-1.tsx apps/web/src/modulos/automatizaciones/componentes/formulario-crear-automatizacion-modo-1.test.tsx
git commit -m "feat: reutilizar conexiones guardadas en modo 1"
```

### Task 6: Probar conexiones guardadas y refrescar el preflight

**Files:**
- Modify: `apps/web/src/modulos/automatizaciones/api.ts`
- Modify: `apps/web/src/modulos/automatizaciones/pagina-nueva-automatizacion.tsx`
- Modify: `apps/web/src/modulos/automatizaciones/pagina-nueva-automatizacion.test.tsx`

**Interfaces:**
- Consumes: `probarConexionOrigen(conexionId: string)`.
- Produces: mutación que invalida `['automatizaciones-preflight', flujoId]` tras éxito o error controlado.

- [ ] **Step 1: Escribir prueba RED de interacción completa**

```tsx
fireEvent.click(
  await screen.findByRole("button", { name: "Probar conexión guardada" }),
);
await waitFor(() => expect(mocks.probarConexionOrigen).toHaveBeenCalledWith(conexionId));
await waitFor(() =>
  expect(mocks.obtenerPreflightAutomatizacion).toHaveBeenCalledTimes(2),
);
expect(screen.queryByLabelText("Servidor")).not.toBeInTheDocument();
```
Añadir también:

```tsx
expect(propsModo1.puedeAdministrarConexiones).toBe(true);
expect(screen.getByRole("link", { name: "Editar en Configuración" })).toBeInTheDocument();
```

Y para usuario final:

```tsx
expect(screen.queryByRole("link", { name: "Editar en Configuración" })).not.toBeInTheDocument();
```

- [ ] **Step 2: Ejecutar y comprobar RED**

Run: `bun run --cwd apps/web test:run -- src/modulos/automatizaciones/pagina-nueva-automatizacion.test.tsx`

Expected: FAIL porque la página no conecta la prueba existente ni los permisos.

- [ ] **Step 3: Implementar la mutación**

```ts
const probarOrigen = useMutation({
  mutationFn: probarConexionOrigen,
  onSettled: async () => {
    await queryClient.invalidateQueries({
      queryKey: ["automatizaciones-preflight", flujoId],
    });
  },
});
```

Pasar al formulario:

```tsx
puedeAdministrarConexiones={configTenant?.puedeAdministrarConexiones ?? false}
conexionProbandoId={probarOrigen.isPending ? probarOrigen.variables : undefined}
onProbarConexion={(id) => probarOrigen.mutate(id)}
```

- [ ] **Step 4: Verificar que una prueba exitosa habilita creación**

El mock de preflight debe devolver primero `sin_probar` y después `disponible`; comprobar que el botón **Crear automatización** pasa de deshabilitado a habilitado sin recargar la página.
- [ ] **Step 5: Ejecutar pruebas, typecheck y commit**

Run: `bun run --cwd apps/web test:run -- src/modulos/automatizaciones/pagina-nueva-automatizacion.test.tsx src/modulos/automatizaciones/componentes/formulario-crear-automatizacion-modo-1.test.tsx && bun run --cwd apps/web typecheck`

Expected: PASS.

```bash
git add apps/web/src/modulos/automatizaciones/api.ts apps/web/src/modulos/automatizaciones/pagina-nueva-automatizacion.tsx apps/web/src/modulos/automatizaciones/pagina-nueva-automatizacion.test.tsx
git commit -m "feat: probar conexiones reutilizadas desde el asistente"
```

### Task 7: Cerrar seguridad, regresión de Modo 2 y validación manual

**Files:**
- Modify only when a failing gate identifies a defect in files from Tasks 1–6.
- Test: all focused and global suites.

- [ ] **Step 1: Ejecutar pruebas focalizadas de backend**

Run:

```bash
bun test \
  packages/contratos/src/automatizaciones/preflight.test.ts \
  apps/api/src/modulos/automatizaciones/aplicacion/casos-de-uso/preflight-automatizacion.test.ts \
  apps/api/src/modulos/automatizaciones/http/rutas-panel.test.ts \
  apps/api/src/modulos/origenes/http/rutas-conexiones-origen.test.ts
```

Expected: PASS, cero secretos en snapshots o respuestas.

- [ ] **Step 2: Ejecutar pruebas focalizadas de frontend**

```bash
bun run --cwd apps/web test:run -- \
  src/modulos/automatizaciones/componentes/tarjeta-conexion-origen-guardada.test.tsx \
  src/modulos/automatizaciones/componentes/formulario-crear-automatizacion-modo-1.test.tsx \
  src/modulos/automatizaciones/pagina-nueva-automatizacion.test.tsx \
  src/modulos/automatizaciones/pagina-nueva-automatizacion-cobertura.test.tsx
```

Expected: PASS e incluye la regresión actual de Modo 2.
- [ ] **Step 3: Ejecutar gates globales**

```bash
bun run test:api
bun run test:web
bun run typecheck
bun run lint
bun run build
bun run db:check
```

Expected: todos con código 0. La advertencia de bundle de Vite no bloquea este plan.

- [ ] **Step 4: Buscar fugas y formularios indebidos**

```bash
rg -n "password|PRIVATE KEY|usuario:clave|secretoValor|secretoClavePrivadaValor" \
  apps/api/src/modulos/automatizaciones \
  apps/web/src/modulos/automatizaciones
```

Revisar cada coincidencia. Son válidas únicamente en construcción server-side, campos del formulario `faltante` o pruebas con sentinelas. No debe existir serialización de secretos en preflight, tarjeta, auditoría ni outbox.

- [ ] **Step 5: Validación manual con dos usuarios de la misma organización**

1. Con el administrador, abrir `Bancolombia prueba:Postgres_BanColombia_Prueba` en Configuración y comprobar que existe.
2. Con un segundo usuario, abrir `/automatizaciones/nueva` y seleccionar el Dataflow de Bancolombia.
3. Confirmar que no aparecen **Servidor**, **Puerto**, **Base de datos** ni **Credenciales** para JDBC existente.
4. Confirmar que aparece **Probar conexión guardada** cuando el estado es `sin_probar`.
5. Ejecutar la prueba y comprobar que la tarjeta cambia a **Disponible** sin recargar.
6. Confirmar que el usuario final no ve **Editar en Configuración**.
7. Confirmar que una conexión SFTP realmente inexistente sí muestra el formulario completo.
8. Abrir Modo 2 y repetir su flujo de selección de conexión y tabla.

- [ ] **Step 6: Revisar diff y commit final de correcciones de gate**

```bash
git diff --check
git status --short
git diff --name-only
```

No incluir archivos ajenos. Si no hubo defectos adicionales, no crear un commit vacío.

## Criterio de cierre

El plan queda completo cuando un segundo usuario de la organización puede reutilizar una conexión existente sin volver a introducir datos técnicos; una conexión `sin_probar` o `error` solo requiere pulsar el botón de prueba; una conexión `faltante` conserva el formulario completo; y Modo 2 mantiene todas sus pruebas y comportamiento.
