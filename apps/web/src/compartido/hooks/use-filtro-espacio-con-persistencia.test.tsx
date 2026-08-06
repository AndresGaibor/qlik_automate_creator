import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

const memoria = new Map<string, string>();
const storage = {
  getItem: (clave: string) => memoria.get(clave) ?? null,
  setItem: (clave: string, valor: string) => memoria.set(clave, valor),
  removeItem: (clave: string) => memoria.delete(clave),
  clear: () => memoria.clear(),
  key: (indice: number) => [...memoria.keys()][indice] ?? null,
  get length() {
    return memoria.size;
  },
};
Object.defineProperty(window, "localStorage", {
  value: storage,
  configurable: true,
});
import { useFiltroEspacioConPersistencia } from "./use-filtro-espacio-con-persistencia";

describe("useFiltroEspacioConPersistencia", () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState({}, "", "/flujos?espacioId=space-1");
  });

  it("elimina el filtro cuando está deshabilitado para usuario final", () => {
    localStorage.setItem("qlik_filtro_espacio_id:tenant-1", "space-1");

    const { result } = renderHook(() =>
      useFiltroEspacioConPersistencia("tenant-1", { habilitado: false }),
    );

    expect(result.current.espacioId).toBe("");
    expect(window.location.search).toBe("");
    expect(localStorage.getItem("qlik_filtro_espacio_id:tenant-1")).toBeNull();

    act(() => result.current.establecerEspacioId("space-2"));
    expect(result.current.espacioId).toBe("");
    expect(window.location.search).toBe("");
  });
});
