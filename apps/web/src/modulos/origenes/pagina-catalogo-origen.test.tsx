import { NotificacionesProvider } from "@/compartido/componentes/feedback/notificaciones";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
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
    secretoConfigurado: false,
  },
];

describe("PaginaCatalogoOrigen", () => {
  beforeEach(() => {
    getMock.mockReset().mockResolvedValue(conexionesMock);
    postMock.mockReset();
    putMock.mockReset();
    deleteMock.mockReset();
    window.history.pushState({}, "", "/origenes");
  });

  it("no ofrece revelar ni copiar secretos", async () => {
    renderizar(<PaginaCatalogoOrigen />);
    expect(await screen.findByText("Ventas JDBC")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /copiar json de secretos/i }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/contenido sensible/i)).not.toBeInTheDocument();
    expect(screen.getByTestId("conexion-origen-conn-1")).toHaveAttribute(
      "id",
      "conexion-origen-conn-1",
    );
  });

  it("permite completar el secreto ausente de una conexión histórica", async () => {
    putMock.mockResolvedValue({ id: "conn-1" });
    renderizar(<PaginaCatalogoOrigen />);
    await screen.findByText("Ventas JDBC");

    fireEvent.click(screen.getByRole("button", { name: "Editar" }));
    const secreto = await screen.findByLabelText("Valor secreto (usuario:clave)");
    fireEvent.change(secreto, { target: { value: "lector:clave" } });
    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));

    await waitFor(() => {
      expect(putMock).toHaveBeenCalledWith(
        "/conexiones-origen/conn-1",
        expect.objectContaining({
          config: expect.objectContaining({ secretoValor: "lector:clave" }),
        }),
      );
    });
  });

  it("envia secretoValor con el nombre aceptado por backend", async () => {
    window.history.pushState({}, "", "/origenes?conexion=jdbc:Nueva%20JDBC");
    postMock.mockResolvedValue({ id: "conn-2" });
    renderizar(<PaginaCatalogoOrigen />);
    fireEvent.click(await screen.findByRole("button", { name: /nueva jdbc/i }));

    fireEvent.change(await screen.findByLabelText("Servidor"), {
      target: { value: "db.internal" },
    });
    fireEvent.change(screen.getByLabelText("Base de datos"), {
      target: { value: "demo" },
    });
    fireEvent.change(screen.getByLabelText("Valor secreto (usuario:clave)"), {
      target: { value: "lector:clave" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Guardar conexión" }));

    await waitFor(() => {
      expect(postMock).toHaveBeenCalledWith(
        "/conexiones-origen",
        expect.objectContaining({
          config: expect.objectContaining({ secretoValor: "lector:clave" }),
        }),
      );
    });
    expect(JSON.stringify(postMock.mock.calls[0][1])).not.toContain(
      "secreto_valor",
    );
  });
});
