/// <reference types="vitest" />
/**
 * @vitest-environment jsdom
 */
import { act } from "react";
import type { ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PaginaNuevaAutomatizacion } from "@/modulos/automatizaciones/pagina-nueva-automatizacion";

// --- Test Setup ---

let container: HTMLDivElement;
let root: ReturnType<typeof createRoot> | null = null;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  if (root) {
    const rootRef = root;
    act(() => {
      rootRef.unmount();
    });
  }
  document.body.removeChild(container);
  vi.unstubAllGlobals();
});

// --- Test Utilities ---

function render(children: ReactNode) {
  act(() => {
    root = createRoot(container);
    root.render(children);
  });
}

// --- Tests ---

describe("PaginaNuevaAutomatizacion", () => {
  it("muestra el título de la página", () => {
    render(<PaginaNuevaAutomatizacion />);

    expect(document.body.textContent).toContain("Nueva automatización");
  });

  it("muestra el mensaje de placeholder", () => {
    render(<PaginaNuevaAutomatizacion />);

    expect(document.body.textContent).toContain(
      "Formulario de creación de automatización",
    );
  });

  it("muestra el botón de volver a automatizaciones", () => {
    render(<PaginaNuevaAutomatizacion />);

    const botonVolver = container.querySelector("button");
    expect(botonVolver).not.toBeNull();
    expect(botonVolver?.textContent).toContain("Volver a automatizaciones");
  });

  it("la ruta /automatizaciones/nueva está registrada en el router", async () => {
    const { router } = await import("@/app/router");

    // Verificar que el árbol de rutas contiene la ruta /automatizaciones/nueva
    const rutasHijas = router.routeTree.children ?? [];
    const rutaNueva = rutasHijas.find(
      (ruta) => ruta.fullPath === "/automatizaciones/nueva",
    );

    expect(rutaNueva).toBeDefined();
    expect(rutaNueva?.fullPath).toBe("/automatizaciones/nueva");
  });
});
