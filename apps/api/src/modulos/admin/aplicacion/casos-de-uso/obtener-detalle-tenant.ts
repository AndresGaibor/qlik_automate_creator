import { generarSlugOrganizacion } from "../../dominio/slug-organizacion.js";
import type {
  RepositorioAdministracion,
  UsuarioAdministrable,
} from "../puertos/repositorio-administracion.js";
export type UsuarioTenant = UsuarioAdministrable;
export interface DetalleTenant {
  id: string;
  nombre: string;
  slug: string;
  estado: string;
  creadoEn: string;
  usuarios: UsuarioTenant[];
}
export async function obtenerDetalleTenant(
  repositorio: RepositorioAdministracion,
  organizacionId: string,
): Promise<DetalleTenant | null> {
  const organizacion = await repositorio.obtenerOrganizacion(organizacionId);
  if (!organizacion) return null;
  return {
    id: organizacion.id,
    nombre: organizacion.nombre,
    slug: generarSlugOrganizacion(organizacion.nombre),
    estado: organizacion.estado,
    creadoEn: organizacion.creadoEn.toISOString(),
    usuarios: await repositorio.listarUsuarios(organizacionId),
  };
}
