import { eq } from "drizzle-orm";
import { db } from "../../../../plataforma/persistencia/conexion.js";
import { organizaciones } from "../../../../plataforma/persistencia/esquema.js";

export interface CrearTenantEntrada {
  nombre: string;
}

export interface CrearTenantResultado {
  id: string;
  nombre: string;
  slug: string;
  estado: string;
  creadoEn: string;
}

function generarSlug(nombre: string): string {
  return nombre
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function crearTenant(
  entrada: CrearTenantEntrada,
): Promise<CrearTenantResultado> {
  const slug = generarSlug(entrada.nombre);

  const [organizacion] = await db
    .insert(organizaciones)
    .values({
      nombre: entrada.nombre,
      estado: "activa",
    })
    .returning();

  if (!organizacion) {
    throw new Error("No se pudo crear la organización");
  }

  return {
    id: organizacion.id,
    nombre: organizacion.nombre,
    slug,
    estado: organizacion.estado as string,
    creadoEn: new Date().toISOString(),
  };
}
