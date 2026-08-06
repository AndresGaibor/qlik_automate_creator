import { and, eq } from "drizzle-orm";
import type { ConexionDb } from "../../../plataforma/persistencia/conexion.js";
import {
  identidadesQlik,
  membresiasOrganizacion,
  organizaciones,
  tenantsQlik,
  usuarios,
} from "../../../plataforma/persistencia/esquema.js";
import type {
  SesionPublica,
  TenantSesionDisponible,
} from "../dominio/modelos.js";
import { resolverEsSuperadministrador } from "../dominio/superadministrador.js";
import { buscarSesionValida } from "./consulta-sesion-postgres.js";

export async function consultarSesionPublicaPostgres(
  db: ConexionDb,
  superadminMail: string | undefined,
  tokenSesion: string,
  listarTenantsDisponibles: (
    token: string,
  ) => Promise<TenantSesionDisponible[]>,
): Promise<SesionPublica | null> {
  const sesion = await buscarSesionValida(db, tokenSesion);
  if (!sesion) return null;
  const [usuario, identidad] = await Promise.all([
    db.query.usuarios.findFirst({
      where: eq(usuarios.id, sesion.usuarioId),
    }),
    db.query.identidadesQlik.findFirst({
      where: and(
        eq(identidadesQlik.usuarioId, sesion.usuarioId),
        eq(identidadesQlik.tenantQlikId, sesion.tenantQlikActivoId),
      ),
    }),
  ]);
  if (!identidad) return null;
  const tenant = await db.query.tenantsQlik.findFirst({
    where: eq(tenantsQlik.id, identidad.tenantQlikId),
  });
  if (!tenant) return null;

  const esSuperadmin = resolverEsSuperadministrador({
    persistido: Boolean(usuario?.esSuperadmin),
    correo: usuario?.correo,
    correosHeredados:
      superadminMail ??
      process.env.SUPERADMINMAIL ??
      process.env.SUPERADMIN_EMAIL,
  });
  let membresias: Array<{
    organizacionId: string;
    organizacionNombre: string;
    rol: "admin" | "usuario";
  }> = [];

  if (esSuperadmin) {
    const todasOrg = await db.query.organizaciones.findMany();
    membresias = todasOrg.map((org) => ({
      organizacionId: org.id,
      organizacionNombre: org.nombre,
      rol: "admin" as const,
    }));
  } else {
    const membresiasRaw = await db.query.membresiasOrganizacion.findMany({
      where: eq(membresiasOrganizacion.usuarioId, sesion.usuarioId),
    });
    for (const m of membresiasRaw) {
      const org = await db.query.organizaciones.findFirst({
        where: eq(organizaciones.id, m.organizacionId),
      });
      if (org) {
        const rolMap: Record<string, "admin" | "usuario"> = {
          administrador: "admin",
          admin: "admin",
          usuario: "usuario",
        };
        membresias.push({
          organizacionId: org.id,
          organizacionNombre: org.nombre,
          rol: rolMap[m.rol] ?? "usuario",
        });
      }
    }
  }

  const tenantsDisponibles = await listarTenantsDisponibles(tokenSesion);
  return {
    tenantHost: tenant.host,
    tenantActivoId: tenant.id,
    tenantsDisponibles,
    usuario: usuario
      ? {
          id: usuario.id,
          nombre: usuario.nombre,
          correo: usuario.correo,
          avatarUrl: usuario.avatarUrl,
        }
      : null,
    identidad: identidad
      ? {
          id: identidad.id,
          nombreQlik: identidad.nombreQlik,
          correoQlik: identidad.correoQlik,
        }
      : null,
    esSuperadmin,
    membresias,
  };
}
