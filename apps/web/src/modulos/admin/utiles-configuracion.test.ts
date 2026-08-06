import { describe, expect, it } from "vitest";
import { seleccionarConfiguracionPrincipal } from "./utiles-configuracion";

describe("seleccionarConfiguracionPrincipal", () => {
  it("elige la organización activa aunque no sea la primera", () => {
    const resultado = seleccionarConfiguracionPrincipal([
      {
        id: "suspendida",
        nombre: "Anterior",
        slug: "anterior",
        estado: "suspendida",
        cantidadUsuarios: 0,
        creadoEn: "2026-08-05",
      },
      {
        id: "activa",
        nombre: "Principal",
        slug: "principal",
        estado: "activa",
        cantidadUsuarios: 2,
        creadoEn: "2026-08-05",
      },
    ]);
    expect(resultado?.id).toBe("activa");
  });

  it("usa la primera cuando ninguna está activa", () => {
    const resultado = seleccionarConfiguracionPrincipal([
      {
        id: "primera",
        nombre: "Primera",
        slug: "primera",
        estado: "suspendida",
        cantidadUsuarios: 0,
        creadoEn: "2026-08-05",
      },
    ]);
    expect(resultado?.id).toBe("primera");
  });
});
