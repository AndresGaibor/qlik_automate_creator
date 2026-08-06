import { and, eq } from "drizzle-orm";
import type { ConexionDb } from "../../../plataforma/persistencia/conexion.js";
import { conexionesDestino } from "../../../plataforma/persistencia/esquema.js";
import type {
  CambiosConexionDestino,
  ConexionDestino,
  EntradaConexionDestino,
  RepositorioConexionesDestino,
} from "../aplicacion/puertos/repositorio-conexiones-destino.js";
import type { TipoDestino } from "../dominio/tipos-destino.js";

export class RepositorioConexionesDestinoPostgres
  implements RepositorioConexionesDestino
{
  constructor(private readonly db: ConexionDb) {}

  async listarPorOrganizacion(
    organizacionId: string,
  ): Promise<ConexionDestino[]> {
    const filas = await this.db.query.conexionesDestino.findMany({
      where: (tabla, { eq }) => eq(tabla.organizacionId, organizacionId),
      orderBy: (tabla, { asc }) => [asc(tabla.nombre)],
    });
    return filas.map(mapearConexion);
  }

  async obtener(
    organizacionId: string,
    id: string,
  ): Promise<ConexionDestino | null> {
    const fila = await this.db.query.conexionesDestino.findFirst({
      where: (tabla, { and, eq }) =>
        and(eq(tabla.organizacionId, organizacionId), eq(tabla.id, id)),
    });
    return fila ? mapearConexion(fila) : null;
  }

  async crear(entrada: EntradaConexionDestino): Promise<ConexionDestino> {
    const [fila] = await this.db
      .insert(conexionesDestino)
      .values({
        organizacionId: entrada.organizacionId,
        tipo: entrada.tipo,
        nombre: entrada.nombre,
        config: entrada.config,
        secretoRefs: entrada.secretoRefs,
        estado: "activo",
      })
      .returning();
    if (!fila) throw new Error("No se pudo crear la conexión destino");
    return mapearConexion(fila);
  }

  async guardarParaTenant(entrada: {
    organizacionId: string;
    tenantQlikId: string;
    tipo: string;
    nombre: string;
    config: Record<string, unknown>;
  }): Promise<{ id: string }> {
    const [conexion] = await this.db
      .insert(conexionesDestino)
      .values({
        organizacionId: entrada.organizacionId,
        tenantQlikId: entrada.tenantQlikId,
        tipo: entrada.tipo,
        nombre: entrada.nombre,
        config: entrada.config,
        secretoRefs: {},
        estado: "activo",
      })
      .onConflictDoUpdate({
        target: [
          conexionesDestino.organizacionId,
          conexionesDestino.tipo,
          conexionesDestino.nombre,
        ],
        set: {
          tenantQlikId: entrada.tenantQlikId,
          config: entrada.config,
          actualizadoEn: new Date(),
        },
      })
      .returning({ id: conexionesDestino.id });
    if (!conexion) throw new Error("No se pudo guardar la conexión destino");
    return conexion;
  }

  async actualizar(
    organizacionId: string,
    id: string,
    cambios: CambiosConexionDestino,
  ): Promise<boolean> {
    const [fila] = await this.db
      .update(conexionesDestino)
      .set({
        ...cambios,
        actualizadoEn: new Date(),
      })
      .where(
        and(
          eq(conexionesDestino.organizacionId, organizacionId),
          eq(conexionesDestino.id, id),
        ),
      )
      .returning({ id: conexionesDestino.id });
    return Boolean(fila);
  }

  async eliminar(organizacionId: string, id: string): Promise<boolean> {
    const [fila] = await this.db
      .delete(conexionesDestino)
      .where(
        and(
          eq(conexionesDestino.organizacionId, organizacionId),
          eq(conexionesDestino.id, id),
        ),
      )
      .returning({ id: conexionesDestino.id });
    return Boolean(fila);
  }
}

function mapearConexion(fila: {
  id: string;
  organizacionId: string;
  tipo: string;
  nombre: string;
  estado: string;
  mensajeError: string | null;
  config: unknown;
  secretoRefs: unknown;
}): ConexionDestino {
  return {
    id: fila.id,
    organizacionId: fila.organizacionId,
    tipo: fila.tipo as TipoDestino,
    nombre: fila.nombre,
    estado: fila.estado as ConexionDestino["estado"],
    mensajeError: fila.mensajeError,
    config: (fila.config as Record<string, unknown>) ?? {},
    secretoRefs: (fila.secretoRefs as Record<string, unknown>) ?? {},
  };
}
