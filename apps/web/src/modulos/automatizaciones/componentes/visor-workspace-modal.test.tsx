import { NotificacionesProvider } from "@/compartido/componentes/feedback/notificaciones";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { VisorWorkspaceModal } from "./visor-workspace-modal";

const mocks = vi.hoisted(() => ({
  obtenerWorkspace: vi.fn(),
  actualizarWorkspace: vi.fn(),
}));

vi.mock("../api", () => ({
  obtenerWorkspaceAutomatizacion: mocks.obtenerWorkspace,
  actualizarWorkspaceAutomatizacion: mocks.actualizarWorkspace,
}));

function renderizar() {
  const cliente = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={cliente}>
      <NotificacionesProvider>
        <VisorWorkspaceModal
          automatizacionId="auto-1"
          nombreAutomatizacion="Carga ventas"
        />
      </NotificacionesProvider>
    </QueryClientProvider>,
  );
}

describe("VisorWorkspaceModal", () => {
  it("carga bloques y permite cambiar a la edición JSON", async () => {
    mocks.obtenerWorkspace.mockResolvedValue({
      workspace: {
        blocks: [
          {
            id: "inicio",
            type: "StartBlock",
            displayName: "Inicio",
            inputs: [],
          },
        ],
      },
    });

    renderizar();
    fireEvent.click(screen.getByRole("button", { name: /ver script/i }));

    expect(
      await screen.findByRole("button", {
        name: "Pasos de la automatización (1)",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Inicio")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Edición avanzada (JSON)" }),
    );
    expect(
      screen.getByText(/usuarios con experiencia técnica/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Editar JSON" }),
    ).toBeInTheDocument();
  });
});
