import { and, count, eq } from "drizzle-orm";
import { db } from "../../../plataforma/persistencia/conexion.js";
import {
  membresiasOrganizacion,
  organizaciones,
  usuarios,
} from "../../../plataforma/persistencia/esquema.js";
import type {
  EstadoOrganizacion,
  RepositorioAdministracion,
  RolAdministracion,
  UsuarioAdministrable,
} from "../aplicacion/puertos/repositorio-administracion.js";

const normalizarRol = (rol: string): RolAdministracion =>
  rol === "admin" || rol === "administrador" ? "admin" : "usuario";

export class RepositorioAdministracionPostgres
  implements RepositorioAdministracion
{
  async listarOrganizaciones() {
    const filas = await db.query.organizaciones.findMany();
    return Promise.all(
      filas.map(async (organizacion) => {
        const [resultado] = await db
          .select({ cantidad: count() })
          .from(membresiasOrganizacion)
          .where(eq(membresiasOrganizacion.organizacionId, organizacion.id));
        return {
          ...organizacion,
          estado: organizacion.estado as EstadoOrganizacion,
          cantidadUsuarios: Number(resultado?.cantidad ?? 0),
        };
      }),
    );
  }

  async obtenerOrganizacion(id: string) {
    const fila = await db.query.organizaciones.findFirst({
      where: eq(organizaciones.id, id),
    });
    return fila ? { ...fila, estado: fila.estado as EstadoOrganizacion } : null;
  }

  async crearOrganizacion(nombre: string) {
    const [fila] = await db
      .insert(organizaciones)
      .values({ nombre, estado: "activa" })
      .returning();
    if (!fila) throw new Error("No se pudo crear la organización");
    return { ...fila, estado: fila.estado as EstadoOrganizacion };
  }

  async actualizarOrganizacion(
    id: string,
    cambios: { nombre?: string; estado?: EstadoOrganizacion },
  ) {
    const [fila] = await db
      .update(organizaciones)
      .set(cambios)
      .where(eq(organizaciones.id, id))
      .returning();
    return fila ? { ...fila, estado: fila.estado as EstadoOrganizacion } : null;
  }

  async eliminarOrganizacion(id: string) {
    const filas = await db
      .delete(organizaciones)
      .where(eq(organizaciones.id, id))
      .returning({ id: organizaciones.id });
    return filas.length > 0;
  }

  async listarUsuarios(
    organizacionId: string,
  ): Promise<UsuarioAdministrable[]> {
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
  }

  async agregarUsuario(
    organizacionId: string,
    correo: string,
    rol: RolAdministracion,
  ) {
    if (!(await this.obtenerOrganizacion(organizacionId))) return null;
    let usuario = await db.query.usuarios.findFirst({
      where: eq(usuarios.correo, correo),
    });
    if (!usuario) {
      [usuario] = await db
        .insert(usuarios)
        .values({
          nombre: correo.split("@")[0] ?? correo,
          correo,
          estado: "activo",
        })
        .returning();
    }
    if (!usuario) throw new Error("No se pudo crear el usuario");
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
    return {
      id: usuario.id,
      correo: usuario.correo,
      nombre: usuario.nombre,
      rol,
    };
  }

  async actualizarRolUsuario(
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
  }

  async eliminarUsuario(organizacionId: string, usuarioId: string) {
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
  }
}
