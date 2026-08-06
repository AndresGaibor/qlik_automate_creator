import { describe, expect, it, vi } from "bun:test";
import { ErrorAplicacion } from "../../../../nucleo/errores/error-aplicacion.js";
import type {
  FabricaDestino,
  PuertoDestino,
} from "../../../destinos/publico.js";
import {
  construirCatalogoConexionesSpark,
  parsearScriptQlik,
} from "../../../flujos/publico.js";
import type { PuertoQlik } from "../../../qlik/publico.js";
import type {
  ParametrosPlantilla,
  ParametrosPlantillaModo1,
  ParametrosPlantillaModo2,
} from "./preparar-parametros-plantilla.js";
import { prepararParametrosPlantilla } from "./preparar-parametros-plantilla.js";

function crearMockPuertoQlik(mocks: {
  obtenerScriptApp?: PuertoQlik["obtenerScriptApp"];
}) {
  return {
    obtenerScriptApp: mocks.obtenerScriptApp ?? vi.fn(),
  } as unknown as PuertoQlik;
}

function crearMockConsultarConexionesOrigen(
  connections: Array<{
    tipo: string;
    nombre: string;
    config: Record<string, unknown>;
  }>,
) {
  return vi.fn(async () => connections);
}

function crearMockConsultarConexionDestino(
  conn: {
    tipo: string;
    config: Record<string, unknown>;
  } | null,
) {
  return vi.fn(async () => conn);
}

function crearMockCrearClienteDestino(cliente: {
  obtenerRecurso(id: string): Promise<unknown>;
}): FabricaDestino {
  return vi.fn(() => cliente as PuertoDestino);
}

describe("prepararParametrosPlantilla", () => {
  describe("modo 1", () => {
    const script = `
LIB CONNECT TO [Ventas DB];
SQL SELECT * FROM public.ventas;
STORE ventas INTO [lib://Salida SFTP/ventas.csv];
`;

    function depsModo1() {
      const origenes = [
        {
          id: "origen-jdbc",
          tipo: "jdbc",
          nombre: "Ventas DB",
          estado: "disponible" as const,
          probadaEn: new Date(),
          mensajeError: null,
          config: {
            url: "jdbc:postgresql://db.internal:5432/origen",
            driver: "org.postgresql.Driver",
            secreto_nombre: "JDBC_VENTAS",
          },
        },
        {
          id: "origen-sftp",
          tipo: "sftp",
          nombre: "Salida SFTP",
          estado: "disponible" as const,
          probadaEn: new Date(),
          mensajeError: null,
          config: {
            host: "sftp.internal",
            puerto: 22,
            usuario: "demo",
            secreto_clave_privada_nombre: "SFTP_SALIDA_B64",
            ruta_base: "/upload",
          },
        },
      ];
      return {
        qlik: crearMockPuertoQlik({
          obtenerScriptApp: async () => ({ script }),
        }),
        consultarConexionesOrigen: async () => origenes,
        probarConexionOrigen: vi.fn(async () => undefined),
        leerSecretoOrigen: vi.fn(async (_org, id) =>
          id === "origen-jdbc"
            ? "lector:CLAVE_SUPER_SECRETA"
            : "-----BEGIN OPENSSH PRIVATE KEY-----",
        ),
        obtenerConexionDestinoConSecreto: vi.fn(async () => ({
          id: "destino-pg",
          tipo: "postgres",
          nombre: "Destino demo",
          estado: "activo" as const,
          probadaEn: new Date(),
          mensajeError: null,
          config: {
            host: "db.internal",
            port: 5432,
            database: "demo",
            schema: "public",
            user: "writer",
          },
          secreto: { nombre: "POSTGRES_DESTINO_DEMO", valor: "clave-destino" },
        })),
        probarConexionDestino: vi.fn(async () => undefined),
      };
    }

    it("construye las cinco variables desde servidor", async () => {
      const resultado = await prepararParametrosPlantilla(depsModo1(), {
        modo: 1,
        organizacionId: "org-1",
        flujoId: "flujo-1",
        destinoId: "destino-pg",
      });

      expect(resultado).toMatchObject({
        modo: 1,
        Appid: "flujo-1",
        DFScript: script,
      });
      const params = resultado as ParametrosPlantillaModo1;
      expect(Object.keys(params).sort()).toEqual(
        [
          "Appid",
          "BaseDestinoJSON",
          "ConexionJSON",
          "DFScript",
          "SECRETOSJSON",
          "modo",
        ].sort(),
      );
      expect(JSON.parse(params.BaseDestinoJSON)).toEqual({
        tipo: "postgres",
        host: "db.internal",
        puerto: 5432,
        database: "demo",
        esquema: "public",
        secreto_nombre: "POSTGRES_DESTINO_DEMO",
      });
      expect(JSON.parse(params.SECRETOSJSON)).toEqual({
        JDBC_VENTAS: "lector:CLAVE_SUPER_SECRETA",
        SFTP_SALIDA_B64: Buffer.from(
          "-----BEGIN OPENSSH PRIVATE KEY-----",
          "utf8",
        ).toString("base64"),
        POSTGRES_DESTINO_DEMO: "writer:clave-destino",
      });
    });

    it("Modo 1 no requiere tablaId y vuelve a probar todas las conexiones", async () => {
      const deps = depsModo1();
      await expect(
        prepararParametrosPlantilla(deps, {
          modo: 1,
          organizacionId: "org-1",
          flujoId: "flujo-1",
          destinoId: "destino-pg",
        }),
      ).resolves.toMatchObject({ modo: 1 });
      expect(deps.probarConexionOrigen).toHaveBeenCalledTimes(2);
      expect(deps.probarConexionDestino).toHaveBeenCalledTimes(1);
    });

    it("no filtra secretos en errores cuando falta una conexión", async () => {
      const deps = depsModo1();
      deps.consultarConexionesOrigen = async () => [];
      try {
        await prepararParametrosPlantilla(deps, {
          modo: 1,
          organizacionId: "org-1",
          flujoId: "flujo-1",
          destinoId: "destino-pg",
        });
        throw new Error("debió fallar");
      } catch (error) {
        expect(error).toMatchObject({ codigo: "CONEXIONES_ORIGEN_FALTANTES" });
        expect(JSON.stringify(error)).not.toContain("CLAVE_SUPER_SECRETA");
        expect(JSON.stringify(error)).not.toContain(
          "BEGIN OPENSSH PRIVATE KEY",
        );
      }
    });
  });

  describe("modo 2", () => {
    it("genera ParametrosPlantillaModo2 con EsquemaTablaDestino y RutasSftpContenido", async () => {
      const scriptRes = {
        script: "STORE data INTO [lib://SFTP_Conexion/upload/archivo.csv];",
      };
      const qlik = crearMockPuertoQlik({
        obtenerScriptApp: async () => scriptRes,
      });

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
      const qlik = crearMockPuertoQlik({
        obtenerScriptApp: async () => scriptRes,
      });
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
      ).rejects.toMatchObject({
        codigo: "SFTP_NO_CONFIGURADO",
        estadoHttp: 422,
      });
    });

    it("lanza DESTINO_REQUERIDO_MODO_2 si falta destinoId", async () => {
      const qlik = crearMockPuertoQlik({});
      const consultarConexionesOrigen = crearMockConsultarConexionesOrigen([]);

      await expect(
        prepararParametrosPlantilla(
          { qlik, consultarConexionesOrigen },
          {
            modo: 2,
            organizacionId: "org-1",
            flujoId: "flujo-1",
            tablaId: "t",
            destinoId: undefined,
          },
        ),
      ).rejects.toMatchObject({
        codigo: "DESTINO_REQUERIDO_MODO_2",
        estadoHttp: 422,
      });
    });

    it("lanza TABLA_DESTINO_REQUERIDA si falta tablaId en modo 2", async () => {
      const qlik = crearMockPuertoQlik({});
      const consultarConexionesOrigen = crearMockConsultarConexionesOrigen([]);

      await expect(
        prepararParametrosPlantilla(
          { qlik, consultarConexionesOrigen },
          {
            modo: 2,
            organizacionId: "org-1",
            flujoId: "flujo-1",
            tablaId: undefined,
            destinoId: "dest-1",
          },
        ),
      ).rejects.toMatchObject({
        codigo: "TABLA_DESTINO_REQUERIDA",
        estadoHttp: 422,
      });
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
          {
            modo: 2,
            organizacionId: "org-1",
            flujoId: "flujo-1",
            tablaId: "t",
            destinoId: "dest-1",
          },
        ),
      ).rejects.toMatchObject({
        codigo: "DESTINO_NO_ENCONTRADO",
        estadoHttp: 404,
      });
    });

    it("lanza DESTINO_SIN_COLUMNAS si recurso no tiene columnas", async () => {
      const scriptRes = { script: "STORE x INTO [lib://SFTP//f.csv];" };
      const qlik = crearMockPuertoQlik({
        obtenerScriptApp: async () => scriptRes,
      });
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
      ).rejects.toMatchObject({
        codigo: "DESTINO_SIN_COLUMNAS",
        estadoHttp: 422,
      });
    });

    it("EjecucionId presente y no vacio en modo 2", async () => {
      const scriptRes = { script: "STORE x INTO [lib://SFTP//f.csv];" };
      const qlik = crearMockPuertoQlik({
        obtenerScriptApp: async () => scriptRes,
      });
      const consultarConexionesOrigen = crearMockConsultarConexionesOrigen([]);

      const deps = {
        qlik,
        consultarConexionesOrigen,
        consultarConexionDestino: crearMockConsultarConexionDestino({
          tipo: "postgres",
          config: {},
        }),
        crearCliente: crearMockCrearClienteDestino({
          obtenerRecurso: async () => ({
            id: "t",
            columnas: [{ nombre: "x" }],
          }),
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
