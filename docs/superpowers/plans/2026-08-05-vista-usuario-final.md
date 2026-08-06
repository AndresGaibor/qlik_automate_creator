# Vista Usuario Final — Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permitir que un administrador active el toggle "Vista usuario final" y, mientras está activo, se comporte como usuario final (rutas `/admin/*` y `/configuracion` bloqueadas con redirección, items de administración ocultos en el nav, contenido admin oculto en Inicio y Resultados).

**Architecture:** Portar el patrón de `~/code/javascript/qlik_reportes_creator/apps/web/src/app/contexto-vista.tsx` usando el enfoque A aprobado: un `VistaContext` global (estado local con `useState` dentro de un `VistaProvider`) + hook `useVistaUsuarioFinal()`. El `LayoutPrincipal` envuelve todo el árbol con el provider, expone el checkbox (solo `esAdmin`), deriva `puedeVerAdministracion = esAdmin && !estado.modoUsuarioFinal`, redirige desde rutas restringidas y filtra la navegación. Las páginas consumen el hook para ocultar contenido de administración. Sin dependencias nuevas.

**Tech Stack:** React 18, TypeScript, @tanstack/react-query, @tanstack/react-router, Tailwind 4, Vitest + Testing Library.

## Global Constraints

- Enfoque aprobado: **A — VistaContext global** con persistencia **estado local `useState`** (sin localStorage, sin dependencias nuevas).
- Rutas bloqueadas cuando `modoUsuarioFinal` activo y `esAdmin`: **`/configuracion` y `/admin/*`** (NO `/tablas`). Redirección con `navegar({ to: "/tablas", replace: true })`.
- `esAdmin` se sigue derivando igual que hoy: `(sesion.esSuperadmin ?? false) || sesion.membresias.some((m) => m.rol === "admin")`. `puedeVerAdministracion = esAdmin && !estado.modoUsuarioFinal`.
- Textos en español. Sin `console.log` en código final. Inmutabilidad: los setters crean objetos nuevos.
- Verificación por task (workdir `apps/web`): test `bunx vitest run <archivo>`; typecheck final `bun run typecheck`; formato `bunx prettier --write <archivo>`.
- Falsos positivos conocidos del typecheck (NO arreglar): TS2307 `Cannot find module './*.js'` y `bun:test`.
- Cobertura objetivo: las funciones nuevas y ramas de los componentes tocados.

---

### Task 1: VistaContext global (`contexto-vista.tsx`)

**Files:**
- Create: `apps/web/src/app/contexto-vista.tsx`
- Test: `apps/web/src/app/contexto-vista.test.tsx`

**Interfaces:**
- Produces: `VistaProvider` (componente que envuelve el árbol), `useVistaUsuarioFinal(): { estado: { modoUsuarioFinal: boolean }; setModoUsuarioFinal: (activo: boolean) => void }`. `setModoUsuarioFinal` es estable (usa patrón funcional de `useState`).

- [ ] **Step 1: Write the failing test**

Create `apps/web/src/app/contexto-vista.test.tsx`:

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VistaProvider, useVistaUsuarioFinal } from "./contexto-vista";

function Consumidor() {
  const { estado, setModoUsuarioFinal } = useVistaUsuarioFinal();
  return (
    <div>
      <span data-testid="modo">{String(estado.modoUsuarioFinal)}</span>
      <button onClick={() => setModoUsuarioFinal(true)}>Activar</button>
      <button onClick={() => setModoUsuarioFinal(false)}>Desactivar</button>
    </div>
  );
}

describe("useVistaUsuarioFinal", () => {
  it("lanza error si se usa fuera de VistaProvider", () => {
    expect(() => render(<Consumidor />)).toThrow(/VistaProvider/);
  });

  it("inicia con modoUsuarioFinal false", () => {
    render(
      <VistaProvider>
        <Consumidor />
      </VistaProvider>,
    );
    expect(screen.getByTestId("modo")).toHaveTextContent("false");
  });

  it("setModoUsuarioFinal(true) activa el modo", () => {
    render(
      <VistaProvider>
        <Consumidor />
      </VistaProvider>,
    );
    fireEvent.click(screen.getByText("Activar"));
    expect(screen.getByTestId("modo")).toHaveTextContent("true");
  });

  it("setModoUsuarioFinal(false) desactiva el modo", () => {
    render(
      <VistaProvider>
        <Consumidor />
      </VistaProvider>,
    );
    fireEvent.click(screen.getByText("Activar"));
    fireEvent.click(screen.getByText("Desactivar"));
    expect(screen.getByTestId("modo")).toHaveTextContent("false");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run (workdir `apps/web`): `bunx vitest run src/app/contexto-vista.test.tsx`
Expected: FAIL — module `./contexto-vista` not found.

- [ ] **Step 3: Write minimal implementation**

Create `apps/web/src/app/contexto-vista.tsx`:

```tsx
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

export interface EstadoVista {
  modoUsuarioFinal: boolean;
}

const EstadoVistaInicial: EstadoVista = { modoUsuarioFinal: false };

export interface VistaContextoValor {
  estado: EstadoVista;
  setModoUsuarioFinal: (activo: boolean) => void;
}

const VistaContexto = createContext<VistaContextoValor | null>(null);

export function VistaProvider({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<EstadoVista>(EstadoVistaInicial);

  const setModoUsuarioFinal = useCallback((activo: boolean) => {
    setEstado((previo) => ({ ...previo, modoUsuarioFinal: activo }));
  }, []);

  return (
    <VistaContexto.Provider value={{ estado, setModoUsuarioFinal }}>
      {children}
    </VistaContexto.Provider>
  );
}

export function useVistaUsuarioFinal(): VistaContextoValor {
  const contexto = useContext(VistaContexto);
  if (!contexto) {
    throw new Error("useVistaUsuarioFinal debe usarse dentro de VistaProvider");
  }
  return contexto;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run (workdir `apps/web`): `bunx vitest run src/app/contexto-vista.test.tsx`
Expected: 4 passing.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/app/contexto-vista.tsx apps/web/src/app/contexto-vista.test.tsx
git commit -m "feat: contexto global de vista usuario final"
```

---

### Task 2: `LayoutPrincipal` — provider, checkbox, redirección y filtro de nav

**Files:**
- Modify: `apps/web/src/app/layout-principal.tsx`
- Test: `apps/web/src/app/layout-principal.test.tsx`

**Interfaces:**
- Consumes: `VistaProvider`, `useVistaUsuarioFinal` de `./contexto-vista` (Task 1).
- Produces: `LayoutPrincipal` (exportada, mismo nombre/uso que hoy) envuelve el árbol con `VistaProvider`. Derivación `puedeVerAdministracion = esAdmin && !estado.modoUsuarioFinal` usada por Tasks 3-4 como criterio de visibilidad.

- [ ] **Step 1: Write the failing test**

Create `apps/web/src/app/layout-principal.test.tsx`:

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NotificacionesProvider } from "@/compartido/componentes/feedback/notificaciones";
import { LayoutPrincipal } from "./layout-principal";

const mocks = vi.hoisted(() => {
  let pathname = "/tablas";
  return {
    obtenerEstadoSetup: vi.fn(),
    obtenerSesion: vi.fn(),
    cambiarTenantActivo: vi.fn(),
    cerrarSesion: vi.fn(),
    navegar: vi.fn(),
    useLocation: vi.fn(() => ({ pathname })),
    useNotificaciones: vi.fn(() => ({
      mostrarError: vi.fn(),
      mostrarExito: vi.fn(),
    })),
    Link: ({ to, children }: { to: string; children: React.ReactNode }) =>
      React.createElement("a", { href: to }, children),
    setPathname: (nuevo: string) => {
      pathname = nuevo;
    },
  };
});

vi.mock("@/modulos/setup/api", () => ({
  obtenerEstadoSetup: mocks.obtenerEstadoSetup,
}));
vi.mock("@/modulos/autenticacion/api", () => ({
  obtenerSesion: mocks.obtenerSesion,
  cambiarTenantActivo: mocks.cambiarTenantActivo,
  cerrarSesion: mocks.cerrarSesion,
}));
vi.mock("@/compartido/componentes/feedback/notificaciones", () => ({
  useNotificaciones: mocks.useNotificaciones,
  NotificacionesProvider: ({ children }: { children: ReactNode }) => (
    <>{children}</>
  ),
}));
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mocks.navegar,
  useLocation: mocks.useLocation,
  Link: mocks.Link,
  Outlet: () => <div data-testid="outlet" />,
}));

const sesionAdmin = {
  usuario: { nombre: "Ana Admin", avatarUrl: null },
  esSuperadmin: true,
  tenantActivoId: "ten-1",
  tenantsDisponibles: [
    { id: "ten-1", nombre: "Tenant Demo", host: "demo.us.qlikcloud.com" },
  ],
  membresias: [{ rol: "admin" }],
};

const sesionNoAdmin = {
  ...sesionAdmin,
  esSuperadmin: false,
  membresias: [],
};

function renderizar() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <LayoutPrincipal />
    </QueryClientProvider>,
  );
}

describe("LayoutPrincipal", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mocks.setPathname("/tablas");
    mocks.obtenerEstadoSetup.mockResolvedValue({ needsSetup: false });
    mocks.cambiarTenantActivo.mockResolvedValue({});
    mocks.cerrarSesion.mockResolvedValue({});
    mocks.navegar.mockClear();
  });

  it("admin ve el checkbox 'Vista usuario final' y los items de administracion", async () => {
    mocks.obtenerSesion.mockResolvedValue(sesionAdmin);
    renderizar();

    await waitFor(() => {
      expect(
        screen.getByRole("checkbox", { name: "Vista usuario final" }),
      ).toBeInTheDocument();
    });
    expect(screen.getByRole("link", { name: "Configuración" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Organizaciones" })).toBeInTheDocument();
  });

  it("no-admin no ve el checkbox", async () => {
    mocks.obtenerSesion.mockResolvedValue(sesionNoAdmin);
    renderizar();

    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Resultados" })).toBeInTheDocument();
    });
    expect(
      screen.queryByRole("checkbox", { name: "Vista usuario final" }),
    ).not.toBeInTheDocument();
  });

  it("activar el checkbox oculta los items de administracion de la nav", async () => {
    mocks.obtenerSesion.mockResolvedValue(sesionAdmin);
    renderizar();

    const checkbox = await screen.findByRole("checkbox", {
      name: "Vista usuario final",
    });
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(
        screen.queryByRole("link", { name: "Configuración" }),
      ).not.toBeInTheDocument();
    });
    expect(
      screen.queryByRole("link", { name: "Organizaciones" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Resultados" })).toBeInTheDocument();
  });

  it("con modo usuario final activo en /configuracion redirige a /tablas", async () => {
    mocks.setPathname("/configuracion");
    mocks.obtenerSesion.mockResolvedValue(sesionAdmin);
    renderizar();

    const checkbox = await screen.findByRole("checkbox", {
      name: "Vista usuario final",
    });
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(mocks.navegar).toHaveBeenCalledWith({
        to: "/tablas",
        replace: true,
      });
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run (workdir `apps/web`): `bunx vitest run src/app/layout-principal.test.tsx`
Expected: FAIL — checkbox y redirección no existen.

- [ ] **Step 3: Implement layout**

Modify `apps/web/src/app/layout-principal.tsx`:

3a. Importar el contexto:

```tsx
import {
  VistaProvider,
  useVistaUsuarioFinal,
} from "./contexto-vista";
```

3b. Renombrar la función actual: `export function LayoutPrincipal() {` → `export function LayoutPrincipal() {` (la exportada) que ahora renderiza solo el provider, y extraer todo el cuerpo actual (desde `const navegar = useNavigate();` hasta el final del `return`) a un componente interno nuevo:

```tsx
export function LayoutPrincipal() {
  return (
    <VistaProvider>
      <ContenidoLayoutPrincipal />
    </VistaProvider>
  );
}

function ContenidoLayoutPrincipal() {
  // ...todo el cuerpo que tenía LayoutPrincipal...
```

3c. Dentro de `ContenidoLayoutPrincipal`, tras calcular `esAdmin` (línea ~220), añadir:

```tsx
const { estado, setModoUsuarioFinal } = useVistaUsuarioFinal();
const puedeVerAdministracion = esAdmin && !estado.modoUsuarioFinal;
```

3d. Añadir el `useEffect` de redirección (después del existente de sesión 401, ~línea 146):

```tsx
useEffect(() => {
  if (puedeVerAdministracion) return;
  const rutaBloqueada =
    ubicacion.pathname === "/configuracion" ||
    ubicacion.pathname.startsWith("/admin/");
  if (rutaBloqueada) navegar({ to: "/tablas", replace: true });
}, [puedeVerAdministracion, ubicacion.pathname, navegar]);
```

3e. Añadir el checkbox en el bloque de acciones desktop (`<div className="ml-auto hidden items-center gap-4 md:flex">`), justo antes del `<div className="flex items-center gap-2.5 border-l border-line-200 pl-4">` del avatar:

```tsx
{esAdmin && (
  <label className="flex cursor-pointer items-center gap-2 select-none">
    <input
      type="checkbox"
      checked={estado.modoUsuarioFinal}
      onChange={(e) => setModoUsuarioFinal(e.target.checked)}
      className="h-4 w-4 accent-brand-600"
    />
    <span className="hidden xl:inline text-xs font-medium text-ink-600">
      Vista usuario final
    </span>
  </label>
)}
```

3f. Filtrar la nav desktop (`{NAVEGACION.filter((item) => {`, ~línea 242): añadir la tercera condición:

```tsx
{NAVEGACION.filter((item) => {
  if (item.superadmin && !esSuperadmin) return false;
  if (item.admin && !esAdmin) return false;
  if (estado.modoUsuarioFinal && (item.admin || item.superadmin))
    return false;
  return true;
})}
```

3g. Filtrar la nav móvil (`{NAVEGACION.filter((item) =>`, ~línea 306): añadir la condición final:

```tsx
{NAVEGACION.filter(
  (item) =>
    (!item.superadmin || esSuperadmin) &&
    (!item.admin || esAdmin) &&
    (!estado.modoUsuarioFinal || (!item.admin && !item.superadmin)),
).map((item) => (
```

- [ ] **Step 4: Run test to verify it passes**

Run (workdir `apps/web`): `bunx vitest run src/app/layout-principal.test.tsx`
Expected: 4 passing.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/app/layout-principal.tsx apps/web/src/app/layout-principal.test.tsx
git commit -m "feat: toggle de vista usuario final en el layout principal"
```

---

### Task 3: `PaginaInicio` — badge y card de plataforma

**Files:**
- Modify: `apps/web/src/modulos/inicio/pagina-inicio.tsx`
- Test: `apps/web/src/modulos/inicio/pagina-inicio.test.tsx`

**Interfaces:**
- Consumes: `useVistaUsuarioFinal` de `@/app/contexto-vista` (Task 1).

- [ ] **Step 1: Write the failing test**

Create `apps/web/src/modulos/inicio/pagina-inicio.test.tsx`:

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import React, { useEffect } from "react";
import { describe, expect, it, vi } from "vitest";
import { VistaProvider, useVistaUsuarioFinal } from "@/app/contexto-vista";
import { PaginaInicio } from "./pagina-inicio";

const mocks = vi.hoisted(() => ({
  obtenerSesion: vi.fn(),
  Link: ({ to, children }: { to: string; children: React.ReactNode }) =>
    React.createElement("a", { href: to }, children),
}));

vi.mock("@/modulos/autenticacion/api", () => ({
  obtenerSesion: mocks.obtenerSesion,
}));
vi.mock("@tanstack/react-router", () => ({
  Link: mocks.Link,
}));

const sesionAdmin = {
  usuario: { nombre: "Ana Admin", avatarUrl: null },
  esSuperadmin: true,
  tenantActivoId: "ten-1",
  tenantsDisponibles: [
    { id: "ten-1", nombre: "Tenant Demo", host: "demo.us.qlikcloud.com" },
  ],
  membresias: [{ rol: "admin" }],
};

function ConModo({ activo, children }: { activo: boolean; children: ReactNode }) {
  const { setModoUsuarioFinal } = useVistaUsuarioFinal();
  useEffect(() => {
    setModoUsuarioFinal(activo);
  }, [activo, setModoUsuarioFinal]);
  return <>{children}</>;
}

function renderizar(activo: boolean) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <VistaProvider>
        <ConModo activo={activo}>
          <PaginaInicio />
        </ConModo>
      </VistaProvider>
    </QueryClientProvider>,
  );
}

describe("PaginaInicio", () => {
  it("admin sin modo usuario final ve badge Administrador y la card de plataforma", async () => {
    mocks.obtenerSesion.mockResolvedValue(sesionAdmin);
    renderizar(false);

    await waitFor(() => {
      expect(screen.getByText("Administrador")).toBeInTheDocument();
    });
    expect(
      screen.getByText("Configuración de la plataforma"),
    ).toBeInTheDocument();
  });

  it("admin con modo usuario final ve badge Usuario final y oculta la card", async () => {
    mocks.obtenerSesion.mockResolvedValue(sesionAdmin);
    renderizar(true);

    await waitFor(() => {
      expect(screen.getByText("Usuario final")).toBeInTheDocument();
    });
    expect(
      screen.queryByText("Configuración de la plataforma"),
    ).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run (workdir `apps/web`): `bunx vitest run src/modulos/inicio/pagina-inicio.test.tsx`
Expected: FAIL — el badge muestra "Administrador" también con modo activo (aún sin consumir el contexto).

- [ ] **Step 3: Implement**

Modify `apps/web/src/modulos/inicio/pagina-inicio.tsx`:

3a. Importar el hook:

```tsx
import { useVistaUsuarioFinal } from "@/app/contexto-vista";
```

3b. Tras calcular `esAdmin` (línea ~58), añadir:

```tsx
const { estado } = useVistaUsuarioFinal();
const puedeVerAdministracion = esAdmin && !estado.modoUsuarioFinal;
```

3c. Reemplazar el badge (línea 97): `{esAdmin ? "Administrador" : "Usuario final"}` → `{puedeVerAdministracion ? "Administrador" : "Usuario final"}`.

3d. Reemplazar la card de plataforma (línea 122): `{esAdmin && (` → `{puedeVerAdministracion && (`.

- [ ] **Step 4: Run test to verify it passes**

Run (workdir `apps/web`): `bunx vitest run src/modulos/inicio/pagina-inicio.test.tsx`
Expected: 2 passing.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/modulos/inicio/pagina-inicio.tsx apps/web/src/modulos/inicio/pagina-inicio.test.tsx
git commit -m "feat: ocultar contenido de administracion en inicio segun vista"
```

---

### Task 4: `PaginaTablasDestino` — Resultados según vista

**Files:**
- Modify: `apps/web/src/modulos/tablas/pagina-tablas-destino.tsx`
- Test: `apps/web/src/modulos/tablas/pagina-tablas-destino.test.tsx`

**Interfaces:**
- Consumes: `useVistaUsuarioFinal` de `@/app/contexto-vista` (Task 1).

- [ ] **Step 1: Write the failing test**

Create `apps/web/src/modulos/tablas/pagina-tablas-destino.test.tsx`:

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import React, { useEffect } from "react";
import { describe, expect, it, vi } from "vitest";
import { VistaProvider, useVistaUsuarioFinal } from "@/app/contexto-vista";
import { NotificacionesProvider } from "@/compartido/componentes/feedback/notificaciones";
import { PaginaTablasDestino } from "./pagina-tablas-destino";

const mocks = vi.hoisted(() => ({
  obtenerSesion: vi.fn(),
  obtenerConexionesDestino: vi.fn(),
  obtenerRecursosDestino: vi.fn(),
  obtenerTablasImpala: vi.fn(),
  obtenerAutomatizaciones: vi.fn(),
  obtenerDetalleRecursoDestino: vi.fn(),
  useNavigate: vi.fn(),
  useNotificaciones: vi.fn(() => ({ mostrarExito: vi.fn(), mostrarError: vi.fn() })),
  Link: ({ to, children }: { to: string; children: React.ReactNode }) =>
    React.createElement("a", { href: to }, children),
}));

vi.mock("@/modulos/autenticacion/api", () => ({
  obtenerSesion: mocks.obtenerSesion,
}));
vi.mock("@/modulos/automatizaciones/api", () => ({
  obtenerConexionesDestino: mocks.obtenerConexionesDestino,
  obtenerRecursosDestino: mocks.obtenerRecursosDestino,
  obtenerTablasImpala: mocks.obtenerTablasImpala,
  obtenerAutomatizaciones: mocks.obtenerAutomatizaciones,
  obtenerDetalleRecursoDestino: mocks.obtenerDetalleRecursoDestino,
}));
vi.mock("@/compartido/componentes/feedback/notificaciones", () => ({
  useNotificaciones: mocks.useNotificaciones,
  NotificacionesProvider: ({ children }: { children: ReactNode }) => (
    <>{children}</>
  ),
}));
vi.mock("@tanstack/react-router", () => ({
  useNavigate: mocks.useNavigate,
  Link: mocks.Link,
}));

const sesionAdmin = {
  usuario: { nombre: "Ana Admin", avatarUrl: null },
  esSuperadmin: true,
  tenantActivoId: "ten-1",
  tenantsDisponibles: [
    { id: "ten-1", nombre: "Tenant Demo", host: "demo.us.qlikcloud.com" },
  ],
  membresias: [{ rol: "admin" }],
};

function ConModo({ activo, children }: { activo: boolean; children: ReactNode }) {
  const { setModoUsuarioFinal } = useVistaUsuarioFinal();
  useEffect(() => {
    setModoUsuarioFinal(activo);
  }, [activo, setModoUsuarioFinal]);
  return <>{children}</>;
}

function renderizar(activo: boolean) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <VistaProvider>
        <ConModo activo={activo}>
          <NotificacionesProvider>
            <PaginaTablasDestino />
          </NotificacionesProvider>
        </ConModo>
      </VistaProvider>
    </QueryClientProvider>,
  );
}

describe("PaginaTablasDestino", () => {
  it("admin sin modo usuario final ve 'Crear nuevo reporte' y permiso de edicion", async () => {
    mocks.obtenerSesion.mockResolvedValue(sesionAdmin);
    mocks.obtenerConexionesDestino.mockResolvedValue([]);
    mocks.obtenerTablasImpala.mockResolvedValue([]);
    mocks.obtenerAutomatizaciones.mockResolvedValue([]);
    renderizar(false);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Crear nuevo reporte" }),
      ).toBeInTheDocument();
    });
  });

  it("admin con modo usuario final ve 'Solicitar un nuevo reporte' y no el flujo admin", async () => {
    mocks.obtenerSesion.mockResolvedValue(sesionAdmin);
    mocks.obtenerConexionesDestino.mockResolvedValue([]);
    mocks.obtenerTablasImpala.mockResolvedValue([]);
    mocks.obtenerAutomatizaciones.mockResolvedValue([]);
    renderizar(true);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Solicitar un nuevo reporte" }),
      ).toBeInTheDocument();
    });
    expect(
      screen.queryByRole("button", { name: "Crear nuevo reporte" }),
    ).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run (workdir `apps/web`): `bunx vitest run src/modulos/tablas/pagina-tablas-destino.test.tsx`
Expected: FAIL — el segundo test encuentra "Crear nuevo reporte" en vez de "Solicitar un nuevo reporte" (la página aún no consume el contexto).

- [ ] **Step 3: Implement**

Modify `apps/web/src/modulos/tablas/pagina-tablas-destino.tsx`:

3a. Importar el hook:

```tsx
import { useVistaUsuarioFinal } from "@/app/contexto-vista";
```

3b. Tras el cálculo de `esAdmin` (línea ~69), añadir:

```tsx
const { estado } = useVistaUsuarioFinal();
const puedeVerAdministracion = esAdmin && !estado.modoUsuarioFinal;
```

3c. Reemplazar los seis usos de `esAdmin` (que condicionan contenido de administración) por `puedeVerAdministracion`:
- línea 219: `{esAdmin && organizacionActivaId ? (` (botón "Configurar Impala" en el estado de error) → `{puedeVerAdministracion && organizacionActivaId ? (`
- línea 262: `if (esAdmin) {` (mensaje "Modo Administrador") → `if (puedeVerAdministracion) {`
- línea 272: `{esAdmin ? "Crear nuevo reporte" : "Solicitar un nuevo reporte"}` → `{puedeVerAdministracion ? "Crear nuevo reporte" : "Solicitar un nuevo reporte"}`
- línea 445: `esAdmin` (mensaje de edición) → `puedeVerAdministracion`
- línea 453: `{esAdmin ? "Editar reporte" : "Editar (Requiere Administrador)"}` → `{puedeVerAdministracion ? "Editar reporte" : "Editar (Requiere Administrador)"}`
- línea 496: `{esAdmin ? (` (permisos de edición) → `{puedeVerAdministracion ? (`

- [ ] **Step 4: Run test to verify it passes**

Run (workdir `apps/web`): `bunx vitest run src/modulos/tablas/pagina-tablas-destino.test.tsx`
Expected: 2 passing.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/modulos/tablas/pagina-tablas-destino.tsx apps/web/src/modulos/tablas/pagina-tablas-destino.test.tsx
git commit -m "feat: ocultar acciones de administracion en resultados segun vista"
```

---

### Task 5: Verificación final

- [ ] **Step 1: Run full web test suite**

Run (workdir `apps/web`): `bunx vitest run`
Expected: 41 tests passing (4 contexto + 4 layout + 2 inicio + 2 tablas + 29 existentes).

- [ ] **Step 2: Run web typecheck**

Run (workdir `apps/web`): `bun run typecheck`
Expected: 0 errors. (Se toleran los falsos positivos conocidos TS2307 de `./*.js` y `bun:test`.)

- [ ] **Step 3: Format changed files**

Run (workdir raíz): `bunx prettier --write apps/web/src/app/contexto-vista.tsx apps/web/src/app/contexto-vista.test.tsx apps/web/src/app/layout-principal.tsx apps/web/src/app/layout-principal.test.tsx apps/web/src/modulos/inicio/pagina-inicio.tsx apps/web/src/modulos/inicio/pagina-inicio.test.tsx apps/web/src/modulos/tablas/pagina-tablas-destino.tsx apps/web/src/modulos/tablas/pagina-tablas-destino.test.tsx`

- [ ] **Step 4: Manual smoke test**

Con `bun run dev` en la raíz y sesión admin:
1. En `/tablas`, el header muestra el checkbox "Vista usuario final".
2. Al tildarlo, "Configuración" y "Organizaciones" desaparecen del nav.
3. Navegar a `/configuracion` con el modo activo redirige a `/tablas`.
4. En Resultados el botón cambia a "Solicitar un nuevo reporte"; en Inicio el badge dice "Usuario final" y desaparece la card "Configuración de la plataforma".

- [ ] **Step 5: Commit docs**

```bash
git add docs/superpowers/plans/2026-08-05-vista-usuario-final.md
git commit -m "docs: plan de implementacion de la vista usuario final"
```
