import { describe, expect, it } from "bun:test";
import { normalizarRutaRetorno } from "./utiles-oauth-http.js";

describe("normalizarRutaRetorno", () => {
  it("acepta rutas internas codificadas", () => {
    expect(normalizarRutaRetorno("%2Fadmin%2Ftenants%2Forg-1")).toBe(
      "/admin/tenants/org-1",
    );
  });

  it("rechaza URLs externas y rutas protocol-relative", () => {
    expect(normalizarRutaRetorno("https%3A%2F%2Fejemplo.com")).toBeUndefined();
    expect(normalizarRutaRetorno("%2F%2Fejemplo.com")).toBeUndefined();
  });

  it("rechaza valores con codificación inválida", () => {
    expect(normalizarRutaRetorno("%E0%A4%A")).toBeUndefined();
  });
});
