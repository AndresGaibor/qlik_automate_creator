import { and, eq } from "drizzle-orm";
import { db } from "../../../../plataforma/persistencia/conexion.js";
import { membresiasOrganizacion } from "../../../../plataforma/persistencia/esquema.js";

export interface EliminarUsuarioResultado {
  eliminado: boolean;
}

export async function eliminarUsuario(
  organizacionId: string,
  usuarioId: string,
): Promise<EliminarUsuarioResultado> {
  const membresia = await db.query.membresiasOrganizacion.findFirst({
    where: and(
      eq(membresiasOrganizacion.organizacionId, organizacionId),
      eq(membresiasOrganizacion.usuarioId, usuarioId),
    ),
  });

  if (!membresia) {
    return { eliminado: false };
  }

  await db
    .delete(membresiasOrganizacion)
    .where(
      and(
        eq(membresiasOrganizacion.organizacionId, organizacionId),
        eq(membresiasOrganizacion.usuarioId, usuarioId),
      ),
    );

  return { eliminado: true };
}
