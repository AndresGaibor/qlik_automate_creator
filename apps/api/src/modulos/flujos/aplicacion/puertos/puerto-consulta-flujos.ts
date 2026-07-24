import type { Flujo } from "../../dominio/flujo.js";

export interface PuertoConsultaFlujos {
  listar(espacioId?: string): Promise<Flujo[]>;
}
