import { NotificacionesProvider } from "@/compartido/componentes/feedback/notificaciones";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PaginaSetup } from "./pagina-setup";

vi.mock("./api", () => ({
  completarSetup: vi.fn(),
}));

function renderizar() {
  return render(
    <NotificacionesProvider>
      <PaginaSetup />
    </NotificacionesProvider>,
  );
}

describe("PaginaSetup", () => {
  it("valida el paso actual antes de avanzar", async () => {
    renderizar();

    expect(screen.getByText("1 de 3")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
    expect(
      (await screen.findAllByText(/nombre de la organización/i)).length,
    ).toBeGreaterThan(0);

    fireEvent.change(screen.getByLabelText("Nombre de la organización"), {
      target: { value: "Empresa Demo" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Continuar" }));

    expect(await screen.findByLabelText("Host del tenant")).toBeInTheDocument();
    expect(screen.getByText("2 de 3")).toBeInTheDocument();
  });
});
