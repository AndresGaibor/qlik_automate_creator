import { ErrorAplicacion } from "../../../../nucleo/errores/error-aplicacion.js";
import type { ParametrosPlantilla } from "./preparar-parametros-plantilla.js";

const VARIABLES_POR_MODO = {
  1: ["Appid", "DFScript", "ConexionJSON", "BaseDestinoJSON", "SECRETOSJSON"],
  2: [
    "DataflowId",
    "RutasSftpContenido",
    "EsquemaTablaDestino",
    "EjecucionId",
    "TablaDestino",
  ],
} as const;

function clonarWorkspace(
  workspace: Record<string, unknown>,
): Record<string, unknown> {
  return structuredClone(workspace);
}

function obtenerOperacionVariable(
  block: Record<string, unknown>,
  modo: 1 | 2,
): Record<string, unknown> | undefined {
  const operaciones = Array.isArray(block.operations)
    ? (block.operations as Array<Record<string, unknown>>)
    : [];
  return (
    operaciones.find((operacion) => operacion.id === "set_value") ??
    (modo === 2 ? operaciones[0] : undefined)
  );
}

function nombresDisponibles(
  workspace: Record<string, unknown>,
  modo: 1 | 2,
): Set<string> {
  const nombres = new Set<string>();
  const variables = Array.isArray(workspace.variables)
    ? (workspace.variables as Array<Record<string, unknown>>)
    : [];
  for (const variable of variables) {
    const nombre = String(variable.name ?? "");
    if (nombre) nombres.add(nombre);
  }
  const bloques = Array.isArray(workspace.blocks)
    ? (workspace.blocks as Array<Record<string, unknown>>)
    : [];
  for (const bloque of bloques) {
    if (bloque.type !== "VariableBlock") continue;
    const nombre = String(bloque.name ?? "");
    if (nombre && obtenerOperacionVariable(bloque, modo)) nombres.add(nombre);
  }
  return nombres;
}

function aplicarVariables(
  workspace: Record<string, unknown>,
  valores: Map<string, unknown>,
  modo: 1 | 2,
): void {
  const variables = Array.isArray(workspace.variables)
    ? (workspace.variables as Array<Record<string, unknown>>)
    : [];
  for (const variable of variables) {
    const nombre = String(variable.name ?? "");
    if (valores.has(nombre)) variable.value = valores.get(nombre);
  }

  const bloques = Array.isArray(workspace.blocks)
    ? (workspace.blocks as Array<Record<string, unknown>>)
    : [];
  for (const bloque of bloques) {
    if (bloque.type !== "VariableBlock") continue;
    const nombre = String(bloque.name ?? "");
    if (!valores.has(nombre)) continue;
    const operacion = obtenerOperacionVariable(bloque, modo);
    if (operacion) operacion.value = valores.get(nombre);
  }
}

export function configurarWorkspacePlantilla(
  workspace: Record<string, unknown>,
  parametros: ParametrosPlantilla,
): Record<string, unknown> {
  const resultado = clonarWorkspace(workspace);
  const requeridas = VARIABLES_POR_MODO[parametros.modo];
  const disponibles = nombresDisponibles(resultado, parametros.modo);
  const faltantes = requeridas.filter((nombre) => !disponibles.has(nombre));

  if (faltantes.length > 0) {
    throw new ErrorAplicacion(
      parametros.modo === 1
        ? "VARIABLES_PLANTILLA_FALTANTES"
        : "PLANTILLA_INCOMPATIBLE",
      `La plantilla no define las variables requeridas para el modo ${parametros.modo}: ${faltantes.join(", ")}`,
      422,
      { modo: parametros.modo, variablesFaltantes: faltantes },
    );
  }

  const valores = new Map<string, unknown>();
  if (parametros.modo === 1) {
    valores.set("Appid", parametros.Appid);
    valores.set("DFScript", parametros.DFScript);
    valores.set("ConexionJSON", parametros.ConexionJSON);
    valores.set("BaseDestinoJSON", parametros.BaseDestinoJSON);
    valores.set("SECRETOSJSON", parametros.SECRETOSJSON);
  } else {
    valores.set("DataflowId", parametros.DataflowId);
    valores.set("RutasSftpContenido", parametros.RutasSftpContenido);
    valores.set("EsquemaTablaDestino", parametros.EsquemaTablaDestino);
    valores.set("EjecucionId", parametros.EjecucionId);
    valores.set("TablaDestino", parametros.TablaDestino);
  }

  aplicarVariables(resultado, valores, parametros.modo);
  return resultado;
}
