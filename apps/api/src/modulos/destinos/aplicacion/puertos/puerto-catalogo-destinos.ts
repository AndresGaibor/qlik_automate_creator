import type {
  EsquemaTablaDestino,
  FlujoDatosDestino,
} from "../../dominio/modelos.js";

export interface PuertoCatalogoDestinos {
  listarBasesDatos(): Promise<string[]>;
  listarTablas(baseDatos: string): Promise<string[]>;
  obtenerEsquemaTabla(
    baseDatos: string,
    tabla: string,
  ): Promise<EsquemaTablaDestino>;
  listarFlujosDatos(): Promise<FlujoDatosDestino[]>;
  obtenerFlujoDatos(id: string): Promise<FlujoDatosDestino>;
}
