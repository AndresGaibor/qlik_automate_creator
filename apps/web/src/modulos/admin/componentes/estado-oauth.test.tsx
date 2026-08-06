import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EstadoOauth } from "./estado-oauth";

describe("EstadoOauth", () => {
  it.each([
    ["verificada", "Verificada"],
    ["error", "Con error"],
    ["pendiente", "Pendiente de verificar"],
    ["desactivada", "Desactivada"],
  ] as const)("presenta %s como %s", (estado, texto) => {
    render(
      <EstadoOauth
        cargando={false}
        configuracion={{ origen: "tenant", estado } as never}
      />,
    );
    expect(screen.getByText(texto)).toBeInTheDocument();
  });

  it("distingue configuración heredada y ausencia de configuración", () => {
    const { rerender } = render(
      <EstadoOauth
        cargando={false}
        configuracion={{ origen: "entorno_global" } as never}
      />,
    );
    expect(screen.getByText("Configuración heredada")).toBeInTheDocument();

    rerender(<EstadoOauth cargando={false} />);
    expect(screen.getByText("Sin configurar")).toBeInTheDocument();
  });
});
