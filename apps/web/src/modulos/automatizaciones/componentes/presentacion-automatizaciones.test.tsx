import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BarraFiltrosAutomatizaciones } from "./barra-filtros-automatizaciones";
import { ListaAutomatizaciones } from "./lista-automatizaciones";
import { ListaEjecuciones } from "./lista-ejecuciones";

const automatizacion = {
  id: "automation-1",
  nombre: "Carga diaria de ventas",
  espacioId: "space-1",
  espacioNombre: "Ventas",
  propietarioId: "user-1",
  propietarioNombre: "Andres Gaibor",
  activa: true,
  modoEjecucion: "manual",
  ejecucionActiva: false,
  puedeEjecutar: true,
  creadoEn: "2026-08-01T10:00:00.000Z",
  modificadoEn: "2026-08-05T10:00:00.000Z",
};

describe("presentación de automatizaciones", () => {
  it("mantiene los filtros compactos y usa búsqueda semántica", () => {
    const { container } = render(
      <BarraFiltrosAutomatizaciones
        busquedaTemp="ventas"
        setBusquedaTemp={vi.fn()}
        buscar={(evento) => evento.preventDefault()}
        limpiar={vi.fn()}
        espacios={[{ id: "space-1", nombre: "Ventas" }]}
        espacioFiltrado="space-1"
        onEspacioChange={vi.fn()}
      />,
    );

    expect(container.querySelector('input[type="search"]')).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /^buscar$/i }),
    ).not.toBeInTheDocument();
  });

  it("presenta cada automatización como fila operativa responsive", () => {
    const { container } = render(
      <ListaAutomatizaciones
        automatizaciones={[automatizacion]}
        idEjecutando={null}
        espacioFiltrado="space-1"
        targetHost="tenant.qlikcloud.com"
        hayFiltros={false}
        onEjecutar={vi.fn()}
      />,
    );

    expect(container.querySelector("article")).toBeInTheDocument();
    expect(screen.getByText("Automatización")).toBeInTheDocument();
    expect(screen.getAllByText("Estado").length).toBeGreaterThan(0);
    expect(
      screen.getByRole("button", { name: /ejecutar ahora/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Abrir en Qlik Cloud")).toBeInTheDocument();
  });

  it("hace legibles estado, duración, id y error de cada ejecución", () => {
    render(
      <ListaEjecuciones
        ejecuciones={[
          {
            id: "12345678-1234-1234-1234-123456789abc",
            estado: "finished",
            iniciadoEn: "2026-08-05T10:00:00.000Z",
            finalizadoEn: "2026-08-05T10:01:30.000Z",
          },
          {
            id: "87654321-4321-4321-4321-cba987654321",
            estado: "failed",
            iniciadoEn: "2026-08-04T10:00:00.000Z",
            finalizadoEn: "2026-08-04T10:00:10.000Z",
            error: { message: "Conexión rechazada por el destino" },
          },
        ]}
      />,
    );

    expect(screen.getByText("Completada")).toBeInTheDocument();
    expect(screen.getByText("Fallida")).toBeInTheDocument();
    expect(screen.getByText("12345678…789abc")).toBeInTheDocument();
    expect(screen.getByText("1 min 30 s")).toBeInTheDocument();
    expect(
      screen.getByText("Conexión rechazada por el destino"),
    ).toBeInTheDocument();
  });
});
