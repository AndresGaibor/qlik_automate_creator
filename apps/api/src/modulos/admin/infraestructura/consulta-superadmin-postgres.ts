import { eq } from "drizzle-orm";
import type { ConexionDb } from "../../../plataforma/persistencia/conexion.js";
import { usuarios } from "../../../plataforma/persistencia/esquema.js";
import type {
  ResultadoEliminarSuperadmin,
  SuperadminAdministrable,
} from "../aplicacion/puertos/repositorio-administracion.js";

interface FilaSuperadmin {
  id: string;
  nombre: string;
  correo: string | null;
  estado: string;
  esSuperadmin: boolean;
  creadoEn: Date;
}

export function mapearSuperadmin(
  fila: FilaSuperadmin,
): SuperadminAdministrable {
  return {
    id: fila.id,
    nombre: fila.nombre,
    correo: fila.correo,
    estado: fila.estado as "activo" | "suspendido",
    esSuperadmin: fila.esSuperadmin,
    creadoEn: fila.creadoEn,
  };
}

export const ConsultaSuperadmin = {
  async listarSuperadmins(db: ConexionDb): Promise<SuperadminAdministrable[]> {
    const filas = await db.query.usuarios.findMany({
      where: eq(usuarios.esSuperadmin, true),
    });
    return filas.map(mapearSuperadmin);
  },

  async agregarSuperadmin(
    db: ConexionDb,
    entrada: { nombre: string; correo: string },
  ): Promise<SuperadminAdministrable | null> {
    const correo = entrada.correo.toLowerCase();
    const existente = await db.query.usuarios.findFirst({
      where: eq(usuarios.correo, correo),
    });

    if (existente) {
      if (existente.esSuperadmin) {
        throw new Error("Ya existe un superadministrador con este correo");
      }
      const [actualizado] = await db
        .update(usuarios)
        .set({
          nombre: entrada.nombre,
          estado: "activo",
          esSuperadmin: true,
          actualizadoEn: new Date(),
        })
        .where(eq(usuarios.id, existente.id))
        .returning();
      return actualizado ? mapearSuperadmin(actualizado) : null;
    }

    const [nuevo] = await db
      .insert(usuarios)
      .values({
        nombre: entrada.nombre,
        correo,
        estado: "activo",
        esSuperadmin: true,
      })
      .returning();
    return nuevo ? mapearSuperadmin(nuevo) : null;
  },

  async eliminarSuperadmin(
    db: ConexionDb,
    id: string,
  ): Promise<ResultadoEliminarSuperadmin> {
    const superadmin = await db.query.usuarios.findFirst({
      where: eq(usuarios.id, id),
    });
    if (!superadmin) {
      return {
        exito: false,
        mensaje: "Superadministrador no encontrado",
        codigo: "NO_ENCONTRADO",
      };
    }
    if (!superadmin.esSuperadmin) {
      return {
        exito: false,
        mensaje: "El usuario no es un superadministrador",
        codigo: "NO_ES_SUPERADMIN",
      };
    }

    const todos = await db.query.usuarios.findMany({
      where: eq(usuarios.esSuperadmin, true),
    });
    if (todos.length <= 1) {
      return {
        exito: false,
        mensaje: "No puedes eliminar al último superadministrador",
        codigo: "ULTIMO_SUPERADMIN",
      };
    }

    await db
      .update(usuarios)
      .set({
        esSuperadmin: false,
        estado: "suspendido",
        actualizadoEn: new Date(),
      })
      .where(eq(usuarios.id, id));
    return { exito: true };
  },
};
