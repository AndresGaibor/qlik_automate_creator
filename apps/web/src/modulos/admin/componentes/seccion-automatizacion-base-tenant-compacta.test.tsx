import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SeccionAutomatizacionBaseTenant } from "./seccion-automatizacion-base-tenant";

vi.mock("@/modulos/automatizaciones/api", () => ({
  obtenerConexionesDestino: vi
    .fn()
    .mockResolvedValue([{ id: "d1", nombre: "Destino" }]),
}));
vi.mock("./seccion-configurar-automatizacion-base", () => ({
  SeccionConfigurarAutomatizacionBase: () => <div>Formulario plantilla</div>,
}));
vi.mock("./seccion-configurar-destinos-tenant", () => ({
  SeccionConfigurarDestinosTenant: ({
    cantidadExistentes,
  }: { cantidadExistentes: number }) => (
    <div>Gestor de destinos · {cantidadExistentes} existente</div>
  ),
}));

function renderizar() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <SeccionAutomatizacionBaseTenant
        organizacionId="org-1"
        tenantsQlik={[
          {
            id: "q1",
            organizacionId: "org-1",
            tenantIdQlik: "tenant-1",
            host: "empresa.us.qlikcloud.com",
            nombre: "Producción",
            estado: "activo",
            esPrincipal: true,
            tieneDestinoApiKey: false,
            destinoApiKeyMascara: null,
            tieneImpalaPassword: false,
            impalaPasswordMascara: null,
            automatizacionBaseIdQlik: "auto-1",
            automatizacionBaseNombre: "Plantilla principal",
            automatizacionPlantillaModo1Nombre: "Ventas Spark",
            automatizacionPlantillaModo2Nombre: "Ventas SFTP Talend",
            impalaHost: "impala.local",
            impalaPort: 21050,
            creadoEn: "2026-08-05",
          },
        ]}
      />
    </QueryClientProvider>,
  );
}

describe("SeccionAutomatizacionBaseTenant compacta", () => {
  it("resume una configuración lista y abre formularios bajo demanda", async () => {
    renderizar();
    expect(await screen.findByText("Ventas Spark")).toBeInTheDocument();
    expect(screen.getByText("Ventas SFTP Talend")).toBeInTheDocument();
    expect(await screen.findByText("1 conexión")).toBeInTheDocument();
    expect(screen.queryByText("Formulario plantilla")).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: /gestionar plantillas y destinos/i }),
    );
    expect(screen.getByText("Formulario plantilla")).toBeInTheDocument();
    expect(screen.getByText("Plantillas por modo")).toBeInTheDocument();
    expect(screen.getByText("Conexiones de destino")).toBeInTheDocument();
    expect(
      screen.getByText("Gestor de destinos · 1 existente"),
    ).toBeInTheDocument();
  });
});
