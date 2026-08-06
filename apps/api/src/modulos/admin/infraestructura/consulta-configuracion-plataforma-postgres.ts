import { eq } from "drizzle-orm";
import type { ConexionDb } from "../../../plataforma/persistencia/conexion.js";
import { configuracionesPlataforma } from "../../../plataforma/persistencia/esquema.js";
import type { ModoPlantilla } from "../aplicacion/puertos/repositorio-administracion.js";

export function normalizarModoPlantilla(valor: unknown): ModoPlantilla {
  return valor === 1 || valor === 2 ? valor : 1;
}

export const ConsultaConfiguracionPlataforma = {
  async obtenerModoAutomatizacionGlobal(db: ConexionDb) {
    const fila = await db.query.configuracionesPlataforma.findFirst({
      where: eq(configuracionesPlataforma.id, 1),
    });
    return {
      modoAutomatizacionActivo: normalizarModoPlantilla(
        fila?.modoAutomatizacionActivo,
      ),
    };
  },

  async actualizarModoAutomatizacionGlobal(
    db: ConexionDb,
    modo: ModoPlantilla,
    usuarioId?: string,
  ) {
    const existente = await db.query.configuracionesPlataforma.findFirst({
      where: eq(configuracionesPlataforma.id, 1),
    });

    if (!existente) {
      const [nueva] = await db
        .insert(configuracionesPlataforma)
        .values({
          id: 1,
          modoAutomatizacionActivo: modo,
          actualizadoPorUsuarioId: usuarioId ?? null,
        })
        .returning();
      return {
        modoAutomatizacionActivo: normalizarModoPlantilla(
          nueva.modoAutomatizacionActivo,
        ),
      };
    }

    const [actualizada] = await db
      .update(configuracionesPlataforma)
      .set({
        modoAutomatizacionActivo: modo,
        actualizadoEn: new Date(),
        actualizadoPorUsuarioId: usuarioId ?? null,
      })
      .where(eq(configuracionesPlataforma.id, 1))
      .returning();

    return {
      modoAutomatizacionActivo: normalizarModoPlantilla(
        actualizada.modoAutomatizacionActivo,
      ),
    };
  },
};
