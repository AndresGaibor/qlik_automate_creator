import { and, eq, sql } from "drizzle-orm";
import {
  membresiasOrganizacion,
  organizaciones,
  tenantsQlik,
  usuarios,
} from "../../../plataforma/persistencia/esquema.js";
import type {
  ConexionDb,
  TenantQlikAutenticable,
} from "../aplicacion/puertos/repositorio-autenticacion.js";
import { resolverEsSuperadministrador } from "../dominio/superadministrador.js";
import { validarYNormalizarHost } from "../dominio/validador-host-qlik.js";

export async function obtenerTenantPorHost(
  db: ConexionDb,
  host: string,
): Promise<TenantQlikAutenticable | null> {
  const tenant = await db.query.tenantsQlik.findFirst({
    where: eq(tenantsQlik.host, validarYNormalizarHost(host)),
  });
  return tenant
    ? {
        id: tenant.id,
        host: tenant.host,
        estado: tenant.estado as "activo" | "desconectado" | "suspendido",
      }
    : null;
}

export async function obtenerTenantPorId(
  db: ConexionDb,
  id: string,
): Promise<TenantQlikAutenticable | null> {
  const tenant = await db.query.tenantsQlik.findFirst({
    where: eq(tenantsQlik.id, id),
  });
  return tenant
    ? {
        id: tenant.id,
        host: tenant.host,
        estado: tenant.estado as "activo" | "desconectado" | "suspendido",
      }
    : null;
}

export async function obtenerTenantPorCorreoUsuario(
  db: ConexionDb,
  correo: string,
  superadminMail?: string,
): Promise<TenantQlikAutenticable | null> {
  const correoNormalizado = correo.trim().toLowerCase();

  let superadminCorreos = superadminMail ?? "";
  if (!superadminCorreos) {
    try {
      const resultado = await db.execute(
        sql`SELECT valor FROM app_config WHERE clave = 'superadmin_email' LIMIT 1`,
      );
      const fila = resultado[0] as
        | { valor: Record<string, unknown> }
        | undefined;
      if (fila?.valor?.value) {
        superadminCorreos = String(fila.valor.value);
      }
    } catch {
      // app_config no existe todavía — ignorar
    }
  }

  const usuario = await db.query.usuarios.findFirst({
    where: eq(usuarios.correo, correoNormalizado),
  });

  let organizacionId: string | null = null;

  if (usuario) {
    const membresia = await db.query.membresiasOrganizacion.findFirst({
      where: eq(membresiasOrganizacion.usuarioId, usuario.id),
    });
    if (membresia) {
      organizacionId = membresia.organizacionId;
    }
  }

  if (organizacionId) {
    const org = await db.query.organizaciones.findFirst({
      where: eq(organizaciones.id, organizacionId),
    });

    if (org && org.estado === "activa") {
      const tenantObj = await db.query.tenantsQlik.findFirst({
        where: and(
          eq(tenantsQlik.organizacionId, organizacionId),
          eq(tenantsQlik.estado, "activo"),
        ),
      });
      if (tenantObj) {
        return {
          id: tenantObj.id,
          host: tenantObj.host,
          estado: tenantObj.estado as "activo" | "desconectado" | "suspendido",
        };
      }
    }
  }

  const esSuperadmin = resolverEsSuperadministrador({
    persistido: Boolean(usuario?.esSuperadmin),
    correo: correoNormalizado,
    correosHeredados:
      superadminMail ??
      process.env.SUPERADMINMAIL ??
      process.env.SUPERADMIN_EMAIL,
  });

  if (esSuperadmin) {
    const tenantPrincipal = await db.query.tenantsQlik.findFirst({
      where: eq(tenantsQlik.estado, "activo"),
    });
    if (tenantPrincipal) {
      return {
        id: tenantPrincipal.id,
        host: tenantPrincipal.host,
        estado: tenantPrincipal.estado as
          | "activo"
          | "desconectado"
          | "suspendido",
      };
    }
  }

  return null;
}
