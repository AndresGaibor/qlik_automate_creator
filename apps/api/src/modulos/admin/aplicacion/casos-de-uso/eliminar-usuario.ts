import type { RepositorioAdministracion } from "../puertos/repositorio-administracion.js";
export interface EliminarUsuarioResultado {
  eliminado: boolean;
}
export async function eliminarUsuario(
  repositorio: RepositorioAdministracion,
  organizacionId: string,
  usuarioId: string,
): Promise<EliminarUsuarioResultado> {
  return {
    eliminado: await repositorio.eliminarUsuario(organizacionId, usuarioId),
  };
}
