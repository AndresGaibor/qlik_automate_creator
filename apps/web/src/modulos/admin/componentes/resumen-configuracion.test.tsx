import { act } from "react";
import { type Root, createRoot } from "react-dom/client";
import { afterEach, expect, test } from "vitest";
import { ResumenConfiguracion } from "./resumen-configuracion";

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root | undefined;
let container: HTMLDivElement | undefined;
afterEach(() => {
  if (root) act(() => root?.unmount());
  container?.remove();
  root = undefined;
  container = undefined;
});

function montar(completos: boolean[]) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() =>
    root?.render(
      <ResumenConfiguracion
        items={completos.map((completo, indice) => ({
          id: indice === 0 ? "general" : "qlik",
          etiqueta: indice === 0 ? "General" : "Qlik Cloud",
          estado: completo ? "Lista" : "Pendiente",
          completo,
          tono: completo ? "exito" : "pendiente",
        }))}
      />,
    ),
  );
  return container;
}

test("compacta el detalle cuando toda la configuración está lista", () => {
  const vista = montar([true, true]);
  expect(vista.textContent).toContain("Todo configurado");
  expect(vista.querySelector('a[href="#general"]')).toBeNull();
  const boton = vista.querySelector<HTMLButtonElement>(
    'button[aria-expanded="false"]',
  );
  expect(boton).not.toBeNull();
  act(() => boton?.click());
  expect(vista.querySelector('a[href="#general"]')).not.toBeNull();
});

test("mantiene visible el detalle cuando existe una configuración pendiente", () => {
  const vista = montar([true, false]);
  expect(vista.textContent).toContain("1 configuración requiere atención");
  expect(vista.querySelector('a[href="#qlik"]')).not.toBeNull();
  expect(vista.querySelector('button[aria-expanded="true"]')).not.toBeNull();
});

test("expone el progreso con semántica accesible", () => {
  const vista = montar([true, false]);
  expect(
    vista.querySelector('[role="progressbar"]')?.getAttribute("aria-valuenow"),
  ).toBe("50");
});

test("completa la última fila cuando existen siete secciones", () => {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  const ids = [
    "general",
    "qlik",
    "oauth",
    "plantilla",
    "impala",
    "origenes",
    "usuarios",
  ] as const;
  act(() =>
    root?.render(
      <ResumenConfiguracion
        items={ids.map((id) => ({
          id,
          etiqueta: id,
          estado: id === "impala" ? "Pendiente" : "Lista",
          completo: id !== "impala",
          tono: id === "impala" ? "pendiente" : "exito",
        }))}
      />,
    ),
  );

  expect(container.querySelector('a[href="#usuarios"]')).toHaveClass(
    "sm:col-span-2",
    "xl:col-span-2",
  );
});
