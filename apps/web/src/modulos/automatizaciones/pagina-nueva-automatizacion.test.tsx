import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import type { ReactElement } from "react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NotificacionesProvider } from "@/compartido/componentes/feedback/notificaciones";
import { PaginaNuevaAutomatizacion } from "./pagina-nueva-automatizacion";

const mocks = vi.hoisted(() => ({
  obtenerConfiguracionTenant: vi.fn(),
  obtenerAutomatizaciones: vi.fn(),
  obtenerFlujosConFiltros: vi.fn(),
  obtenerConexionesDestino: vi.fn(),
  obtenerRecursosDestino: vi.fn(),
  obtenerTablasImpala: vi.fn(),
  crearAutomatizacionDesdePlantilla: vi.fn(),
  useFiltroEspacioConPersistencia: vi.fn(() => ({ espacioId: undefined })),
  useNavigate: vi.fn(),
  Link: ({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) =>
    React.createElement("a", { href: to, className }, children),
}));

vi.mock("@/modulos/automatizaciones/api", () => ({
  obtenerConfiguracionTenant: mocks.obtenerConfiguracionTenant,
  obtenerAutomatizaciones: mocks.obtenerAutomatizaciones,
  obtenerFlujosConFiltros: mocks.obtenerFlujosConFiltros,
  obtenerConexionesDestino: mocks.obtenerConexionesDestino,
  obtenerRecursosDestino: mocks.obtenerRecursosDestino,
  obtenerTablasImpala: mocks.obtenerTablasImpala,
  crearAutomatizacionDesdePlantilla: mocks.crearAutomatizacionDesdePlantilla,
}));
vi.mock("@/compartido/hooks/use-filtro-espacio-con-persistencia", () => ({
  useFiltroEspacioConPersistencia: mocks.useFiltroEspacioConPersistencia,
}));
vi.mock("@tanstack/react-router", () => ({
  useNavigate: mocks.useNavigate,
  Link: mocks.Link,
}));

function renderizar(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <NotificacionesProvider>{ui}</NotificacionesProvider>
    </QueryClientProvider>,
  );
}

const flujosMock = [
  { id: "flujo-1", nombre: "Dataflow Ventas", espacioNombre: "Ventas", espacioId: "esp-1" },
];

const conexionesDestinoMock = [
  { id: "dest-1", nombre: "Conexión SFTP Prod", tipo: "sftp" as const, capacidades: { escribeTablas: false, escribeArchivos: true } },
  { id: "dest-2", nombre: "Conexión DB Stage", tipo: "jdbc" as const, capacidades: { escribeTablas: true, escribeArchivos: false } },
];

const recursosDestinoMock = [
  { id: "rec-1", nombre: "tabla_ventas", tipo: "tabla" as const, espacioDeNombres: "dest-1", metadatos: {} },
];

describe("PaginaNuevaAutomatizacion", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("modo 2 sin destino seleccionado muestra requisito y deshabilita crear", async () => {
    mocks.obtenerConfiguracionTenant.mockResolvedValue({
      modoAutomatizacionActivo: 2,
      plantillaEfectivaIdQlik: "pt-2",
      plantillaEfectivaNombre: "Talend SFTP",
      configurada: true,
    });
    mocks.obtenerAutomatizaciones.mockResolvedValue([]);
    mocks.obtenerFlujosConFiltros.mockResolvedValue(flujosMock);
    mocks.obtenerConexionesDestino.mockResolvedValue(conexionesDestinoMock);
    mocks.obtenerRecursosDestino.mockResolvedValue(recursosDestinoMock);
    mocks.obtenerTablasImpala.mockResolvedValue([]);

    renderizar(<PaginaNuevaAutomatizacion />);

    await waitFor(() => {
      expect(screen.getByText("El modo 2 requiere seleccionar una conexión destino y una tabla.")).toBeInTheDocument();
    });

    const botonCrear = screen.getByRole("button", { name: /crear automatización/i });
    expect(botonCrear).toBeDisabled();
  });

  it("modo 1 no muestra el texto de requisito del modo 2 y muestra bloque de solo lectura con modo y plantilla", async () => {
    mocks.obtenerConfiguracionTenant.mockResolvedValue({
      modoAutomatizacionActivo: 1,
      plantillaEfectivaIdQlik: "pt-1",
      plantillaEfectivaNombre: "Dataflow Spark",
      configurada: true,
    });
    mocks.obtenerAutomatizaciones.mockResolvedValue([]);
    mocks.obtenerFlujosConFiltros.mockResolvedValue(flujosMock);
    mocks.obtenerConexionesDestino.mockResolvedValue([]);
    mocks.obtenerTablasImpala.mockResolvedValue([{ nombre: "tabla_legacy" }]);

    renderizar(<PaginaNuevaAutomatizacion />);

    await waitFor(() => {
      expect(screen.queryByText("El modo 2 requiere seleccionar una conexión destino y una tabla.")).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/modo 1/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/dataflow spark/i)).toBeInTheDocument();
  });

  it("modo 2 con destino seleccionado permite habilitar boton crear", async () => {
    mocks.obtenerConfiguracionTenant.mockResolvedValue({
      modoAutomatizacionActivo: 2,
      plantillaEfectivaIdQlik: "pt-2",
      plantillaEfectivaNombre: "Talend SFTP",
      configurada: true,
    });
    mocks.obtenerAutomatizaciones.mockResolvedValue([]);
    mocks.obtenerFlujosConFiltros.mockResolvedValue(flujosMock);
    mocks.obtenerConexionesDestino.mockResolvedValue(conexionesDestinoMock);
    mocks.obtenerRecursosDestino.mockResolvedValue(recursosDestinoMock);
    mocks.obtenerTablasImpala.mockResolvedValue([]);

    renderizar(<PaginaNuevaAutomatizacion />);

    await waitFor(() => {
      expect(screen.queryByText("El modo 2 requiere seleccionar una conexión destino y una tabla.")).toBeInTheDocument();
    });

    const botonDestino = screen.getByLabelText(/conexión destino.*modo 2/i);
    await waitFor(() => expect(botonDestino).not.toBeDisabled());
  });

  it("configurada:false renderiza alerta con enlace a administracion", async () => {
    mocks.obtenerConfiguracionTenant.mockResolvedValue({
      modoAutomatizacionActivo: 1,
      plantillaEfectivaIdQlik: null,
      plantillaEfectivaNombre: null,
      configurada: false,
    });
    mocks.obtenerAutomatizaciones.mockResolvedValue([]);

    renderizar(<PaginaNuevaAutomatizacion />);

    await waitFor(() => {
      expect(screen.getByRole("link", { name: /ir a administración/i })).toBeInTheDocument();
    });
  });
});
