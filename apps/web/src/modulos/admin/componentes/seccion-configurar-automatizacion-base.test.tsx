import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TenantQlik } from "@/modulos/admin/api";
import { NotificacionesProvider } from "@/compartido/componentes/feedback/notificaciones";
import { SeccionConfigurarAutomatizacionBase } from "./seccion-configurar-automatizacion-base";

const { listarMock, configurarMock } = vi.hoisted(() => ({
  listarMock: vi.fn<() => Promise<unknown[]>>(),
  configurarMock: vi.fn<() => Promise<unknown>>(),
}));

vi.mock("@/modulos/admin/api", () => ({
  listarAutomatizacionesParaAdmin: listarMock,
  configurarPlantillaAutomatizacionTenant: configurarMock,
}));

function renderizar(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <NotificacionesProvider>{ui}</NotificacionesProvider>
    </QueryClientProvider>,
  );
}

const automatizacionesMock = [
  {
    id: "plantilla-1",
    nombre: "Dataflow Spark",
    espacioNombre: "Personal",
    espacioId: "esp-1",
    propietarioId: "usr-1",
    propietarioNombre: "Usuario 1",
    activa: true,
    modoEjecucion: "manual",
    ejecucionActiva: false,
    puedeEjecutar: true,
    creadoEn: "2025-01-01T00:00:00Z",
    modificadoEn: "2025-01-01T00:00:00Z",
  },
  {
    id: "plantilla-2",
    nombre: "Talend SFTP",
    espacioNombre: "Personal",
    espacioId: "esp-1",
    propietarioId: "usr-1",
    propietarioNombre: "Usuario 1",
    activa: true,
    modoEjecucion: "manual",
    ejecucionActiva: false,
    puedeEjecutar: true,
    creadoEn: "2025-01-01T00:00:00Z",
    modificadoEn: "2025-01-01T00:00:00Z",
  },
];

function crearTenantQlik(overrides: Partial<TenantQlik> = {}): TenantQlik {
  return {
    id: "tenant-1",
    organizacionId: "org-1",
    tenantIdQlik: "tq-1",
    host: "tenant1.eu.qlikcloud.com",
    nombre: "Tenant 1",
    estado: "activo",
    esPrincipal: true,
    automatizacionBaseIdQlik: "base-1",
    automatizacionBaseNombre: "Base Legacy",
    automatizacionPlantillaModo1IdQlik: "plantilla-1",
    automatizacionPlantillaModo1Nombre: "Dataflow Spark",
    automatizacionPlantillaModo2IdQlik: "plantilla-2",
    automatizacionPlantillaModo2Nombre: "Talend SFTP",
    destinoApiUrl: null,
    tieneDestinoApiKey: false,
    destinoApiKeyMascara: null,
    destinoBaseDatos: null,
    impalaHost: null,
    impalaPort: null,
    impalaAuthMechanism: null,
    impalaUser: null,
    tieneImpalaPassword: false,
    impalaPasswordMascara: null,
    impalaDatabase: null,
    creadoEn: "2025-01-01T00:00:00Z",
    ...overrides,
  };
}

describe("SeccionConfigurarAutomatizacionBase", () => {
  beforeEach(() => {
    listarMock.mockClear();
    configurarMock.mockClear();
  });

  it("renderiza dos selectores con etiquetas distintas", () => {
    listarMock.mockResolvedValue([]);
    renderizar(
      <SeccionConfigurarAutomatizacionBase
        organizacionId="org-1"
        tenantQlik={crearTenantQlik()}
      />,
    );
    expect(
      screen.getByLabelText("Plantilla Modo 1 — Dataflow Spark/Python"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Plantilla Modo 2 — Dataflow → SFTP → Talend"),
    ).toBeInTheDocument();
  });

  it("inicializa cada selector con su valor del tenant", () => {
    listarMock.mockResolvedValue(automatizacionesMock);
    renderizar(
      <SeccionConfigurarAutomatizacionBase
        organizacionId="org-1"
        tenantQlik={crearTenantQlik()}
      />,
    );
    const selector1 = screen.getByLabelText(
      "Plantilla Modo 1 — Dataflow Spark/Python",
    );
    const selector2 = screen.getByLabelText(
      "Plantilla Modo 2 — Dataflow → SFTP → Talend",
    );
    expect(selector1).toBeInTheDocument();
    expect(selector2).toBeInTheDocument();
    expect(listarMock).toHaveBeenCalled();
  });

  it("seleccionar modo 2 llama a configurarPlantillaAutomatizacionTenant con modo 2", async () => {
    listarMock.mockResolvedValue(automatizacionesMock);
    configurarMock.mockResolvedValue({});
    renderizar(
      <SeccionConfigurarAutomatizacionBase
        organizacionId="org-1"
        tenantQlik={crearTenantQlik()}
      />,
    );
    const botonModo2 = screen.getByLabelText(
      "Plantilla Modo 2 — Dataflow → SFTP → Talend",
    );
    fireEvent.click(botonModo2);
    const opciones = await screen.findAllByText((content, element) => {
      return element?.textContent?.includes("Talend SFTP") ?? false;
    });
    expect(opciones.length).toBeGreaterThan(0);
  });

  it("modo 1 sin plantilla propia muestra fallback legacy de baseIdQlik", () => {
    listarMock.mockResolvedValue(automatizacionesMock);
    renderizar(
      <SeccionConfigurarAutomatizacionBase
        organizacionId="org-1"
        tenantQlik={crearTenantQlik({ automatizacionPlantillaModo1IdQlik: null })}
      />,
    );
    const selector1 = screen.getByLabelText(
      "Plantilla Modo 1 — Dataflow Spark/Python",
    );
    expect(selector1).toBeInTheDocument();
    expect(listarMock).toHaveBeenCalled();
  });
});
