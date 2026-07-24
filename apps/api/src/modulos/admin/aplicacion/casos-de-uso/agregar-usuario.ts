import { and, eq } from "drizzle-orm";
import { db } from "../../../../plataforma/persistencia/conexion.js";
import {
  membresiasOrganizacion,
  organizaciones,
  usuarios,
} from "../../../../plataforma/persistencia/esquema.js";

export interface AgregarUsuarioEntrada {
  correo: string;
  rol: "admin" | "usuario";
}

export interface UsuarioAgregado {
  id: string;
  correo: string | null;
  nombre: string;
  rol: "admin" | "usuario";
}

export interface AgregarUsuarioResultado {
  usuario: UsuarioAgregado;
}

export async function agregarUsuario(
  organizacionId: string,
  entrada: AgregarUsuarioEntrada,
): Promise<AgregarUsuarioResultado | null> {
  const org = await db.query.organizaciones.findFirst({
    where: eq(organizaciones.id, organizacionId),
  });

  if (!org) return null;

  let usuario = await db.query.usuarios.findFirst({
    where: eq(usuarios.correo, entrada.correo),
  });

  if (!usuario) {
    const [usuarioCreado] = await db
      .insert(usuarios)
      .values({
        nombre: entrada.correo.split("@")[0],
        correo: entrada.correo,
        estado: "activo",
      })
      .returning();

    if (!usuarioCreado) {
      throw new Error("No se pudo crear el usuario");
    }
    usuario = usuarioCreado;
  }

  const membresiaExistente = await db.query.membresiasOrganizacion.findFirst({
    where: and(
      eq(membresiasOrganizacion.organizacionId, organizacionId),
      eq(membresiasOrganizacion.usuarioId, usuario.id),
    ),
  });

  if (membresiaExistente) {
    await db
      .update(membresiasOrganizacion)
      .set({ rol: entrada.rol })
      .where(
        and(
          eq(membresiasOrganizacion.organizacionId, organizacionId),
          eq(membresiasOrganizacion.usuarioId, usuario.id),
        ),
      );
  } else {
    await db.insert(membresiasOrganizacion).values({
      organizacionId,
      usuarioId: usuario.id,
      rol: entrada.rol,
    });
  }

  return {
    usuario: {
      id: usuario.id,
      correo: usuario.correo,
      nombre: usuario.nombre,
      rol: entrada.rol,
    },
  };
}
