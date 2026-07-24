import type { RepositorioAdministracion } from "../puertos/repositorio-administracion.js";
export interface EliminarTenantResultado {
  eliminado: boolean;
}
export async function eliminarTenant(
  repositorio: RepositorioAdministracion,
  organizacionId: string,
): Promise<EliminarTenantResultado> {
  return { eliminado: await repositorio.eliminarOrganizacion(organizacionId) };
}
