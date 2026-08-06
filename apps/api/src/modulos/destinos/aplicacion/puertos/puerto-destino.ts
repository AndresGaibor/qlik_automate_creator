import type {
  CapacidadesDestino,
  DetalleRecursoDestino,
  RecursoDestino,
  TipoDestino,
} from "../../dominio/tipos-destino.js";

export interface PuertoDestino {
  readonly tipo: TipoDestino;
  probar(): Promise<void>;
  obtenerCapacidades(): CapacidadesDestino;
  listarRecursos(): Promise<RecursoDestino[]>;
  obtenerRecurso(id: string): Promise<DetalleRecursoDestino>;
}
