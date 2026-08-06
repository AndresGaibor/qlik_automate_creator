type Usuario = { id: string; rol: "admin" | "usuario" };

function cantidadAdministradores(usuarios: Usuario[]) {
  return usuarios.filter((usuario) => usuario.rol === "admin").length;
}

export function puedeQuitarUsuario(usuario: Usuario, usuarios: Usuario[]) {
  return usuario.rol !== "admin" || cantidadAdministradores(usuarios) > 1;
}

export function puedeCambiarRolUsuario(
  usuario: Usuario,
  nuevoRol: "admin" | "usuario",
  usuarios: Usuario[],
) {
  if (usuario.rol === nuevoRol) return true;
  if (usuario.rol === "admin" && nuevoRol === "usuario") {
    return cantidadAdministradores(usuarios) > 1;
  }
  return true;
}
