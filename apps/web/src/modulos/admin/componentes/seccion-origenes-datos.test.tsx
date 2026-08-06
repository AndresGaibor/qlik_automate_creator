import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SeccionOrigenesDatos } from "./seccion-origenes-datos";

vi.mock("@/modulos/origenes/pagina-catalogo-origen", () => ({
  PaginaCatalogoOrigen: () => <div>Gestor de orígenes</div>,
}));

describe("SeccionOrigenesDatos", () => {
  it("mantiene el gestor cerrado hasta que el administrador lo solicita", () => {
    render(<SeccionOrigenesDatos />);
    expect(screen.queryByText("Gestor de orígenes")).not.toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: /administrar orígenes/i }),
    );
    expect(screen.getByText("Gestor de orígenes")).toBeInTheDocument();
  });
});
