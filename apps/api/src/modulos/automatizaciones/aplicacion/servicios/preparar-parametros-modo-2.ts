import { ErrorAplicacion } from "../../../../nucleo/errores/error-aplicacion.js";
import { generarUuid } from "../../../../nucleo/valores/generar-uuid.js";
import type { DetalleRecursoDestino } from "../../../destinos/publico.js";
import {
  construirCatalogoConexionesSpark,
  parsearScriptQlik,
} from "../../../flujos/publico.js";
import type {
  DependenciasPrepararParametros,
  EntradaPreparar,
  ParametrosPlantillaModo2,
} from "./tipos-parametros-plantilla.js";
import { validarTablaDestino } from "./utiles-parametros-plantilla.js";

export async function prepararParametrosModo2(
  deps: DependenciasPrepararParametros,
  entrada: EntradaPreparar,
): Promise<ParametrosPlantillaModo2> {
  if (!entrada.destinoId) {
    throw new ErrorAplicacion(
      "DESTINO_REQUERIDO_MODO_2",
      "Destino es requerido para modo 2",
      422,
    );
  }
  const tablaDestino = validarTablaDestino(entrada.tablaId);
  if (!deps.consultarConexionDestino) {
    throw new ErrorAplicacion(
      "DESTINO_REQUERIDO_MODO_2",
      "Destino es requerido para modo 2",
      422,
    );
  }

  const conexionDestino = await deps.consultarConexionDestino(
    entrada.destinoId,
    entrada.organizacionId,
  );
  if (!conexionDestino) {
    throw new ErrorAplicacion(
      "DESTINO_NO_ENCONTRADO",
      "Conexión destino no encontrada",
      404,
    );
  }

  const scriptRes = await deps.qlik.obtenerScriptApp(
    entrada.flujoId,
    "current",
  );
  const conexionesOrigen = await deps.consultarConexionesOrigen(
    entrada.organizacionId,
  );
  const catalogo = construirCatalogoConexionesSpark(
    parsearScriptQlik(scriptRes.script || ""),
    conexionesOrigen.map((conexion) => ({
      tipo: conexion.tipo,
      nombre: conexion.nombre,
      config: conexion.config,
    })),
  );
  if (!catalogo.sftp || catalogo.sftp.length === 0) {
    throw new ErrorAplicacion(
      "SFTP_NO_CONFIGURADO",
      "El Dataflow no declara una ruta SFTP para el modo 2",
      422,
    );
  }
  if (!deps.crearCliente) {
    throw new ErrorAplicacion(
      "FABRICA_DESTINO_NO_CONFIGURADA",
      "No se configuró la fábrica de destinos",
      500,
    );
  }

  const cliente = deps.crearCliente({
    tipo: conexionDestino.tipo as "postgres" | "bigquery" | "impala" | "sftp",
    config: conexionDestino.config,
  }) as { obtenerRecurso: (id: string) => Promise<DetalleRecursoDestino> };
  const recurso = await cliente.obtenerRecurso(tablaDestino);
  if (!recurso.columnas || recurso.columnas.length === 0) {
    throw new ErrorAplicacion(
      "DESTINO_SIN_COLUMNAS",
      "El recurso destino no tiene columnas definidas",
      422,
    );
  }

  return {
    modo: 2,
    DataflowId: entrada.flujoId,
    RutasSftpContenido: JSON.stringify(catalogo.sftp),
    EsquemaTablaDestino: JSON.stringify(recurso),
    EjecucionId: generarUuid(),
    TablaDestino: tablaDestino,
  };
}
