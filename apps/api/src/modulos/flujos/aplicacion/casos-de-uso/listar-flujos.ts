import type { ResumenFlujo } from "@qlik/contratos/flujos";
import type { PuertoConsultaFlujos } from "../puertos/puerto-consulta-flujos.js";

export class ListarFlujos {
  constructor(private readonly consulta: PuertoConsultaFlujos) {}

  ejecutar(espacioId?: string): Promise<ResumenFlujo[]> {
    return this.consulta.listar(espacioId);
  }
}
