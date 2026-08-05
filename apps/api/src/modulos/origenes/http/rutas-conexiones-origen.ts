import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import {
  responderError,
  responderExito,
} from "../../../nucleo/http/respuestas.js";
import { db } from "../../../plataforma/persistencia/conexion.js";
import { conexionesOrigen } from "../../../plataforma/persistencia/esquema.js";

const esquemaConexionOrigen = z.discriminatedUnion("tipo", [
  z.object({
    tipo: z.literal("jdbc"),
    nombre: z.string().trim().min(1).max(255),
    config: z.object({
      url: z.string().trim().min(1),
      driver: z.string().trim().min(1),
      secreto_nombre: z.string().trim().min(1),
      propiedades: z.record(z.string()).default({}),
    }),
  }),
  z.object({
    tipo: z.literal("sftp"),
    nombre: z.string().trim().min(1).max(255),
    config: z.object({
      host: z.string().trim().min(1),
      puerto: z.number().int().min(1).max(65535).default(22),
      usuario: z.string().trim().min(1),
      secreto_clave_privada_nombre: z.string().trim().min(1),
      ruta_base: z.string().trim().min(1).default("/upload"),
    }),
  }),
]);

type ResolverSesion = (c: import("hono").Context) => Promise<{
  organizacionId: string;
}>;

export function crearRutasConexionesOrigen(resolverSesion: ResolverSesion) {
  const rutas = new Hono();

  rutas.get("/", async (c) => {
    const sesion = await resolverSesion(c);
    const conexiones = await db.query.conexionesOrigen.findMany({
      where: (tabla, { eq }) => eq(tabla.organizacionId, sesion.organizacionId),
      orderBy: (tabla, { asc }) => [asc(tabla.nombre)],
    });
    return responderExito(c, conexiones);
  });

  rutas.post("/", async (c) => {
    const sesion = await resolverSesion(c);
    const entrada = esquemaConexionOrigen.parse(await c.req.json());
    const existente = await db.query.conexionesOrigen.findFirst({
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
    const [conexion] = await db
      .insert(conexionesOrigen)
      .values({
        organizacionId: sesion.organizacionId,
        tipo: entrada.tipo,
        nombre: entrada.nombre,
        config: entrada.config,
      })
      .returning();
    return responderExito(c, conexion);
  });

  rutas.put("/:id", async (c) => {
    const sesion = await resolverSesion(c);
    const entrada = esquemaConexionOrigen.parse(await c.req.json());
    const existente = await db.query.conexionesOrigen.findFirst({
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
      const repetida = await db.query.conexionesOrigen.findFirst({
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
    const [actualizada] = await db
      .update(conexionesOrigen)
      .set({
        tipo: entrada.tipo,
        nombre: entrada.nombre,
        config: entrada.config,
        actualizadoEn: new Date(),
      })
      .where(
        and(
          eq(conexionesOrigen.id, existente.id),
          eq(conexionesOrigen.organizacionId, sesion.organizacionId),
        ),
      )
      .returning();
    return responderExito(c, actualizada);
  });

  rutas.delete("/:id", async (c) => {
    const sesion = await resolverSesion(c);
    const [eliminada] = await db
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

  return rutas;
}
