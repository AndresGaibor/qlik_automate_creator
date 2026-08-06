import { and, eq } from "drizzle-orm";
import type { ConexionDb } from "../../../plataforma/persistencia/conexion.js";
import {
  credencialesQlik,
  identidadesQlik,
  sesionesUsuario,
  tenantsQlik,
} from "../../../plataforma/persistencia/esquema.js";
import { buscarSesionValida } from "./consulta-sesion-postgres.js";

export async function cambiarTenantActivoPostgres(
  db: ConexionDb,
  tokenSesion: string,
  tenantQlikId: string,
): Promise<boolean> {
  const sesion = await buscarSesionValida(db, tokenSesion);
  if (!sesion) return false;
  const identidad = await db.query.identidadesQlik.findFirst({
    where: and(
      eq(identidadesQlik.usuarioId, sesion.usuarioId),
      eq(identidadesQlik.tenantQlikId, tenantQlikId),
    ),
  });
  const tenant = await db.query.tenantsQlik.findFirst({
    where: and(
      eq(tenantsQlik.id, tenantQlikId),
      eq(tenantsQlik.estado, "activo"),
    ),
  });
  if (!identidad || !tenant) return false;
  const credencial = await db.query.credencialesQlik.findFirst({
    where: eq(credencialesQlik.identidadQlikId, identidad.id),
  });
  if (!credencial || credencial.estado !== "activa") return false;
  await db
    .update(sesionesUsuario)
    .set({
      tenantQlikActivoId: tenant.id,
      identidadQlikId: identidad.id,
    })
    .where(eq(sesionesUsuario.id, sesion.id));
  return true;
}
