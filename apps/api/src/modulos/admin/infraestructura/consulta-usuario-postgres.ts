import { and, eq } from "drizzle-orm";
import type { ConexionDb } from "../../../plataforma/persistencia/conexion.js";
import {
  membresiasOrganizacion,
  usuarios,
} from "../../../plataforma/persistencia/esquema.js";
import type {
  RolAdministracion,
  UsuarioAdministrable,
} from "../aplicacion/puertos/repositorio-administracion.js";

type DbType = ConexionDb;

const normalizarRol = (rol: string): RolAdministracion =>
  rol === "admin" || rol === "administrador" ? "admin" : "usuario";

export const ConsultaUsuario = {
  async listarUsuarios(db: DbType, organizacionId: string) {
    const membresias = await db.query.membresiasOrganizacion.findMany({
      where: eq(membresiasOrganizacion.organizacionId, organizacionId),
    });
    const resultado: UsuarioAdministrable[] = [];
    for (const membresia of membresias) {
      const usuario = await db.query.usuarios.findFirst({
        where: eq(usuarios.id, membresia.usuarioId),
      });
      if (usuario)
        resultado.push({
          id: usuario.id,
          correo: usuario.correo,
          nombre: usuario.nombre,
          rol: normalizarRol(membresia.rol),
        });
    }
    return resultado;
  },

  async agregarUsuario(
    db: DbType,
    organizacionId: string,
    correoEntrada: string,
    rol: RolAdministracion,
    obtenerOrganizacion: (id: string) => Promise<{ id: string } | null>,
  ) {
    if (!(await obtenerOrganizacion(organizacionId))) return null;

    const correos = correoEntrada
      .split(/[,;\s\n]+/)
      .map((c) => c.trim().toLowerCase())
      .filter((c) => c.length > 0 && c.includes("@"));

    if (correos.length === 0) {
      throw new Error("Debes ingresar al menos un correo electrónico válido");
    }

    let ultimoUsuario: UsuarioAdministrable | null = null;

    for (const correo of correos) {
      let usuario = await db.query.usuarios.findFirst({
        where: eq(usuarios.correo, correo),
      });
      if (!usuario) {
        [usuario] = await db
          .insert(usuarios)
          .values({
            nombre: "Pendiente de primer ingreso",
            correo,
            estado: "activo",
          })
          .returning();
      }
      if (!usuario) throw new Error(`No se pudo crear el usuario ${correo}`);
      await db
        .insert(membresiasOrganizacion)
        .values({ organizacionId, usuarioId: usuario.id, rol })
        .onConflictDoUpdate({
          target: [
            membresiasOrganizacion.organizacionId,
            membresiasOrganizacion.usuarioId,
          ],
          set: { rol },
        });

      ultimoUsuario = {
        id: usuario.id,
        correo: usuario.correo,
        nombre: usuario.nombre,
        rol,
      };
    }

    return ultimoUsuario;
  },

  async actualizarRolUsuario(
    db: DbType,
    organizacionId: string,
    usuarioId: string,
    rol: RolAdministracion,
  ) {
    const filas = await db
      .update(membresiasOrganizacion)
      .set({ rol })
      .where(
        and(
          eq(membresiasOrganizacion.organizacionId, organizacionId),
          eq(membresiasOrganizacion.usuarioId, usuarioId),
        ),
      )
      .returning();
    if (filas.length === 0) return null;
    const usuario = await db.query.usuarios.findFirst({
      where: eq(usuarios.id, usuarioId),
    });
    return usuario
      ? { id: usuario.id, correo: usuario.correo, nombre: usuario.nombre, rol }
      : null;
  },

  async eliminarUsuario(db: DbType, organizacionId: string, usuarioId: string) {
    const filas = await db
      .delete(membresiasOrganizacion)
      .where(
        and(
          eq(membresiasOrganizacion.organizacionId, organizacionId),
          eq(membresiasOrganizacion.usuarioId, usuarioId),
        ),
      )
      .returning();
    return filas.length > 0;
  },
};
