import { ErrorAplicacion } from "../../../../nucleo/errores/error-aplicacion.js";
import {
  construirCatalogoConexionesSpark,
  parsearScriptQlik,
} from "../../../flujos/publico.js";
import { construirSecretosModo1 } from "./construir-secretos-modo-1.js";
import { resolverDestinoPostgresModo1 } from "./resolver-destino-postgres-modo-1.js";
import {
  exigirDependenciasModo1,
  resolverOrigenesModo1,
} from "./resolver-origenes-modo-1.js";
import type {
  DependenciasPrepararParametros,
  EntradaPreparar,
  ParametrosPlantillaModo1,
} from "./tipos-parametros-plantilla.js";

export async function prepararParametrosModo1(
  deps: DependenciasPrepararParametros,
  entrada: EntradaPreparar,
): Promise<ParametrosPlantillaModo1> {
  if (!entrada.destinoId) {
    throw new ErrorAplicacion(
      "DESTINO_POSTGRES_REQUERIDO",
      "Selecciona una base destino PostgreSQL",
      422,
    );
  }
  exigirDependenciasModo1(deps);

  const { DFScript, asociadas, secretosOrigen } = await resolverOrigenesModo1(
    deps,
    entrada,
  );
  const { baseDestino, secretoDestino } = await resolverDestinoPostgresModo1(
    deps,
    entrada.organizacionId,
    entrada.destinoId,
  );
  const catalogo = construirCatalogoConexionesSpark(
    parsearScriptQlik(DFScript),
    asociadas.map(({ conexion }) => ({
      tipo: conexion?.tipo ?? "",
      nombre: conexion?.nombre ?? "",
      config: conexion?.config ?? {},
    })),
  );
  const secretos = construirSecretosModo1(secretosOrigen, secretoDestino);

  return {
    modo: 1,
    Appid: entrada.flujoId,
    DFScript,
    ConexionJSON: JSON.stringify(catalogo),
    BaseDestinoJSON: JSON.stringify(baseDestino),
    SECRETOSJSON: JSON.stringify(secretos),
  };
}
