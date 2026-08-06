import { describe, expect, it } from "bun:test";
import { normalizarModoPlantilla } from "./consulta-configuracion-plataforma-postgres.js";
import { mapearSuperadmin } from "./consulta-superadmin-postgres.js";

describe("modelos de persistencia administrativa", () => {
  it("normaliza modos inválidos al modo 1", () => {
    expect(normalizarModoPlantilla(1)).toBe(1);
    expect(normalizarModoPlantilla(2)).toBe(2);
    expect(normalizarModoPlantilla(99)).toBe(1);
    expect(normalizarModoPlantilla(null)).toBe(1);
  });

  it("mapea un usuario persistido sin filtrar campos internos", () => {
    const creadoEn = new Date("2026-08-06T12:00:00Z");
    expect(
      mapearSuperadmin({
        id: "usr-1",
        nombre: "Ana",
        correo: "ana@example.com",
        estado: "activo",
        esSuperadmin: true,
        creadoEn,
      }),
    ).toEqual({
      id: "usr-1",
      nombre: "Ana",
      correo: "ana@example.com",
      estado: "activo",
      esSuperadmin: true,
      creadoEn,
    });
  });
});
