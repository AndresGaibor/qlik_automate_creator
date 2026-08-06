import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, fireEvent, within } from "@testing-library/react";
import type { ReactElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NotificacionesProvider } from "@/compartido/componentes/feedback/notificaciones";
import { PaginaCatalogoOrigen } from "./pagina-catalogo-origen";

vi.mock("@/modulos/admin/api", () => ({
  obtenerModoGlobalAutomatizacion: vi.fn().mockResolvedValue({
    modoAutomatizacionActivo: 1,
    plantillaEfectivaIdQlik: "pt-1",
    plantillaEfectivaNombre: "Dataflow Spark",
    configurada: true,
  }),
  guardarModoGlobalAutomatizacion: vi.fn(),
}));

const { getMock, postMock, putMock, deleteMock } = vi.hoisted(() => ({
  getMock: vi.fn(),
  postMock: vi.fn(),
  putMock: vi.fn(),
  deleteMock: vi.fn(),
}));

vi.mock("@/compartido/api/cliente", () => ({
  clienteApi: {
    get: getMock,
    post: postMock,
    put: putMock,
    delete: deleteMock,
  },
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

const conexionesMock = [
  {
    id: "conn-1",
    tipo: "jdbc" as const,
    nombre: "Ventas JDBC",
    config: {
      url: "jdbc:postgresql://localhost:5432/ventas",
      secreto_nombre: "JDBC_VENTAS",
    },
  },
  {
    id: "conn-2",
    tipo: "sftp" as const,
    nombre: "SFTP Logs",
    config: {
      host: "sftp.miempresa.com",
      puerto: 22,
      usuario: "logs_user",
      secreto_clave_privada_nombre: "SFTP_PRIVATE_KEY_LOGS",
    },
  },
];

describe("PaginaCatalogoOrigen", () => {
  beforeEach(() => {
    getMock.mockReset();
    postMock.mockReset();
    putMock.mockReset();
    deleteMock.mockReset();
    vi.stubGlobal(
      "navigator",
      Object.assign({}, navigator, {
        clipboard: {
          writeText: vi.fn().mockResolvedValue(undefined),
        },
      }),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("la lista normal no muestra valores de secretos", async () => {
    getMock.mockResolvedValue(conexionesMock);
    renderizar(<PaginaCatalogoOrigen />);
    await waitFor(() => {
      expect(screen.queryByText(/usuario:clave/)).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Ventas JDBC")).toBeInTheDocument();
    });
    expect(screen.getByText("SFTP Logs")).toBeInTheDocument();
  });

  it("copiar JSON de secretos para el job llama al endpoint y muestra dialogo con JSON", async () => {
    getMock.mockResolvedValue(conexionesMock);
    postMock.mockResolvedValue({ JDBC_VENTAS: "usuario:clave", SFTP_PRIVATE_KEY_LOGS: "contenido-pem" });

    renderizar(<PaginaCatalogoOrigen />);

    const botonCopiar = await waitFor(() =>
      screen.getByRole("button", { name: /copiar json de secretos/i }),
    );
    fireEvent.click(botonCopiar);

    await waitFor(() => {
      expect(postMock).toHaveBeenCalled();
      expect(postMock.mock.calls[postMock.mock.calls.length - 1][0]).toBe("/conexiones-origen/contexto-secretos");
    });

    await waitFor(() => {
      expect(screen.getByText(/usuario:clave/i)).toBeInTheDocument();
    });

    const botonCopiarJson = screen.getByRole("button", { name: /^copiar json$/i });
    fireEvent.click(botonCopiarJson);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });
  });

  it("cerrar dialogo limpia el estado del contexto", async () => {
    getMock.mockResolvedValue(conexionesMock);
    postMock.mockResolvedValue({ JDBC_VENTAS: "usuario:clave" });

    renderizar(<PaginaCatalogoOrigen />);

    const botonCopiar = await waitFor(() =>
      screen.getByRole("button", { name: /copiar json de secretos/i }),
    );
    fireEvent.click(botonCopiar);

    await waitFor(() => {
      expect(screen.getByText(/usuario:clave/i)).toBeInTheDocument();
    });

    const botonCerrar = screen.getByRole("button", { name: /cerrar/i });
    fireEvent.click(botonCerrar);

    await waitFor(() => {
      expect(screen.queryByText(/usuario:clave/i)).not.toBeInTheDocument();
    });
  });
});
