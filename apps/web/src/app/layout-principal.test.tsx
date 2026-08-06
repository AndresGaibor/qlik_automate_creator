import { NotificacionesProvider } from "@/compartido/componentes/feedback/notificaciones";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
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

const sesionAdminMultiples = {
  ...sesionAdmin,
  tenantsDisponibles: [
    { id: "ten-1", nombre: "Tenant Demo", host: "demo.us.qlikcloud.com" },
    {
      id: "ten-2",
      nombre: "Tenant Secundario",
      host: "secundario.us.qlikcloud.com",
    },
  ],
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
    expect(
      screen.getByRole("link", { name: "Configuración" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Organizaciones" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Superadministradores" }),
    ).not.toBeInTheDocument();
  });

  it("mantiene una sola organización visible aunque la sesión devuelva varias", async () => {
    mocks.obtenerSesion.mockResolvedValue(sesionAdminMultiples);
    renderizar();

    await screen.findByRole("link", { name: "Configuración" });
    expect(
      screen.queryByRole("button", { name: /Tenant Demo/i }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Tenant Secundario")).not.toBeInTheDocument();
  });

  it("no redirige configuración mientras la sesión todavía está cargando", async () => {
    mocks.setPathname("/configuracion");
    let resolverSesion: ((valor: typeof sesionAdmin) => void) | undefined;
    mocks.obtenerSesion.mockReturnValue(
      new Promise((resolve) => {
        resolverSesion = resolve;
      }),
    );

    renderizar();

    await waitFor(() => expect(mocks.obtenerSesion).toHaveBeenCalled());
    expect(mocks.navegar).not.toHaveBeenCalledWith({
      to: "/tablas",
      replace: true,
    });

    resolverSesion?.(sesionAdmin);
    await screen.findByRole("link", { name: "Configuración" });
    expect(mocks.navegar).not.toHaveBeenCalledWith({
      to: "/tablas",
      replace: true,
    });
  });

  it("no-admin no ve el checkbox", async () => {
    mocks.obtenerSesion.mockResolvedValue(sesionNoAdmin);
    renderizar();

    await waitFor(() => {
      expect(
        screen.getByRole("link", { name: "Resultados" }),
      ).toBeInTheDocument();
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
    expect(
      screen.getByRole("link", { name: "Resultados" }),
    ).toBeInTheDocument();
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
