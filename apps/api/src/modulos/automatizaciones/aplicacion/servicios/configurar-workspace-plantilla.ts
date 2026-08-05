import type { ParametrosPlantilla } from "./preparar-parametros-plantilla.js";
import { ErrorAplicacion } from "../../../../nucleo/errores/error-aplicacion.js";

const VARIABLES_POR_MODO = {
  1: [
    "DataflowId",
    "DataflowScriptContenido",
    "ConexionesContenido",
    "EjecucionId",
    "TablaDestino",
  ],
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

function obtenerOperaciones(
  block: Record<string, unknown>,
): Array<Record<string, unknown>> {
  const b = block as Record<string, unknown>;
  const ops = b.operations ?? b["operations"];
  return Array.isArray(ops) ? (ops as Array<Record<string, unknown>>) : [];
}

function recopilarVariablesWorkspace(
  workspace: Record<string, unknown>,
): Map<string, unknown> {
  const valores = new Map<string, unknown>();

  const variables = Array.isArray(workspace.variables)
    ? (workspace.variables as Array<Record<string, unknown>>)
    : [];
  for (const v of variables) {
    const name = String(v.name ?? "");
    if (name) {
      valores.set(name, v.value);
    }
  }

  const blocks = Array.isArray(workspace.blocks)
    ? (workspace.blocks as Array<Record<string, unknown>>)
    : [];
  for (const block of blocks) {
    if (String(block.type ?? "") === "VariableBlock") {
      const name = String(block.name ?? "");
      const ops = obtenerOperaciones(block);
      if (name && ops.length > 0) {
        valores.set(name, ops[0].value);
      }
    }
  }

  return valores;
}

function aplicarVariablesEnWorkspace(
  workspace: Record<string, unknown>,
  valores: Map<string, unknown>,
): void {
  const variables = Array.isArray(workspace.variables)
    ? (workspace.variables as Array<Record<string, unknown>>)
    : [];
  for (const v of variables) {
    const name = String(v.name ?? "");
    if (name && valores.has(name)) {
      v.value = valores.get(name);
    }
  }

  const blocks = Array.isArray(workspace.blocks)
    ? (workspace.blocks as Array<Record<string, unknown>>)
    : [];
  for (const block of blocks) {
    if (String(block.type ?? "") === "VariableBlock") {
      const name = String(block.name ?? "");
      if (name && valores.has(name)) {
        const ops = obtenerOperaciones(block);
        if (ops.length > 0) {
          ops[0].value = valores.get(name);
        }
      }
    }
  }
}

export function configurarWorkspacePlantilla(
  workspace: Record<string, unknown>,
  parametros: ParametrosPlantilla,
): Record<string, unknown> {
  const modo = parametros.modo;
  const nombresRequeridos = VARIABLES_POR_MODO[modo];

  const result = clonarWorkspace(workspace);
  const valoresActuales = recopilarVariablesWorkspace(result);

  const faltantes: string[] = [];
  for (const nombre of nombresRequeridos) {
    if (!valoresActuales.has(nombre)) {
      faltantes.push(nombre);
    }
  }

  if (faltantes.length > 0) {
    throw new ErrorAplicacion(
      "PLANTILLA_INCOMPATIBLE",
      `La plantilla no define las variables requeridas para el modo ${modo}: ${faltantes.join(", ")}`,
      422,
      { modo, variablesFaltantes: faltantes },
    );
  }

  const nuevosValores = new Map<string, unknown>();
  if (modo === 1) {
    const p =
      parametros as import("./preparar-parametros-plantilla.js").ParametrosPlantillaModo1;
    nuevosValores.set("DataflowId", p.DataflowId);
    nuevosValores.set("DataflowScriptContenido", p.DataflowScriptContenido);
    nuevosValores.set("ConexionesContenido", p.ConexionesContenido);
    nuevosValores.set("EjecucionId", p.EjecucionId);
    nuevosValores.set("TablaDestino", p.TablaDestino);
  } else {
    const p =
      parametros as import("./preparar-parametros-plantilla.js").ParametrosPlantillaModo2;
    nuevosValores.set("DataflowId", p.DataflowId);
    nuevosValores.set("RutasSftpContenido", p.RutasSftpContenido);
    nuevosValores.set("EsquemaTablaDestino", p.EsquemaTablaDestino);
    nuevosValores.set("EjecucionId", p.EjecucionId);
    nuevosValores.set("TablaDestino", p.TablaDestino);
  }

  aplicarVariablesEnWorkspace(result, nuevosValores);
  return result;
}
