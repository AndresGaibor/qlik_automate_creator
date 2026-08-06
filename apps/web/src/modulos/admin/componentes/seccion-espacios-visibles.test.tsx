import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SeccionEspaciosVisiblesPresentacion } from "./seccion-espacios-visibles";

describe("SeccionEspaciosVisibles", () => {
  it("permite seleccionar espacios y guardar la política", () => {
    const onGuardar = vi.fn();
    render(
      <SeccionEspaciosVisiblesPresentacion
        espacios={[
          {
            id: "ventas",
            nombre: "Ventas",
            tipo: "shared",
            disponible: true,
            seleccionado: true,
          },
          {
            id: "finanzas",
            nombre: "Finanzas",
            tipo: "managed",
            disponible: true,
            seleccionado: false,
          },
        ]}
        permitirRecursosSinEspacio={false}
        guardando={false}
        sincronizando={false}
        onGuardar={onGuardar}
        onSincronizar={vi.fn()}
      />,
    );

    expect(screen.getByText("1 de 2 espacios habilitados")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Finanzas"));
    fireEvent.click(
      screen.getByLabelText(/recursos personales o sin espacio/i),
    );
    fireEvent.click(
      screen.getByRole("button", { name: /guardar espacios visibles/i }),
    );
    expect(onGuardar).toHaveBeenCalledWith({
      espaciosPermitidosIds: ["ventas", "finanzas"],
      permitirRecursosSinEspacio: true,
    });
  });
});
