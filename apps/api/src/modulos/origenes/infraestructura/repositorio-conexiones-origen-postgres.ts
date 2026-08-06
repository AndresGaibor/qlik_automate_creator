import { and, eq } from "drizzle-orm";
import type { ConexionDb } from "../../../plataforma/persistencia/conexion.js";
import {
  conexionesOrigen,
  secretosConexionOrigen,
} from "../../../plataforma/persistencia/esquema.js";
import {
  cifrarSecretoParaPersistencia,
  leerSecretoCifrado,
} from "../../../plataforma/seguridad/secreto-cifrado.js";
import type {
  ConexionOrigen,
  EntradaConexionOrigen,
  RepositorioConexionesOrigen,
  TipoConexionOrigen,
} from "../aplicacion/puertos/repositorio-conexiones-origen.js";

interface ServicioCifrado {
  cifrar(valor: string): { cifrado: string; iv: string; tag: string };
  descifrar(cifrado: string, iv: string, tag: string): string;
}

type EscritorSecretos = Pick<ConexionDb, "insert">;

export class RepositorioConexionesOrigenPostgres
  implements RepositorioConexionesOrigen
{
  constructor(
    private readonly db: ConexionDb,
    private readonly cifrado: ServicioCifrado,
  ) {}

  async listar(organizacionId: string): Promise<ConexionOrigen[]> {
    const filas = await this.db.query.conexionesOrigen.findMany({
      where: (tabla, { eq }) => eq(tabla.organizacionId, organizacionId),
      orderBy: (tabla, { asc }) => [asc(tabla.nombre)],
    });
    return filas.map(mapearConexion);
  }

  async buscarPorNombre(
    organizacionId: string,
    nombre: string,
  ): Promise<ConexionOrigen | null> {
    const fila = await this.db.query.conexionesOrigen.findFirst({
      where: (tabla, { and, eq }) =>
        and(eq(tabla.organizacionId, organizacionId), eq(tabla.nombre, nombre)),
    });
    return fila ? mapearConexion(fila) : null;
  }

  async buscarPorTipoYNombre(
    organizacionId: string,
    tipo: TipoConexionOrigen,
    nombre: string,
  ): Promise<ConexionOrigen | null> {
    const fila = await this.db.query.conexionesOrigen.findFirst({
      where: (tabla, { and, eq }) =>
        and(
          eq(tabla.organizacionId, organizacionId),
          eq(tabla.tipo, tipo),
          eq(tabla.nombre, nombre),
        ),
    });
    return fila ? mapearConexion(fila) : null;
  }

  async buscarPorId(
    organizacionId: string,
    id: string,
  ): Promise<ConexionOrigen | null> {
    const fila = await this.db.query.conexionesOrigen.findFirst({
      where: (tabla, { and, eq }) =>
        and(eq(tabla.organizacionId, organizacionId), eq(tabla.id, id)),
    });
    return fila ? mapearConexion(fila) : null;
  }

  async crear(
    organizacionId: string,
    entrada: EntradaConexionOrigen,
  ): Promise<ConexionOrigen> {
    let creada: ConexionOrigen | undefined;
    await this.db.transaction(async (tx) => {
      const [fila] = await tx
        .insert(conexionesOrigen)
        .values({
          organizacionId,
          tipo: entrada.tipo,
          nombre: entrada.nombre,
          config: entrada.config,
        })
        .returning();
      creada = mapearConexion(fila);
      await guardarSecretoSiExiste(tx, fila.id, entrada, this.cifrado);
    });
    if (!creada) throw new Error("No se pudo crear la conexión de origen");
    return creada;
  }

  async actualizar(
    organizacionId: string,
    id: string,
    entrada: EntradaConexionOrigen,
  ): Promise<ConexionOrigen | null> {
    let actualizada: ConexionOrigen | null = null;
    await this.db.transaction(async (tx) => {
      const [fila] = await tx
        .update(conexionesOrigen)
        .set({
          tipo: entrada.tipo,
          nombre: entrada.nombre,
          config: entrada.config,
          actualizadoEn: new Date(),
        })
        .where(
          and(
            eq(conexionesOrigen.organizacionId, organizacionId),
            eq(conexionesOrigen.id, id),
          ),
        )
        .returning();
      if (!fila) return;
      actualizada = mapearConexion(fila);

      const secretosPrevios = await tx
        .select()
        .from(secretosConexionOrigen)
        .where(eq(secretosConexionOrigen.conexionOrigenId, id));
      const nombreActual = entrada.secreto?.nombre;
      for (const secreto of secretosPrevios) {
        if (nombreActual && secreto.nombre === nombreActual) continue;
        await tx
          .delete(secretosConexionOrigen)
          .where(
            and(
              eq(secretosConexionOrigen.conexionOrigenId, id),
              eq(secretosConexionOrigen.nombre, secreto.nombre),
            ),
          );
      }
      await guardarSecretoSiExiste(tx, id, entrada, this.cifrado);
    });
    return actualizada;
  }

  async eliminar(organizacionId: string, id: string): Promise<boolean> {
    const [eliminada] = await this.db
      .delete(conexionesOrigen)
      .where(
        and(
          eq(conexionesOrigen.organizacionId, organizacionId),
          eq(conexionesOrigen.id, id),
        ),
      )
      .returning({ id: conexionesOrigen.id });
    return Boolean(eliminada);
  }

  async existeSecreto(
    organizacionId: string,
    conexionId: string,
    nombre: string,
  ): Promise<boolean> {
    const conexion = await this.db.query.conexionesOrigen.findFirst({
      where: (tabla, { and, eq }) =>
        and(eq(tabla.organizacionId, organizacionId), eq(tabla.id, conexionId)),
    });
    if (!conexion) return false;
    const fila = await this.db.query.secretosConexionOrigen.findFirst({
      where: (tabla, { and, eq }) =>
        and(eq(tabla.conexionOrigenId, conexionId), eq(tabla.nombre, nombre)),
      columns: { nombre: true },
    });
    return Boolean(fila);
  }

  async leerSecreto(
    organizacionId: string,
    conexionId: string,
    nombre: string,
  ): Promise<string | null> {
    const conexion = await this.db.query.conexionesOrigen.findFirst({
      where: (tabla, { and, eq }) =>
        and(eq(tabla.organizacionId, organizacionId), eq(tabla.id, conexionId)),
    });
    if (!conexion) return null;
    const fila = await this.db.query.secretosConexionOrigen.findFirst({
      where: (tabla, { and, eq }) =>
        and(eq(tabla.conexionOrigenId, conexionId), eq(tabla.nombre, nombre)),
    });
    if (!fila) return null;
    return leerSecretoCifrado(this.cifrado, fila.valorCifrado) ?? null;
  }

  async registrarPrueba(
    organizacionId: string,
    conexionId: string,
    resultado: {
      estado: "disponible" | "error";
      probadaEn: Date;
      mensajeError: string | null;
    },
  ): Promise<boolean> {
    const [fila] = await this.db
      .update(conexionesOrigen)
      .set({
        estado: resultado.estado,
        probadaEn: resultado.probadaEn,
        mensajeError: resultado.mensajeError,
        actualizadoEn: new Date(),
      })
      .where(
        and(
          eq(conexionesOrigen.organizacionId, organizacionId),
          eq(conexionesOrigen.id, conexionId),
        ),
      )
      .returning({ id: conexionesOrigen.id });
    return Boolean(fila);
  }
}

function mapearConexion(fila: {
  id: string;
  organizacionId: string;
  tipo: string;
  nombre: string;
  config: unknown;
  estado: string;
  probadaEn: Date | null;
  mensajeError: string | null;
  creadoEn: Date;
  actualizadoEn: Date;
}): ConexionOrigen {
  return {
    ...fila,
    tipo: fila.tipo as TipoConexionOrigen,
    estado: fila.estado as ConexionOrigen["estado"],
    config: (fila.config as Record<string, unknown>) ?? {},
  };
}

async function guardarSecretoSiExiste(
  db: EscritorSecretos,
  conexionId: string,
  entrada: EntradaConexionOrigen,
  cifrado: ServicioCifrado,
): Promise<void> {
  const secreto = entrada.secreto;
  if (!secreto?.nombre || !secreto.valor) return;
  const valorCifrado = cifrarSecretoParaPersistencia(cifrado, secreto.valor);
  await db
    .insert(secretosConexionOrigen)
    .values({
      conexionOrigenId: conexionId,
      nombre: secreto.nombre,
      valorCifrado,
    })
    .onConflictDoUpdate({
      target: [
        secretosConexionOrigen.conexionOrigenId,
        secretosConexionOrigen.nombre,
      ],
      set: { valorCifrado, actualizadoEn: new Date() },
    });
}
