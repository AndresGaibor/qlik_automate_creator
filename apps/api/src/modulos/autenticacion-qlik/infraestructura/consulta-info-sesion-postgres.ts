import { eq } from "drizzle-orm";
import type { ConexionDb } from "../../../plataforma/persistencia/conexion.js";
import {
  identidadesQlik,
  tenantsQlik,
} from "../../../plataforma/persistencia/esquema.js";
import type { InfoSesion } from "../dominio/modelos.js";
import { buscarSesionValida } from "./consulta-sesion-postgres.js";

export async function obtenerInfoSesionPostgres(
  db: ConexionDb,
  tokenSesion: string,
): Promise<InfoSesion | null> {
  const sesion = await buscarSesionValida(db, tokenSesion);
  if (!sesion) return null;
  const identidad = await db.query.identidadesQlik.findFirst({
    where: eq(identidadesQlik.id, sesion.identidadQlikId),
  });
  if (!identidad || identidad.tenantQlikId !== sesion.tenantQlikActivoId) {
    return null;
  }
  const tenant = await db.query.tenantsQlik.findFirst({
    where: eq(tenantsQlik.id, identidad.tenantQlikId),
  });
  if (!tenant) return null;
  return {
    sesionId: sesion.id,
    usuarioId: sesion.usuarioId,
    identidadQlikId: identidad.id,
    tenantId: tenant.id,
    tenantHost: tenant.host,
    organizacionId: tenant.organizacionId,
  };
}
