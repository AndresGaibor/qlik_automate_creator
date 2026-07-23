import { sql } from "drizzle-orm";
import { Hono, type Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { db } from "../../infraestructura/base-datos/conexion.js";
import {
  ClienteQlik,
  QlikApiError,
} from "../../infraestructura/qlik/cliente.js";
import { obtenerCredencialesQlik } from "../autenticacion-qlik/credenciales.js";
import { obtenerTenantDesdeSesion } from "../autenticacion-qlik/sesion.js";
import type { AutomatizacionQlik } from "../../infraestructura/qlik/tipos.js";
import { aDetalle, aResumen, mapaEspacios } from "./mapeador.js";

export const qlikAutomatizacionesRouter = new Hono();

/**
 * Helper centralizado: resuelve sesión + credenciales + cliente Qlik.
 */
async function resolverCliente(c: Context) {
  const infoSesion = await obtenerTenantDesdeSesion(c);
  if (!infoSesion) {
    return { ok: false as const, status: 401 as const, error: "Sesión requerida" };
  }

  const credenciales = await obtenerCredencialesQlik(infoSesion);
  if (!credenciales) {
    return {
      ok: false as const,
      status: 401 as const,
      error: "Credenciales Qlik no disponibles",
    };
  }

  const cliente = new ClienteQlik(credenciales.host, credenciales.token);
  return { ok: true as const, cliente };
}

/**
 * Mapea errores de Qlik a respuestas HTTP útiles.
 * Preserva el status code de Qlik salvo 5xx que se mapea a 502.
 */
function mapearErrorQlik(c: Context, error: unknown) {
  if (error instanceof QlikApiError) {
    const mensajes: Record<number, string> = {
      401: "Token de autenticación de Qlik inválido o expirado.",
      403: "Permisos insuficientes en Qlik.",
      404: "Recurso no encontrado en Qlik.",
    };
    const status =
      (error.statusCode >= 500 ? 502 : error.statusCode) as ContentfulStatusCode;
    return c.json(
      {
        success: false,
        error: mensajes[error.statusCode] ?? error.message,
        qlikStatus: error.statusCode,
      },
      status,
    );
  }
  return c.json(
    {
      success: false,
      error: "Error interno del servidor",
    },
    500,
  );
}

/**
 * Resuelve userId → nombre usando la API de Qlik.
 * Deduplica IDs y usa Promise.allSettled para que fallos parciales no rompan la lista.
 * Devuelve un mapa de userId → nombre resuelto.
 */
async function resolverMapaUsuarios(
  cliente: ClienteQlik,
  automatizaciones: AutomatizacionQlik[],
): Promise<Map<string, string>> {
  const ownerIds = [
    ...new Set(
      automatizaciones
        .map((a) => a.ownerId)
        .filter((id): id is string => !!id),
    ),
  ];

  if (ownerIds.length === 0) return new Map();

  const resultados = await Promise.allSettled(
    ownerIds.map((id) => cliente.obtenerUsuario(id)),
  );

  const mapa = new Map<string, string>();
  for (let i = 0; i < ownerIds.length; i++) {
    const resultado = resultados[i];
    if (resultado.status === "fulfilled") {
      mapa.set(ownerIds[i], resultado.value.name);
    }
  }
  return mapa;
}

// ─── GET / ─────────────────────────────────────────────────────────────────

qlikAutomatizacionesRouter.get("/", async (c) => {
  const auth = await resolverCliente(c);
  if (!auth.ok) {
    return c.json({ success: false, error: auth.error }, auth.status);
  }

  try {
    const [espacios, automatizaciones] = await Promise.all([
      auth.cliente.listarEspacios(),
      auth.cliente.listarAutomatizaciones(),
    ]);

    const mapa = mapaEspacios(espacios);
    const mapaUsr = await resolverMapaUsuarios(
      auth.cliente,
      automatizaciones,
    );
    const data = automatizaciones.map((auto) =>
      aResumen(auto, mapa, mapaUsr),
    );

    return c.json({ success: true, data });
  } catch (error) {
    return mapearErrorQlik(c, error);
  }
});

// ─── GET /:id ──────────────────────────────────────────────────────────────

qlikAutomatizacionesRouter.get("/:id", async (c) => {
  const auth = await resolverCliente(c);
  if (!auth.ok) {
    return c.json({ success: false, error: auth.error }, auth.status);
  }

  const { id } = c.req.param();

  try {
    const [espacios, automatizacion, ejecuciones] = await Promise.all([
      auth.cliente.listarEspacios(),
      auth.cliente.obtenerAutomatizacion(id),
      auth.cliente.listarEjecuciones(id, { limit: 20, sort: "desc" }),
    ]);

    const mapa = mapaEspacios(espacios);
    const mapaUsr = await resolverMapaUsuarios(auth.cliente, [automatizacion]);
    const data = aDetalle(automatizacion, ejecuciones, mapa, mapaUsr);

    return c.json({ success: true, data });
  } catch (error) {
    return mapearErrorQlik(c, error);
  }
});

// ─── GET /:id/runs ─────────────────────────────────────────────────────────

qlikAutomatizacionesRouter.get("/:id/runs", async (c) => {
  const auth = await resolverCliente(c);
  if (!auth.ok) {
    return c.json({ success: false, error: auth.error }, auth.status);
  }

  const { id } = c.req.param();

  try {
    const ejecuciones = await auth.cliente.listarEjecuciones(id);
    return c.json({ success: true, data: ejecuciones });
  } catch (error) {
    return mapearErrorQlik(c, error);
  }
});

// ─── POST /:id/run ─────────────────────────────────────────────────────────

qlikAutomatizacionesRouter.post("/:id/run", async (c) => {
  const auth = await resolverCliente(c);
  if (!auth.ok) {
    return c.json({ success: false, error: auth.error }, auth.status);
  }

  const { id } = c.req.param();
  const infoSesion = await obtenerTenantDesdeSesion(c);
  const claveLock = `${infoSesion?.tenantId ?? "unknown"}:${id}`;

  try {
    const resultado = await db.transaction(async (tx) => {
      // Intentar adquirir advisory lock distribuido (no bloqueante)
      const [fila] = await tx.execute(
        sql`SELECT pg_try_advisory_xact_lock(hashtext(${claveLock})) AS adquirido`,
      );

      if (!fila?.adquirido) {
        return { tipo: "lock_en_uso" as const };
      }

      // Verificar si hay ejecución activa dentro de la misma transacción
      const ejecuciones = await auth.cliente.listarEjecuciones(id, {
        limit: 1,
        sort: "desc",
      });
      const ultima = ejecuciones[0];

      if (ultima && esEstadoActivo(ultima.status)) {
        return {
          tipo: "ejecucion_activa" as const,
          status: ultima.status,
          runId: ultima.id,
        };
      }

      const ejecucion = await auth.cliente.ejecutarAutomatizacion(id);
      return { tipo: "exito" as const, ejecucion };
    });

    if (resultado.tipo === "lock_en_uso") {
      return c.json(
        {
          success: false,
          error: "Ya hay una ejecución en curso para esta automatización",
        },
        409,
      );
    }

    if (resultado.tipo === "ejecucion_activa") {
      return c.json(
        {
          success: false,
          error: `La automatización ya está en ejecución (estado: ${resultado.status})`,
          runIdActivo: resultado.runId,
        },
        409,
      );
    }

    return c.json({ success: true, data: resultado.ejecucion });
  } catch (error) {
    return mapearErrorQlik(c, error);
  }
});

// ─── POST /:id/runs/:runId/stop ────────────────────────────────────────────

qlikAutomatizacionesRouter.post("/:id/runs/:runId/stop", async (c) => {
  const auth = await resolverCliente(c);
  if (!auth.ok) {
    return c.json({ success: false, error: auth.error }, auth.status);
  }

  const { id, runId } = c.req.param();

  try {
    await auth.cliente.detenerEjecucion(id, runId);
    return c.json({ success: true });
  } catch (error) {
    return mapearErrorQlik(c, error);
  }
});

// ─── Helpers ───────────────────────────────────────────────────────────────

const ESTADOS_ACTIVOS = new Set(["running", "queued", "pending", "started"]);

function esEstadoActivo(status: string): boolean {
  return ESTADOS_ACTIVOS.has(status);
}
