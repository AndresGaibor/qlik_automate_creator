import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children }: { to: string; children: React.ReactNode }) =>
    React.createElement("a", { href: to }, children),
}));
import { FormularioCrearAutomatizacion } from "./formulario-crear-automatizacion";

const flujo = {
  id: "f-1",
  nombre: "Dataflow Ventas",
  espacioNombre: "Ventas",
  espacioId: "e-1",
};
const recurso = {
  id: "r-1",
  nombre: "tabla_ventas",
  tipo: "tabla" as const,
  espacioDeNombres: "analytics",
  metadatos: {},
};

function renderizar(
  overrides: Partial<Parameters<typeof FormularioCrearAutomatizacion>[0]> = {},
) {
  const props: Parameters<typeof FormularioCrearAutomatizacion>[0] = {
    flujoId: "",
    setFlujoId: vi.fn(),
    tablaId: "",
    setTablaId: vi.fn(),
    nombre: "",
    setNombre: vi.fn(),
    flujos: [flujo],
    tablas: [recurso],
    etiquetaDestino: "BigQuery principal",
    automatizaciones: [],
    isLoadingFlujos: false,
    isLoadingTablas: false,
    onCrear: vi.fn(),
    isCreating: false,
    puedeCrear: false,
    modoActivo: 1,
    plantillaEfectivaNombre: "Plantilla Spark",
    destinoId: undefined,
    setDestinoId: vi.fn(),
    conexiones: [],
    requiereDestino: false,
    ...overrides,
  };
  return render(<FormularioCrearAutomatizacion {...props} />);
}

describe("FormularioCrearAutomatizacion UI guiada", () => {
  it("presenta tres pasos y un resumen lateral", () => {
    renderizar();
    expect(
      screen.getByRole("heading", { name: "Elige el origen" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Define el destino" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Identifica la automatización" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "1. Elige el origen" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("complementary", { name: "Resumen de creación" }),
    ).toBeInTheDocument();
  });

  it("bloquea el destino hasta seleccionar un Dataflow", () => {
    renderizar();
    expect(
      screen.getByRole("button", { name: /recurso destino/i }),
    ).toBeDisabled();
    expect(
      screen.getByText("Selecciona primero un Dataflow para continuar."),
    ).toBeInTheDocument();
  });

  it("muestra los valores elegidos y habilita la creación", () => {
    renderizar({
      flujoId: "f-1",
      tablaId: "tabla_ventas",
      nombre: "Ventas diarias",
      puedeCrear: true,
    });
    expect(screen.getAllByText("Dataflow Ventas").length).toBeGreaterThan(0);
    expect(screen.getAllByText("tabla_ventas").length).toBeGreaterThan(0);
    expect(
      screen.getByRole("button", { name: /crear automatización/i }),
    ).toBeEnabled();
  });
});
