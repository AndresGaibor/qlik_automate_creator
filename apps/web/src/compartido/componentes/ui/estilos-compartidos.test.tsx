import { EstadoError } from "@/compartido/componentes/feedback/estado-error";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EstadoCarga } from "./estado-carga";
import { PageHeader } from "./page-header";

describe("patrones visuales compartidos", () => {
  it("comunica la carga con estado accesible y spinner visual", () => {
    const { container } = render(
      <EstadoCarga mensaje="Consultando automatizaciones…" />,
    );

    const output = container.querySelector("output");
    expect(output).toHaveAttribute("aria-busy", "true");
    expect(output).toHaveTextContent("Consultando automatizaciones…");
    expect(
      container.querySelector('[data-spinner="true"]'),
    ).toBeInTheDocument();
  });

  it("usa encabezado semántico y agrupa acciones responsive", () => {
    const { container } = render(
      <PageHeader
        title="Automatizaciones"
        description="Gestiona ejecuciones"
        actions={<button type="button">Nueva</button>}
      />,
    );

    expect(container.querySelector("header h1")).toHaveTextContent(
      "Automatizaciones",
    );
    expect(container.querySelector("[data-page-actions]")).toBeInTheDocument();
  });

  it("presenta errores con jerarquía visual y permite reintentar", () => {
    const onReintentar = vi.fn();
    const { container } = render(
      <EstadoError
        mensaje="Error 503 del servidor"
        onReintentar={onReintentar}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "El servidor no responde" }),
    ).toBeInTheDocument();
    expect(container.querySelector(".shadow-card")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(onReintentar).toHaveBeenCalledOnce();
  });
});
