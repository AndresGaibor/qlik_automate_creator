import { asc, eq, isNull, sql } from "drizzle-orm";
import type { EventoDominio } from "../../nucleo/eventos/evento-dominio.js";
import type { PuertoOutbox } from "../../nucleo/eventos/puerto-outbox.js";
import { db } from "./conexion.js";
import { eventosOutbox } from "./esquema.js";

export class OutboxPostgres implements PuertoOutbox {
  async guardar(eventos: EventoDominio[]): Promise<void> {
    if (eventos.length === 0) return;
    await db
      .insert(eventosOutbox)
      .values(
        eventos.map((evento) => ({
          id: evento.id,
          agregadoTipo: evento.agregadoTipo,
          agregadoId: evento.agregadoId,
          tipo: evento.tipo,
          version: evento.version,
          datos: evento.datos,
          metadatos: evento.metadatos ?? {},
          ocurridoEn: evento.ocurridoEn,
        })),
      )
      .onConflictDoNothing();
  }

  async listarPendientes(limite: number): Promise<EventoDominio[]> {
    const filas = await db
      .select()
      .from(eventosOutbox)
      .where(isNull(eventosOutbox.publicadoEn))
      .orderBy(asc(eventosOutbox.ocurridoEn))
      .limit(limite);
    return filas.map((fila) => ({
      id: fila.id,
      tipo: fila.tipo,
      agregadoTipo: fila.agregadoTipo,
      agregadoId: fila.agregadoId,
      version: fila.version,
      ocurridoEn: fila.ocurridoEn,
      datos: fila.datos,
      metadatos: fila.metadatos as Record<string, unknown>,
    }));
  }

  async marcarPublicado(eventoId: string, publicadoEn: Date): Promise<void> {
    await db
      .update(eventosOutbox)
      .set({ publicadoEn, ultimoError: null })
      .where(eq(eventosOutbox.id, eventoId));
  }

  async registrarFallo(eventoId: string, mensaje: string): Promise<void> {
    await db
      .update(eventosOutbox)
      .set({
        intentos: sql`${eventosOutbox.intentos} + 1`,
        ultimoError: mensaje.slice(0, 4000),
      })
      .where(eq(eventosOutbox.id, eventoId));
  }
}
