import { describe, expect, it } from "bun:test";
import { ErrorAplicacion } from "../../../../nucleo/errores/error-aplicacion.js";
import { configurarWorkspacePlantilla } from "./configurar-workspace-plantilla.js";
import type {
  ParametrosPlantillaModo1,
  ParametrosPlantillaModo2,
} from "./preparar-parametros-plantilla.js";

describe("configurarWorkspacePlantilla", () => {
  describe("modo 1", () => {
    const parametros: ParametrosPlantillaModo1 = {
      modo: 1,
      Appid: "flujo-1",
      DFScript: "script",
      ConexionJSON: "{}",
      BaseDestinoJSON: "{}",
      SECRETOSJSON: '{"SECRETO":"valor"}',
    };

    it("actualiza set_value y conserva variables adicionales", () => {
      const workspace = {
        variables: [
          { guid: "a", name: "Appid", type: "string" },
          { guid: "b", name: "DFScript", type: "string" },
          { guid: "c", name: "ConexionJSON", type: "string" },
          { guid: "d", name: "BaseDestinoJSON", type: "string" },
          { guid: "e", name: "SECRETOSJSON", type: "string" },
          { guid: "f", name: "Dataset", type: "string" },
        ],
        blocks: [
          {
            type: "VariableBlock",
            name: "Appid",
            operations: [
              { id: "otra", key: "noop", value: "no-cambiar" },
              { id: "set_value", key: "op-a", value: "anterior" },
            ],
          },
        ],
      };

      const resultado = configurarWorkspacePlantilla(workspace, parametros);
      const bloque = (resultado.blocks as Array<Record<string, unknown>>)[0];
      const operaciones = bloque.operations as Array<Record<string, unknown>>;
      expect(operaciones[0].value).toBe("no-cambiar");
      expect(operaciones[1].value).toBe("flujo-1");
      expect(
        (resultado.variables as Array<Record<string, unknown>>)[5],
      ).toEqual(workspace.variables[5]);
      expect(workspace.blocks[0].operations[1].value).toBe("anterior");
    });

    it("informa todas las variables faltantes antes de copiar", () => {
      expect(() =>
        configurarWorkspacePlantilla(
          { variables: [{ name: "Appid" }], blocks: [] },
          parametros,
        ),
      ).toThrow(ErrorAplicacion);
      try {
        configurarWorkspacePlantilla(
          { variables: [{ name: "Appid" }], blocks: [] },
          parametros,
        );
      } catch (error) {
        expect(error).toMatchObject({
          codigo: "VARIABLES_PLANTILLA_FALTANTES",
          detalles: {
            variablesFaltantes: [
              "DFScript",
              "ConexionJSON",
              "BaseDestinoJSON",
              "SECRETOSJSON",
            ],
          },
        });
      }
    });
  });

  describe("modo 2", () => {
    it("actualiza solo las variables del modo 2 y deja las demas intactas", () => {
      const workspace = {
        variables: [
          { name: "DataflowId", value: "flujo-1" },
          { name: "RutasSftpContenido", value: "old-rutas" },
          { name: "EsquemaTablaDestino", value: "old-esquema" },
          { name: "EjecucionId", value: "old-ejec" },
          { name: "TablaDestino", value: "old-tabla" },
          { name: "OtraVariable", value: "queda" },
        ],
        blocks: [],
      };

      const params: ParametrosPlantillaModo2 = {
        modo: 2,
        DataflowId: "flujo-2",
        RutasSftpContenido: '[{"nombre":"SFTP","rutaBase":"/upload"}]',
        EsquemaTablaDestino: '{"id":"t","columnas":[]}',
        EjecucionId: "ejec-2",
        TablaDestino: "tabla-2",
      };

      const resultado = configurarWorkspacePlantilla(workspace, params);

      const varMap = Object.fromEntries(
        (resultado.variables as Array<{ name: string; value: unknown }>).map(
          (v) => [v.name, v.value],
        ),
      );
      expect(varMap.DataflowId).toBe("flujo-2");
      expect(varMap.RutasSftpContenido).toBe(
        '[{"nombre":"SFTP","rutaBase":"/upload"}]',
      );
      expect(varMap.EsquemaTablaDestino).toBe('{"id":"t","columnas":[]}');
      expect(varMap.EjecucionId).toBe("ejec-2");
      expect(varMap.TablaDestino).toBe("tabla-2");
      expect(varMap.OtraVariable).toBe("queda");
    });

    it("lanza PLANTILLA_INCOMPATIBLE si falta EsquemaTablaDestino en modo 2", () => {
      const workspace = {
        variables: [
          { name: "DataflowId", value: "flujo-1" },
          { name: "RutasSftpContenido", value: "[]" },
          { name: "EjecucionId", value: "ejec" },
          { name: "TablaDestino", value: "t" },
        ],
        blocks: [],
      };

      const params: ParametrosPlantillaModo2 = {
        modo: 2,
        DataflowId: "flujo-1",
        RutasSftpContenido: "[]",
        EsquemaTablaDestino: '{"id":"t","columnas":[]}',
        EjecucionId: "ejec",
        TablaDestino: "t",
      };

      expect(() => configurarWorkspacePlantilla(workspace, params)).toThrow(
        ErrorAplicacion,
      );
      try {
        configurarWorkspacePlantilla(workspace, params);
      } catch (e) {
        expect(e).toMatchObject({
          codigo: "PLANTILLA_INCOMPATIBLE",
          estadoHttp: 422,
        });
        expect((e as ErrorAplicacion).message).toContain("EsquemaTablaDestino");
      }
    });

    it("soporta variables solo en VariableBlock para modo 2", () => {
      const blocks = [
        {
          name: "DataflowId",
          type: "VariableBlock",
          operations: [{ value: "old-flujo" }],
        },
        {
          name: "RutasSftpContenido",
          type: "VariableBlock",
          operations: [{ value: "old-rutas" }],
        },
        {
          name: "EsquemaTablaDestino",
          type: "VariableBlock",
          operations: [{ value: "old-esquema" }],
        },
        {
          name: "EjecucionId",
          type: "VariableBlock",
          operations: [{ value: "old-ejec" }],
        },
        {
          name: "TablaDestino",
          type: "VariableBlock",
          operations: [{ value: "old-tabla" }],
        },
      ];
      const workspace = { variables: [], blocks };

      const params: ParametrosPlantillaModo2 = {
        modo: 2,
        DataflowId: "flujo-2",
        RutasSftpContenido: "nuevas-rutas",
        EsquemaTablaDestino: '{"id":"t","columnas":[]}',
        EjecucionId: "ejec-2",
        TablaDestino: "tabla-2",
      };

      const resultado = configurarWorkspacePlantilla(
        { ...workspace, blocks: [...blocks] },
        params,
      );

      const resultadoBlocks = resultado.blocks as Array<{
        name: string;
        type: string;
        operations: Array<{ value: unknown }>;
      }>;
      const rutasBlock = resultadoBlocks.find(
        (b) => b.type === "VariableBlock" && b.name === "RutasSftpContenido",
      );
      expect(rutasBlock?.operations[0].value).toBe("nuevas-rutas");
    });

    it("lanza un solo PLANTILLA_INCOMPATIBLE con todas las variables faltantes", () => {
      const workspace = {
        variables: [{ name: "VariableExtra", value: "x" }],
        blocks: [],
      };

      const params: ParametrosPlantillaModo2 = {
        modo: 2,
        DataflowId: "f",
        RutasSftpContenido: "[]",
        EsquemaTablaDestino: '{"id":"t","columnas":[]}',
        EjecucionId: "e",
        TablaDestino: "t",
      };

      expect(() => configurarWorkspacePlantilla(workspace, params)).toThrow(
        ErrorAplicacion,
      );
      try {
        configurarWorkspacePlantilla(workspace, params);
      } catch (e) {
        expect(e).toMatchObject({
          codigo: "PLANTILLA_INCOMPATIBLE",
          estadoHttp: 422,
        });
        const err = e as ErrorAplicacion;
        expect(err.message).toContain("DataflowId");
        expect(err.message).toContain("RutasSftpContenido");
        expect(err.message).toContain("EsquemaTablaDestino");
        expect(err.message).toContain("EjecucionId");
        expect(err.message).toContain("TablaDestino");
      }
    });
  });
});
