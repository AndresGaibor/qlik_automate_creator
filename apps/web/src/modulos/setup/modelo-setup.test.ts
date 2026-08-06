import { describe, expect, it } from "vitest";
import {
  crearEntradaSetup,
  crearEstadoInicialSetup,
  validarPasoSetup,
} from "./modelo-setup";

describe("modelo del asistente de setup", () => {
  it("crea el estado inicial con scopes y redirect calculado", () => {
    const estado = crearEstadoInicialSetup(
      "https://app.ejemplo.com/api/auth/qlik/callback",
    );

    expect(estado.qlikScopes.length).toBeGreaterThan(0);
    expect(estado.qlikRedirectUri).toBe(
      "https://app.ejemplo.com/api/auth/qlik/callback",
    );
  });

  it("devuelve un mensaje concreto para cada paso inválido", () => {
    const estado = crearEstadoInicialSetup("http://localhost/callback");

    expect(validarPasoSetup(1, estado)).toMatch(/organización/i);
    expect(
      validarPasoSetup(1, { ...estado, organizacionNombre: "Empresa" }),
    ).toBeNull();
    expect(
      validarPasoSetup(2, { ...estado, organizacionNombre: "Empresa" }),
    ).toMatch(/tenant/i);
    expect(
      validarPasoSetup(3, {
        ...estado,
        superadminNombre: "Administrador",
        superadminCorreo: "correo-invalido",
      }),
    ).toMatch(/correo/i);
  });

  it("normaliza los datos enviados al backend", () => {
    const estado = {
      ...crearEstadoInicialSetup("http://localhost/callback"),
      organizacionNombre: "  Empresa Demo  ",
      qlikTenantHost: " tenant.qlikcloud.com ",
      qlikClientId: " cliente ",
      qlikClientSecret: " secreto ",
      superadminNombre: "  Ana Admin ",
      superadminCorreo: " ANA@EJEMPLO.COM ",
    };

    expect(crearEntradaSetup(estado, "https://app.ejemplo.com")).toMatchObject({
      organizacionNombre: "Empresa Demo",
      qlikTenantHost: "tenant.qlikcloud.com",
      qlikClientId: "cliente",
      qlikClientSecret: "secreto",
      superadminNombre: "Ana Admin",
      superadminCorreo: "ana@ejemplo.com",
      frontendUrl: "https://app.ejemplo.com",
    });
  });
});
