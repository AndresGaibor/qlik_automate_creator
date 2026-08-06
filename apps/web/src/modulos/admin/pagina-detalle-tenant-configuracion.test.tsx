import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import type React from "react";
import { describe, expect, it, vi } from "vitest";
import { PaginaDetalleTenant } from "./pagina-detalle-tenant";

const mocks = vi.hoisted(() => ({
  obtenerDetalleTenant: vi.fn(),
  obtenerTenantsQlik: vi.fn(),
  obtenerConfiguracionOauthTenant: vi.fn(),
}));

vi.mock("./api", () => ({
  obtenerDetalleTenant: mocks.obtenerDetalleTenant,
  obtenerTenantsQlik: mocks.obtenerTenantsQlik,
  obtenerConfiguracionOauthTenant: mocks.obtenerConfiguracionOauthTenant,
}));
vi.mock("./hooks/useDetalleTenantMutations", () => ({
  useDetalleTenantMutations: () => ({
    actualizar: { mutate: vi.fn(), isPending: false },
    agregarUsuario: { mutate: vi.fn(), isPending: false },
    actualizarUsuario: { mutate: vi.fn(), isPending: false },
    eliminarUsuario: { mutate: vi.fn(), isPending: false },
    crearQlik: { mutate: vi.fn(), isPending: false },
    hacerPrincipal: { mutate: vi.fn(), isPending: false },
    eliminarQlik: { mutate: vi.fn(), isPending: false },
  }),
}));
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));
vi.mock("./componentes/seccion-info-tenant", () => ({
  SeccionInfoTenant: () => <div>Contenido general</div>,
}));
vi.mock("./componentes/seccion-qlik-cloud", () => ({
  SeccionQlikCloud: () => <div>Contenido Qlik</div>,
}));
vi.mock("./componentes/seccion-oauth-qlik", () => ({
  SeccionOauthQlik: () => <div>Contenido OAuth</div>,
}));
vi.mock("./componentes/seccion-automatizacion-base-tenant", () => ({
  SeccionAutomatizacionBaseTenant: () => <div>Contenido plantilla</div>,
}));
vi.mock("./componentes/seccion-configurar-impala-tenant", () => ({
  SeccionConfigurarImpalaTenant: () => <div>Contenido Impala</div>,
}));
vi.mock("./componentes/seccion-usuarios", () => ({
  SeccionUsuarios: () => <div>Contenido usuarios</div>,
}));
vi.mock("@/modulos/origenes/pagina-catalogo-origen", () => ({
  PaginaCatalogoOrigen: () => <div>Contenido orígenes</div>,
}));

function renderizar() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <PaginaDetalleTenant tenantId="org-1" modoConfiguracion />
    </QueryClientProvider>,
  );
}

describe("PaginaDetalleTenant como configuración", () => {
  it("muestra el diseño unificado con siete secciones y sin lista de organizaciones", async () => {
    mocks.obtenerDetalleTenant.mockResolvedValue({
      id: "org-1",
      nombre: "Aliware",
      slug: "aliware",
      estado: "activa",
      creadoEn: "2026-08-05",
      usuarios: [
        { id: "u1", nombre: "Andrés", correo: "a@b.com", rol: "admin" },
      ],
    });
    mocks.obtenerTenantsQlik.mockResolvedValue([
      {
        id: "q1",
        organizacionId: "org-1",
        tenantIdQlik: "tenant-1",
        host: "empresa.us.qlikcloud.com",
        nombre: "Producción",
        estado: "activo",
        esPrincipal: true,
        automatizacionBaseIdQlik: "auto-1",
        automatizacionBaseNombre: "Plantilla principal",
        impalaHost: "impala.local",
        creadoEn: "2026-08-05",
      },
    ]);
    mocks.obtenerConfiguracionOauthTenant.mockResolvedValue({
      estado: "verificada",
    });

    renderizar();

    expect(
      await screen.findByRole("heading", { name: "Configuración" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/conexión a Impala/i)).toBeInTheDocument();
    const navegacion = screen.getByRole("navigation", {
      name: "Secciones de configuración",
    });
    for (const etiqueta of [
      "General",
      "Qlik Cloud",
      "OAuth",
      "Plantilla base",
      "Impala",
      "Usuarios",
    ]) {
      expect(navegacion).toHaveTextContent(etiqueta);
    }
    expect(
      screen.getByRole("progressbar", { name: "Progreso de configuración" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Organizaciones")).not.toBeInTheDocument();
  });
});
