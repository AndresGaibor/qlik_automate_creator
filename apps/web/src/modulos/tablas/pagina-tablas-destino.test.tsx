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
  useNotificaciones: vi.fn(() => ({
    mostrarExito: vi.fn(),
    mostrarError: vi.fn(),
  })),
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

function ConModo({
  activo,
  children,
}: {
  activo: boolean;
  children: ReactNode;
}) {
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
      expect(screen.getByText("Impala heredado")).toBeInTheDocument();
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
      expect(screen.getByText("Impala heredado")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Solicitar un nuevo reporte" }),
      ).toBeInTheDocument();
    });
    expect(
      screen.queryByRole("button", { name: "Crear nuevo reporte" }),
    ).not.toBeInTheDocument();
  });
});
