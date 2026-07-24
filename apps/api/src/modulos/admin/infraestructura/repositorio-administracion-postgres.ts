import { and, count, eq } from "drizzle-orm";
import { db } from "../../../plataforma/persistencia/conexion.js";
import {
  membresiasOrganizacion,
  organizaciones,
  tenantsQlik,
  usuarios,
} from "../../../plataforma/persistencia/esquema.js";
import type {
  EstadoOrganizacion,
  EstadoTenantQlik,
  RepositorioAdministracion,
  ResultadoEliminarTenantQlik,
  RolAdministracion,
  TenantQlikAdministrable,
  UsuarioAdministrable,
} from "../aplicacion/puertos/repositorio-administracion.js";
import {
  decidirSiNuevoTenantEsPrincipal,
  validarEliminacionTenantQlik,
} from "../dominio/tenant-qlik.js";

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
  async listarTenantsQlik(
    organizacionId: string,
  ): Promise<TenantQlikAdministrable[]> {
    const filas = await db.query.tenantsQlik.findMany({
      where: eq(tenantsQlik.organizacionId, organizacionId),
    });
    return filas.map(mapearTenantQlik);
  }

  async crearTenantQlik(entrada: {
    organizacionId: string;
    tenantIdQlik: string;
    host: string;
    nombre?: string;
  }): Promise<TenantQlikAdministrable | null> {
    if (!(await this.obtenerOrganizacion(entrada.organizacionId))) return null;
    return db.transaction(async (tx) => {
      const existentes = await tx.query.tenantsQlik.findMany({
        where: eq(tenantsQlik.organizacionId, entrada.organizacionId),
      });
      const [fila] = await tx
        .insert(tenantsQlik)
        .values({
          organizacionId: entrada.organizacionId,
          tenantIdQlik: entrada.tenantIdQlik,
          host: normalizarHostQlik(entrada.host),
          nombre: entrada.nombre ?? null,
          esPrincipal: decidirSiNuevoTenantEsPrincipal(existentes.length),
        })
        .returning();
      if (!fila) throw new Error("No se pudo crear el tenant Qlik");
      return mapearTenantQlik(fila);
    });
  }

  async marcarTenantQlikPrincipal(
    organizacionId: string,
    tenantQlikId: string,
  ): Promise<TenantQlikAdministrable | null> {
    return db.transaction(async (tx) => {
      const tenant = await tx.query.tenantsQlik.findFirst({
        where: and(
          eq(tenantsQlik.id, tenantQlikId),
          eq(tenantsQlik.organizacionId, organizacionId),
        ),
      });
      if (!tenant) return null;
      await tx
        .update(tenantsQlik)
        .set({ esPrincipal: false, actualizadoEn: new Date() })
        .where(eq(tenantsQlik.organizacionId, organizacionId));
      const [actualizado] = await tx
        .update(tenantsQlik)
        .set({ esPrincipal: true, actualizadoEn: new Date() })
        .where(eq(tenantsQlik.id, tenantQlikId))
        .returning();
      return actualizado ? mapearTenantQlik(actualizado) : null;
    });
  }

  async eliminarTenantQlik(
    organizacionId: string,
    tenantQlikId: string,
  ): Promise<ResultadoEliminarTenantQlik> {
    const tenant = await db.query.tenantsQlik.findFirst({
      where: and(
        eq(tenantsQlik.id, tenantQlikId),
        eq(tenantsQlik.organizacionId, organizacionId),
      ),
    });
    if (!tenant) return "NO_ENCONTRADO";
    if (validarEliminacionTenantQlik(tenant) === "REQUIERE_REEMPLAZO") {
      return "REQUIERE_REEMPLAZO";
    }
    await db.delete(tenantsQlik).where(eq(tenantsQlik.id, tenantQlikId));
    return "ELIMINADO";
  }
}

function mapearTenantQlik(
  fila: typeof tenantsQlik.$inferSelect,
): TenantQlikAdministrable {
  return {
    ...fila,
    estado: fila.estado as EstadoTenantQlik,
  };
}

function normalizarHostQlik(host: string): string {
  const valor = /^https?:\/\//i.test(host) ? host : `https://${host}`;
  const url = new URL(valor);
  if (url.protocol !== "https:" || url.pathname !== "/") {
    throw new Error("El host Qlik debe ser HTTPS y no contener ruta");
  }
  return url.host.toLowerCase();
}
