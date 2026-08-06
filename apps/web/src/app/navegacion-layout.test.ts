import { describe, expect, it } from "vitest";
import { filtrarNavegacion } from "./navegacion-layout";

describe("filtrarNavegacion", () => {
  it("oculta administración para usuarios finales", () => {
    expect(
      filtrarNavegacion({
        esAdmin: true,
        esSuperadmin: true,
        modoUsuarioFinal: true,
      }).map((item) => item.to),
    ).toEqual(["/", "/flujos", "/automatizaciones", "/tablas"]);
  });

  it("muestra configuración solo a administradores", () => {
    expect(
      filtrarNavegacion({
        esAdmin: false,
        esSuperadmin: false,
        modoUsuarioFinal: false,
      }).map((item) => item.to),
    ).not.toContain("/configuracion");

    expect(
      filtrarNavegacion({
        esAdmin: true,
        esSuperadmin: false,
        modoUsuarioFinal: false,
      }).map((item) => item.to),
    ).toContain("/configuracion");
  });
});
