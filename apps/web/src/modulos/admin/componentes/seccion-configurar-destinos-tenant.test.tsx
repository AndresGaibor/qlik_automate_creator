import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SeccionConfigurarDestinosTenant } from "./seccion-configurar-destinos-tenant";

vi.mock("@/compartido/componentes/feedback/notificaciones", () => ({
  useNotificaciones: () => ({ mostrarExito: vi.fn(), mostrarError: vi.fn() }),
}));
vi.mock("@/modulos/admin/api", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/modulos/admin/api")>();
  return { ...original, configurarConexionDestino: vi.fn() };
});

const tenantQlik = {
  id: "q1",
  organizacionId: "org-1",
  tenantIdQlik: "tenant-1",
  host: "empresa.us.qlikcloud.com",
  nombre: "Producción",
  estado: "activo" as const,
  esPrincipal: true,
  tieneDestinoApiKey: false,
  destinoApiKeyMascara: null,
  tieneImpalaPassword: false,
  impalaPasswordMascara: null,
  creadoEn: "2026-08-05",
};

function renderizar(cantidadExistentes: number) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <SeccionConfigurarDestinosTenant
        organizacionId="org-1"
        tenantQlik={tenantQlik}
        cantidadExistentes={cantidadExistentes}
      />
    </QueryClientProvider>,
  );
}

describe("SeccionConfigurarDestinosTenant", () => {
  it("resume destinos existentes y abre el formulario bajo demanda", () => {
    renderizar(1);
    expect(screen.getByText("1 destino configurado")).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText(/nombre de la conexión/i),
    ).not.toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: /agregar otro destino/i }),
    );
    expect(
      screen.getByPlaceholderText(/nombre de la conexión/i),
    ).toBeInTheDocument();
  });

  it("abre el formulario cuando todavía no existe un destino", () => {
    renderizar(0);
    expect(
      screen.getByPlaceholderText(/nombre de la conexión/i),
    ).toBeInTheDocument();
  });
});
