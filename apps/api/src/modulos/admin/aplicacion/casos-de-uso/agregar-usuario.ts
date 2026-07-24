import type {
  RepositorioAdministracion,
  RolAdministracion,
  UsuarioAdministrable,
} from "../puertos/repositorio-administracion.js";
export interface AgregarUsuarioEntrada {
  correo: string;
  rol: RolAdministracion;
}
export type UsuarioAgregado = UsuarioAdministrable;
export interface AgregarUsuarioResultado {
  usuario: UsuarioAgregado;
}
export async function agregarUsuario(
  repositorio: RepositorioAdministracion,
  organizacionId: string,
  entrada: AgregarUsuarioEntrada,
): Promise<AgregarUsuarioResultado | null> {
  const usuario = await repositorio.agregarUsuario(
    organizacionId,
    entrada.correo,
    entrada.rol,
  );
  return usuario ? { usuario } : null;
}
