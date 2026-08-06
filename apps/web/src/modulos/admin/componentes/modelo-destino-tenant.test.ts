import { describe, expect, it } from "vitest";
import {
  configuracionInicialDestino,
  construirEntradaDestino,
  puedeGuardarDestino,
} from "./modelo-destino-tenant";

describe("modelo de destino por tenant", () => {
  it("define defaults según el tipo", () => {
    expect(configuracionInicialDestino("postgres")).toEqual({ port: "5432" });
    expect(configuracionInicialDestino("sftp")).toEqual({
      port: "22",
      rutaBase: "/",
    });
    expect(configuracionInicialDestino("impala")).toEqual({
      port: "21050",
      database: "default",
    });
  });

  it("construye el payload sin modificar la configuración", () => {
    const config = { host: " db.internal ", port: "5432" };
    expect(construirEntradaDestino("postgres", " Producción ", config)).toEqual(
      {
        tipo: "postgres",
        nombre: "Producción",
        config,
      },
    );
  });

  it("exige nombre y host para guardar", () => {
    expect(puedeGuardarDestino("Producción", { host: "db.internal" })).toBe(
      true,
    );
    expect(puedeGuardarDestino("", { host: "db.internal" })).toBe(false);
    expect(puedeGuardarDestino("Producción", { host: "" })).toBe(false);
  });
});
