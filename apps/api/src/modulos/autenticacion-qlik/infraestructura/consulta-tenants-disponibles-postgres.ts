import { and, eq } from "drizzle-orm";
import type { ConexionDb } from "../../../plataforma/persistencia/conexion.js";
import {
  identidadesQlik,
  organizaciones,
  tenantsQlik,
} from "../../../plataforma/persistencia/esquema.js";
import type { TenantSesionDisponible } from "../dominio/modelos.js";
import { buscarSesionValida } from "./consulta-sesion-postgres.js";

export async function listarTenantsDisponiblesPostgres(
  db: ConexionDb,
  tokenSesion: string,
): Promise<TenantSesionDisponible[]> {
  const sesion = await buscarSesionValida(db, tokenSesion);
  if (!sesion) return [];
  const identidades = await db.query.identidadesQlik.findMany({
    where: eq(identidadesQlik.usuarioId, sesion.usuarioId),
  });
  const resultado = new Map<
    string,
    {
      id: string;
      host: string;
      nombre: string | null;
      organizacionId: string;
      organizacionNombre: string;
      esPrincipal: boolean;
    }
  >();
  for (const identidad of identidades) {
    const tenant = await db.query.tenantsQlik.findFirst({
      where: and(
        eq(tenantsQlik.id, identidad.tenantQlikId),
        eq(tenantsQlik.estado, "activo"),
      ),
    });
    if (!tenant) continue;
    const organizacion = await db.query.organizaciones.findFirst({
      where: eq(organizaciones.id, tenant.organizacionId),
    });
    if (!organizacion || organizacion.estado !== "activa") continue;
    resultado.set(tenant.id, {
      id: tenant.id,
      host: tenant.host,
      nombre: tenant.nombre,
      organizacionId: organizacion.id,
      organizacionNombre: organizacion.nombre,
      esPrincipal: tenant.esPrincipal,
    });
  }
  return Array.from(resultado.values());
}
