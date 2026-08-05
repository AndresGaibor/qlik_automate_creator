import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import {
  responderError,
  responderExito,
} from "../../../nucleo/http/respuestas.js";
import type { PuertoAuditoria } from "../../../nucleo/auditoria/puerto-auditoria.js";
import type { RegistroAuditoria } from "../../../nucleo/auditoria/registro-auditoria.js";
import { db } from "../../../plataforma/persistencia/conexion.js";
import { conexionesOrigen, secretosConexionOrigen } from "../../../plataforma/persistencia/esquema.js";
import type { ResolverContextoAdmin } from "../../admin/http/rutas-comunes.js";
import { servicioAdmin } from "../../admin/http/rutas-comunes.js";
import { cifrarSecretoParaPersistencia, descifrarSecretoPersistido, leerSecretoCifrado } from "../../../plataforma/seguridad/secreto-cifrado.js";

const esquemaConfigJdbc = z.object({
  url: z.string().trim().min(1),
  driver: z.string().trim().min(1),
  secreto_nombre: z.string().trim().min(1),
  propiedades: z.record(z.string()).default({}),
});

const esquemaConfigSftp = z.object({
  host: z.string().trim().min(1),
  puerto: z.number().int().min(1).max(65535).default(22),
  usuario: z.string().trim().min(1),
  secreto_clave_privada_nombre: z.string().trim().min(1),
  ruta_base: z.string().trim().min(1).default("/upload"),
});

const esquemaConexionOrigenEntrada = z.discriminatedUnion("tipo", [
  z.object({
    tipo: z.literal("jdbc"),
    nombre: z.string().trim().min(1).max(255),
    config: esquemaConfigJdbc.extend({
      secretoValor: z.string().max(2000).optional(),
    }),
  }),
  z.object({
    tipo: z.literal("sftp"),
    nombre: z.string().trim().min(1).max(255),
    config: esquemaConfigSftp.extend({
      secretoClavePrivadaValor: z.string().max(2000).optional(),
    }),
  }),
]);

type ResolverSesion = (c: import("hono").Context) => Promise<{
  organizacionId: string;
  usuarioId?: string;
}>;

export interface DepsRutasConexionesOrigen {
  resolverSesion: ResolverSesion;
  db?: typeof import("../../../plataforma/persistencia/conexion.js").db;
  servicioCifrado: {
    cifrar(valor: string): { cifrado: string; iv: string; tag: string };
    descifrar(cifrado: string, iv: string, tag: string): string;
  };
  auditoria: PuertoAuditoria;
  resolverContextoAdmin: ResolverContextoAdmin;
}

function estadosConexion(origenId: string) {
  return db.select().from(secretosConexionOrigen).where(eq(secretosConexionOrigen.conexionOrigenId, origenId));
}

function omitirSecretos(config: Record<string, unknown>): Record<string, unknown> {
  const { secretoValor, secretoClavePrivadaValor, ...rest } = config as Record<string, unknown>;
  return rest;
}

export function crearRutasConexionesOrigen(deps: DepsRutasConexionesOrigen) {
  const { resolverSesion, db: dbLocal = db, servicioCifrado, auditoria, resolverContextoAdmin } = deps;

  const rutas = new Hono();

  rutas.get("/", async (c) => {
    const sesion = await resolverSesion(c);
    const conexiones = await dbLocal.query.conexionesOrigen.findMany({
      where: (tabla, { eq }) => eq(tabla.organizacionId, sesion.organizacionId),
      orderBy: (tabla, { asc }) => [asc(tabla.nombre)],
    });
    const sanitizadas = conexiones.map((conn) => ({
      ...conn,
      config: omitirSecretos(conn.config as Record<string, unknown>),
    }));
    return responderExito(c, sanitizadas);
  });

  rutas.post("/", async (c) => {
    const sesion = await resolverSesion(c);
    const entrada = esquemaConexionOrigenEntrada.parse(await c.req.json());

    const existente = await dbLocal.query.conexionesOrigen.findFirst({
      where: (tabla, { and, eq }) =>
        and(
          eq(tabla.organizacionId, sesion.organizacionId),
          eq(tabla.nombre, entrada.nombre),
        ),
    });
    if (existente) {
      return responderError(c, "Esta conexión ya está registrada", 409, {
        codigo: "CONEXION_EXISTENTE",
      });
    }

    const configSinSecreto = omitirSecretos(entrada.config as Record<string, unknown>);
    const [conexion] = await dbLocal
      .insert(conexionesOrigen)
      .values({
        organizacionId: sesion.organizacionId,
        tipo: entrada.tipo,
        nombre: entrada.nombre,
        config: configSinSecreto,
      })
      .returning();

    const nombreSecreto = entrada.tipo === "jdbc"
      ? (entrada.config as { secreto_nombre: string }).secreto_nombre
      : (entrada.config as { secreto_clave_privada_nombre: string }).secreto_clave_privada_nombre;

    const valorSecreto = entrada.tipo === "jdbc"
      ? (entrada.config as { secretoValor?: string }).secretoValor
      : (entrada.config as { secretoClavePrivadaValor?: string }).secretoClavePrivadaValor;

    if (valorSecreto && nombreSecreto) {
      const cifrado = cifrarSecretoParaPersistencia(servicioCifrado, valorSecreto);
      await dbLocal
        .insert(secretosConexionOrigen)
        .values({
          conexionOrigenId: conexion.id,
          nombre: nombreSecreto,
          valorCifrado: cifrado,
        })
        .onConflictDoUpdate({
          target: [secretosConexionOrigen.conexionOrigenId, secretosConexionOrigen.nombre],
          set: { valorCifrado: cifrado, actualizadoEn: new Date() },
        });
    }

    return responderExito(c, { ...conexion, config: configSinSecreto });
  });

  rutas.put("/:id", async (c) => {
    const sesion = await resolverSesion(c);
    const entrada = esquemaConexionOrigenEntrada.parse(await c.req.json());
    const existente = await dbLocal.query.conexionesOrigen.findFirst({
      where: (tabla, { and, eq }) =>
        and(
          eq(tabla.id, c.req.param("id")),
          eq(tabla.organizacionId, sesion.organizacionId),
        ),
    });
    if (!existente) {
      return responderError(c, "Conexión no encontrada", 404, {
        codigo: "NO_ENCONTRADA",
      });
    }
    if (existente.nombre !== entrada.nombre) {
      const repetida = await dbLocal.query.conexionesOrigen.findFirst({
        where: (tabla, { and, eq }) =>
          and(
            eq(tabla.organizacionId, sesion.organizacionId),
            eq(tabla.nombre, entrada.nombre),
          ),
      });
      if (repetida) {
        return responderError(c, "Esta conexión ya está registrada", 409, {
          codigo: "CONEXION_EXISTENTE",
        });
      }
    }

    const configSinSecreto = omitirSecretos(entrada.config as Record<string, unknown>);
    const [actualizada] = await dbLocal
      .update(conexionesOrigen)
      .set({
        tipo: entrada.tipo,
        nombre: entrada.nombre,
        config: configSinSecreto,
        actualizadoEn: new Date(),
      })
      .where(
        and(
          eq(conexionesOrigen.id, existente.id),
          eq(conexionesOrigen.organizacionId, sesion.organizacionId),
        ),
      )
      .returning();

    const nombreSecreto = entrada.tipo === "jdbc"
      ? (entrada.config as { secreto_nombre: string }).secreto_nombre
      : (entrada.config as { secreto_clave_privada_nombre: string }).secreto_clave_privada_nombre;

    const valorSecreto = entrada.tipo === "jdbc"
      ? (entrada.config as { secretoValor?: string }).secretoValor
      : (entrada.config as { secretoClavePrivadaValor?: string }).secretoClavePrivadaValor;

    const secretosPrevios = await estadosConexion(existente.id);
    const nombresPrevios = new Set(secretosPrevios.map((s) => s.nombre));
    const nombresActuales = new Set([nombreSecreto]);

    for (const sec of secretosPrevios) {
      if (!nombresActuales.has(sec.nombre)) {
        await dbLocal
          .delete(secretosConexionOrigen)
          .where(
            and(
              eq(secretosConexionOrigen.conexionOrigenId, existente.id),
              eq(secretosConexionOrigen.nombre, sec.nombre),
            ),
          );
      }
    }

    if (valorSecreto && nombreSecreto) {
      const cifrado = cifrarSecretoParaPersistencia(servicioCifrado, valorSecreto);
      await dbLocal
        .insert(secretosConexionOrigen)
        .values({
          conexionOrigenId: existente.id,
          nombre: nombreSecreto,
          valorCifrado: cifrado,
        })
        .onConflictDoUpdate({
          target: [secretosConexionOrigen.conexionOrigenId, secretosConexionOrigen.nombre],
          set: { valorCifrado: cifrado, actualizadoEn: new Date() },
        });
    }

    return responderExito(c, { ...actualizada, config: configSinSecreto });
  });

  rutas.delete("/:id", async (c) => {
    const sesion = await resolverSesion(c);
    const [eliminada] = await dbLocal
      .delete(conexionesOrigen)
      .where(
        and(
          eq(conexionesOrigen.id, c.req.param("id")),
          eq(conexionesOrigen.organizacionId, sesion.organizacionId),
        ),
      )
      .returning({ id: conexionesOrigen.id });
    return responderExito(c, { eliminado: Boolean(eliminada) });
  });

  rutas.post("/contexto-secretos", async (c) => {
    const sesion = await resolverSesion(c);
    const contextoAdmin = await resolverContextoAdmin(c);

    if (!servicioAdmin.puedeAcceder(contextoAdmin, sesion.organizacionId)) {
      return responderError(c, "No tienes permisos para acceder a este tenant", 403, {
        codigo: "NO_AUTORIZADO",
      });
    }

    const conexiones = await dbLocal.query.conexionesOrigen.findMany({
      where: (tabla, { eq }) => eq(tabla.organizacionId, sesion.organizacionId),
    });

    const secretosMap: Record<string, string> = {};
    const nombresFaltantes: string[] = [];

    for (const conn of conexiones) {
      const config = conn.config as Record<string, unknown>;
      const nombreSecreto = conn.tipo === "jdbc"
        ? (config.secreto_nombre as string)
        : (config.secreto_clave_privada_nombre as string);

      if (!nombreSecreto) continue;

      const secretos = await dbLocal.query.secretosConexionOrigen.findFirst({
        where: (tabla, { and, eq }) =>
          and(
            eq(tabla.conexionOrigenId, conn.id),
            eq(tabla.nombre, nombreSecreto),
          ),
      });

      if (!secretos) {
        if (!nombresFaltantes.includes(nombreSecreto)) {
          nombresFaltantes.push(nombreSecreto);
        }
        continue;
      }

      try {
        const descifrado = leerSecretoCifrado(servicioCifrado, secretos.valorCifrado);
        if (descifrado !== undefined) {
          secretosMap[nombreSecreto] = descifrado;
        }
      } catch {
        secretosMap[nombreSecreto] = "";
      }
    }

    if (nombresFaltantes.length > 0) {
      return responderError(c, "Secretos no encontrados en el sistema", 422, {
        codigo: "SECRETOS_FALTANTES",
        detalles: { nombres: nombresFaltantes },
      });
    }

    await auditoria.registrar({
      organizacionId: sesion.organizacionId,
      usuarioId: sesion.usuarioId,
      accion: "conexion-origen.revelar-contexto-secretos",
      entidadTipo: "conexion_origen",
      resultado: "exito",
    } satisfies RegistroAuditoria);

    return responderExito(c, secretosMap);
  });

  return rutas;
}
