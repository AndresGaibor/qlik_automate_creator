import { and, eq } from "drizzle-orm";
import { db } from "../../../../plataforma/persistencia/conexion.js";
import {
  membresiasOrganizacion,
  usuarios,
} from "../../../../plataforma/persistencia/esquema.js";

export interface ActualizarUsuarioEntrada {
  rol: "admin" | "usuario";
}

export interface UsuarioActualizado {
  id: string;
  correo: string | null;
  nombre: string;
  rol: "admin" | "usuario";
}

export interface ActualizarUsuarioResultado {
  usuario: UsuarioActualizado;
}

export async function actualizarUsuario(
  organizacionId: string,
  usuarioId: string,
  entrada: ActualizarUsuarioEntrada,
): Promise<ActualizarUsuarioResultado | null> {
  const membresia = await db.query.membresiasOrganizacion.findFirst({
    where: and(
      eq(membresiasOrganizacion.organizacionId, organizacionId),
      eq(membresiasOrganizacion.usuarioId, usuarioId),
    ),
  });

  if (!membresia) return null;

  await db
    .update(membresiasOrganizacion)
    .set({ rol: entrada.rol })
    .where(
      and(
        eq(membresiasOrganizacion.organizacionId, organizacionId),
        eq(membresiasOrganizacion.usuarioId, usuarioId),
      ),
    );

  const usuario = await db.query.usuarios.findFirst({
    where: eq(usuarios.id, usuarioId),
  });

  if (!usuario) return null;

  return {
    usuario: {
      id: usuario.id,
      correo: usuario.correo,
      nombre: usuario.nombre,
      rol: entrada.rol,
    },
  };
}
