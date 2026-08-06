import { describe, expect, it } from "bun:test";
import { normalizarOpcionesImpala } from "./configuracion-impala.js";
import { construirEsquemaTablaImpala } from "./modelo-esquema-impala.js";
import {
  extraerColumna0Hive,
  extraerFilasHive,
} from "./modelo-resultados-hive.js";

describe("modelos del cliente Impala", () => {
  it("normaliza configuración y aplica defaults seguros", () => {
    expect(normalizarOpcionesImpala({ host: " impala.local " })).toEqual({
      host: "impala.local",
      port: 21050,
      authMechanism: "NOSASL",
      user: undefined,
      password: undefined,
      database: "default",
    });
  });

  it("rechaza host vacío", () => {
    expect(() => normalizarOpcionesImpala({ host: "  " })).toThrow(
      "El host de Impala no puede estar vacío",
    );
  });

  it("extrae columna columnar respetando el bitmap de nulos", () => {
    const datos = [
      {
        columns: [
          {
            stringVal: {
              values: ["uno", "dos", "tres"],
              nulls: new Uint8Array([2]),
            },
          },
        ],
      },
    ];
    expect(extraerColumna0Hive(datos)).toEqual(["uno", "tres"]);
  });

  it("extrae todas las columnas en formato row-based", () => {
    const datos = [
      {
        rows: [
          {
            colVals: [
              { stringVal: { value: "id" } },
              { stringVal: { value: "string" } },
            ],
          },
        ],
      },
    ];
    expect(extraerFilasHive(datos)).toEqual([["id", "string"]]);
  });

  it("construye el esquema omitiendo comentarios de DESCRIBE", () => {
    expect(
      construirEsquemaTablaImpala("ventas", "facturas", [
        ["id", "bigint"],
        ["# Partition Information", ""],
        ["fecha", "timestamp"],
      ]),
    ).toEqual({
      baseDatos: "ventas",
      tabla: "facturas",
      columnas: [
        { nombre: "id", tipo: "bigint" },
        { nombre: "fecha", tipo: "timestamp" },
      ],
      especificacionEsquema: "id:bigint|fecha:timestamp",
    });
  });
});
