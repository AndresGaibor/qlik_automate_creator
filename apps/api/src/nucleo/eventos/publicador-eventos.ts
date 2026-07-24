import type { EventoDominio } from "./evento-dominio.js";

export interface PublicadorEventos {
  publicar(eventos: EventoDominio[]): Promise<void>;
}

export class PublicadorEventosEnMemoria implements PublicadorEventos {
  private readonly manejadores = new Map<
    string,
    Array<(evento: EventoDominio) => Promise<void>>
  >();

  suscribir(
    tipo: string,
    manejador: (evento: EventoDominio) => Promise<void>,
  ): void {
    const actuales = this.manejadores.get(tipo) ?? [];
    actuales.push(manejador);
    this.manejadores.set(tipo, actuales);
  }

  async publicar(eventos: EventoDominio[]): Promise<void> {
    for (const evento of eventos) {
      const manejadores = this.manejadores.get(evento.tipo) ?? [];
      await Promise.all(manejadores.map((manejador) => manejador(evento)));
    }
  }
}
