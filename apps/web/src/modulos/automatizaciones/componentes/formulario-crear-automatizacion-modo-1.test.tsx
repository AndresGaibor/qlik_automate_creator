import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { PreflightAutomatizacion } from "../api";
import { FormularioCrearAutomatizacionModo1 } from "./formulario-crear-automatizacion-modo-1";

type Requisito = PreflightAutomatizacion["conexionesRequeridas"][number];

const baseRequisito = {
  tipo: "jdbc" as const,
  nombre: "Bancolombia prueba:Postgres_BanColombia_Prueba",
  conexionId: "11111111-1111-4111-8111-111111111111",
  probadaEn: null,
  mensaje: null,
};

function renderizar(requisito?: Requisito) {
  const onProbarConexion = vi.fn();
  render(
    <FormularioCrearAutomatizacionModo1
      flujos={[{ id: "flujo-1", nombre: "Ventas", espacioNombre: "Equipo" }]}
      flujoId="flujo-1"
      onFlujoChange={vi.fn()}
      preflight={{
        flujo: { id: "flujo-1", nombre: "Ventas" },
        conexionesRequeridas: requisito ? [requisito] : [],
        destinosPostgres: [],
      }}
      cargandoPreflight={false}
      conexiones={[]}
      onDestinoChange={vi.fn()}
      nombre=""
      onNombreChange={vi.fn()}
      confirmacion={false}
      onConfirmacionChange={vi.fn()}
      onConexionGuardada={vi.fn()}
      onDestinoGuardado={vi.fn()}
      puedeAdministrarConexiones={false}
      onProbarConexion={onProbarConexion}
      onCrear={vi.fn()}
      creando={false}
    />,
  );
  return { onProbarConexion };
}

function pasoConexionesOrigen() {
  const titulo = screen.getByRole("heading", {
    name: "Verifica las conexiones de origen",
  });
  const seccion = titulo.closest("section");
  if (!seccion) throw new Error("No se encontró el paso de conexiones");
  return within(seccion);
}

describe("FormularioCrearAutomatizacionModo1", () => {
  it("notifica la selección del Dataflow", () => {
    const onFlujoChange = vi.fn();
    render(
      <FormularioCrearAutomatizacionModo1
        flujos={[{ id: "flujo-1", nombre: "Ventas", espacioNombre: "Equipo" }]}
        flujoId=""
        onFlujoChange={onFlujoChange}
        cargandoPreflight={false}
        conexiones={[]}
        onDestinoChange={vi.fn()}
        nombre=""
        onNombreChange={vi.fn()}
        confirmacion={false}
        onConfirmacionChange={vi.fn()}
        onConexionGuardada={vi.fn()}
        onDestinoGuardado={vi.fn()}
        puedeAdministrarConexiones={false}
        onProbarConexion={vi.fn()}
        onCrear={vi.fn()}
        creando={false}
      />,
    );

    fireEvent.change(screen.getByLabelText("Dataflow de origen"), {
      target: { value: "flujo-1" },
    });

    expect(onFlujoChange).toHaveBeenCalledWith("flujo-1");
  });

  it("reutiliza una conexión disponible sin mostrar campos técnicos", () => {
    renderizar({
      ...baseRequisito,
      estado: "disponible",
      probadaEn: "2026-08-06T12:00:00.000Z",
    });

    const paso = pasoConexionesOrigen();
    expect(paso.getByText("Disponible")).toBeInTheDocument();
    expect(paso.queryByLabelText("Servidor")).not.toBeInTheDocument();
  });

  it("permite probar una conexión guardada sin volver a pedir credenciales", () => {
    const { onProbarConexion } = renderizar({
      ...baseRequisito,
      estado: "sin_probar",
    });

    const paso = pasoConexionesOrigen();
    expect(
      paso.getByText("Bancolombia prueba:Postgres_BanColombia_Prueba"),
    ).toBeInTheDocument();
    expect(
      paso.getByRole("button", { name: "Probar conexión guardada" }),
    ).toBeEnabled();
    expect(paso.queryByLabelText("Servidor")).not.toBeInTheDocument();
    expect(
      paso.queryByText("Credenciales (usuario:clave)"),
    ).not.toBeInTheDocument();

    fireEvent.click(
      paso.getByRole("button", { name: "Probar conexión guardada" }),
    );
    expect(onProbarConexion).toHaveBeenCalledWith(baseRequisito.conexionId);
  });

  it("permite volver a probar una conexión guardada con error", () => {
    renderizar({
      ...baseRequisito,
      estado: "error",
      mensaje: "No fue posible abrir la conexión PostgreSQL",
    });

    const paso = pasoConexionesOrigen();
    expect(paso.getByRole("button", { name: "Volver a probar" })).toBeEnabled();
    expect(paso.queryByLabelText("Servidor")).not.toBeInTheDocument();
  });

  it("muestra el formulario técnico únicamente cuando la conexión falta", () => {
    renderizar({
      ...baseRequisito,
      estado: "faltante",
      conexionId: null,
    });

    const paso = pasoConexionesOrigen();
    expect(paso.getByLabelText("Servidor")).toBeInTheDocument();
    expect(paso.getByText("Credenciales (usuario:clave)")).toBeInTheDocument();
  });
});
