import { generarSlugOrganizacion } from "../../dominio/slug-organizacion.js";
import type { RepositorioAdministracion } from "../puertos/repositorio-administracion.js";

export interface TenantResumen {
  id: string;
  nombre: string;
  slug: string;
  estado: string;
  cantidadUsuarios: number;
  creadoEn: string;
}

export async function listarTenants(
  repositorio: RepositorioAdministracion,
): Promise<TenantResumen[]> {
  const organizaciones = await repositorio.listarOrganizaciones();
  return organizaciones.map((organizacion) => ({
    id: organizacion.id,
    nombre: organizacion.nombre,
    slug: generarSlugOrganizacion(organizacion.nombre),
    estado: organizacion.estado,
    cantidadUsuarios: organizacion.cantidadUsuarios,
    creadoEn: organizacion.creadoEn.toISOString(),
  }));
}
