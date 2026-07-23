# Feedback visible de errores en frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mostrar los errores de API mediante toast global y mensajes inline con reintento, evitando reintentos y errores silenciosos.

**Architecture:** Un `NotificacionesProvider` liviano monta un toast accesible y expone `mostrarError`. Un `EstadoError` renderiza el estado inline. Las páginas consumen `isError`, `error` y `refetch` de React Query; el layout notifica errores de sesión/logout.

**Tech Stack:** React 18, TanStack Query 5, Vitest, TypeScript, Tailwind existente.

## Global Constraints

- No añadir dependencias externas de notificaciones.
- Todos los textos visibles estarán en español.
- No mostrar stacks, tokens ni detalles internos del servidor.
- Las queries de flujos y automatizaciones usarán `retry: false`.
- Los errores tendrán `role="alert"` y controles accesibles por teclado.

---

### Task 1: Infraestructura de notificaciones y estado inline

**Files:**
- Create: `apps/web/src/componentes/feedback/notificaciones.tsx`
- Create: `apps/web/src/componentes/feedback/estado-error.tsx`
- Create: `apps/web/src/__tests__/feedback.test.tsx`
- Modify: `apps/web/src/main.tsx:8-26`

**Interfaces:**
- `NotificacionesProvider({ children }: { children: ReactNode })` monta el contexto.
- `useNotificaciones(): { mostrarError: (mensaje: string) => void }` expone el toast.
- `EstadoError({ mensaje, onReintentar }: { mensaje: string; onReintentar?: () => void })` muestra el error inline.

- [ ] **Step 1: Write the failing tests**

```tsx
function TriggerError() {
  const { mostrarError } = useNotificaciones();
  return (
    <button type="button" onClick={() => mostrarError("No se pudo cargar")}>
      Mostrar error
    </button>
  );
}

it("muestra un toast accesible y permite cerrarlo", async () => {
  render(
    <NotificacionesProvider>
      <TriggerError />
    </NotificacionesProvider>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Mostrar error" }));
  expect(screen.getByRole("alert")).toHaveTextContent("No se pudo cargar");
  await userEvent.click(screen.getByRole("button", { name: "Cerrar aviso" }));
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

it("muestra error inline y reintenta", async () => {
  const reintentar = vi.fn();
  render(<EstadoError mensaje="Sesión requerida" onReintentar={reintentar} />);
  expect(screen.getByRole("alert")).toHaveTextContent("Sesión requerida");
  await userEvent.click(screen.getByRole("button", { name: "Reintentar" }));
  expect(reintentar).toHaveBeenCalledOnce();
});
```

- [ ] **Step 2: Run tests to verify RED**

Run: `bun test apps/web/src/__tests__/feedback.test.tsx`

Expected: FAIL because the feedback components and provider do not exist.

- [ ] **Step 3: Implement the minimal feedback components**

`mostrarError` debe guardar un aviso `{ id, mensaje }`, renderizarlo con `role="alert"`,
permitir cerrarlo y eliminarlo automáticamente después de 5000 ms. `EstadoError`
debe renderizar el mensaje y el botón `Reintentar` solo cuando recibe callback.

- [ ] **Step 4: Mount the provider**

En `main.tsx`, envolver `RouterProvider` dentro de `NotificacionesProvider`, manteniendo
`QueryClientProvider` como proveedor padre.

- [ ] **Step 5: Run tests to verify GREEN**

Run: `bun test apps/web/src/__tests__/feedback.test.tsx`

Expected: PASS.

### Task 2: Normalizar errores de consultas y páginas

**Files:**
- Modify: `apps/web/src/modulos/flujos/pagina-flujos.tsx`
- Modify: `apps/web/src/modulos/automatizaciones/pagina-automatizaciones.tsx`
- Modify: `apps/web/src/__tests__/pagina-flujos.test.tsx`
- Create: `apps/web/src/__tests__/pagina-automatizaciones.test.tsx`

**Interfaces:**
- Cada página usará `useQuery({ retry: false })` y conservará `refetch`.
- Cada página llamará `mostrarError(error.message)` una vez por cambio de error.
- Cada página renderizará `EstadoError` con `onReintentar: () => refetch()`.

- [ ] **Step 1: Write failing page tests**

```tsx
it("muestra error inline y ofrece reintento al fallar la carga", async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: false,
    status: 401,
    json: () => Promise.resolve({ success: false, error: "Sesión requerida" }),
  }) as unknown as typeof fetch;
  const root = createRoot(document.createElement("div"));
  await act(async () => root.render(<QueryClientProvider client={clienteQuery}><PaginaFlujos /></QueryClientProvider>));
  expect(document.body.textContent).toContain("Sesión requerida");
  expect(document.querySelector('button[data-accion="reintentar"]')).not.toBeNull();
});
```

Crear el equivalente para `PaginaAutomatizaciones` con `/api/automatizaciones`, usando el mismo mock de `global.fetch`, un `QueryClient` con `retry: false` y `createRoot`/`act` de `react-dom/test-utils`.

- [ ] **Step 2: Run focused tests to verify RED**

Run: `bun test apps/web/src/__tests__/pagina-flujos.test.tsx apps/web/src/__tests__/pagina-automatizaciones.test.tsx`

Expected: FAIL because no inline error state or toast integration exists.

- [ ] **Step 3: Implement query error handling**

Cada `queryFn` debe comprobar `res.ok` y lanzar `Error(json.error ?? "Error al cargar …")`.
Configurar `retry: false`, extraer `isError`, `error` y `refetch`, y ejecutar en `useEffect`
`mostrarError(error.message)` cuando `isError` cambie. Renderizar `EstadoError` antes de
la lista cuando `isError` sea verdadero.

- [ ] **Step 4: Run focused tests to verify GREEN**

Run: `bun test apps/web/src/__tests__/pagina-flujos.test.tsx apps/web/src/__tests__/pagina-automatizaciones.test.tsx`

Expected: PASS, incluyendo el callback de reintento.

### Task 3: Sesión, logout y configuración global de React Query

**Files:**
- Modify: `apps/web/src/app/router.tsx:16-80`
- Modify: `apps/web/src/main.tsx:8-15`
- Modify: `apps/web/src/__tests__/oauth-rutas.test.ts`

**Interfaces:**
- El logout usa `mostrarError` en `onError` y conserva la navegación solo en éxito.
- La consulta de sesión usa `retry: false` y no muestra toast duplicado para 401.
- El `QueryClient` global configura `queries.retry = false` como red de seguridad.
- `LayoutPrincipal` se exportará como función para poder probar el logout con un router de prueba.

- [ ] **Step 1: Write failing logout/error tests**

```tsx
it("notifica cuando cerrar sesión falla", async () => {
  const clienteQuery = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const contenedor = document.createElement("div");
  document.body.appendChild(contenedor);
  global.fetch = vi.fn().mockResolvedValueOnce(
    new Response(null, { status: 500 }),
  ) as unknown as typeof fetch;
  const root = createRoot(contenedor);
  await act(async () => root.render(
    <QueryClientProvider client={clienteQuery}>
      <NotificacionesProvider>
        <LayoutPrincipal />
      </NotificacionesProvider>
    </QueryClientProvider>,
  ));
  const boton = contenedor.querySelector('button[data-accion="cerrar-sesion"]');
  await act(async () => boton?.dispatchEvent(new MouseEvent("click", { bubbles: true })));
  expect(document.body.textContent).toContain("No se pudo cerrar sesión");
});
```

- [ ] **Step 2: Run test to verify RED**

Run: `bun test apps/web/src/__tests__/oauth-rutas.test.ts`

Expected: FAIL because logout currently only throws inside the mutation.

- [ ] **Step 3: Wire notifications and retry policy**

Usar `const { mostrarError } = useNotificaciones()` en el layout. Añadir `onError`
al logout con mensaje seguro. Mantener la consulta de sesión deshabilitada en `/login`
y redirigir a login en respuestas no autorizadas. Configurar `retry: false` en el
`QueryClient` global.

- [ ] **Step 4: Run all web tests and typecheck**

Run: `bun test apps/web/src && bun run --cwd apps/web tsc --noEmit`

Expected: tests PASS; si el typecheck conserva el error preexistente de
`src/infraestructura/api/cliente.test.ts`, documentarlo sin ocultarlo.

## Final Verification

- [ ] `bun test apps/web/src`
- [ ] `bun run --cwd apps/web tsc --noEmit`
- [ ] Revisar que no queden `console.log` ni errores de API sin estado visible en las páginas.
