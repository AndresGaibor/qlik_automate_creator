import { describe, expect, it, vi } from "bun:test";
import { Hono } from "hono";
import type { Context } from "hono";
import type { PuertoAuditoria } from "../../../nucleo/auditoria/puerto-auditoria.js";
import { crearRutasConexionesOrigen } from "./rutas-conexiones-origen.js";

interface ConexionOral {
  id: string;
  organizacionId: string;
  tipo: string;
  nombre: string;
  config: Record<string, unknown>;
  creadoEn: Date;
  actualizadoEn: Date;
}

interface SecretoOral {
  conexionOrigenId: string;
  nombre: string;
  valorCifrado: string;
  creadoEn: Date;
  actualizadoEn: Date;
}

function crearCifradorFake() {
  return {
    cifrar(valor: string) {
      return { cifrado: `enc:${valor}`, iv: "iv", tag: "tag" };
    },
    descifrar(_cifrado: string, _iv: string, _tag: string) {
      return "usuario:clave";
    },
  };
}

function crearQueryMock(conexiones: Map<string, ConexionOral>, secretos: Map<string, SecretoOral>) {
  return {
    conexionesOrigen: {
      findMany: async () => Array.from(conexiones.values()),
      findFirst: async () => Array.from(conexiones.values())[0] || null,
    },
    secretosConexionOrigen: {
      findFirst: async () => Array.from(secretos.values())[0] || null,
    },
  };
}

function crearDbFake() {
  const conexiones: Map<string, ConexionOral> = new Map();
  const secretos: Map<string, SecretoOral> = new Map();

  const dbFake = {
    query: crearQueryMock(conexiones, secretos),
    insert: () => ({
      values: () => ({
        returning: async () => {
          const id = crypto.randomUUID();
          const conn: ConexionOral = {
            id,
            organizacionId: "org-1",
            tipo: "jdbc",
            nombre: "Test",
            config: {},
            creadoEn: new Date(),
            actualizadoEn: new Date(),
          };
          conexiones.set(id, conn);
          return [conn];
        },
        onConflictDoUpdate: async () => [],
      }),
    }),
    update: () => ({
      set: () => ({
        where: () => ({
          returning: async () => {
            const updated: ConexionOral = {
              id: "conn-1",
              organizacionId: "org-1",
              tipo: "jdbc",
              nombre: "Test",
              config: {},
              creadoEn: new Date(),
              actualizadoEn: new Date(),
            };
            conexiones.set("conn-1", updated);
            return [updated];
          },
        }),
      }),
    }),
    delete: () => ({
      where: () => ({
        returning: async () => [{ id: "conn-1" }],
      }),
    }),
    select: () => ({
      from: () => ({
        where: () => [],
      }),
    }),
  };

  return { dbFake, conexiones, secretos };
}

function crearAppPrueba(
  dbFake: ReturnType<typeof crearDbFake>["dbFake"],
  cifrador: ReturnType<typeof crearCifradorFake>,
  auditoriaFake: PuertoAuditoria,
  resolverSesion: (c: Context) => Promise<{ organizacionId: string; usuarioId?: string }>,
  resolverContextoAdmin: (c: Context) => Promise<{ esSuperadmin: boolean; usuarioId: string; membresias: Array<{ organizacionId: string; organizacionNombre: string; rol: "admin" | "usuario" }> }>,
) {
  const app = new Hono();
  app.route(
    "/api/conexiones-origen",
    crearRutasConexionesOrigen({
      resolverSesion,
      db: dbFake as never,
      servicioCifrado: cifrador,
      auditoria: auditoriaFake,
      resolverContextoAdmin,
    }),
  );
  return app;
}

describe("rutas-conexiones-origen · secretos", () => {
  it("GET / lista no incluye campo secretoValor en config JDBC", async () => {
    const cifrador = crearCifradorFake();
    const { dbFake, conexiones } = crearDbFake();

    conexiones.set("conn-jdbc", {
      id: "conn-jdbc",
      organizacionId: "org-1",
      tipo: "jdbc",
      nombre: "Bancolombia:Postgres",
      config: {
        url: "jdbc:postgresql://localhost:5432/bancolombia",
        driver: "org.postgresql.Driver",
        secreto_nombre: "JDBC_POSTGRES_BANCO",
        propiedades: {},
        secretoValor: "usuario:clave",
      },
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    });

    const auditoriaFake: PuertoAuditoria = { registrar: vi.fn(async () => undefined) };
    const resolverSesion = async () => ({ organizacionId: "org-1", usuarioId: "user-1" });
    const resolverContextoAdmin = async () => ({ esSuperadmin: true, usuarioId: "user-1", membresias: [{ organizacionId: "org-1", organizacionNombre: "Empresa", rol: "admin" as const }] });

    const app = crearAppPrueba(dbFake, cifrador, auditoriaFake, resolverSesion, resolverContextoAdmin);
    const respuesta = await app.request("/api/conexiones-origen");
    expect(respuesta.status).toBe(200);
    const listado = await respuesta.json();

    expect(listado.datos[0].config).not.toHaveProperty("secretoValor");
    expect(JSON.stringify(listado)).not.toContain("usuario:clave");
  });

  it("GET / lista no incluye campo secretoClavePrivadaValor en config SFTP", async () => {
    const cifrador = crearCifradorFake();
    const { dbFake, conexiones } = crearDbFake();

    conexiones.set("conn-sftp", {
      id: "conn-sftp",
      organizacionId: "org-1",
      tipo: "sftp",
      nombre: "Bancolombia:SFTP",
      config: {
        host: "sftp.bancolombia.test",
        puerto: 22,
        usuario: "sftpqlik",
        secreto_clave_privada_nombre: "SFTP_PRIVATE_KEY_B64",
        ruta_base: "/upload",
        secretoClavePrivadaValor: "LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0t...",
      },
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    });

    const auditoriaFake: PuertoAuditoria = { registrar: vi.fn(async () => undefined) };
    const resolverSesion = async () => ({ organizacionId: "org-1", usuarioId: "user-1" });
    const resolverContextoAdmin = async () => ({ esSuperadmin: true, usuarioId: "user-1", membresias: [{ organizacionId: "org-1", organizacionNombre: "Empresa", rol: "admin" as const }] });

    const app = crearAppPrueba(dbFake, cifrador, auditoriaFake, resolverSesion, resolverContextoAdmin);
    const respuesta = await app.request("/api/conexiones-origen");
    expect(respuesta.status).toBe(200);
    const listado = await respuesta.json();

    expect(listado.datos[0].config).not.toHaveProperty("secretoClavePrivadaValor");
    expect(JSON.stringify(listado)).not.toContain("LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0t");
  });

  it("POST /api/conexiones-origen/contexto-secretos devuelve secretos descifrados para admin", async () => {
    const cifrador = crearCifradorFake();
    const { dbFake, conexiones, secretos } = crearDbFake();

    conexiones.set("conn-jdbc-2", {
      id: "conn-jdbc-2",
      organizacionId: "org-1",
      tipo: "jdbc",
      nombre: "Bancolombia:Postgres_BanColombia_Prueba",
      config: {
        url: "jdbc:postgresql://localhost:5432/bancolombia",
        driver: "org.postgresql.Driver",
        secreto_nombre: "JDBC_POSTGRES_BANCO",
        propiedades: {},
      },
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    });

    secretos.set("conn-jdbc-2:JDBC_POSTGRES_BANCO", {
      conexionOrigenId: "conn-jdbc-2",
      nombre: "JDBC_POSTGRES_BANCO",
      valorCifrado: JSON.stringify({ cifrado: "encrypted-user:pass", iv: "iv-abc", tag: "tag-xyz" }),
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    });

    const auditoriaFake: PuertoAuditoria = { registrar: vi.fn(async () => undefined) };
    const resolverSesion = async () => ({ organizacionId: "org-1", usuarioId: "user-1" });
    const resolverContextoAdmin = async () => ({ esSuperadmin: true, usuarioId: "user-1", membresias: [{ organizacionId: "org-1", organizacionNombre: "Empresa", rol: "admin" as const }] });

    const app = crearAppPrueba(dbFake, cifrador, auditoriaFake, resolverSesion, resolverContextoAdmin);
    const respuesta = await app.request("/api/conexiones-origen/contexto-secretos", { method: "POST" });
    expect(respuesta.status).toBe(200);
    const revelar = await respuesta.json();

    expect(revelar.datos).toHaveProperty("JDBC_POSTGRES_BANCO");
    expect(revelar.datos.JDBC_POSTGRES_BANCO).toBe("usuario:clave");
  });

  it("POST /api/conexiones-origen/contexto-secretos devuelve 403 para no-admin", async () => {
    const cifrador = crearCifradorFake();
    const { dbFake } = crearDbFake();

    const auditoriaFake: PuertoAuditoria = { registrar: vi.fn(async () => undefined) };
    const resolverSesion = async () => ({ organizacionId: "org-1", usuarioId: "user-1" });
    const resolverContextoAdmin = async () => ({ esSuperadmin: false, usuarioId: "user-1", membresias: [] as [] });

    const app = crearAppPrueba(dbFake, cifrador, auditoriaFake, resolverSesion, resolverContextoAdmin);
    const respuesta = await app.request("/api/conexiones-origen/contexto-secretos", { method: "POST" });

    expect(respuesta.status).toBe(403);
  });
});
