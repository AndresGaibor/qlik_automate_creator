import { ErrorAplicacion } from "../../../../nucleo/errores/error-aplicacion.js";
import { generarUuid } from "../../../../nucleo/valores/generar-uuid.js";
import type {
  DetalleRecursoDestino,
  FabricaDestino,
} from "../../../destinos/publico.js";
import {
  construirCatalogoConexionesSpark,
  descubrirRequisitosConexion,
  parsearScriptQlik,
} from "../../../flujos/publico.js";
import type { PuertoQlik } from "../../../qlik/publico.js";
import {
  type SecretoOrigenModo1,
  construirSecretosModo1,
} from "./construir-secretos-modo-1.js";

export interface ParametrosPlantillaModo1 {
  modo: 1;
  Appid: string;
  DFScript: string;
  ConexionJSON: string;
  BaseDestinoJSON: string;
  SECRETOSJSON: string;
}

export interface ParametrosPlantillaModo2 {
  modo: 2;
  DataflowId: string;
  RutasSftpContenido: string;
  EsquemaTablaDestino: string;
  EjecucionId: string;
  TablaDestino: string;
}

export type ParametrosPlantilla =
  | ParametrosPlantillaModo1
  | ParametrosPlantillaModo2;

interface ConexionOrigenPreparacion {
  id?: string;
  tipo: string;
  nombre: string;
  config: Record<string, unknown>;
  estado?: "sin_probar" | "disponible" | "error";
  probadaEn?: Date | null;
  mensajeError?: string | null;
}

interface ConexionDestinoPreparacion {
  id: string;
  tipo: string;
  nombre: string;
  estado: "activo" | "error" | "desconectado";
  probadaEn: Date | null;
  mensajeError: string | null;
  config: Record<string, unknown>;
  secreto: { nombre: string; valor: string } | null;
}

export interface DependenciasPrepararParametros {
  qlik: PuertoQlik;
  consultarConexionesOrigen(
    organizacionId: string,
  ): Promise<ConexionOrigenPreparacion[]>;
  probarConexionOrigen?: (
    organizacionId: string,
    id: string,
  ) => Promise<unknown>;
  leerSecretoOrigen?: (
    organizacionId: string,
    id: string,
    nombre: string,
  ) => Promise<string | null>;
  obtenerConexionDestinoConSecreto?: (
    destinoId: string,
    organizacionId: string,
  ) => Promise<ConexionDestinoPreparacion | null>;
  probarConexionDestino?: (
    organizacionId: string,
    destinoId: string,
  ) => Promise<unknown>;
  consultarConexionDestino?: (
    destinoId: string,
    organizacionId: string,
  ) => Promise<{ tipo: string; config: Record<string, unknown> } | null>;
  crearCliente?: FabricaDestino;
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
  return entrada.modo === 1
    ? prepararModo1(deps, entrada)
    : prepararModo2(deps, entrada);
}

async function prepararModo1(
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

  const destino = await deps.obtenerConexionDestinoConSecreto?.(
    entrada.destinoId,
    entrada.organizacionId,
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
    await deps.probarConexionDestino?.(entrada.organizacionId, destino.id);
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

  const catalogo = construirCatalogoConexionesSpark(
    parsearScriptQlik(DFScript),
    asociadas.map(({ conexion }) => ({
      tipo: conexion?.tipo ?? "",
      nombre: conexion?.nombre ?? "",
      config: conexion?.config ?? {},
    })),
  );
  const usuarioDestino = texto(destino.config.user);
  const baseDestino = {
    tipo: "postgres",
    host: texto(destino.config.host),
    puerto: numero(destino.config.port, 5432),
    database: texto(destino.config.database),
    esquema: texto(destino.config.schema) || "public",
    secreto_nombre: destino.secreto.nombre,
  };
  const secretos = construirSecretosModo1(secretosOrigen, {
    referencia: destino.secreto.nombre,
    usuario: usuarioDestino,
    password: destino.secreto.valor,
  });

  return {
    modo: 1,
    Appid: entrada.flujoId,
    DFScript,
    ConexionJSON: JSON.stringify(catalogo),
    BaseDestinoJSON: JSON.stringify(baseDestino),
    SECRETOSJSON: JSON.stringify(secretos),
  };
}

function exigirDependenciasModo1(deps: DependenciasPrepararParametros): void {
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

  const scriptRes = await deps.qlik.obtenerScriptApp(
    entrada.flujoId,
    "current",
  );
  const conexionesOrigen = await deps.consultarConexionesOrigen(
    entrada.organizacionId,
  );
  const configuracionesCatalogos = conexionesOrigen.map((c) => ({
    tipo: c.tipo,
    nombre: c.nombre,
    config: c.config,
  }));

  const descubierto = parsearScriptQlik(scriptRes.script || "");
  const catalogo = construirCatalogoConexionesSpark(
    descubierto,
    configuracionesCatalogos,
  );

  if (!catalogo.sftp || catalogo.sftp.length === 0) {
    throw new ErrorAplicacion(
      "SFTP_NO_CONFIGURADO",
      "El Dataflow no declara una ruta SFTP para el modo 2",
      422,
    );
  }
  const RutasSftpContenido = JSON.stringify(catalogo.sftp);

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
  const EsquemaTablaDestino = JSON.stringify(recurso);

  return {
    modo: 2,
    DataflowId: entrada.flujoId,
    RutasSftpContenido,
    EsquemaTablaDestino,
    EjecucionId: generarUuid(),
    TablaDestino: tablaDestino,
  };
}

function texto(valor: unknown): string {
  return typeof valor === "string" ? valor.trim() : "";
}

function numero(valor: unknown, predeterminado: number): number {
  return typeof valor === "number" && Number.isFinite(valor)
    ? valor
    : predeterminado;
}
