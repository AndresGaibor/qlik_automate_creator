import { act } from "react";
import { type Root, createRoot } from "react-dom/client";
import { afterEach, expect, test, vi } from "vitest";
import { NavegacionConfiguracion } from "./navegacion-configuracion";

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root | undefined;
let container: HTMLDivElement | undefined;
afterEach(() => {
  if (root) act(() => root?.unmount());
  container?.remove();
  history.replaceState(null, "", window.location.pathname);
});

test("navega por las seis secciones y marca la activa", () => {
  history.replaceState(null, "", "#impala");
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  const items = [
    {
      id: "general",
      etiqueta: "General",
      estado: "Activa",
      completo: true,
      tono: "exito",
    },
    {
      id: "qlik",
      etiqueta: "Qlik Cloud",
      estado: "Conectado",
      completo: true,
      tono: "exito",
    },
    {
      id: "oauth",
      etiqueta: "OAuth",
      estado: "Verificado",
      completo: true,
      tono: "exito",
    },
    {
      id: "plantilla",
      etiqueta: "Plantilla base",
      estado: "Configurada",
      completo: true,
      tono: "exito",
    },
    {
      id: "impala",
      etiqueta: "Impala",
      estado: "Conectada",
      completo: true,
      tono: "exito",
    },
    {
      id: "usuarios",
      etiqueta: "Usuarios",
      estado: "1 autorizado",
      completo: true,
      tono: "exito",
    },
  ] as const;

  act(() => root?.render(<NavegacionConfiguracion items={[...items]} />));
  expect(container.querySelectorAll("a")).toHaveLength(6);
  expect(
    container.querySelector('a[href="#impala"]')?.getAttribute("aria-current"),
  ).toBe("location");
});

test("actualiza la sección activa al desplazarse", () => {
  let emitir:
    | ((entradas: Array<{ isIntersecting: boolean; target: Element }>) => void)
    | undefined;
  const observar = vi.fn();
  const desconectar = vi.fn();
  class ObservadorFalso {
    constructor(callback: typeof emitir) {
      emitir = callback;
    }
    observe = observar;
    disconnect = desconectar;
  }
  vi.stubGlobal("IntersectionObserver", ObservadorFalso);

  const general = document.createElement("section");
  general.id = "general";
  const qlik = document.createElement("section");
  qlik.id = "qlik";
  document.body.append(general, qlik);

  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  const items = [
    {
      id: "general",
      etiqueta: "General",
      estado: "Activa",
      completo: true,
      tono: "exito",
    },
    {
      id: "qlik",
      etiqueta: "Qlik Cloud",
      estado: "Conectado",
      completo: true,
      tono: "exito",
    },
  ] as const;
  act(() => root?.render(<NavegacionConfiguracion items={[...items]} />));

  expect(observar).toHaveBeenCalledTimes(2);
  act(() => emitir?.([{ isIntersecting: true, target: qlik }]));
  expect(
    container.querySelector('a[href="#qlik"]')?.getAttribute("aria-current"),
  ).toBe("location");

  general.remove();
  qlik.remove();
  vi.unstubAllGlobals();
});
