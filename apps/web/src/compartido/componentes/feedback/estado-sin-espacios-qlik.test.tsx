import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EstadoSinEspaciosQlik } from "./estado-sin-espacios-qlik";

describe("EstadoSinEspaciosQlik", () => {
  it("explica el acceso cerrado sin revelar recursos", () => {
    render(<EstadoSinEspaciosQlik />);
    expect(
      screen.getByRole("heading", {
        name: "No tienes espacios de Qlik Cloud habilitados",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Solicita al administrador/i)).toBeInTheDocument();
    expect(screen.queryByText(/Todos los espacios/i)).not.toBeInTheDocument();
  });
});
