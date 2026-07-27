import { describe, expect, it } from "bun:test";
import { validarIdentificadorImpala } from "./identificador-impala.js";

describe("validarIdentificadorImpala", () => {
  it("acepta únicamente identificadores SQL simples", () => {
    expect(validarIdentificadorImpala("ventas_2026")).toBe("ventas_2026");
    expect(() => validarIdentificadorImpala("default; DROP TABLE usuarios")).toThrow(
      "Identificador de Impala inválido",
    );
  });
});
