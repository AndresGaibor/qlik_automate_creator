import { count, eq } from "drizzle-orm";
import type { ConexionDb } from "../../../plataforma/persistencia/conexion.js";
import {
  membresiasOrganizacion,
  organizaciones,
} from "../../../plataforma/persistencia/esquema.js";
import type {
  EstadoOrganizacion,
  OrganizacionAdministrable,
} from "../aplicacion/puertos/repositorio-administracion.js";

type DbType = ConexionDb;

export const ConsultaOrganizacion = {
  async listarOrganizaciones(db: DbType) {
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
  },

  async obtenerOrganizacion(db: DbType, id: string) {
    const fila = await db.query.organizaciones.findFirst({
      where: eq(organizaciones.id, id),
    });
    return fila
      ? ({
          ...fila,
          estado: fila.estado as EstadoOrganizacion,
        } as OrganizacionAdministrable)
      : null;
  },

  async crearOrganizacion(db: DbType, nombre: string) {
    const [fila] = await db
      .insert(organizaciones)
      .values({ nombre, estado: "activa" })
      .returning();
    if (!fila) throw new Error("No se pudo crear la organización");
    return { ...fila, estado: fila.estado as EstadoOrganizacion };
  },

  async actualizarOrganizacion(
    db: DbType,
    id: string,
    cambios: { nombre?: string; estado?: EstadoOrganizacion },
  ) {
    const [fila] = await db
      .update(organizaciones)
      .set(cambios)
      .where(eq(organizaciones.id, id))
      .returning();
    return fila
      ? ({
          ...fila,
          estado: fila.estado as EstadoOrganizacion,
        } as OrganizacionAdministrable)
      : null;
  },

  async eliminarOrganizacion(db: DbType, id: string) {
    const filas = await db
      .delete(organizaciones)
      .where(eq(organizaciones.id, id))
      .returning({ id: organizaciones.id });
    return filas.length > 0;
  },
};
