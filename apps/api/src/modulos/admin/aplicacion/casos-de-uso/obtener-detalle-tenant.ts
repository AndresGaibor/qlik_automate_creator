import { eq } from "drizzle-orm";
import { db } from "../../../../plataforma/persistencia/conexion.js";
import {
  membresiasOrganizacion,
  organizaciones,
  usuarios,
} from "../../../../plataforma/persistencia/esquema.js";

function generarSlug(nombre: string): string {
  return nombre
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export interface UsuarioTenant {
  id: string;
  correo: string | null;
  nombre: string;
  rol: "admin" | "usuario";
}

export interface DetalleTenant {
  id: string;
  nombre: string;
  slug: string;
  estado: string;
  creadoEn: string;
  usuarios: UsuarioTenant[];
}

export async function obtenerDetalleTenant(
  organizacionId: string,
): Promise<DetalleTenant | null> {
  type OrgRow = {
    id: string;
    nombre: string;
    estado: string;
    creadoEn: Date;
  };

  const org = await db.query.organizaciones.findFirst({
    where: eq(organizaciones.id, organizacionId),
  });

  if (!org) return null;

  const orgData = org as OrgRow;

  const membresiasRaw = await db.query.membresiasOrganizacion.findMany({
    where: eq(membresiasOrganizacion.organizacionId, organizacionId),
  });

  const usuariosResultado: UsuarioTenant[] = [];

  for (const m of membresiasRaw) {
    const usuario = await db.query.usuarios.findFirst({
      where: eq(usuarios.id, m.usuarioId),
    });

    if (usuario) {
      const rolMap: Record<string, "admin" | "usuario"> = {
        administrador: "admin",
        admin: "admin",
        usuario: "usuario",
      };

      usuariosResultado.push({
        id: usuario.id,
        correo: usuario.correo,
        nombre: usuario.nombre,
        rol: rolMap[m.rol] ?? "usuario",
      });
    }
  }

  return {
    id: orgData.id,
    nombre: orgData.nombre,
    slug: generarSlug(orgData.nombre),
    estado: orgData.estado,
    creadoEn: orgData.creadoEn.toISOString(),
    usuarios: usuariosResultado,
  };
}
