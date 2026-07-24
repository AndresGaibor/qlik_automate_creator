export interface EventoDominio<T = unknown> {
  id: string;
  tipo: string;
  agregadoTipo: string;
  agregadoId: string;
  version: number;
  ocurridoEn: Date;
  datos: T;
  metadatos?: Record<string, unknown>;
}
