import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BarraFiltrosAutomatizaciones } from "./barra-filtros-automatizaciones";

describe("BarraFiltrosAutomatizaciones", () => {
  it("oculta el selector de espacios en vista de usuario final", () => {
    render(
      <BarraFiltrosAutomatizaciones
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
      screen.getByRole("searchbox", { name: /Buscar automatizaciones/i }),
    ).toBeInTheDocument();
  });
});
