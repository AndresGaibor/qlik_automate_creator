import { describe, expect, it } from "bun:test";
import {
  esCorreoSuperadministradorHeredado,
  resolverEsSuperadministrador,
} from "./superadministrador.js";

describe("superadministrador", () => {
  it("prioriza la marca persistida", () => {
    expect(
      resolverEsSuperadministrador({
        persistido: true,
        correo: "usuario@empresa.com",
        correosHeredados: "otro@empresa.com",
      }),
    ).toBe(true);
  });

  it("reconoce varios correos heredados sin depender de mayúsculas", () => {
    expect(
      esCorreoSuperadministradorHeredado(
        " DOS@EMPRESA.COM ",
        "uno@empresa.com, dos@empresa.com",
      ),
    ).toBe(true);
  });

  it("no concede privilegios a coincidencias parciales", () => {
    expect(
      esCorreoSuperadministradorHeredado(
        "admin@empresa.com.evil",
        "admin@empresa.com",
      ),
    ).toBe(false);
  });
});
