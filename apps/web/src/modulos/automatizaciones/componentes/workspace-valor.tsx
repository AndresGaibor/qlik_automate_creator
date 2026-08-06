import { useState } from "react";
import type { GrupoResumenWorkspace } from "./modelo-workspace";

export function WorkspaceValor({ valor }: { valor: unknown }) {
  if (typeof valor === "boolean") {
    return (
      <span
        className={`font-mono text-xs px-1.5 py-0.5 rounded ${
          valor ? "bg-brand-50 text-brand-700" : "bg-ink-100 text-ink-600"
        }`}
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
  if (typeof valor === "string" && valor.length <= 60) {
    return (
      <span className="font-mono text-xs text-ink-700 break-all">{valor}</span>
    );
  }
  return <WorkspaceJson valor={valor} />;
}

export function WorkspaceGrupo({ grupo }: { grupo: GrupoResumenWorkspace }) {
  const [abierto, setAbierto] = useState(false);
  return (
    <div className="border border-line-100 rounded-md overflow-hidden mb-2">
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        className="w-full flex items-center gap-2 px-3 py-2 bg-ink-50 hover:bg-ink-100 transition-colors text-left"
      >
        <span className="text-xs text-ink-400">
          {abierto ? "Ocultar" : "Ver"}
        </span>
        <span className="font-semibold text-xs text-ink-700">
          {grupo.clave}
        </span>
        <span className="text-xs text-ink-400">
          ({grupo.items.length} items)
        </span>
      </button>
      {abierto && (
        <div className="divide-y divide-line-100">
          {grupo.items.map((item, indice) => (
            <div
              key={`${grupo.clave}-${indice}`}
              className="grid grid-cols-[140px_1fr] gap-x-2 px-3 py-1.5"
            >
              <span className="font-mono text-xs text-ink-500 truncate">
                {item.clave}
              </span>
              <WorkspaceValor valor={item.valor} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function WorkspaceJson({ valor }: { valor: unknown }) {
  const [abierto, setAbierto] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setAbierto(!abierto)}
      className="text-left"
    >
      <span className="text-xs text-ink-400 font-medium">
        {abierto ? "Ocultar" : "Ver"} valor
      </span>
      {abierto && (
        <pre className="mt-1 p-2 bg-ink-50 rounded text-xs font-mono text-ink-700 overflow-x-auto whitespace-pre-wrap break-all max-h-48">
          {JSON.stringify(valor, null, 2)}
        </pre>
      )}
    </button>
  );
}
