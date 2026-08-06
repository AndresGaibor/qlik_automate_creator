import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PaginaConfiguracion } from "./pagina-configuracion";

const mocks = vi.hoisted(() => ({
  obtenerTenants: vi.fn(),
}));

vi.mock("./api", () => ({ obtenerTenants: mocks.obtenerTenants }));
vi.mock("./pagina-detalle-tenant", () => ({
  PaginaDetalleTenant: ({
    tenantId,
    modoConfiguracion,
  }: { tenantId: string; modoConfiguracion?: boolean }) => (
    <div
      data-testid="detalle"
      data-tenant={tenantId}
      data-modo={String(modoConfiguracion)}
    />
  ),
}));

function renderizar() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <PaginaConfiguracion />
    </QueryClientProvider>,
  );
}

describe("PaginaConfiguracion", () => {
  it("abre automáticamente la única organización activa en modo configuración", async () => {
    mocks.obtenerTenants.mockResolvedValue([
      {
        id: "anterior",
        nombre: "Anterior",
        slug: "anterior",
        estado: "suspendida",
        usuarios: 0,
        tenantsQlik: 0,
      },
      {
        id: "principal",
        nombre: "Principal",
        slug: "principal",
        estado: "activa",
        usuarios: 2,
        tenantsQlik: 1,
      },
    ]);
    renderizar();
    const detalle = await screen.findByTestId("detalle");
    expect(detalle).toHaveAttribute("data-tenant", "principal");
    expect(detalle).toHaveAttribute("data-modo", "true");
  });
});
