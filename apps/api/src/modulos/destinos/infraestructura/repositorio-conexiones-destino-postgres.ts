import { and, eq } from "drizzle-orm";
import type { ConexionDb } from "../../../plataforma/persistencia/conexion.js";
import {
  conexionesDestino,
  secretosConexionDestino,
} from "../../../plataforma/persistencia/esquema.js";
import {
  cifrarSecretoParaPersistencia,
  leerSecretoCifrado,
} from "../../../plataforma/seguridad/secreto-cifrado.js";
import type {
  CambiosConexionDestino,
  ConexionDestino,
  ConexionDestinoConSecreto,
  EntradaPersistirConexionDestino,
  RepositorioConexionesDestino,
} from "../aplicacion/puertos/repositorio-conexiones-destino.js";
import type { TipoDestino } from "../dominio/tipos-destino.js";

interface ServicioCifrado {
  cifrar(valor: string): { cifrado: string; iv: string; tag: string };
  descifrar(cifrado: string, iv: string, tag: string): string;
}

export class RepositorioConexionesDestinoPostgres
  implements RepositorioConexionesDestino
{
  constructor(
    private readonly db: ConexionDb,
    private readonly cifrado: ServicioCifrado,
  ) {}

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

  async obtenerConSecreto(
    organizacionId: string,
    id: string,
  ): Promise<ConexionDestinoConSecreto | null> {
    const conexion = await this.obtener(organizacionId, id);
    if (!conexion) return null;
    const nombre = obtenerReferenciaSecreto(conexion.secretoRefs);
    if (!nombre) return { ...conexion, secreto: null };
    const fila = await this.db.query.secretosConexionDestino.findFirst({
      where: (tabla, { and, eq }) =>
        and(eq(tabla.conexionDestinoId, id), eq(tabla.nombre, nombre)),
    });
    const valor = leerSecretoCifrado(this.cifrado, fila?.valorCifrado);
    return {
      ...conexion,
      secreto: valor ? { nombre, valor } : null,
    };
  }

  async crear(
    entrada: EntradaPersistirConexionDestino,
  ): Promise<ConexionDestino> {
    return this.db.transaction(async (tx) => {
      const [fila] = await tx
        .insert(conexionesDestino)
        .values({
          organizacionId: entrada.organizacionId,
          tenantQlikId: entrada.tenantQlikId,
          tipo: entrada.tipo,
          nombre: entrada.nombre,
          config: entrada.config,
          secretoRefs: entrada.secretoRefs,
          estado: "activo",
        })
        .returning();
      if (!fila) throw new Error("No se pudo crear la conexión destino");
      if (entrada.secreto) {
        const valorCifrado = cifrarSecretoParaPersistencia(
          this.cifrado,
          entrada.secreto.valor,
        );
        await tx.insert(secretosConexionDestino).values({
          conexionDestinoId: fila.id,
          nombre: entrada.secreto.nombre,
          valorCifrado,
        });
      }
      return mapearConexion(fila);
    });
  }

  async guardarParaTenant(
    entrada: EntradaPersistirConexionDestino,
  ): Promise<ConexionDestino> {
    return this.db.transaction(async (tx) => {
      const [fila] = await tx
        .insert(conexionesDestino)
        .values({
          organizacionId: entrada.organizacionId,
          tenantQlikId: entrada.tenantQlikId,
          tipo: entrada.tipo,
          nombre: entrada.nombre,
          config: entrada.config,
          secretoRefs: entrada.secretoRefs,
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
            secretoRefs: entrada.secretoRefs,
            actualizadoEn: new Date(),
          },
        })
        .returning();
      if (!fila) throw new Error("No se pudo guardar la conexión destino");
      if (entrada.secreto) {
        const valorCifrado = cifrarSecretoParaPersistencia(
          this.cifrado,
          entrada.secreto.valor,
        );
        await tx
          .insert(secretosConexionDestino)
          .values({
            conexionDestinoId: fila.id,
            nombre: entrada.secreto.nombre,
            valorCifrado,
          })
          .onConflictDoUpdate({
            target: [
              secretosConexionDestino.conexionDestinoId,
              secretosConexionDestino.nombre,
            ],
            set: { valorCifrado, actualizadoEn: new Date() },
          });
      }
      return mapearConexion(fila);
    });
  }

  async actualizar(
    organizacionId: string,
    id: string,
    cambios: CambiosConexionDestino,
  ): Promise<boolean> {
    const [fila] = await this.db
      .update(conexionesDestino)
      .set({ ...cambios, actualizadoEn: new Date() })
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
  probadaEn: Date | null;
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
    probadaEn: fila.probadaEn,
    config: (fila.config as Record<string, unknown>) ?? {},
    secretoRefs: (fila.secretoRefs as Record<string, unknown>) ?? {},
  };
}

function obtenerReferenciaSecreto(
  referencias: Record<string, unknown>,
): string | null {
  const valor = referencias.password;
  return typeof valor === "string" && valor.length > 0 ? valor : null;
}
