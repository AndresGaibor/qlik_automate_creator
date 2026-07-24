import { generarSlugOrganizacion } from "../../dominio/slug-organizacion.js";
import type {
  EstadoOrganizacion,
  RepositorioAdministracion,
} from "../puertos/repositorio-administracion.js";

export interface ActualizarTenantEntrada {
  nombre?: string;
  estado?: EstadoOrganizacion;
}
export interface ActualizarTenantResultado {
  id: string;
  nombre: string;
  slug: string;
  estado: string;
  creadoEn: string;
}

export async function actualizarTenant(
  repositorio: RepositorioAdministracion,
  organizacionId: string,
  entrada: ActualizarTenantEntrada,
): Promise<ActualizarTenantResultado | null> {
  const organizacion = await repositorio.actualizarOrganizacion(
    organizacionId,
    entrada,
  );
  return organizacion
    ? {
        id: organizacion.id,
        nombre: organizacion.nombre,
        slug: generarSlugOrganizacion(organizacion.nombre),
        estado: organizacion.estado,
        creadoEn: organizacion.creadoEn.toISOString(),
      }
    : null;
}
