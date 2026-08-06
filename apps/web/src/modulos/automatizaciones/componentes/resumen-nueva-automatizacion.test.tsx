import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ResumenNuevaAutomatizacion } from "./resumen-nueva-automatizacion";

describe("ResumenNuevaAutomatizacion", () => {
  it("muestra progreso, ruta y requisitos faltantes", () => {
    render(
      <ResumenNuevaAutomatizacion
        flujoNombre="Dataflow Ventas"
        conexionNombre="BigQuery principal"
        recursoNombre=""
        nombre=""
        modoActivo={1}
        plantillaNombre="Plantilla Spark"
        requiereDestino={false}
        isCreating={false}
        onCrear={vi.fn()}
      />,
    );

    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "33",
    );
    expect(screen.getByText("Dataflow Ventas")).toBeInTheDocument();
    expect(screen.getByText("BigQuery principal")).toBeInTheDocument();
    expect(
      screen.getByText("Selecciona el recurso de destino"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Escribe o confirma el nombre"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /crear automatización/i }),
    ).toBeDisabled();
  });

  it("habilita la creación cuando los tres pasos están completos", () => {
    const onCrear = vi.fn();
    render(
      <ResumenNuevaAutomatizacion
        flujoNombre="Dataflow Ventas"
        conexionNombre="SFTP Producción"
        recursoNombre="ventas.csv"
        nombre="Ventas diarias"
        modoActivo={2}
        plantillaNombre="Plantilla Talend"
        requiereDestino
        isCreating={false}
        onCrear={onCrear}
      />,
    );

    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "100",
    );
    expect(screen.getByText(/Dataflow → SFTP → Talend/i)).toBeInTheDocument();
    const boton = screen.getByRole("button", { name: /crear automatización/i });
    expect(boton).toBeEnabled();
    fireEvent.click(boton);
    expect(onCrear).toHaveBeenCalledOnce();
  });
});
