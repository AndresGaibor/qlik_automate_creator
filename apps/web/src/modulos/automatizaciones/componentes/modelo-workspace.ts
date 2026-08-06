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
