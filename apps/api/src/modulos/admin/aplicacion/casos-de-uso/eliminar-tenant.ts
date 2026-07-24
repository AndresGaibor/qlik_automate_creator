import { eq } from "drizzle-orm";
import { db } from "../../../../plataforma/persistencia/conexion.js";
import { organizaciones } from "../../../../plataforma/persistencia/esquema.js";

export interface EliminarTenantResultado {
  eliminado: boolean;
}

export async function eliminarTenant(
  organizacionId: string,
): Promise<EliminarTenantResultado> {
  const org = await db.query.organizaciones.findFirst({
    where: eq(organizaciones.id, organizacionId),
  });

  if (!org) {
    return { eliminado: false };
  }

  await db.delete(organizaciones).where(eq(organizaciones.id, organizacionId));

  return { eliminado: true };
}
