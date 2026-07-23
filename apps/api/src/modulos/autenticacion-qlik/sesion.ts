import crypto from "node:crypto";
import { and, eq, isNull } from "drizzle-orm";
import { sql } from "drizzle-orm";
import type { Context } from "hono";
import { getCookie } from "hono/cookie";
import { db } from "../../infraestructura/base-datos/conexion.js";
import {
  identidadesQlik,
  sesionesUsuario,
  tenantsQlik,
} from "../../infraestructura/base-datos/esquema.js";

const SESION_COOKIE = "sesion_usuario";

export interface InfoSesion {
  sesionId: string;
  usuarioId: string;
  identidadQlikId: string;
  tenantId: string;
  tenantHost: string;
  organizacionId: string;
  tenantUuid: string;
}

/**
 * Obtiene el tenant desde la sesión del usuario.
 * Returns null si no hay sesión válida.
 */
export async function obtenerTenantDesdeSesion(
  c: Context,
): Promise<InfoSesion | null> {
  // Leer cookie real usando getCookie de hono/cookie
  const sesionToken = getCookie(c, SESION_COOKIE);

  if (!sesionToken) {
    return null;
  }

  const sesionHash = crypto
    .createHash("sha256")
    .update(sesionToken)
    .digest("hex");

  const sesion = await db.query.sesionesUsuario.findFirst({
    where: and(
      eq(sesionesUsuario.tokenSesionHash, sesionHash),
      sql`${sesionesUsuario.expiraEn} > NOW()`,
      isNull(sesionesUsuario.revocadaEn),
    ),
  });

  if (!sesion) {
    return null;
  }

  const identidad = await db.query.identidadesQlik.findFirst({
    where: eq(identidadesQlik.id, sesion.identidadQlikId),
  });

  if (!identidad) {
    return null;
  }

  const tenant = await db.query.tenantsQlik.findFirst({
    where: eq(tenantsQlik.id, identidad.tenantQlikId),
  });

  if (!tenant) {
    return null;
  }

  return {
    sesionId: sesion.id,
    usuarioId: sesion.usuarioId,
    identidadQlikId: identidad.id,
    tenantId: tenant.id,
    tenantHost: tenant.host,
    organizacionId: tenant.organizacionId,
    tenantUuid: tenant.id,
  };
}

/**
 * Middleware helper: verifica sesión y deriva tenant.
 * Si no hay sesión, responde con 401.
 */
export async function requerirSesionConTenant(c: Context) {
  const infoSesion = await obtenerTenantDesdeSesion(c);

  if (!infoSesion) {
    return {
      error: true,
      status: 401,
      json: { success: false, error: "Sesión requerida" },
    };
  }

  return {
    error: false,
    info: infoSesion,
  };
}
