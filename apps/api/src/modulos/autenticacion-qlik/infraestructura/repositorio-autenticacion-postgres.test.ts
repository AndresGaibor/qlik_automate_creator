import { describe, expect, it } from "bun:test";
import type { ConexionDb } from "../../../plataforma/persistencia/conexion.js";
import { RepositorioAutenticacionPostgres } from "./repositorio-autenticacion-postgres.js";

const cifradoFalso = {
  cifrar: () => ({ cifrado: "x", iv: "x", tag: "x" }),
  descifrar: () => "token",
};

function columnasEnWhere(where: unknown): string[] {
  const resultado: string[] = [];
  const visitar = (nodo: unknown) => {
    if (!nodo || typeof nodo !== "object") return;
    const obj = nodo as Record<string, unknown>;
    if (typeof obj.name === "string" && typeof obj.dataType === "string") {
      resultado.push(obj.name);
    }
    const chunks = obj.queryChunks;
    if (Array.isArray(chunks)) for (const c of chunks) visitar(c);
  };
  visitar(where);
  return resultado;
}

describe("obtenerInfoSesion — identidad exacta de sesión", () => {
  it("devuelve InfoSesion cuando la identidad de la sesión es vigente", async () => {
    const sesion = {
      id: "sesion-id",
      usuarioId: "usuario-1",
      identidadQlikId: "identidad-vigente",
      tenantQlikActivoId: "tenant-1",
    };
    const identidadAnterior = {
      id: "identidad-anterior",
      usuarioId: "usuario-1",
      tenantQlikId: "tenant-1",
    };
    const identidadVigente = {
      id: "identidad-vigente",
      usuarioId: "usuario-1",
      tenantQlikId: "tenant-1",
    };
    const tenant = {
      id: "tenant-1",
      host: "empresa.qlikcloud.com",
      organizacionId: "org-1",
    };

    const db = {
      query: {
        sesionesUsuario: { findFirst: async () => sesion },
        identidadesQlik: {
          findFirst: async (query: { where: unknown }) => {
            const cols = columnasEnWhere(query.where);
            if (cols.includes("id")) return identidadVigente;
            return identidadAnterior;
          },
        },
        tenantsQlik: { findFirst: async () => tenant },
      },
    } as unknown as ConexionDb;
    const repositorio = new RepositorioAutenticacionPostgres(db, cifradoFalso);

    const info = await repositorio.obtenerInfoSesion("token-sesion");

    expect(info).toMatchObject({
      identidadQlikId: "identidad-vigente",
      tenantId: "tenant-1",
      tenantHost: "empresa.qlikcloud.com",
      organizacionId: "org-1",
    });
  });

  it("devuelve null cuando la identidad tiene un tenant distinto al activo de la sesión", async () => {
    const sesion = {
      id: "sesion-id",
      usuarioId: "usuario-1",
      identidadQlikId: "identidad-mal",
      tenantQlikActivoId: "tenant-1",
    };
    const identidadMal = {
      id: "identidad-mal",
      usuarioId: "usuario-1",
      tenantQlikId: "tenant-distinto",
    };

    const db = {
      query: {
        sesionesUsuario: { findFirst: async () => sesion },
        identidadesQlik: {
          findFirst: async () => identidadMal,
        },
        tenantsQlik: { findFirst: async () => null },
      },
    } as unknown as ConexionDb;
    const repositorio = new RepositorioAutenticacionPostgres(db, cifradoFalso);

    const info = await repositorio.obtenerInfoSesion("token-sesion");

    expect(info).toBeNull();
  });
});
