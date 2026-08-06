import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FormularioConexionOrigen } from "./formulario-conexion-origen";

const mocks = vi.hoisted(() => ({
  guardar: vi.fn(),
  probar: vi.fn(),
}));

vi.mock("../api", () => ({
  guardarConexionOrigen: mocks.guardar,
  probarConexionOrigen: mocks.probar,
}));

describe("FormularioConexionOrigen", () => {
  it("envia el secreto con el nombre aceptado por backend y prueba al guardar", async () => {
    mocks.guardar.mockResolvedValue({ id: "conexion-1" });
    mocks.probar.mockResolvedValue({
      estado: "disponible",
      probadaEn: "2026-08-06T12:00:00.000Z",
      mensaje: null,
    });
    const onGuardada = vi.fn();
    render(
      <FormularioConexionOrigen
        requisito={{ tipo: "sftp", nombre: "Salida SFTP" }}
        onGuardada={onGuardada}
      />,
    );

    fireEvent.change(screen.getByLabelText("Servidor"), {
      target: { value: "sftp.internal" },
    });
    fireEvent.change(screen.getByLabelText("Usuario"), {
      target: { value: "demo" },
    });
    fireEvent.change(screen.getByLabelText("Llave privada"), {
      target: { value: "-----BEGIN OPENSSH PRIVATE KEY-----" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Guardar y probar" }));

    await waitFor(() => {
      expect(mocks.guardar).toHaveBeenCalledWith(
        expect.objectContaining({
          tipo: "sftp",
          nombre: "Salida SFTP",
          config: expect.objectContaining({
            secretoClavePrivadaValor: "-----BEGIN OPENSSH PRIVATE KEY-----",
          }),
        }),
      );
      expect(mocks.probar).toHaveBeenCalledWith("conexion-1");
      expect(onGuardada).toHaveBeenCalledWith("conexion-1");
    });
    expect(screen.getByLabelText("Llave privada")).toHaveValue("");
  });

  it("configura una conexión JDBC PostgreSQL", async () => {
    mocks.guardar.mockReset();
    mocks.probar.mockReset();
    mocks.guardar.mockResolvedValue({ id: "jdbc-1" });
    mocks.probar.mockResolvedValue({ estado: "disponible" });
    const onGuardada = vi.fn();
    render(
      <FormularioConexionOrigen
        requisito={{ tipo: "jdbc", nombre: "Ventas Ágil" }}
        onGuardada={onGuardada}
      />,
    );

    fireEvent.change(screen.getByLabelText("Servidor"), {
      target: { value: "db.internal" },
    });
    fireEvent.change(screen.getByLabelText("Puerto"), {
      target: { value: "5433" },
    });
    fireEvent.change(screen.getByLabelText("Base de datos"), {
      target: { value: "ventas" },
    });
    fireEvent.change(screen.getByLabelText("Credenciales (usuario:clave)"), {
      target: { value: "lector:secreto" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Guardar y probar" }));

    await waitFor(() =>
      expect(mocks.guardar).toHaveBeenCalledWith({
        tipo: "jdbc",
        nombre: "Ventas Ágil",
        config: expect.objectContaining({
          url: "jdbc:postgresql://db.internal:5433/ventas",
          secreto_nombre: "JDBC_VENTAS_AGIL",
          secretoValor: "lector:secreto",
        }),
      }),
    );
    expect(onGuardada).toHaveBeenCalledWith("jdbc-1");
  });

  it("muestra un error seguro y limpia la llave cuando guardar falla", async () => {
    mocks.guardar.mockReset();
    mocks.probar.mockReset();
    mocks.guardar.mockRejectedValue("fallo opaco");
    render(
      <FormularioConexionOrigen
        requisito={{ tipo: "sftp", nombre: "Salida" }}
        onGuardada={vi.fn()}
      />,
    );
    fireEvent.change(screen.getByLabelText("Servidor"), {
      target: { value: "sftp.internal" },
    });
    fireEvent.change(screen.getByLabelText("Usuario"), {
      target: { value: "demo" },
    });
    fireEvent.change(screen.getByLabelText("Carpeta de salida"), {
      target: { value: "/upload" },
    });
    fireEvent.change(screen.getByLabelText("Llave privada"), {
      target: { value: "PEM" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Guardar y probar" }));

    expect(
      await screen.findByText("No se pudo guardar la conexión"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Llave privada")).toHaveValue("");
  });

  it("normaliza la carpeta vacía y omite un secreto ausente", async () => {
    mocks.guardar.mockReset();
    mocks.probar.mockReset();
    mocks.guardar.mockResolvedValue({ id: "sftp-sin-secreto" });
    mocks.probar.mockResolvedValue({ estado: "disponible" });
    const onGuardada = vi.fn();
    render(
      <FormularioConexionOrigen
        requisito={{ tipo: "sftp", nombre: "Salida opcional" }}
        onGuardada={onGuardada}
      />,
    );
    fireEvent.change(screen.getByLabelText("Servidor"), {
      target: { value: "sftp.internal" },
    });
    fireEvent.change(screen.getByLabelText("Usuario"), {
      target: { value: "demo" },
    });
    const ruta = screen.getByLabelText("Carpeta de salida");
    const llave = screen.getByLabelText("Llave privada");
    ruta.removeAttribute("required");
    llave.removeAttribute("required");
    fireEvent.change(ruta, { target: { value: "" } });
    fireEvent.change(llave, { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: "Guardar y probar" }));

    await waitFor(() =>
      expect(mocks.guardar).toHaveBeenCalledWith(
        expect.objectContaining({
          config: expect.objectContaining({ ruta_base: "/upload" }),
        }),
      ),
    );
    const entrada = mocks.guardar.mock.calls[0]?.[0];
    expect(entrada.config).not.toHaveProperty("secretoClavePrivadaValor");
    expect(onGuardada).toHaveBeenCalledWith("sftp-sin-secreto");
  });
});
