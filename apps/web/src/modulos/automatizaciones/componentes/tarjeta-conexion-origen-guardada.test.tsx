import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TarjetaConexionOrigenGuardada } from "./tarjeta-conexion-origen-guardada";

const sinProbar = {
  tipo: "jdbc" as const,
  nombre: "Bancolombia prueba:Postgres_BanColombia_Prueba",
  estado: "sin_probar" as const,
  conexionId: "11111111-1111-4111-8111-111111111111",
  probadaEn: null,
  mensaje: null,
};

const incompleta = {
  tipo: "jdbc" as const,
  nombre: "Bancolombia prueba:Postgres_BanColombia_Prueba",
  estado: "incompleta" as const,
  conexionId: "11111111-1111-4111-8111-111111111111",
  probadaEn: null,
  mensaje: "Falta configurar la credencial segura",
};

const conError = {
  tipo: "sftp" as const,
  nombre: "Bancolombia prueba:SFTP",
  estado: "error" as const,
  conexionId: "22222222-2222-4222-8222-222222222222",
  probadaEn: "2026-08-06T12:00:00.000Z",
  mensaje: "No fue posible abrir la conexión SFTP",
};

describe("TarjetaConexionOrigenGuardada", () => {
  it("permite probar una conexion guardada sin revelar configuracion", () => {
    const probar = vi.fn();
    render(
      <TarjetaConexionOrigenGuardada
        requisito={sinProbar}
        puedeAdministrar={false}
        probando={false}
        onProbar={probar}
      />,
    );

    expect(screen.getByText("Conexión guardada")).toBeInTheDocument();
    expect(
      screen.getByText("Bancolombia prueba:Postgres_BanColombia_Prueba"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Probar conexión guardada" }),
    ).toBeEnabled();
    expect(screen.queryByLabelText("Servidor")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /editar/i }),
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Probar conexión guardada" }),
    );
    expect(probar).toHaveBeenCalledWith(sinProbar.conexionId);
  });

  it("no permite probar una conexión incompleta y guía al administrador", () => {
    render(
      <TarjetaConexionOrigenGuardada
        requisito={incompleta}
        puedeAdministrar
        probando={false}
        onProbar={vi.fn()}
      />,
    );

    expect(screen.getByText("Credencial pendiente")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /probar/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Completar en Configuración" }),
    ).toHaveAttribute(
      "href",
      `/configuracion#conexion-origen-${incompleta.conexionId}`,
    );
  });

  it("muestra el error seguro y el enlace administrativo", () => {
    render(
      <TarjetaConexionOrigenGuardada
        requisito={conError}
        puedeAdministrar
        probando={false}
        onProbar={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Volver a probar" }),
    ).toBeEnabled();
    expect(
      screen.getByText("No fue posible abrir la conexión SFTP"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Editar en Configuración" }),
    ).toHaveAttribute(
      "href",
      `/configuracion#conexion-origen-${conError.conexionId}`,
    );
  });
});
