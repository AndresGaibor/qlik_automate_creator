import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/compartido/componentes/ui/card";
import { Icon } from "@/compartido/componentes/ui/icon";
import type { WorkspaceAutomatizacion } from "@/modulos/automatizaciones/api";
import {
  type ResumenFlujo,
  obtenerFlujosConFiltros,
} from "@/modulos/flujos/api";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

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

function entriesValidas(obj: unknown): Array<[string, unknown]> {
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

    const settings = (b.settings ?? b.parameters ?? {}) as Record<
      string,
      unknown
    >;

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
  const blocks = workspace.blocks;
  const mapaValores: Record<string, unknown> = {};

  // 1. Recorrer los bloques para encontrar los VariableBlock y sus operations
  if (Array.isArray(blocks)) {
    for (const b of blocks) {
      const block = b as Record<string, unknown>;
      if (block.type === "VariableBlock" && block.name) {
        const varNombre = String(block.name);
        const operations = block.operations as
          | Array<Record<string, unknown>>
          | undefined;
        if (
          Array.isArray(operations) &&
          operations.length > 0 &&
          operations[0].value !== undefined
        ) {
          mapaValores[varNombre] = operations[0].value;
        }
      }
    }
  }

  if (!Array.isArray(vars)) return [];

  return vars.map((v) => {
    const variable = v as Record<string, unknown>;
    const nombre = String(variable.name ?? "sin nombre");
    const valorDirecto = variable.value ?? variable.defaultValue;
    const valorOp = mapaValores[nombre];
    const valorFinal =
      valorDirecto !== undefined && valorDirecto !== ""
        ? valorDirecto
        : (valorOp ?? "");

    return {
      nombre,
      valor: valorFinal,
    };
  });
}

function JsonVer({ data }: { data: unknown }) {
  const [open, setOpen] = useState(false);
  return (
    <button type="button" onClick={() => setOpen(!open)} className="text-left">
      <span className="text-xs text-ink-400 font-medium">
        {open ? "Ocultar" : "Ver"} valor
      </span>
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
      <span
        className={`font-mono text-xs px-1.5 py-0.5 rounded ${valor ? "bg-brand-50 text-brand-700" : "bg-ink-100 text-ink-600"}`}
      >
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
    return (
      <span className="font-mono text-xs text-ink-700 break-all">{valor}</span>
    );
  }
  return <JsonVer data={valor} />;
}

function GrupoArray({
  grupo,
}: { grupo: { clave: string; items: ParamEntry[] } }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-line-100 rounded-md overflow-hidden mb-2">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2 bg-ink-50 hover:bg-ink-100 transition-colors text-left"
      >
        <span className="text-xs text-ink-400">{open ? "Ocultar" : "Ver"}</span>
        <span className="font-semibold text-xs text-ink-700">
          {grupo.clave}
        </span>
        <span className="text-xs text-ink-400">
          ({grupo.items.length} items)
        </span>
      </button>
      {open && (
        <div className="divide-y divide-line-100">
          {grupo.items.map((item, idx) => (
            <div
              key={`${grupo.clave}-${idx}`}
              className="grid grid-cols-[140px_1fr] gap-x-2 px-3 py-1.5"
            >
              <span className="font-mono text-xs text-ink-500 truncate">
                {item.clave}
              </span>
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
          <div className="font-semibold text-sm text-ink-900 truncate">
            {bloque.nombre}
          </div>
          <div className="text-xs text-ink-400 font-mono truncate">
            {bloque.tipo}
          </div>
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
              <div
                key={p.clave}
                className="grid grid-cols-[140px_1fr] gap-x-2 text-xs"
              >
                <span className="font-mono text-ink-500 shrink-0 truncate pt-0.5">
                  {p.clave}
                </span>
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
        <div className="font-semibold text-sm text-ink-900">
          {variable.nombre}
        </div>
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

  const { data: flujos = [] } = useQuery<ResumenFlujo[]>({
    queryKey: ["flujos"],
    queryFn: () => obtenerFlujosConFiltros(),
    staleTime: 60 * 1000,
  });

  if (bloques.length === 0 && variables.length === 0) {
    return (
      <Card className="border-line-200 bg-surface shadow-card">
        <CardHeader className="border-b border-line-200 bg-app/30 pb-4">
          <CardTitle className="font-display text-lg font-semibold text-ink-900">
            Estructura del Workspace
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center text-sm text-ink-400">
          No se encontraron bloques ni variables en el workspace de esta
          automatización.
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
                {variables.length}{" "}
                {variables.length === 1 ? "variable" : "variables"}
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
        {/* Banner de Referencias a Dataflow y Tabla Destino */}
        {(() => {
          const varAppid = String(
            variables.find((v) => v.nombre === "Appid")?.valor || "",
          );
          const varDataset = String(
            variables.find((v) => v.nombre === "Dataset")?.valor || "",
          );
          const varArchivo = String(
            variables.find((v) => v.nombre === "ArchivoEntrada")?.valor || "",
          );
          const varTabla = String(
            variables.find((v) => v.nombre === "TablaDestino")?.valor || "",
          );
          const varExt = String(
            variables.find((v) => v.nombre === "Extension")?.valor || "",
          );

          const tieneRefDataflow = Boolean(varAppid || varDataset || varTabla);

          if (!tieneRefDataflow) return null;

          // Buscar el Dataflow por ID o por coincidencia de nombre
          const flujoEncontrado = flujos.find(
            (f) =>
              f.id === varAppid ||
              f.nombre
                .toLowerCase()
                .includes((varDataset || varArchivo).toLowerCase()),
          );
          const nombreDataflow =
            flujoEncontrado?.nombre ||
            varDataset ||
            varArchivo ||
            (varAppid ? `Flujo (${varAppid.slice(0, 8)}...)` : "—");

          return (
            <div className="rounded-xl border border-brand-200 bg-gradient-to-r from-brand-50/70 via-white to-sky-50/50 p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-display font-semibold text-sm text-brand-900">
                  <Icon name="flow" size="sm" className="text-brand-600" />
                  Orquestación de Datos Referenciada
                </div>
                <span className="text-[11px] font-medium bg-brand-100 text-brand-700 px-2.5 py-0.5 rounded-full border border-brand-200">
                  Dataflow a Impala Pipeline
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                {/* Dataflow Origen (Nombre con link a su pagina de detalle) */}
                <div className="p-3 bg-white/90 rounded-lg border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Dataflow Origen
                  </span>
                  <div
                    className="font-semibold text-xs text-brand-700 truncate"
                    title={nombreDataflow}
                  >
                    {flujoEncontrado ? (
                      <Link
                        to="/flujos/$id"
                        params={{ id: flujoEncontrado.id }}
                        className="hover:underline flex items-center gap-1.5"
                      >
                        <Icon
                          name="cloud"
                          size="sm"
                          className="text-brand-600 shrink-0"
                        />
                        <span className="truncate">{nombreDataflow}</span>
                      </Link>
                    ) : (
                      <Link
                        to="/flujos"
                        className="hover:underline flex items-center gap-1.5"
                      >
                        <Icon
                          name="cloud"
                          size="sm"
                          className="text-brand-600 shrink-0"
                        />
                        <span className="truncate">{nombreDataflow}</span>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Dataset / Archivo */}
                <div className="p-3 bg-white/90 rounded-lg border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Dataset / Archivo
                  </span>
                  <div className="font-medium text-xs text-slate-800 truncate">
                    {varArchivo || varDataset ? (
                      <span className="inline-flex items-center gap-1">
                        <span className="font-semibold text-indigo-700">
                          {varArchivo || varDataset}
                        </span>
                        {Boolean(varExt) && (
                          <span className="text-[10px] bg-slate-100 px-1 rounded text-slate-500 font-mono">
                            .{varExt}
                          </span>
                        )}
                      </span>
                    ) : (
                      "—"
                    )}
                  </div>
                </div>

                {/* Tabla Destino Impala */}
                <div className="p-3 bg-white/90 rounded-lg border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Tabla Destino Impala
                  </span>
                  <div
                    className="font-mono text-xs font-bold text-emerald-700 truncate"
                    title={varTabla}
                  >
                    {varTabla ? varTabla : "—"}
                  </div>
                </div>

                {/* Motor Orquestador */}
                <div className="p-3 bg-white/90 rounded-lg border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Motor Ejecutor
                  </span>
                  <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Talend + Spark / Impala
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

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
