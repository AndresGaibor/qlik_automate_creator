export const TIPOS_DESTINO = [
  "impala",
  "postgres",
  "bigquery",
  "sftp",
] as const;

export type TipoDestino = (typeof TIPOS_DESTINO)[number];

export type TipoRecursoDestino = "tabla" | "dataset" | "archivo" | "carpeta";

export interface CapacidadesDestino {
  listarRecursos: boolean;
  esquema: boolean;
  conteoRegistros: boolean;
  vistaPrevia: boolean;
  escritura: boolean;
}

export interface RecursoDestino {
  id: string;
  nombre: string;
  tipo: TipoRecursoDestino;
  espacioDeNombres?: string;
  ruta?: string;
  columnas?: Array<{ nombre: string; tipo: string }>;
  metadatos: Record<string, unknown>;
}

export interface DetalleRecursoDestino extends RecursoDestino {
  totalFilas?: number;
  actualizadoEn: string;
}
