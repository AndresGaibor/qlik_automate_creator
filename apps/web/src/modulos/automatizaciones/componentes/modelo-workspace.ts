import type { IconName } from "@/compartido/componentes/ui/icon";

export interface InputWorkspace {
  id: string;
  label: string;
  type?: string;
  value?: unknown;
}

export interface BloqueWorkspace {
  id: string;
  type: string;
  title: string;
  connector?: string;
  operation?: string;
  childId?: string;
  nextBlockId?: string;
  inputs: InputWorkspace[];
  comment: string | null;
  disabled: boolean;
}

export interface WorkspaceProcesado {
  bloquesRaw: Record<string, unknown>[];
  bloques: BloqueWorkspace[];
}

export interface TipoBadgeWorkspace {
  bg: string;
  icon: IconName;
  label: string;
}

export function procesarBloquesWorkspace(
  workspace: Record<string, unknown>,
): WorkspaceProcesado {
  const bloquesRaw = (
    Array.isArray(workspace.blocks) ? workspace.blocks : []
  ) as Record<string, unknown>[];

  return {
    bloquesRaw,
    bloques: bloquesRaw.map(procesarBloque),
  };
}

function procesarBloque(bloque: Record<string, unknown>): BloqueWorkspace {
  const inputsRaw = (
    Array.isArray(bloque.inputs) ? bloque.inputs : []
  ) as Record<string, unknown>[];
  const childId = bloque.childId ? String(bloque.childId) : undefined;

  return {
    id: String(bloque.id || ""),
    type: String(bloque.type || bloque.blockType || "Block"),
    title: String(
      bloque.displayName ||
        bloque.name ||
        bloque.title ||
        bloque.type ||
        "Bloque sin título",
    ),
    connector: valorOpcional(bloque.connector || bloque.connectorId),
    operation: valorOpcional(bloque.operation || bloque.action),
    childId,
    nextBlockId: valorOpcional(bloque.nextBlockId) ?? childId,
    inputs: inputsRaw.map((input) => ({
      id: String(input.id || input.name || ""),
      label: input.label
        ? String(input.label)
        : String(input.id || input.name || ""),
      type: valorOpcional(input.type),
      value: input.value,
    })),
    comment: typeof bloque.comment === "string" ? bloque.comment : null,
    disabled: Boolean(bloque.disabled),
  };
}

function valorOpcional(valor: unknown): string | undefined {
  return valor ? String(valor) : undefined;
}

export function presentarValorEntrada(valor: unknown): {
  texto: string;
  vacio: boolean;
} {
  if (valor === null || valor === undefined) {
    return { texto: "sin configurar", vacio: true };
  }
  return {
    texto: typeof valor === "object" ? JSON.stringify(valor) : String(valor),
    vacio: false,
  };
}

export function obtenerTipoBadge(type: string): TipoBadgeWorkspace {
  if (type.includes("Start")) {
    return {
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: "play",
      label: "Inicio / Disparador",
    };
  }
  if (type.includes("Endpoint")) {
    return {
      bg: "bg-sky-50 text-sky-700 border-sky-200",
      icon: "zap",
      label: "Acción API / Conector",
    };
  }
  if (type.includes("Show") || type.includes("Output")) {
    return {
      bg: "bg-indigo-50 text-indigo-700 border-indigo-200",
      icon: "sparkles",
      label: "Salida / Output",
    };
  }
  if (type.includes("Stop")) {
    return {
      bg: "bg-rose-50 text-rose-700 border-rose-200",
      icon: "x",
      label: "Fin de Flujo",
    };
  }
  return {
    bg: "bg-slate-100 text-slate-700 border-slate-200",
    icon: "flow",
    label: type,
  };
}

export interface ParametroResumenWorkspace {
  clave: string;
  valor: unknown;
}

export interface GrupoResumenWorkspace {
  clave: string;
  items: ParametroResumenWorkspace[];
}

export interface BloqueResumenWorkspace {
  tipo: string;
  nombre: string;
  parametros: ParametroResumenWorkspace[];
  grupos: GrupoResumenWorkspace[];
}

export interface VariableResumenWorkspace {
  nombre: string;
  valor: unknown;
}

export interface FlujoReferenciable {
  id: string;
  nombre: string;
}

export interface ReferenciaWorkspace {
  nombreDataflow: string;
  flujoId: string | null;
  archivoODataset: string;
  extension: string;
  tablaDestino: string;
}

export function extraerBloquesResumen(
  workspace: Record<string, unknown>,
): BloqueResumenWorkspace[] {
  const bloques = workspace.blocks;
  if (!Array.isArray(bloques)) return [];

  return bloques.map((bloque, indice) => {
    const actual = bloque as Record<string, unknown>;
    const tipo = String(actual.type ?? actual.blockType ?? "desconocido");
    const nombre = String(actual.name ?? actual.title ?? `Bloque ${indice}`);
    const settings = (actual.settings ?? actual.parameters ?? {}) as Record<
      string,
      unknown
    >;
    const grupos: GrupoResumenWorkspace[] = [];
    const parametros: ParametroResumenWorkspace[] = [];

    for (const [clave, valor] of entriesValidasResumen(settings)) {
      if (Array.isArray(valor)) {
        if (valor.length > 0 && typeof valor[0] === "object") {
          const items: ParametroResumenWorkspace[] = [];
          for (const item of valor) {
            if (typeof item === "object" && item !== null) {
              for (const [itemClave, itemValor] of entriesValidasResumen(
                item,
              )) {
                items.push({ clave: itemClave, valor: itemValor });
              }
            } else {
              items.push({ clave, valor: item });
            }
          }
          grupos.push({ clave, items });
        } else {
          parametros.push({ clave, valor });
        }
      } else if (typeof valor === "object" && valor !== null) {
        for (const [itemClave, itemValor] of entriesValidasResumen(valor)) {
          parametros.push({ clave: `${clave}.${itemClave}`, valor: itemValor });
        }
      } else {
        parametros.push({ clave, valor });
      }
    }

    if (actual.connectorId && tipo === "EndpointBlock") {
      parametros.push({ clave: "connectorId", valor: actual.connectorId });
    }
    if (actual.endpointId && tipo === "EndpointBlock") {
      parametros.push({ clave: "endpointId", valor: actual.endpointId });
    }
    if (actual.snippetId) {
      parametros.push({ clave: "snippetId", valor: actual.snippetId });
    }

    return { tipo, nombre, parametros, grupos };
  });
}

export function extraerVariablesResumen(
  workspace: Record<string, unknown>,
): VariableResumenWorkspace[] {
  const variables = workspace.variables;
  const bloques = workspace.blocks;
  const valoresOperaciones: Record<string, unknown> = {};

  if (Array.isArray(bloques)) {
    for (const bloque of bloques) {
      const actual = bloque as Record<string, unknown>;
      if (actual.type !== "VariableBlock" || !actual.name) continue;
      const operaciones = actual.operations as
        | Array<Record<string, unknown>>
        | undefined;
      if (
        Array.isArray(operaciones) &&
        operaciones.length > 0 &&
        operaciones[0].value !== undefined
      ) {
        valoresOperaciones[String(actual.name)] = operaciones[0].value;
      }
    }
  }
  if (!Array.isArray(variables)) return [];

  return variables.map((variableRaw) => {
    const variable = variableRaw as Record<string, unknown>;
    const nombre = String(variable.name ?? "sin nombre");
    const valorDirecto = variable.value ?? variable.defaultValue;
    return {
      nombre,
      valor:
        valorDirecto !== undefined && valorDirecto !== ""
          ? valorDirecto
          : (valoresOperaciones[nombre] ?? ""),
    };
  });
}

export function construirReferenciaWorkspace(
  variables: VariableResumenWorkspace[],
  flujos: FlujoReferenciable[],
): ReferenciaWorkspace | null {
  const valor = (nombre: string) =>
    String(
      variables.find((variable) => variable.nombre === nombre)?.valor || "",
    );
  const appid = valor("Appid");
  const dataset = valor("Dataset");
  const archivo = valor("ArchivoEntrada");
  const tablaDestino = valor("TablaDestino");
  const extension = valor("Extension");
  if (!appid && !dataset && !tablaDestino) return null;

  const referenciaNombre = (dataset || archivo).toLowerCase();
  const flujo = flujos.find(
    (item) =>
      item.id === appid ||
      (referenciaNombre &&
        item.nombre.toLowerCase().includes(referenciaNombre)),
  );
  return {
    nombreDataflow:
      flujo?.nombre ||
      dataset ||
      archivo ||
      (appid ? `Flujo (${appid.slice(0, 8)}...)` : "—"),
    flujoId: flujo?.id ?? null,
    archivoODataset: archivo || dataset,
    extension,
    tablaDestino,
  };
}

function entriesValidasResumen(valor: unknown): Array<[string, unknown]> {
  if (typeof valor !== "object" || valor === null) return [];
  return Object.entries(valor as Record<string, unknown>).filter(
    ([clave]) => !clave.startsWith("_") && !clave.startsWith("internal"),
  );
}
