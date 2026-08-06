import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { VisorScriptFlujoModal } from "./visor-script-flujo-modal";

const mocks = vi.hoisted(() => ({
  obtenerScriptFlujo: vi.fn(),
}));

vi.mock("../api", async (importOriginal) => {
  const original = await importOriginal<typeof import("../api")>();
  return {
    ...original,
    obtenerScriptFlujo: mocks.obtenerScriptFlujo,
  };
});

function renderizar() {
  const cliente = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={cliente}>
      <VisorScriptFlujoModal
        flujo={{
          id: "flujo-1",
          nombre: "Ventas",
          espacioId: "espacio-1",
          espacioNombre: "Operaciones",
          modificadoEn: "2026-08-06T10:00:00Z",
        }}
      />
    </QueryClientProvider>,
  );
}

describe("VisorScriptFlujoModal", () => {
  it("muestra el script y permite consultar metadatos", async () => {
    mocks.obtenerScriptFlujo.mockResolvedValue({
      id: "flujo-1",
      script: "LOAD * FROM ventas;",
      versionMessage: "Versión publicada",
    });

    renderizar();
    fireEvent.click(
      screen.getByRole("button", { name: "Ver Script / Definición" }),
    );

    expect(await screen.findByText("LOAD * FROM ventas;")).toBeInTheDocument();
    expect(screen.getByText(/Versión publicada/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Metadatos JSON" }));
    expect(
      screen.getByText("Metadatos del Flujo de Datos"),
    ).toBeInTheDocument();
    expect(screen.getByText("Operaciones")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Cerrar visor de script" }),
    ).toBeInTheDocument();
  });
});
