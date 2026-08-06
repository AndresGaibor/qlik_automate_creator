import { describe, expect, it } from "vitest";
import {
  construirReferenciaWorkspace,
  extraerBloquesResumen,
  extraerVariablesResumen,
} from "./modelo-workspace";

describe("modelo de resumen del workspace", () => {
  it("extrae parámetros, grupos e identificadores del bloque", () => {
    expect(
      extraerBloquesResumen({
        blocks: [
          {
            type: "EndpointBlock",
            name: "Carga",
            connectorId: "conector-1",
            endpointId: "endpoint-1",
            settings: {
              tabla: "ventas",
              internalId: "oculto",
              columnas: [{ nombre: "id", tipo: "int" }],
            },
          },
        ],
      }),
    ).toEqual([
      {
        tipo: "EndpointBlock",
        nombre: "Carga",
        parametros: [
          { clave: "tabla", valor: "ventas" },
          { clave: "connectorId", valor: "conector-1" },
          { clave: "endpointId", valor: "endpoint-1" },
        ],
        grupos: [
          {
            clave: "columnas",
            items: [
              { clave: "nombre", valor: "id" },
              { clave: "tipo", valor: "int" },
            ],
          },
        ],
      },
    ]);
  });

  it("recupera valores de VariableBlock cuando la variable no los trae", () => {
    expect(
      extraerVariablesResumen({
        variables: [{ name: "Appid", value: "" }],
        blocks: [
          {
            type: "VariableBlock",
            name: "Appid",
            operations: [{ value: "flujo-1" }],
          },
        ],
      }),
    ).toEqual([{ nombre: "Appid", valor: "flujo-1" }]);
  });

  it("resuelve la referencia del Dataflow y destino", () => {
    expect(
      construirReferenciaWorkspace(
        [
          { nombre: "Appid", valor: "flujo-1" },
          { nombre: "TablaDestino", valor: "dwh.ventas" },
          { nombre: "ArchivoEntrada", valor: "ventas" },
          { nombre: "Extension", valor: "csv" },
        ],
        [{ id: "flujo-1", nombre: "Ventas diarias" }],
      ),
    ).toMatchObject({
      nombreDataflow: "Ventas diarias",
      flujoId: "flujo-1",
      archivoODataset: "ventas",
      extension: "csv",
      tablaDestino: "dwh.ventas",
    });
  });
});
