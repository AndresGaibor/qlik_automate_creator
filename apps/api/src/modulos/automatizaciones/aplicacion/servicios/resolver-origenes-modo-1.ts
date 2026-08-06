import { ErrorAplicacion } from "../../../../nucleo/errores/error-aplicacion.js";
import { descubrirRequisitosConexion } from "../../../flujos/publico.js";
import type { SecretoOrigenModo1 } from "./construir-secretos-modo-1.js";
import type {
  DependenciasPrepararParametros,
  EntradaPreparar,
} from "./tipos-parametros-plantilla.js";
import { texto } from "./utiles-parametros-plantilla.js";

export function exigirDependenciasModo1(
  deps: DependenciasPrepararParametros,
): void {
  if (
    !deps.probarConexionOrigen ||
    !deps.leerSecretoOrigen ||
    !deps.obtenerConexionDestinoConSecreto ||
    !deps.probarConexionDestino
  ) {
    throw new ErrorAplicacion(
      "PREPARACION_MODO_1_NO_CONFIGURADA",
      "El servidor no tiene configurada la preparación de Modo 1",
      500,
    );
  }
}

export async function resolverOrigenesModo1(
  deps: DependenciasPrepararParametros,
  entrada: EntradaPreparar,
) {
  const { script } = await deps.qlik.obtenerScriptApp(
    entrada.flujoId,
    "current",
  );
  const DFScript = script ?? "";
  const requisitos = descubrirRequisitosConexion(DFScript);
  const conexiones = await deps.consultarConexionesOrigen(
    entrada.organizacionId,
  );
  const asociadas = requisitos.map((requisito) => ({
    requisito,
    conexion: conexiones.find(
      (item) =>
        item.tipo === requisito.tipo && item.nombre === requisito.nombre,
    ),
  }));
  const faltantes = asociadas
    .filter((item) => !item.conexion?.id)
    .map(({ requisito }) => requisito);
  if (faltantes.length > 0) {
    throw new ErrorAplicacion(
      "CONEXIONES_ORIGEN_FALTANTES",
      "Faltan conexiones requeridas por el Dataflow",
      422,
      { conexiones: faltantes },
    );
  }

  const secretosOrigen: SecretoOrigenModo1[] = [];
  for (const { requisito, conexion } of asociadas) {
    const id = conexion?.id;
    if (!conexion || !id) continue;
    try {
      await deps.probarConexionOrigen?.(entrada.organizacionId, id);
    } catch {
      throw new ErrorAplicacion(
        "CONEXION_ORIGEN_NO_DISPONIBLE",
        `La conexión ${requisito.nombre} no está disponible`,
        422,
        { tipo: requisito.tipo, nombre: requisito.nombre },
      );
    }
    const referencia = obtenerReferenciaSecreto(
      requisito.tipo,
      conexion.config,
    );
    const valor = referencia
      ? await deps.leerSecretoOrigen?.(entrada.organizacionId, id, referencia)
      : null;
    if (!referencia || !valor) {
      throw new ErrorAplicacion(
        "SECRETO_REQUERIDO_FALTANTE",
        `Falta el secreto de la conexión ${requisito.nombre}`,
        422,
        { tipo: requisito.tipo, nombre: requisito.nombre, referencia },
      );
    }
    secretosOrigen.push({ tipo: requisito.tipo, referencia, valor });
  }

  return { DFScript, asociadas, secretosOrigen };
}

function obtenerReferenciaSecreto(
  tipo: "jdbc" | "sftp",
  config: Record<string, unknown>,
): string {
  return texto(
    tipo === "jdbc"
      ? config.secreto_nombre
      : config.secreto_clave_privada_nombre,
  );
}
