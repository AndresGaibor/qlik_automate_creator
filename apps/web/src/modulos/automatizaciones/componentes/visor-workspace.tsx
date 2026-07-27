import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/compartido/componentes/ui/card";
import { Icon } from "@/compartido/componentes/ui/icon";
import type { WorkspaceAutomatizacion } from "@/modulos/automatizaciones/api";

interface Props {
  workspace: WorkspaceAutomatizacion;
}

interface ParamEntry {
  clave: string;
  valor: unknown;
}

interface BloqueInfo {
  tipo: string;
  nombre: string;
  parametros: ParamEntry[];
  grupos: Array<{ clave: string; items: ParamEntry[] }>;
}

interface VariableInfo {
  nombre: string;
  valor: unknown;
}

function entriesSinInternos(
  obj: Record<string, unknown>,
): Array<[string, unknown]> {
  return Object.entries(obj).filter(
    ([k]) => !k.startsWith("_") && !k.startsWith("internal"),
  );
}

function entriesValidas(
  obj: unknown,
): Array<[string, unknown]> {
  if (typeof obj !== "object" || obj === null) return [];
  return entriesSinInternos(obj as Record<string, unknown>);
}

function extraerBloques(workspace: Record<string, unknown>): BloqueInfo[] {
  const blocks = workspace.blocks;
  if (!Array.isArray(blocks)) return [];

  return blocks.map((bloque, indice) => {
    const b = bloque as Record<string, unknown>;
    const tipo = String(b.type ?? b.blockType ?? "desconocido");
    const nombre = String(b.name ?? b.title ?? `Bloque ${indice}`);

    const settings = (b.settings ?? b.parameters ?? {}) as Record<string, unknown>;

    const grupos: BloqueInfo["grupos"] = [];
    const parametros: ParamEntry[] = [];

    for (const [clave, valor] of entriesValidas(settings)) {
      if (Array.isArray(valor)) {
        if (valor.length > 0 && typeof valor[0] === "object") {
          const items: ParamEntry[] = [];
          for (const item of valor as unknown[]) {
            if (typeof item === "object" && item !== null) {
              for (const [ik, iv] of entriesValidas(item)) {
                items.push({ clave: ik, valor: iv });
              }
            } else {
              items.push({ clave: clave, valor: item });
            }
          }
          grupos.push({ clave, items });
        } else {
          parametros.push({ clave, valor });
        }
      } else if (typeof valor === "object" && valor !== null) {
        for (const [ik, iv] of entriesValidas(valor)) {
          parametros.push({ clave: `${clave}.${ik}`, valor: iv });
        }
      } else {
        parametros.push({ clave, valor });
      }
    }

    if (b.connectorId && tipo === "EndpointBlock") {
      parametros.push({ clave: "connectorId", valor: b.connectorId });
    }
    if (b.endpointId && tipo === "EndpointBlock") {
      parametros.push({ clave: "endpointId", valor: b.endpointId });
    }
    if (b.snippetId) {
      parametros.push({ clave: "snippetId", valor: b.snippetId });
    }

    return { tipo, nombre, parametros, grupos };
  });
}

function extraerVariables(workspace: Record<string, unknown>): VariableInfo[] {
  const vars = workspace.variables;
  if (!Array.isArray(vars)) return [];

  return vars.map((v) => {
    const variable = v as Record<string, unknown>;
    return {
      nombre: String(variable.name ?? "sin nombre"),
      valor: variable.value ?? variable.defaultValue ?? "",
    };
  });
}

function JsonVer({ data }: { data: unknown }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className="text-left"
    >
      <span className="text-xs text-ink-400 font-medium">{open ? "▼" : "▶"} Ver valor</span>
      {open && (
        <pre className="mt-1 p-2 bg-ink-50 rounded text-xs font-mono text-ink-700 overflow-x-auto whitespace-pre-wrap break-all max-h-48">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </button>
  );
}

function ValorCelda({ valor }: { valor: unknown }) {
  if (typeof valor === "boolean") {
    return (
      <span className={`font-mono text-xs px-1.5 py-0.5 rounded ${valor ? "bg-brand-50 text-brand-700" : "bg-ink-100 text-ink-600"}`}>
        {valor ? "true" : "false"}
      </span>
    );
  }
  if (typeof valor === "number") {
    return <span className="font-mono text-xs text-ink-700">{valor}</span>;
  }
  if (valor === null || valor === undefined || valor === "") {
    return <span className="font-mono text-xs text-ink-400 italic">—</span>;
  }
  if (typeof valor === "string") {
    if (valor.length > 60) {
      return <JsonVer data={valor} />;
    }
    return <span className="font-mono text-xs text-ink-700 break-all">{valor}</span>;
  }
  return <JsonVer data={valor} />;
}

function GrupoArray({ grupo }: { grupo: { clave: string; items: ParamEntry[] } }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-line-100 rounded-md overflow-hidden mb-2">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2 bg-ink-50 hover:bg-ink-100 transition-colors text-left"
      >
        <span className="text-xs text-ink-400">{open ? "▼" : "▶"}</span>
        <span className="font-semibold text-xs text-ink-700">{grupo.clave}</span>
        <span className="text-xs text-ink-400">({grupo.items.length} items)</span>
      </button>
      {open && (
        <div className="divide-y divide-line-100">
          {grupo.items.map((item, idx) => (
            <div key={`${grupo.clave}-${idx}`} className="grid grid-cols-[140px_1fr] gap-x-2 px-3 py-1.5">
              <span className="font-mono text-xs text-ink-500 truncate">{item.clave}</span>
              <ValorCelda valor={item.valor} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BloqueCard({ bloque }: { bloque: BloqueInfo }) {
  const [expandido, setExpandido] = useState(false);
  const tieneContenido =
    bloque.parametros.length > 0 || bloque.grupos.length > 0;

  return (
    <div className="rounded-lg border border-line-200 bg-app/40 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpandido(!expandido)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-hover transition-colors"
      >
        <Icon name="robot" size="sm" className="text-brand-600 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-ink-900 truncate">{bloque.nombre}</div>
          <div className="text-xs text-ink-400 font-mono truncate">{bloque.tipo}</div>
        </div>
        <Icon
          name="chev"
          size="sm"
          className={`text-ink-400 transition-transform shrink-0 ${expandido ? "rotate-180" : ""}`}
        />
      </button>

      {expandido && tieneContenido && (
        <div className="border-t border-line-200 bg-surface px-4 py-3">
          <div className="space-y-2">
            {bloque.parametros.map((p) => (
              <div key={p.clave} className="grid grid-cols-[140px_1fr] gap-x-2 text-xs">
                <span className="font-mono text-ink-500 shrink-0 truncate pt-0.5">{p.clave}</span>
                <ValorCelda valor={p.valor} />
              </div>
            ))}
            {bloque.grupos.map((g) => (
              <GrupoArray key={g.clave} grupo={g} />
            ))}
          </div>
        </div>
      )}

      {expandido && !tieneContenido && (
        <div className="border-t border-line-200 bg-surface px-4 py-3 text-xs text-ink-400">
          Sin parámetros configurados
        </div>
      )}
    </div>
  );
}

function VariableCard({ variable }: { variable: VariableInfo }) {
  return (
    <div className="flex items-start gap-3 px-4 py-2.5 border-b border-line-100 last:border-b-0">
      <Icon name="db" size="sm" className="text-obj-600 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm text-ink-900">{variable.nombre}</div>
        <div className="mt-0.5">
          <ValorCelda valor={variable.valor} />
        </div>
      </div>
    </div>
  );
}

export function VisorWorkspace({ workspace }: Props) {
  const [expandidoGlobal, setExpandidoGlobal] = useState(true);
  const bloques = extraerBloques(workspace.workspace);
  const variables = extraerVariables(workspace.workspace);

  if (bloques.length === 0 && variables.length === 0) {
    return (
      <Card className="border-line-200 bg-surface shadow-card">
        <CardHeader className="border-b border-line-200 bg-app/30 pb-4">
          <CardTitle className="font-display text-lg font-semibold text-ink-900">
            Estructura del Workspace
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center text-sm text-ink-400">
          No se encontraron bloques ni variables en el workspace de esta automatización.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-line-200 bg-surface shadow-card">
      <CardHeader className="border-b border-line-200 bg-app/30 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="font-display text-lg font-semibold text-ink-900">
              Estructura del Workspace
            </CardTitle>
            {bloques.length > 0 && (
              <span className="text-xs text-ink-400 font-mono bg-ink-100 rounded-full px-2 py-0.5">
                {bloques.length} {bloques.length === 1 ? "bloque" : "bloques"}
              </span>
            )}
            {variables.length > 0 && (
              <span className="text-xs text-ink-400 font-mono bg-obj-100 text-obj-700 rounded-full px-2 py-0.5">
                {variables.length} {variables.length === 1 ? "variable" : "variables"}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setExpandidoGlobal(!expandidoGlobal)}
            className="text-xs text-ink-500 hover:text-ink-700 font-medium transition-colors"
          >
            {expandidoGlobal ? "Colapsar todos" : "Expandir todos"}
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-6">
        {bloques.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-ink-500 uppercase tracking-wide mb-2 px-1">
              Bloques
            </div>
            <div className="space-y-2">
              {bloques.map((bloque) => (
                <BloqueCard key={bloque.nombre} bloque={bloque} />
              ))}
            </div>
          </div>
        )}

        {variables.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-ink-500 uppercase tracking-wide mb-2 px-1">
              Variables
            </div>
            <div className="rounded-lg border border-line-200 bg-app/40 overflow-hidden">
              {variables.map((variable) => (
                <VariableCard key={variable.nombre} variable={variable} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
