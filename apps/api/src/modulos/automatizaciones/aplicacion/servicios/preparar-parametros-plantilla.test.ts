import { describe, expect, it, vi } from "bun:test";
import { parsearScriptQlik } from "../../../flujos/aplicacion/generador-catalogo-spark.js";
import { construirCatalogoConexionesSpark } from "../../../flujos/aplicacion/generador-catalogo-spark.js";
import type { PuertoQlik } from "../../../qlik/aplicacion/puertos/puerto-qlik.js";
import type {
  ParametrosPlantilla,
  ParametrosPlantillaModo1,
  ParametrosPlantillaModo2,
} from "./preparar-parametros-plantilla.js";
import {
  prepararParametrosPlantilla,
} from "./preparar-parametros-plantilla.js";
import { ErrorAplicacion } from "../../../../nucleo/errores/error-aplicacion.js";

function crearMockPuertoQlik(mocks: {
  obtenerScriptApp?: PuertoQlik["obtenerScriptApp"];
}) {
  return {
    obtenerScriptApp: mocks.obtenerScriptApp ?? vi.fn(),
  } as unknown as PuertoQlik;
}

function crearMockConsultarConexionesOrigen(connections: Array<{
  tipo: string;
  nombre: string;
  config: Record<string, unknown>;
}>) {
  return vi.fn(async () => connections);
}

function crearMockConsultarConexionDestino(conn: {
  tipo: string;
  config: Record<string, unknown>;
} | null) {
  return vi.fn(async () => conn);
}

function crearMockCrearClienteDestino(cliente: unknown) {
  return vi.fn(() => cliente);
}

describe("prepararParametrosPlantilla", () => {
  describe("modo 1", () => {
    it("genera ParametrosPlantillaModo1 con script y catalogo sin secretos", async () => {
      const scriptRes = {
        script: "LIB CONNECT TO [Postgres_Banco];\nSELECT * FROM esquema.tabla;",
      };
      const qlik = crearMockPuertoQlik({ obtenerScriptApp: async () => scriptRes });

      const conexionesOrigen = [
        {
          tipo: "postgres",
          nombre: "Postgres_Banco",
          config: {
            url: "jdbc:postgresql://host:5432/db",
            secreto_nombre: "SECRETO_POSTGRES_BANCO",
          },
        },
      ];
      const consultarConexionesOrigen =
        crearMockConsultarConexionesOrigen(conexionesOrigen);

      const resultado = await prepararParametrosPlantilla(
        { qlik, consultarConexionesOrigen },
        { modo: 1, organizacionId: "org-1", flujoId: "flujo-1", tablaId: "ventas_curadas" },
      );

      expect(resultado).toMatchObject({
        modo: 1,
        DataflowId: "flujo-1",
        TablaDestino: "ventas_curadas",
      } as ParametrosPlantilla);
      expect(resultado.modo).toBe(1);
      const params1 = resultado as ParametrosPlantillaModo1;
      expect(params1.DataflowScriptContenido).toBe(scriptRes.script);
      expect(params1.ConexionesContenido).toBe(
        JSON.stringify(
          construirCatalogoConexionesSpark(
            parsearScriptQlik(scriptRes.script),
            conexionesOrigen.map((c) => ({
              tipo: c.tipo,
              nombre: c.nombre,
              config: c.config,
            })),
          ),
        ),
      );
    });

    it("ConexionesContenido no contiene usuario:clave", async () => {
      const scriptRes = {
        script: "LIB CONNECT TO [Postgres_Banco];\nSELECT * FROM esquema.tabla;",
      };
      const qlik = crearMockPuertoQlik({ obtenerScriptApp: async () => scriptRes });

      const conexionesOrigen = [
        {
          tipo: "postgres",
          nombre: "Postgres_Banco",
          config: {
            url: "jdbc:postgresql://host:5432/db",
            secreto_nombre: "SECRETO_POSTGRES_BANCO",
            usuario: "admin",
            clave: "secret123",
          },
        },
      ];
      const consultarConexionesOrigen =
        crearMockConsultarConexionesOrigen(conexionesOrigen);

      const resultado = await prepararParametrosPlantilla(
        { qlik, consultarConexionesOrigen },
        { modo: 1, organizacionId: "org-1", flujoId: "flujo-1", tablaId: "ventas_curadas" },
      );

      const params1 = resultado as ParametrosPlantillaModo1;
      expect(params1.ConexionesContenido).not.toContain("usuario:clave");
      expect(params1.ConexionesContenido).not.toContain("secret123");
    });

    it("lanza TABLA_DESTINO_REQUERIDA si tablaId es vacio en modo 1", async () => {
      const qlik = crearMockPuertoQlik({});
      const consultarConexionesOrigen = crearMockConsultarConexionesOrigen([]);

      await expect(
        prepararParametrosPlantilla(
          { qlik, consultarConexionesOrigen },
          { modo: 1, organizacionId: "org-1", flujoId: "flujo-1", tablaId: "  " },
        ),
      ).rejects.toThrow(ErrorAplicacion);
      await expect(
        prepararParametrosPlantilla(
          { qlik, consultarConexionesOrigen },
          { modo: 1, organizacionId: "org-1", flujoId: "flujo-1", tablaId: "  " },
        ),
      ).rejects.toMatchObject({ codigo: "TABLA_DESTINO_REQUERIDA", estadoHttp: 422 });
    });

    it("EjecucionId esta presente y no es vacio", async () => {
      const scriptRes = { script: "LIB CONNECT TO [x];" };
      const qlik = crearMockPuertoQlik({ obtenerScriptApp: async () => scriptRes });
      const consultarConexionesOrigen = crearMockConsultarConexionesOrigen([]);

      const resultado = await prepararParametrosPlantilla(
        { qlik, consultarConexionesOrigen },
        { modo: 1, organizacionId: "org-1", flujoId: "flujo-1", tablaId: "t" },
      );

      const params1 = resultado as ParametrosPlantillaModo1;
      expect(params1.EjecucionId).toBeTruthy();
      expect(params1.EjecucionId.length).toBeGreaterThan(0);
    });
  });

  describe("modo 2", () => {
    it("genera ParametrosPlantillaModo2 con EsquemaTablaDestino y RutasSftpContenido", async () => {
      const scriptRes = {
        script:
          "STORE data INTO [lib://SFTP_Conexion/upload/archivo.csv];",
      };
      const qlik = crearMockPuertoQlik({ obtenerScriptApp: async () => scriptRes });

      const conexionesOrigen = [
        {
          tipo: "sftp",
          nombre: "SFTP_Conexion",
          config: {
            host: "sftp.example.com",
            secreto_clave_privada_nombre: "SECRETO_SFTP",
          },
        },
      ];
      const consultarConexionesOrigen =
        crearMockConsultarConexionesOrigen(conexionesOrigen);

      const recursoDestino = {
        id: "ventas_curadas",
        columnas: [{ nombre: "id" }, { nombre: "monto" }],
      };
      const clienteDestino = {
        tipo: "postgres" as const,
        obtenerRecurso: async (id: string) => recursoDestino,
      };

      const deps = {
        qlik,
        consultarConexionesOrigen,
        consultarConexionDestino: crearMockConsultarConexionDestino({
          tipo: "postgres",
          config: { host: "pg.example.com" },
        }),
        crearCliente: crearMockCrearClienteDestino(clienteDestino),
      };

      const resultado = await prepararParametrosPlantilla(deps, {
        modo: 2,
        organizacionId: "org-1",
        flujoId: "flujo-1",
        tablaId: "ventas_curadas",
        destinoId: "destino-uuid-1",
      });

      expect(resultado.modo).toBe(2);
      const params2 = resultado as ParametrosPlantillaModo2;
      expect(params2.DataflowId).toBe("flujo-1");
      expect(params2.TablaDestino).toBe("ventas_curadas");
      expect(params2.EsquemaTablaDestino).toBe(JSON.stringify(recursoDestino));
      expect(params2.RutasSftpContenido).toBeTruthy();
      const rutas = JSON.parse(params2.RutasSftpContenido);
      expect(Array.isArray(rutas)).toBe(true);
    });

    it("lanza SFTP_NO_CONFIGURADO si catalogo sftp esta vacio", async () => {
      const scriptRes = { script: "SELECT * FROM esquema.tabla;" };
      const qlik = crearMockPuertoQlik({ obtenerScriptApp: async () => scriptRes });
      const consultarConexionesOrigen = crearMockConsultarConexionesOrigen([]);

      const deps = {
        qlik,
        consultarConexionesOrigen,
        consultarConexionDestino: crearMockConsultarConexionDestino({
          tipo: "postgres",
          config: {},
        }),
        crearCliente: crearMockCrearClienteDestino({
          obtenerRecurso: async () => ({ id: "t", columnas: [] }),
        }),
      };

      await expect(
        prepararParametrosPlantilla(deps, {
          modo: 2,
          organizacionId: "org-1",
          flujoId: "flujo-1",
          tablaId: "t",
          destinoId: "dest-1",
        }),
      ).rejects.toMatchObject({ codigo: "SFTP_NO_CONFIGURADO", estadoHttp: 422 });
    });

    it("lanza DESTINO_REQUERIDO_MODO_2 si falta destinoId", async () => {
      const qlik = crearMockPuertoQlik({});
      const consultarConexionesOrigen = crearMockConsultarConexionesOrigen([]);

      await expect(
        prepararParametrosPlantilla(
          { qlik, consultarConexionesOrigen },
          { modo: 2, organizacionId: "org-1", flujoId: "flujo-1", tablaId: "t", destinoId: undefined },
        ),
      ).rejects.toMatchObject({ codigo: "DESTINO_REQUERIDO_MODO_2", estadoHttp: 422 });
    });

    it("lanza TABLA_DESTINO_REQUERIDA si falta tablaId en modo 2", async () => {
      const qlik = crearMockPuertoQlik({});
      const consultarConexionesOrigen = crearMockConsultarConexionesOrigen([]);

      await expect(
        prepararParametrosPlantilla(
          { qlik, consultarConexionesOrigen },
          { modo: 2, organizacionId: "org-1", flujoId: "flujo-1", tablaId: undefined, destinoId: "dest-1" },
        ),
      ).rejects.toMatchObject({ codigo: "TABLA_DESTINO_REQUERIDA", estadoHttp: 422 });
    });

    it("lanza DESTINO_NO_ENCONTRADO si la conexion destino no existe", async () => {
      const qlik = crearMockPuertoQlik({});
      const consultarConexionesOrigen = crearMockConsultarConexionesOrigen([]);

      await expect(
        prepararParametrosPlantilla(
          {
            qlik,
            consultarConexionesOrigen,
            consultarConexionDestino: crearMockConsultarConexionDestino(null),
          },
          { modo: 2, organizacionId: "org-1", flujoId: "flujo-1", tablaId: "t", destinoId: "dest-1" },
        ),
      ).rejects.toMatchObject({ codigo: "DESTINO_NO_ENCONTRADO", estadoHttp: 404 });
    });

    it("lanza DESTINO_SIN_COLUMNAS si recurso no tiene columnas", async () => {
      const scriptRes = { script: "STORE x INTO [lib://SFTP//f.csv];" };
      const qlik = crearMockPuertoQlik({ obtenerScriptApp: async () => scriptRes });
      const consultarConexionesOrigen = crearMockConsultarConexionesOrigen([]);

      const deps = {
        qlik,
        consultarConexionesOrigen,
        consultarConexionDestino: crearMockConsultarConexionDestino({
          tipo: "postgres",
          config: {},
        }),
        crearCliente: crearMockCrearClienteDestino({
          obtenerRecurso: async () => ({ id: "t", columnas: [] }),
        }),
      };

      await expect(
        prepararParametrosPlantilla(deps, {
          modo: 2,
          organizacionId: "org-1",
          flujoId: "flujo-1",
          tablaId: "t",
          destinoId: "dest-1",
        }),
      ).rejects.toMatchObject({ codigo: "DESTINO_SIN_COLUMNAS", estadoHttp: 422 });
    });

    it("EjecucionId presente y no vacio en modo 2", async () => {
      const scriptRes = { script: "STORE x INTO [lib://SFTP//f.csv];" };
      const qlik = crearMockPuertoQlik({ obtenerScriptApp: async () => scriptRes });
      const consultarConexionesOrigen = crearMockConsultarConexionesOrigen([]);

      const deps = {
        qlik,
        consultarConexionesOrigen,
        consultarConexionDestino: crearMockConsultarConexionDestino({
          tipo: "postgres",
          config: {},
        }),
        crearCliente: crearMockCrearClienteDestino({
          obtenerRecurso: async () => ({ id: "t", columnas: [{ nombre: "x" }] }),
        }),
      };

      const resultado = await prepararParametrosPlantilla(deps, {
        modo: 2,
        organizacionId: "org-1",
        flujoId: "flujo-1",
        tablaId: "t",
        destinoId: "dest-1",
      });

      const params2 = resultado as ParametrosPlantillaModo2;
      expect(params2.EjecucionId).toBeTruthy();
      expect(params2.EjecucionId.length).toBeGreaterThan(0);
    });
  });
});
