import type { PuertoQlik } from "../../../qlik/aplicacion/puertos/puerto-qlik.js";
import { parsearScriptQlik } from "../../../flujos/aplicacion/generador-catalogo-spark.js";
import { construirCatalogoConexionesSpark } from "../../../flujos/aplicacion/generador-catalogo-spark.js";
import { ErrorAplicacion } from "../../../../nucleo/errores/error-aplicacion.js";
import { generarUuid } from "../../../../nucleo/valores/generar-uuid.js";
import { crearClienteDestino } from "../../../destinos/aplicacion/fabrica-destinos.js";
import type { DetalleRecursoDestino } from "../../../destinos/dominio/tipos-destino.js";

export interface ParametrosPlantillaModo1 {
  modo: 1;
  DataflowId: string;
  DataflowScriptContenido: string;
  ConexionesContenido: string;
  EjecucionId: string;
  TablaDestino: string;
}

export interface ParametrosPlantillaModo2 {
  modo: 2;
  DataflowId: string;
  RutasSftpContenido: string;
  EsquemaTablaDestino: string;
  EjecucionId: string;
  TablaDestino: string;
}

export type ParametrosPlantilla = ParametrosPlantillaModo1 | ParametrosPlantillaModo2;

export interface DependenciasPrepararParametros {
  qlik: PuertoQlik;
  consultarConexionesOrigen: (
    organizacionId: string,
  ) => Promise<Array<{ tipo: string; nombre: string; config: Record<string, unknown> }>>;
  consultarConexionDestino?: (
    destinoId: string,
    organizacionId: string,
  ) => Promise<{ tipo: string; config: Record<string, unknown> } | null>;
  crearCliente?: (conexion: { tipo: string; config: Record<string, unknown> }) => unknown;
}

interface EntradaPreparar {
  modo: 1 | 2;
  organizacionId: string;
  flujoId: string;
  tablaId?: string;
  destinoId?: string;
}

function validarTablaDestino(tablaId: string | undefined): string {
  const trimmed = tablaId?.trim() ?? "";
  if (!trimmed) {
    throw new ErrorAplicacion(
      "TABLA_DESTINO_REQUERIDA",
      "Tabla destino es requerida",
      422,
    );
  }
  return trimmed;
}

export async function prepararParametrosPlantilla(
  deps: DependenciasPrepararParametros,
  entrada: EntradaPreparar,
): Promise<ParametrosPlantilla> {
  if (entrada.modo === 1) {
    return prepararModo1(deps, entrada);
  }
  return prepararModo2(deps, entrada);
}

async function prepararModo1(
  deps: DependenciasPrepararParametros,
  entrada: EntradaPreparar,
): Promise<ParametrosPlantillaModo1> {
  const TablaDestino = validarTablaDestino(entrada.tablaId);

  const scriptRes = await deps.qlik.obtenerScriptApp(entrada.flujoId, "current");
  const DataflowScriptContenido = scriptRes.script || "";

  const conexionesOrigen = await deps.consultarConexionesOrigen(
    entrada.organizacionId,
  );
  const configuracionesCatalogos = conexionesOrigen.map((c) => ({
    tipo: c.tipo,
    nombre: c.nombre,
    config: c.config,
  }));

  const descubierto = parsearScriptQlik(DataflowScriptContenido);
  const catalogo = construirCatalogoConexionesSpark(descubierto, configuracionesCatalogos);
  const ConexionesContenido = JSON.stringify(catalogo);

  const EjecucionId = generarUuid();

  return {
    modo: 1,
    DataflowId: entrada.flujoId,
    DataflowScriptContenido,
    ConexionesContenido,
    EjecucionId,
    TablaDestino,
  };
}

async function prepararModo2(
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

  const scriptRes = await deps.qlik.obtenerScriptApp(entrada.flujoId, "current");
  const conexionesOrigen = await deps.consultarConexionesOrigen(entrada.organizacionId);
  const configuracionesCatalogos = conexionesOrigen.map((c) => ({
    tipo: c.tipo,
    nombre: c.nombre,
    config: c.config,
  }));

  const descubierto = parsearScriptQlik(scriptRes.script || "");
  const catalogo = construirCatalogoConexionesSpark(descubierto, configuracionesCatalogos);

  if (!catalogo.sftp || catalogo.sftp.length === 0) {
    throw new ErrorAplicacion(
      "SFTP_NO_CONFIGURADO",
      "El Dataflow no declara una ruta SFTP para el modo 2",
      422,
    );
  }
  const RutasSftpContenido = JSON.stringify(catalogo.sftp);

  const crearClienteFn = deps.crearCliente ?? crearClienteDestino;
  const cliente = crearClienteFn({
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
  const EsquemaTablaDestino = JSON.stringify(recurso);

  const EjecucionId = generarUuid();

  return {
    modo: 2,
    DataflowId: entrada.flujoId,
    RutasSftpContenido,
    EsquemaTablaDestino,
    EjecucionId,
    TablaDestino: tablaDestino,
  };
}
