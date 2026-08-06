import { VistaProvider } from "@/app/contexto-vista";
import { NotificacionesProvider } from "@/compartido/componentes/feedback/notificaciones";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PaginaTablasDestino } from "./pagina-tablas-destino";

const mocks = vi.hoisted(() => ({
  obtenerSesion: vi.fn(),
  obtenerConexionesDestino: vi.fn(),
  obtenerRecursosDestino: vi.fn(),
  obtenerTablasImpala: vi.fn(),
  obtenerDetalleRecursoDestino: vi.fn(),
  obtenerDetalleTablaImpala: vi.fn(),
  obtenerAutomatizaciones: vi.fn(),
  useNavigate: vi.fn(),
  Link: ({ to, children }: { to: string; children: React.ReactNode }) =>
    React.createElement("a", { href: to }, children),
}));

vi.mock("@/modulos/autenticacion/publico", () => ({
  obtenerSesion: mocks.obtenerSesion,
}));
vi.mock("@/modulos/automatizaciones/publico", () => ({
  obtenerAutomatizaciones: mocks.obtenerAutomatizaciones,
  obtenerConexionesDestino: mocks.obtenerConexionesDestino,
  obtenerRecursosDestino: mocks.obtenerRecursosDestino,
  obtenerTablasImpala: mocks.obtenerTablasImpala,
  obtenerDetalleRecursoDestino: mocks.obtenerDetalleRecursoDestino,
}));
vi.mock("./api", () => ({
  obtenerConexionesDestino: mocks.obtenerConexionesDestino,
  obtenerRecursosDestino: mocks.obtenerRecursosDestino,
  obtenerTablasImpala: mocks.obtenerTablasImpala,
  obtenerDetalleRecursoDestino: mocks.obtenerDetalleRecursoDestino,
  obtenerDetalleTablaImpala: mocks.obtenerDetalleTablaImpala,
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
    {
      id: "ten-1",
      nombre: "Tenant Demo",
      host: "demo.us.qlikcloud.com",
      organizacionId: "org-1",
    },
  ],
  membresias: [{ rol: "admin", organizacionId: "org-1" }],
};

function renderizar() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <VistaProvider>
        <NotificacionesProvider>
          <PaginaTablasDestino />
        </NotificacionesProvider>
      </VistaProvider>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.useNavigate.mockReturnValue(vi.fn());
  mocks.obtenerSesion.mockResolvedValue(sesionAdmin);
  mocks.obtenerConexionesDestino.mockResolvedValue([]);
  mocks.obtenerTablasImpala.mockResolvedValue([]);
  mocks.obtenerRecursosDestino.mockResolvedValue([]);
  mocks.obtenerAutomatizaciones.mockResolvedValue([]);
});

describe("PaginaTablasDestino", () => {
  it("presenta el catálogo como una vista de solo lectura", async () => {
    renderizar();

    expect(await screen.findByText("Impala heredado")).toBeInTheDocument();
    expect(screen.getByText(/vista de solo lectura/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /crear nuevo reporte/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /solicitar un nuevo reporte/i }),
    ).not.toBeInTheDocument();
  });

  it("abre la configuración cuando Impala no está configurado", async () => {
    const navegar = vi.fn();
    mocks.useNavigate.mockReturnValue(navegar);
    mocks.obtenerTablasImpala.mockRejectedValue(
      new Error("El tenant no tiene configurado un servidor Impala"),
    );

    renderizar();

    fireEvent.click(
      await screen.findByRole("button", { name: "Configurar Impala" }),
    );
    expect(navegar).toHaveBeenCalledWith({ to: "/configuracion" });
  });

  it("adapta el detalle heredado de Impala al modelo común", async () => {
    mocks.obtenerTablasImpala.mockResolvedValue([{ nombre: "ventas" }]);
    mocks.obtenerDetalleTablaImpala.mockResolvedValue({
      baseDatos: "default",
      tabla: "ventas",
      totalFilas: 7,
      columnas: [{ nombre: "id", tipo: "BIGINT" }],
      actualizadoEn: "2026-08-06T15:00:00.000Z",
    });

    renderizar();
    fireEvent.click(await screen.findByRole("button", { name: /ventas/i }));

    expect(await screen.findByText("default.ventas")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("muestra metadatos reales sin inventar historial ni fechas", async () => {
    mocks.obtenerConexionesDestino.mockResolvedValue([
      {
        id: "destino-1",
        tipo: "postgres",
        nombre: "PostgreSQL producción",
        estado: "activo",
        mensajeError: null,
      },
    ]);
    mocks.obtenerRecursosDestino.mockResolvedValue([
      {
        id: "public.ventas",
        nombre: "ventas",
        tipo: "tabla",
        espacioDeNombres: "public",
        metadatos: {},
      },
    ]);
    mocks.obtenerDetalleRecursoDestino.mockResolvedValue({
      id: "public.ventas",
      nombre: "ventas",
      tipo: "tabla",
      espacioDeNombres: "public",
      metadatos: {},
      columnas: [{ nombre: "id", tipo: "BIGINT" }],
      totalFilas: 12,
      actualizadoEn: "2026-08-06T15:00:00.000Z",
    });

    renderizar();
    fireEvent.click(await screen.findByRole("button", { name: /ventas/i }));

    expect(await screen.findByText("public.ventas")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.queryByText(/historial de cambios/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/24\/07\/2026/)).not.toBeInTheDocument();
    expect(screen.queryByText(/hace un momento/i)).not.toBeInTheDocument();
  });
});
