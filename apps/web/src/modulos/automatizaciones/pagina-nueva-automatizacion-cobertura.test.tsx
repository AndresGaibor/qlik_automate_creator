import { NotificacionesProvider } from "@/compartido/componentes/feedback/notificaciones";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PaginaNuevaAutomatizacion } from "./pagina-nueva-automatizacion";

const mocks = vi.hoisted(() => ({
  config: vi.fn(),
  automatizaciones: vi.fn(),
  flujos: vi.fn(),
  conexiones: vi.fn(),
  recursos: vi.fn(),
  preflight: vi.fn(),
  crear: vi.fn(),
  navegar: vi.fn(),
  propsModo1: undefined as Record<string, unknown> | undefined,
  propsModo2: undefined as Record<string, unknown> | undefined,
}));

vi.mock("@/modulos/automatizaciones/api", () => ({
  obtenerConfiguracionTenant: mocks.config,
  obtenerAutomatizaciones: mocks.automatizaciones,
  obtenerFlujosConFiltros: mocks.flujos,
  obtenerConexionesDestino: mocks.conexiones,
  obtenerRecursosDestino: mocks.recursos,
  obtenerPreflightAutomatizacion: mocks.preflight,
  crearAutomatizacionDesdePlantilla: mocks.crear,
}));
vi.mock("@/compartido/hooks/use-filtro-espacio-con-persistencia", () => ({
  useFiltroEspacioConPersistencia: () => ({ espacioId: undefined }),
}));
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mocks.navegar,
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
}));
vi.mock("./componentes/formulario-crear-automatizacion-modo-1", () => ({
  FormularioCrearAutomatizacionModo1: (props: Record<string, unknown>) => {
    mocks.propsModo1 = props;
    return (
      <div>
        <button
          type="button"
          onClick={() => (props.onConexionGuardada as () => void)()}
        >
          Refrescar origen
        </button>
        <button
          type="button"
          onClick={() =>
            (props.onDestinoGuardado as (id: string) => void)(
              "44444444-4444-4444-8444-444444444444",
            )
          }
        >
          Guardar destino inline
        </button>
      </div>
    );
  },
}));
vi.mock("./componentes/formulario-crear-automatizacion", () => ({
  FormularioCrearAutomatizacion: (props: Record<string, unknown>) => {
    mocks.propsModo2 = props;
    return (
      <div>
        <button
          type="button"
          onClick={() => (props.setFlujoId as (id: string) => void)("flujo-1")}
        >
          Elegir flujo M2
        </button>
        <button
          type="button"
          onClick={() =>
            (props.setDestinoId as (id: string) => void)("destino-1")
          }
        >
          Elegir destino M2
        </button>
        <button
          type="button"
          onClick={() =>
            (props.setTablaId as (id: string) => void)("public.ventas")
          }
        >
          Elegir tabla M2
        </button>
        <button
          type="button"
          onClick={() =>
            (props.setNombre as (valor: string) => void)("Modo 2 demo")
          }
        >
          Nombrar M2
        </button>
        <button type="button" onClick={() => (props.onCrear as () => void)()}>
          Crear M2
        </button>
      </div>
    );
  },
}));

function renderizar() {
  const cliente = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return {
    cliente,
    ...render(
      <QueryClientProvider client={cliente}>
        <NotificacionesProvider>
          <PaginaNuevaAutomatizacion />
        </NotificacionesProvider>
      </QueryClientProvider>,
    ),
  };
}
const flujo = {
  id: "flujo-1",
  nombre: "Ventas",
  espacioNombre: "Operaciones",
};
const destino = {
  id: "destino-1",
  nombre: "Postgres",
  tipo: "postgres",
  estado: "activo",
  probadaEn: "2026-08-06T12:00:00.000Z",
  mensajeError: null,
};

function preparar(modo: 1 | 2) {
  mocks.config.mockResolvedValue({
    modoAutomatizacionActivo: modo,
    configurada: true,
    plantillaEfectivaNombre: `Plantilla ${modo}`,
  });
  mocks.automatizaciones.mockResolvedValue([]);
  mocks.flujos.mockResolvedValue([flujo]);
  mocks.conexiones.mockResolvedValue([destino]);
  mocks.recursos.mockResolvedValue([
    {
      id: "public.ventas",
      nombre: "ventas",
      tipo: "tabla",
      espacioDeNombres: "public",
      metadatos: {},
    },
  ]);
  mocks.preflight.mockResolvedValue({
    flujo: { id: flujo.id, nombre: flujo.nombre },
    conexionesRequeridas: [],
    destinosPostgres: [],
  });
}

describe("PaginaNuevaAutomatizacion · coordinación", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.propsModo1 = undefined;
    mocks.propsModo2 = undefined;
    window.history.pushState({}, "", "/automatizaciones/nueva");
  });

  it("invalida preflight y destinos tras guardados inline", async () => {
    preparar(1);
    const { cliente } = renderizar();
    const invalidar = vi.spyOn(cliente, "invalidateQueries");

    fireEvent.click(
      await screen.findByRole("button", { name: "Refrescar origen" }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Guardar destino inline" }),
    );

    expect(invalidar).toHaveBeenCalledWith({
      queryKey: ["automatizaciones-preflight", ""],
    });
    expect(invalidar).toHaveBeenCalledWith({
      queryKey: ["destinos-conexiones"],
    });
    expect(mocks.propsModo1?.destinoId).toBe(
      "44444444-4444-4444-8444-444444444444",
    );
  });

  it("ejecuta la rama completa de creación Modo 2", async () => {
    preparar(2);
    mocks.crear.mockResolvedValue({ id: "auto-2", nombre: "Modo 2 demo" });
    renderizar();

    fireEvent.click(
      await screen.findByRole("button", { name: "Elegir flujo M2" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Elegir destino M2" }));
    await waitFor(() =>
      expect(mocks.recursos).toHaveBeenCalledWith("destino-1"),
    );
    fireEvent.click(screen.getByRole("button", { name: "Elegir tabla M2" }));
    fireEvent.click(screen.getByRole("button", { name: "Nombrar M2" }));
    fireEvent.click(screen.getByRole("button", { name: "Crear M2" }));

    await waitFor(() =>
      expect(mocks.crear).toHaveBeenCalledWith({
        nombre: "Modo 2 demo",
        espacioIdQlik: undefined,
        flujoId: "flujo-1",
        tablaId: "public.ventas",
        destinoId: "destino-1",
        reemplazosWorkspace: [],
      }),
    );
    expect(mocks.navegar).toHaveBeenCalledWith({ to: "/automatizaciones" });
  });
});
