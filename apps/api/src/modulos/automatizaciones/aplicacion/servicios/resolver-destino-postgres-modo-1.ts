import { ErrorAplicacion } from "../../../../nucleo/errores/error-aplicacion.js";
import type { DependenciasPrepararParametros } from "./tipos-parametros-plantilla.js";
import { numero, texto } from "./utiles-parametros-plantilla.js";

export async function resolverDestinoPostgresModo1(
  deps: DependenciasPrepararParametros,
  organizacionId: string,
  destinoId: string,
) {
  const destino = await deps.obtenerConexionDestinoConSecreto?.(
    destinoId,
    organizacionId,
  );
  if (!destino) {
    throw new ErrorAplicacion(
      "DESTINO_POSTGRES_NO_ENCONTRADO",
      "La base destino PostgreSQL no existe",
      404,
    );
  }
  if (destino.tipo !== "postgres") {
    throw new ErrorAplicacion(
      "DESTINO_POSTGRES_REQUERIDO",
      "El destino seleccionado debe ser PostgreSQL",
      422,
    );
  }
  try {
    await deps.probarConexionDestino?.(organizacionId, destino.id);
  } catch {
    throw new ErrorAplicacion(
      "DESTINO_POSTGRES_NO_DISPONIBLE",
      "No se pudo conectar con el destino PostgreSQL",
      422,
    );
  }
  if (!destino.secreto?.nombre || !destino.secreto.valor) {
    throw new ErrorAplicacion(
      "SECRETO_REQUERIDO_FALTANTE",
      "Falta el secreto del destino PostgreSQL",
      422,
      { tipo: "postgres", nombre: destino.nombre },
    );
  }

  return {
    baseDestino: {
      tipo: "postgres",
      host: texto(destino.config.host),
      puerto: numero(destino.config.port, 5432),
      database: texto(destino.config.database),
      esquema: texto(destino.config.schema) || "public",
      secreto_nombre: destino.secreto.nombre,
    },
    secretoDestino: {
      referencia: destino.secreto.nombre,
      usuario: texto(destino.config.user),
      password: destino.secreto.valor,
    },
  };
}
