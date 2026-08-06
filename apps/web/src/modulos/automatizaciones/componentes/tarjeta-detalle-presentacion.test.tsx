import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TarjetaDetalleAutomatizacion } from "./tarjeta-detalle-automatizacion";

vi.mock("./visor-workspace-modal", () => ({
  VisorWorkspaceModal: () => <button type="button">Ver workspace</button>,
}));

const automatizacion = {
  id: "auto-12345678",
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

const ultimaEjecucion = {
  id: "12345678-1234-1234-1234-123456789abc",
  estado: "finished",
  iniciadoEn: "2026-08-05T10:00:00.000Z",
  finalizadoEn: "2026-08-05T10:01:30.000Z",
};

describe("detalle visual de automatización", () => {
  it("prioriza estado, ejecución y última actividad", () => {
    render(
      <TarjetaDetalleAutomatizacion
        automatizacion={automatizacion}
        ejecutandoActiva={undefined}
        ultimaEjecucion={ultimaEjecucion}
        urlQlik="https://tenant.qlikcloud.com/automations/auto-12345678"
        onEjecutar={vi.fn()}
        onDetener={vi.fn()}
        onClonar={vi.fn()}
        mutationEjecutar={{ mutate: vi.fn(), isPending: false }}
        mutationDetener={{ mutate: vi.fn(), isPending: false }}
      />,
    );

    expect(screen.getByText("Disponible")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Ejecutar ahora" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Última ejecución")).toBeInTheDocument();
    expect(screen.getByText("Completada")).toBeInTheDocument();
    expect(screen.getByText("1 min 30 s")).toBeInTheDocument();
  });

  it("mantiene las acciones secundarias en un menú compacto", () => {
    const onClonar = vi.fn();
    render(
      <TarjetaDetalleAutomatizacion
        automatizacion={automatizacion}
        ejecutandoActiva={undefined}
        ultimaEjecucion={ultimaEjecucion}
        urlQlik="https://tenant.qlikcloud.com/automations/auto-12345678"
        onEjecutar={vi.fn()}
        onDetener={vi.fn()}
        onClonar={onClonar}
        mutationEjecutar={{ mutate: vi.fn(), isPending: false }}
        mutationDetener={{ mutate: vi.fn(), isPending: false }}
      />,
    );

    expect(screen.queryByText("Clonar automatización")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Más acciones" }));

    expect(screen.getByText("Clonar automatización")).toBeInTheDocument();
    expect(screen.getByText("Abrir en Qlik Cloud")).toBeInTheDocument();
    expect(screen.getByText("Ver workspace")).toBeInTheDocument();
  });
});
