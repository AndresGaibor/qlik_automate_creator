import { eq } from "drizzle-orm";
import { db } from "../../../../plataforma/persistencia/conexion.js";
import { organizaciones } from "../../../../plataforma/persistencia/esquema.js";

function generarSlug(nombre: string): string {
  return nombre
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export interface ActualizarTenantEntrada {
  nombre?: string;
  estado?: "activa" | "suspendida";
}

export interface ActualizarTenantResultado {
  id: string;
  nombre: string;
  slug: string;
  estado: string;
  creadoEn: string;
}

export async function actualizarTenant(
  organizacionId: string,
  entrada: ActualizarTenantEntrada,
): Promise<ActualizarTenantResultado | null> {
  type OrgRow = {
    id: string;
    nombre: string;
    estado: string;
    creadoEn: Date;
  };

  const orgExistente = await db.query.organizaciones.findFirst({
    where: eq(organizaciones.id, organizacionId),
  });

  if (!orgExistente) return null;

  const valoresActualizar: Partial<{ nombre: string; estado: string }> = {};
  if (entrada.nombre !== undefined) {
    valoresActualizar.nombre = entrada.nombre;
  }
  if (entrada.estado !== undefined) {
    valoresActualizar.estado = entrada.estado;
  }

  if (Object.keys(valoresActualizar).length > 0) {
    await db
      .update(organizaciones)
      .set(valoresActualizar)
      .where(eq(organizaciones.id, organizacionId));
  }

  const orgActualizado = (await db.query.organizaciones.findFirst({
    where: eq(organizaciones.id, organizacionId),
  })) as OrgRow;

  return {
    id: orgActualizado.id,
    nombre: orgActualizado.nombre,
    slug: generarSlug(orgActualizado.nombre),
    estado: orgActualizado.estado,
    creadoEn: orgActualizado.creadoEn.toISOString(),
  };
}
