import { describe, expect, it } from "bun:test";
import type { ConfiguracionEspaciosVisibles } from "@qlik/contratos/admin";
import { crearPoliticaEspacios } from "./politica-espacios.js";

const configuracion: ConfiguracionEspaciosVisibles = {
  tenantQlikId: "tenant-1",
  espaciosPermitidosIds: ["ventas", "operaciones"],
  permitirRecursosSinEspacio: false,
  configurada: true,
  actualizadoEn: "2026-08-06T10:00:00.000Z",
};

describe("crearPoliticaEspacios", () => {
  it("no restringe al administrador en su vista normal", () => {
    const politica = crearPoliticaEspacios(configuracion, {
      esAdministrador: true,
      forzarVistaUsuarioFinal: false,
    });

    expect(politica.restringida).toBe(false);
    expect(politica.puedeVer("finanzas")).toBe(true);
  });

  it("aplica la lista permitida al usuario final", () => {
    const politica = crearPoliticaEspacios(configuracion, {
      esAdministrador: false,
      forzarVistaUsuarioFinal: false,
    });

    expect(politica.restringida).toBe(true);
    expect(politica.puedeVer("ventas")).toBe(true);
    expect(politica.puedeVer("finanzas")).toBe(false);
  });

  it("restringe al administrador cuando previsualiza la vista final", () => {
    const politica = crearPoliticaEspacios(configuracion, {
      esAdministrador: true,
      forzarVistaUsuarioFinal: true,
    });

    expect(politica.restringida).toBe(true);
    expect(politica.puedeVer("operaciones")).toBe(true);
    expect(politica.puedeVer("finanzas")).toBe(false);
  });

  it("decide explícitamente los recursos sin espacio", () => {
    const cerrada = crearPoliticaEspacios(configuracion, {
      esAdministrador: false,
      forzarVistaUsuarioFinal: false,
    });
    const abierta = crearPoliticaEspacios(
      { ...configuracion, permitirRecursosSinEspacio: true },
      { esAdministrador: false, forzarVistaUsuarioFinal: false },
    );

    expect(cerrada.puedeVer(null)).toBe(false);
    expect(cerrada.puedeVer(undefined)).toBe(false);
    expect(abierta.puedeVer(null)).toBe(true);
  });
});
