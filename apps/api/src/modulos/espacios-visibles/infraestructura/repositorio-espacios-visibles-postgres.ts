import type {
  ConfiguracionEspaciosVisibles,
  GuardarEspaciosVisibles,
  ResultadoGuardarEspaciosVisibles,
} from "@qlik/contratos/admin";
import { and, eq, inArray, notInArray } from "drizzle-orm";
import type { ConexionDb } from "../../../plataforma/persistencia/conexion.js";
import {
  configuracionEspaciosVisibles,
  espaciosQlikCache,
  espaciosVisiblesUsuarioFinal,
} from "../../../plataforma/persistencia/esquema.js";

export class RepositorioEspaciosVisiblesPostgres {
  constructor(private readonly db: ConexionDb) {}

  async obtener(tenantQlikId: string): Promise<ConfiguracionEspaciosVisibles> {
    const [config, seleccion] = await Promise.all([
      this.db.query.configuracionEspaciosVisibles.findFirst({
        where: eq(configuracionEspaciosVisibles.tenantQlikId, tenantQlikId),
      }),
      this.db.query.espaciosVisiblesUsuarioFinal.findMany({
        where: eq(espaciosVisiblesUsuarioFinal.tenantQlikId, tenantQlikId),
      }),
    ]);
    return {
      tenantQlikId,
      espaciosPermitidosIds: seleccion.map((fila) => fila.espacioIdQlik),
      permitirRecursosSinEspacio: config?.permitirRecursosSinEspacio ?? false,
      configurada: Boolean(config),
      actualizadoEn: config?.actualizadoEn?.toISOString() ?? null,
    };
  }

  async reemplazar(
    tenantQlikId: string,
    entrada: GuardarEspaciosVisibles,
    usuarioId?: string,
  ): Promise<ResultadoGuardarEspaciosVisibles> {
    return this.db.transaction(async (tx) => {
      const anterior = await this.obtenerCon(tx, tenantQlikId);
      await tx
        .insert(configuracionEspaciosVisibles)
        .values({
          tenantQlikId,
          permitirRecursosSinEspacio: entrada.permitirRecursosSinEspacio,
          actualizadoPorUsuarioId: usuarioId,
        })
        .onConflictDoUpdate({
          target: configuracionEspaciosVisibles.tenantQlikId,
          set: {
            permitirRecursosSinEspacio: entrada.permitirRecursosSinEspacio,
            actualizadoPorUsuarioId: usuarioId,
            actualizadoEn: new Date(),
          },
        });
      await tx
        .delete(espaciosVisiblesUsuarioFinal)
        .where(eq(espaciosVisiblesUsuarioFinal.tenantQlikId, tenantQlikId));
      if (entrada.espaciosPermitidosIds.length > 0) {
        await tx.insert(espaciosVisiblesUsuarioFinal).values(
          entrada.espaciosPermitidosIds.map((espacioIdQlik) => ({
            tenantQlikId,
            espacioIdQlik,
          })),
        );
      }
      const actual = await this.obtenerCon(tx, tenantQlikId);
      return {
        configuracion: actual,
        anadidos: actual.espaciosPermitidosIds.filter(
          (id) => !anterior.espaciosPermitidosIds.includes(id),
        ),
        retirados: anterior.espaciosPermitidosIds.filter(
          (id) => !actual.espaciosPermitidosIds.includes(id),
        ),
      };
    });
  }

  async listarCatalogo(tenantQlikId: string) {
    return this.db.query.espaciosQlikCache.findMany({
      where: eq(espaciosQlikCache.tenantQlikId, tenantQlikId),
      orderBy: (tabla, { asc }) => [asc(tabla.nombre)],
    });
  }

  async sincronizarCatalogo(
    tenantQlikId: string,
    espacios: Array<{ id: string; nombre: string; tipo: string }>,
  ) {
    await this.db.transaction(async (tx) => {
      const ids = espacios.map((item) => item.id);
      for (const espacio of espacios) {
        await tx
          .insert(espaciosQlikCache)
          .values({
            tenantQlikId,
            espacioIdQlik: espacio.id,
            nombre: espacio.nombre,
            tipo: espacio.tipo,
            eliminadoEn: null,
            sincronizadoEn: new Date(),
          })
          .onConflictDoUpdate({
            target: [
              espaciosQlikCache.tenantQlikId,
              espaciosQlikCache.espacioIdQlik,
            ],
            set: {
              nombre: espacio.nombre,
              tipo: espacio.tipo,
              eliminadoEn: null,
              sincronizadoEn: new Date(),
            },
          });
      }
      if (ids.length > 0) {
        await tx
          .update(espaciosQlikCache)
          .set({ eliminadoEn: new Date() })
          .where(
            and(
              eq(espaciosQlikCache.tenantQlikId, tenantQlikId),
              notInArray(espaciosQlikCache.espacioIdQlik, ids),
            ),
          );
      }
    });
  }

  private async obtenerCon(
    db: Pick<ConexionDb, "query">,
    tenantQlikId: string,
  ) {
    const [config, seleccion] = await Promise.all([
      db.query.configuracionEspaciosVisibles.findFirst({
        where: eq(configuracionEspaciosVisibles.tenantQlikId, tenantQlikId),
      }),
      db.query.espaciosVisiblesUsuarioFinal.findMany({
        where: eq(espaciosVisiblesUsuarioFinal.tenantQlikId, tenantQlikId),
      }),
    ]);
    return {
      tenantQlikId,
      espaciosPermitidosIds: seleccion.map((fila) => fila.espacioIdQlik),
      permitirRecursosSinEspacio: config?.permitirRecursosSinEspacio ?? false,
      configurada: Boolean(config),
      actualizadoEn: config?.actualizadoEn?.toISOString() ?? null,
    } satisfies ConfiguracionEspaciosVisibles;
  }
}
