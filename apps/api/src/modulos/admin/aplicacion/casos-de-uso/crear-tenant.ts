import { generarSlugOrganizacion } from "../../dominio/slug-organizacion.js";
import type { RepositorioAdministracion } from "../puertos/repositorio-administracion.js";

export interface CrearTenantEntrada {
  nombre: string;
}
export interface CrearTenantResultado {
  id: string;
  nombre: string;
  slug: string;
  estado: string;
  creadoEn: string;
}

export async function crearTenant(
  repositorio: RepositorioAdministracion,
  entrada: CrearTenantEntrada,
): Promise<CrearTenantResultado> {
  const organizacion = await repositorio.crearOrganizacion(entrada.nombre);
  return {
    id: organizacion.id,
    nombre: organizacion.nombre,
    slug: generarSlugOrganizacion(organizacion.nombre),
    estado: organizacion.estado,
    creadoEn: organizacion.creadoEn.toISOString(),
  };
}
