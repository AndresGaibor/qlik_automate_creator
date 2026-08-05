import { describe, expect, it } from "bun:test";
import type { ParametrosPlantillaModo1, ParametrosPlantillaModo2 } from "./preparar-parametros-plantilla.js";
import { configurarWorkspacePlantilla } from "./configurar-workspace-plantilla.js";
import { ErrorAplicacion } from "../../../../nucleo/errores/error-aplicacion.js";

describe("configurarWorkspacePlantilla", () => {
  describe("modo 1", () => {
    it("actualiza solo las variables del modo 1 y deja las demas intactas", () => {
      const workspace = {
        variables: [
          { name: "DataflowId", value: "old-flujo" },
          { name: "DataflowScriptContenido", value: "old-script" },
          { name: "ConexionesContenido", value: "old-conexiones" },
          { name: "EjecucionId", value: "old-ejec" },
          { name: "TablaDestino", value: "old-tabla" },
          { name: "VariableExtra", value: "no-debe-cambiar" },
        ],
        blocks: [],
      };

      const params: ParametrosPlantillaModo1 = {
        modo: 1,
        DataflowId: "flujo-nuevo",
        DataflowScriptContenido: "script-nuevo",
        ConexionesContenido: '{"jdbc":[]}',
        EjecucionId: "ejec-nueva",
        TablaDestino: "tabla-nueva",
      };

      const resultado = configurarWorkspacePlantilla(workspace, params);

      const varMap = Object.fromEntries(
        (resultado.variables as Array<{ name: string; value: unknown }>).map(
          (v) => [v.name, v.value],
        ),
      );
      expect(varMap.DataflowId).toBe("flujo-nuevo");
      expect(varMap.DataflowScriptContenido).toBe("script-nuevo");
      expect(varMap.ConexionesContenido).toBe('{"jdbc":[]}');
      expect(varMap.EjecucionId).toBe("ejec-nueva");
      expect(varMap.TablaDestino).toBe("tabla-nueva");
      expect(varMap.VariableExtra).toBe("no-debe-cambiar");
    });

    it("soporta variables solo en bloques VariableBlock", () => {
      const blocks = [
        { name: "DataflowId", type: "VariableBlock", operations: [{ value: "old-flujo" }] },
        { name: "DataflowScriptContenido", type: "VariableBlock", operations: [{ value: "old-script" }] },
        { name: "ConexionesContenido", type: "VariableBlock", operations: [{ value: "old-conexiones" }] },
        { name: "EjecucionId", type: "VariableBlock", operations: [{ value: "old-ejec" }] },
        { name: "TablaDestino", type: "VariableBlock", operations: [{ value: "old-tabla" }] },
      ];
      const workspace = { variables: [], blocks };

      const params: ParametrosPlantillaModo1 = {
        modo: 1,
        DataflowId: "flujo-nuevo",
        DataflowScriptContenido: "script-nuevo",
        ConexionesContenido: "{}",
        EjecucionId: "ejec-nueva",
        TablaDestino: "tabla-nueva",
      };

      const resultado = configurarWorkspacePlantilla(
        { ...workspace, blocks: [...blocks] },
        params,
      );

      const resultadoBlocks = resultado.blocks as Array<{ name: string; type: string; operations: Array<{ value: unknown }> }>;
      const dataflowBlock = resultadoBlocks.find((b) => b.type === "VariableBlock" && b.name === "DataflowId");
      expect(dataflowBlock).toBeDefined();
      expect(dataflowBlock?.operations[0].value).toBe("flujo-nuevo");
    });

    it("lanza PLANTILLA_INCOMPATIBLE si falta una variable requerida del modo 1", () => {
      const workspace = {
        variables: [
          { name: "DataflowId", value: "flujo-1" },
          { name: "DataflowScriptContenido", value: "script" },
          { name: "ConexionesContenido", value: "{}" },
          { name: "EjecucionId", value: "ejec" },
        ],
        blocks: [],
      };

      const params: ParametrosPlantillaModo1 = {
        modo: 1,
        DataflowId: "flujo-1",
        DataflowScriptContenido: "script",
        ConexionesContenido: "{}",
        EjecucionId: "ejec",
        TablaDestino: "tabla-nueva",
      };

      expect(() => configurarWorkspacePlantilla(workspace, params)).toThrow(
        ErrorAplicacion,
      );
      try {
        configurarWorkspacePlantilla(workspace, params);
      } catch (e) {
        expect(e).toMatchObject({ codigo: "PLANTILLA_INCOMPATIBLE", estadoHttp: 422 });
        expect((e as ErrorAplicacion).message).toContain("TablaDestino");
      }
    });

    it("no muta el workspace original", () => {
      const workspace = {
        variables: [
          { name: "DataflowId", value: "original" },
          { name: "DataflowScriptContenido", value: "orig-script" },
          { name: "ConexionesContenido", value: "orig-conn" },
          { name: "EjecucionId", value: "orig-ejec" },
          { name: "TablaDestino", value: "orig-tabla" },
          { name: "VariableExtra", value: "extra" },
        ],
        blocks: [],
      };
      const originalDataflowId = "original";

      const params: ParametrosPlantillaModo1 = {
        modo: 1,
        DataflowId: "nuevo",
        DataflowScriptContenido: "nuevo-script",
        ConexionesContenido: "{}",
        EjecucionId: "nuevo-ejec",
        TablaDestino: "nueva-tabla",
      };

      configurarWorkspacePlantilla(workspace, params);

      expect(
        (workspace.variables as Array<{ name: string; value: unknown }>).find(
          (v) => v.name === "DataflowId",
        )?.value,
      ).toBe(originalDataflowId);
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
      expect(varMap.EsquemaTablaDestino).toBe(
        '{"id":"t","columnas":[]}',
      );
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
        expect(e).toMatchObject({ codigo: "PLANTILLA_INCOMPATIBLE", estadoHttp: 422 });
        expect((e as ErrorAplicacion).message).toContain("EsquemaTablaDestino");
      }
    });

    it("soporta variables solo en VariableBlock para modo 2", () => {
      const blocks = [
        { name: "DataflowId", type: "VariableBlock", operations: [{ value: "old-flujo" }] },
        { name: "RutasSftpContenido", type: "VariableBlock", operations: [{ value: "old-rutas" }] },
        { name: "EsquemaTablaDestino", type: "VariableBlock", operations: [{ value: "old-esquema" }] },
        { name: "EjecucionId", type: "VariableBlock", operations: [{ value: "old-ejec" }] },
        { name: "TablaDestino", type: "VariableBlock", operations: [{ value: "old-tabla" }] },
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

      const resultadoBlocks = resultado.blocks as Array<{ name: string; type: string; operations: Array<{ value: unknown }> }>;
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
        expect(e).toMatchObject({ codigo: "PLANTILLA_INCOMPATIBLE", estadoHttp: 422 });
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
