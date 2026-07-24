import type { EventoDominio } from "./evento-dominio.js";

export interface PuertoOutbox {
  guardar(eventos: EventoDominio[]): Promise<void>;
  listarPendientes(limite: number): Promise<EventoDominio[]>;
  marcarPublicado(eventoId: string, publicadoEn: Date): Promise<void>;
  registrarFallo(eventoId: string, mensaje: string): Promise<void>;
}
