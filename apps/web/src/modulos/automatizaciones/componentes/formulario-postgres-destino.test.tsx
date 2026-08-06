import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FormularioPostgresDestino } from "./formulario-postgres-destino";

const mocks = vi.hoisted(() => ({
  crear: vi.fn(),
  probar: vi.fn(),
}));

vi.mock("../api", () => ({
  crearConexionDestino: mocks.crear,
  probarConexionDestino: mocks.probar,
}));

describe("FormularioPostgresDestino", () => {
  it("crea y prueba PostgreSQL antes de informar que fue guardada", async () => {
    mocks.crear.mockResolvedValue({ id: "destino-1" });
    mocks.probar.mockResolvedValue({
      exitoso: true,
      mensaje: "Conexión exitosa",
    });
    const onGuardada = vi.fn();
    render(<FormularioPostgresDestino onGuardada={onGuardada} />);

    for (const [etiqueta, valor] of [
      ["Nombre", "Destino demo"],
      ["Servidor", "db.internal"],
      ["Base de datos", "demo"],
      ["Esquema", "public"],
      ["Usuario", "writer"],
      ["Contraseña", "secreto"],
    ]) {
      fireEvent.change(screen.getByLabelText(etiqueta), {
        target: { value: valor },
      });
    }
    fireEvent.click(screen.getByRole("button", { name: "Guardar y probar" }));

    await waitFor(() => {
      expect(mocks.crear).toHaveBeenCalledWith({
        tipo: "postgres",
        nombre: "Destino demo",
        config: {
          host: "db.internal",
          port: 5432,
          database: "demo",
          schema: "public",
          user: "writer",
          password: "secreto",
          ssl: false,
        },
      });
      expect(mocks.probar).toHaveBeenCalledWith("destino-1");
      expect(onGuardada).toHaveBeenCalledWith("destino-1");
    });
    expect(screen.getByLabelText("Contraseña")).toHaveValue("");
  });

  it("muestra el fallo de prueba, usa SSL y no confirma el destino", async () => {
    mocks.crear.mockReset();
    mocks.probar.mockReset();
    mocks.crear.mockResolvedValue({ id: "destino-error" });
    mocks.probar.mockResolvedValue({
      exitoso: false,
      mensaje: "No se pudo conectar con el destino PostgreSQL",
    });
    const onGuardada = vi.fn();
    render(<FormularioPostgresDestino onGuardada={onGuardada} />);

    for (const [etiqueta, valor] of [
      ["Nombre", "Destino error"],
      ["Servidor", "db.internal"],
      ["Puerto", "5433"],
      ["Base de datos", "demo"],
      ["Esquema", "public"],
      ["Usuario", "writer"],
      ["Contraseña", "secreto"],
    ]) {
      fireEvent.change(screen.getByLabelText(etiqueta), {
        target: { value: valor },
      });
    }
    fireEvent.click(screen.getByLabelText("Usar SSL"));
    fireEvent.click(screen.getByRole("button", { name: "Guardar y probar" }));

    expect(
      await screen.findByText("No se pudo conectar con el destino PostgreSQL"),
    ).toBeInTheDocument();
    expect(mocks.crear).toHaveBeenCalledWith(
      expect.objectContaining({
        config: expect.objectContaining({
          port: 5433,
          schema: "public",
          ssl: true,
        }),
      }),
    );
    expect(onGuardada).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Contraseña")).toHaveValue("");
  });
});
