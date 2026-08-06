import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EstadoAccesoRecursoQlik } from "./estado-acceso-recurso-qlik";

describe("EstadoAccesoRecursoQlik", () => {
  it("no revela identificadores ni metadatos del recurso", () => {
    render(<EstadoAccesoRecursoQlik />);
    expect(
      screen.getByRole("heading", { name: "No tienes acceso a este recurso" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/space-/i)).not.toBeInTheDocument();
  });
});
