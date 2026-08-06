import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BarraFiltrosFlujos } from "./barra-filtros-flujos";

describe("BarraFiltrosFlujos", () => {
  it("oculta el selector de espacios en vista de usuario final", () => {
    render(
      <BarraFiltrosFlujos
        busquedaTemp=""
        setBusquedaTemp={vi.fn()}
        buscar={vi.fn()}
        limpiar={vi.fn()}
        espacios={[{ id: "space-1", nombre: "Ventas" }]}
        espacioFiltrado=""
        onEspacioChange={vi.fn()}
        mostrarFiltroEspacio={false}
      />,
    );

    expect(screen.queryByText(/Filtrar por espacio/i)).not.toBeInTheDocument();
    expect(screen.queryByText("Todos los espacios")).not.toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /Buscar Dataflow/i }),
    ).toBeInTheDocument();
  });
});
