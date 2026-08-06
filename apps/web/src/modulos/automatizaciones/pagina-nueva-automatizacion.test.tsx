import { NotificacionesProvider } from "@/compartido/componentes/feedback/notificaciones";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactElement } from "react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PaginaNuevaAutomatizacion } from "./pagina-nueva-automatizacion";

const mocks = vi.hoisted(() => ({
  obtenerConfiguracionTenant: vi.fn(),
  obtenerAutomatizaciones: vi.fn(),
  obtenerFlujosConFiltros: vi.fn(),
  obtenerConexionesDestino: vi.fn(),
  obtenerRecursosDestino: vi.fn(),
  obtenerPreflightAutomatizacion: vi.fn(),
  probarConexionOrigen: vi.fn(),
  crearAutomatizacionDesdePlantilla: vi.fn(),
  useFiltroEspacioConPersistencia: vi.fn(() => ({ espacioId: undefined })),
  useNavigate: vi.fn(() => vi.fn()),
  Link: ({ to, children }: { to: string; children: React.ReactNode }) =>
    React.createElement("a", { href: to }, children),
}));

vi.mock("@/modulos/automatizaciones/api", () => ({
  obtenerConfiguracionTenant: mocks.obtenerConfiguracionTenant,
  obtenerAutomatizaciones: mocks.obtenerAutomatizaciones,
  obtenerFlujosConFiltros: mocks.obtenerFlujosConFiltros,
  obtenerConexionesDestino: mocks.obtenerConexionesDestino,
  obtenerRecursosDestino: mocks.obtenerRecursosDestino,
  obtenerPreflightAutomatizacion: mocks.obtenerPreflightAutomatizacion,
  probarConexionOrigen: mocks.probarConexionOrigen,
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

const flujos = [
  {
    id: "flujo-1",
    nombre: "Dataflow Ventas",
    espacioNombre: "Ventas",
    espacioId: "esp-1",
  },
];
const destinoPostgres = {
  id: "33333333-3333-4333-8333-333333333333",
  nombre: "Postgres demo",
  tipo: "postgres" as const,
  estado: "activo" as const,
  probadaEn: "2026-08-06T12:00:00.000Z",
  mensajeError: null,
};

function prepararComun(modo: 1 | 2, puedeAdministrarConexiones = false) {
  mocks.obtenerConfiguracionTenant.mockResolvedValue({
    modoAutomatizacionActivo: modo,
    plantillaEfectivaIdQlik: `pt-${modo}`,
    plantillaEfectivaNombre: modo === 1 ? "Dataflow Spark" : "Talend SFTP",
    configurada: true,
    puedeAdministrarConexiones,
  });
  mocks.obtenerAutomatizaciones.mockResolvedValue([]);
  mocks.obtenerFlujosConFiltros.mockResolvedValue(flujos);
  mocks.obtenerConexionesDestino.mockResolvedValue([destinoPostgres]);
  mocks.obtenerRecursosDestino.mockResolvedValue([
    {
      id: "public.ventas",
      nombre: "ventas",
      tipo: "tabla",
      espacioDeNombres: "public",
      metadatos: {},
    },
  ]);
}

const preflightCompleto = {
  flujo: { id: "flujo-1", nombre: "Dataflow Ventas" },
  conexionesRequeridas: [
    {
      tipo: "jdbc" as const,
      nombre: "Ventas DB",
      estado: "disponible" as const,
      conexionId: "11111111-1111-4111-8111-111111111111",
      probadaEn: "2026-08-06T12:00:00.000Z",
      mensaje: null,
    },
  ],
  destinosPostgres: [
    {
      id: destinoPostgres.id,
      nombre: destinoPostgres.nombre,
      estado: "activo" as const,
      probadoEn: destinoPostgres.probadaEn,
      mensaje: null,
    },
  ],
};

describe("PaginaNuevaAutomatizacion", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.pushState({}, "", "/automatizaciones/nueva");
  });

  it("Modo 1 ejecuta preflight, muestra orígenes y no solicita tabla", async () => {
    prepararComun(1);
    mocks.obtenerPreflightAutomatizacion.mockResolvedValue({
      ...preflightCompleto,
      conexionesRequeridas: [
        {
          tipo: "sftp",
          nombre: "Salida SFTP",
          estado: "faltante",
          conexionId: null,
          probadaEn: null,
          mensaje: null,
        },
      ],
    });
    renderizar(<PaginaNuevaAutomatizacion />);

    await screen.findByRole("option", { name: "Dataflow Ventas" });
    const selector = screen.getByLabelText("Dataflow de origen");
    fireEvent.change(selector, { target: { value: "flujo-1" } });

    await waitFor(() => expect(selector).toHaveValue("flujo-1"));
    await waitFor(() =>
      expect(mocks.obtenerPreflightAutomatizacion).toHaveBeenCalledWith(
        "flujo-1",
      ),
    );
    expect((await screen.findAllByText("Salida SFTP")).length).toBeGreaterThan(
      0,
    );
    expect(screen.getByText("Base destino PostgreSQL")).toBeInTheDocument();
    expect(screen.queryByLabelText(/tabla destino/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Crear automatización" }),
    ).toBeDisabled();
  });

  it("prueba una conexión guardada, refresca el preflight y habilita la creación", async () => {
    prepararComun(1, true);
    const conexionId = "11111111-1111-4111-8111-111111111111";
    mocks.obtenerPreflightAutomatizacion
      .mockResolvedValueOnce({
        ...preflightCompleto,
        conexionesRequeridas: [
          {
            tipo: "jdbc",
            nombre: "Bancolombia prueba:Postgres_BanColombia_Prueba",
            estado: "sin_probar",
            conexionId,
            probadaEn: null,
            mensaje: null,
          },
        ],
      })
      .mockResolvedValueOnce({
        ...preflightCompleto,
        conexionesRequeridas: [
          {
            tipo: "jdbc",
            nombre: "Bancolombia prueba:Postgres_BanColombia_Prueba",
            estado: "disponible",
            conexionId,
            probadaEn: "2026-08-06T12:05:00.000Z",
            mensaje: null,
          },
        ],
      });
    mocks.probarConexionOrigen.mockResolvedValue({
      estado: "disponible",
      probadaEn: "2026-08-06T12:05:00.000Z",
      mensaje: null,
    });

    renderizar(<PaginaNuevaAutomatizacion />);
    await screen.findByRole("option", { name: "Dataflow Ventas" });
    fireEvent.change(screen.getByLabelText("Dataflow de origen"), {
      target: { value: "flujo-1" },
    });

    const probar = await screen.findByRole("button", {
      name: "Probar conexión guardada",
    });
    expect(
      screen.getByRole("link", { name: "Editar en Configuración" }),
    ).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Base destino PostgreSQL"), {
      target: { value: destinoPostgres.id },
    });
    fireEvent.click(
      screen.getByRole("checkbox", {
        name: /este demo guardara credenciales/i,
      }),
    );
    expect(
      screen.getByRole("button", { name: "Crear automatización" }),
    ).toBeDisabled();

    fireEvent.click(probar);
    await waitFor(() =>
      expect(mocks.probarConexionOrigen).toHaveBeenCalledWith(conexionId),
    );
    await waitFor(() =>
      expect(mocks.obtenerPreflightAutomatizacion).toHaveBeenCalledTimes(2),
    );
    expect(await screen.findByText("Disponible")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Crear automatización" }),
    ).toBeEnabled();
    expect(
      screen.queryByText("Credenciales (usuario:clave)"),
    ).not.toBeInTheDocument();
  });

  it("oculta la edición de la conexión a usuarios sin permiso", async () => {
    prepararComun(1, false);
    mocks.obtenerPreflightAutomatizacion.mockResolvedValue({
      ...preflightCompleto,
      conexionesRequeridas: [
        {
          tipo: "jdbc",
          nombre: "Ventas DB",
          estado: "sin_probar",
          conexionId: "11111111-1111-4111-8111-111111111111",
          probadaEn: null,
          mensaje: null,
        },
      ],
    });
    renderizar(<PaginaNuevaAutomatizacion />);
    await screen.findByRole("option", { name: "Dataflow Ventas" });
    fireEvent.change(screen.getByLabelText("Dataflow de origen"), {
      target: { value: "flujo-1" },
    });
    await screen.findByRole("button", { name: "Probar conexión guardada" });
    expect(
      screen.queryByRole("link", { name: "Editar en Configuración" }),
    ).not.toBeInTheDocument();
  });

  it("Modo 1 envía el payload mínimo cuando todo está probado", async () => {
    prepararComun(1);
    mocks.obtenerPreflightAutomatizacion.mockResolvedValue(preflightCompleto);
    mocks.crearAutomatizacionDesdePlantilla.mockResolvedValue({
      id: "auto-1",
      nombre: "Ventas demo",
      plantillaIdQlik: "pt-1",
      modoPlantilla: 1,
    });
    renderizar(<PaginaNuevaAutomatizacion />);

    await screen.findByRole("option", { name: "Dataflow Ventas" });
    fireEvent.change(screen.getByLabelText("Dataflow de origen"), {
      target: { value: "flujo-1" },
    });
    await screen.findByText("Ventas DB");
    fireEvent.change(screen.getByLabelText("Base destino PostgreSQL"), {
      target: { value: destinoPostgres.id },
    });
    fireEvent.change(screen.getByLabelText("Nombre de la automatización"), {
      target: { value: "Ventas demo" },
    });
    fireEvent.click(
      screen.getByRole("checkbox", {
        name: /este demo guardara credenciales/i,
      }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Crear automatización" }),
    );

    await waitFor(() => {
      expect(mocks.crearAutomatizacionDesdePlantilla).toHaveBeenCalledWith({
        nombre: "Ventas demo",
        flujoId: "flujo-1",
        destinoId: destinoPostgres.id,
        espacioIdQlik: undefined,
      });
    });
    const payload = mocks.crearAutomatizacionDesdePlantilla.mock.calls[0][0];
    expect(payload).not.toHaveProperty("tablaId");
    expect(payload).not.toHaveProperty("plantillaIdQlik");
    expect(payload).not.toHaveProperty("SECRETOSJSON");
  });

  it("Modo 2 conserva la selección de conexión y tabla", async () => {
    prepararComun(2);
    renderizar(<PaginaNuevaAutomatizacion />);
    const flujo = await screen.findByLabelText(/dataflow de origen/i);
    await waitFor(() => expect(flujo).not.toBeDisabled());
    fireEvent.click(flujo);
    fireEvent.click(
      await screen.findByRole("option", { name: /dataflow ventas/i }),
    );
    expect(
      screen.getByLabelText(/conexión destino.*modo 2/i),
    ).not.toBeDisabled();
    expect(
      screen.getByText(
        "El modo 2 requiere seleccionar una conexión destino y una tabla.",
      ),
    ).toBeInTheDocument();
  });

  it("mantiene protección beforeunload con cambios", async () => {
    prepararComun(1);
    mocks.obtenerPreflightAutomatizacion.mockResolvedValue(preflightCompleto);
    const agregar = vi.spyOn(window, "addEventListener");
    renderizar(<PaginaNuevaAutomatizacion />);
    await screen.findByRole("option", { name: "Dataflow Ventas" });
    fireEvent.change(screen.getByLabelText("Dataflow de origen"), {
      target: { value: "flujo-1" },
    });
    await waitFor(() =>
      expect(agregar).toHaveBeenCalledWith(
        "beforeunload",
        expect.any(Function),
      ),
    );
  });

  it("configurada:false muestra enlace de administración", async () => {
    mocks.obtenerConfiguracionTenant.mockResolvedValue({
      modoAutomatizacionActivo: 1,
      plantillaEfectivaIdQlik: null,
      plantillaEfectivaNombre: null,
      configurada: false,
    });
    mocks.obtenerAutomatizaciones.mockResolvedValue([]);
    renderizar(<PaginaNuevaAutomatizacion />);
    expect(
      await screen.findByRole("link", { name: /ir a configuración/i }),
    ).toHaveAttribute("href", "/configuracion#plantilla");
  });
});
