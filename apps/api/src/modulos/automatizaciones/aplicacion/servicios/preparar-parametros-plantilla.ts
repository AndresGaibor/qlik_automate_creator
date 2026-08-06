import { prepararParametrosModo1 } from "./preparar-parametros-modo-1.js";
import { prepararParametrosModo2 } from "./preparar-parametros-modo-2.js";
import type {
  DependenciasPrepararParametros,
  EntradaPreparar,
  ParametrosPlantilla,
} from "./tipos-parametros-plantilla.js";

export type {
  DependenciasPrepararParametros,
  ParametrosPlantilla,
  ParametrosPlantillaModo1,
  ParametrosPlantillaModo2,
} from "./tipos-parametros-plantilla.js";

export async function prepararParametrosPlantilla(
  deps: DependenciasPrepararParametros,
  entrada: EntradaPreparar,
): Promise<ParametrosPlantilla> {
  return entrada.modo === 1
    ? prepararParametrosModo1(deps, entrada)
    : prepararParametrosModo2(deps, entrada);
}
