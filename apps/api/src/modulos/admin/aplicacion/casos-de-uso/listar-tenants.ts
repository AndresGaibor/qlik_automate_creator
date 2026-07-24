import { count, eq } from "drizzle-orm";
import { db } from "../../../../plataforma/persistencia/conexion.js";
import {
  membresiasOrganizacion,
  organizaciones,
} from "../../../../plataforma/persistencia/esquema.js";

function generarSlug(nombre: string): string {
  return nombre
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export interface TenantResumen {
  id: string;
  nombre: string;
  slug: string;
  estado: string;
  cantidadUsuarios: number;
  creadoEn: string;
}

export async function listarTenants(): Promise<TenantResumen[]> {
  type OrgRow = {
    id: string;
    nombre: string;
    estado: string;
    creadoEn: Date;
  };

  const todasOrgRaw = await db.query.organizaciones.findMany();
  const todasOrg = todasOrgRaw as OrgRow[];

  const resultado: TenantResumen[] = [];

  for (const org of todasOrg) {
    const [{ count: cantidad }] = await db
      .select({ count: count() })
      .from(membresiasOrganizacion)
      .where(eq(membresiasOrganizacion.organizacionId, org.id));

    resultado.push({
      id: org.id,
      nombre: org.nombre,
      slug: generarSlug(org.nombre),
      estado: org.estado,
      cantidadUsuarios: Number(cantidad),
      creadoEn: org.creadoEn.toISOString(),
    });
  }

  return resultado;
}
