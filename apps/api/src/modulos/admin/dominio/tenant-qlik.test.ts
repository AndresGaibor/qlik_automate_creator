import { describe, expect, it } from "bun:test";
import {
  decidirSiNuevoTenantEsPrincipal,
  validarEliminacionTenantQlik,
} from "./tenant-qlik.js";

describe("reglas de tenant Qlik", () => {
  it("marca como principal el primer tenant de una organización", () => {
    expect(decidirSiNuevoTenantEsPrincipal(0)).toBe(true);
    expect(decidirSiNuevoTenantEsPrincipal(2)).toBe(false);
  });

  it("impide eliminar el tenant principal hasta designar reemplazo", () => {
    expect(validarEliminacionTenantQlik({ esPrincipal: true })).toBe(
      "REQUIERE_REEMPLAZO",
    );
    expect(validarEliminacionTenantQlik({ esPrincipal: false })).toBe(
      "PERMITIDA",
    );
  });
});
