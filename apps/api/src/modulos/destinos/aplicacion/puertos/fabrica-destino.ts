import type { TipoDestino } from "../../dominio/tipos-destino.js";
import type { PuertoDestino } from "./puerto-destino.js";

export interface ConfigConexionDestino {
  tipo: TipoDestino;
  config: Record<string, unknown>;
}

export type FabricaDestino = (conexion: ConfigConexionDestino) => PuertoDestino;
