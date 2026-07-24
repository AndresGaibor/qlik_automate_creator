import type {
  RepositorioAdministracion,
  RolAdministracion,
  UsuarioAdministrable,
} from "../puertos/repositorio-administracion.js";
export interface ActualizarUsuarioEntrada {
  rol: RolAdministracion;
}
export type UsuarioActualizado = UsuarioAdministrable;
export interface ActualizarUsuarioResultado {
  usuario: UsuarioActualizado;
}
export async function actualizarUsuario(
  repositorio: RepositorioAdministracion,
  organizacionId: string,
  usuarioId: string,
  entrada: ActualizarUsuarioEntrada,
): Promise<ActualizarUsuarioResultado | null> {
  const usuario = await repositorio.actualizarRolUsuario(
    organizacionId,
    usuarioId,
    entrada.rol,
  );
  return usuario ? { usuario } : null;
}
