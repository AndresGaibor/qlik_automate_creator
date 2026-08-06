import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { VisorWorkspace } from "./visor-workspace";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children }: { children: ReactNode }) => <a href="/">{children}</a>,
}));

vi.mock("@/modulos/flujos/publico", () => ({
  obtenerFlujosConFiltros: vi.fn().mockResolvedValue([]),
}));

function renderizar() {
  const cliente = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={cliente}>
      <VisorWorkspace
        workspace={{
          id: "auto-1",
          nombre: "Carga ventas",
          workspace: {
            blocks: [{ type: "EndpointBlock", name: "Carga" }],
            variables: [{ name: "TablaDestino", value: "dwh.ventas" }],
          },
          schedules: [],
        }}
      />
    </QueryClientProvider>,
  );
}

describe("VisorWorkspace", () => {
  it("colapsa y expande el contenido completo", () => {
    renderizar();
    expect(screen.getByText("Carga")).toBeInTheDocument();
    expect(screen.getByText("TablaDestino")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Colapsar todos" }));
    expect(screen.queryByText("Carga")).not.toBeInTheDocument();
    expect(screen.queryByText("TablaDestino")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Expandir todos" }));
    expect(screen.getByText("Carga")).toBeInTheDocument();
    expect(screen.getByText("TablaDestino")).toBeInTheDocument();
  });
});
