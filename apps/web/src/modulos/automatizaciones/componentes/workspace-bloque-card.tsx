import { Icon } from "@/compartido/componentes/ui/icon";
import { useState } from "react";
import type { BloqueResumenWorkspace } from "./modelo-workspace";
import { WorkspaceGrupo, WorkspaceValor } from "./workspace-valor";

export function WorkspaceBloqueCard({
  bloque,
}: { bloque: BloqueResumenWorkspace }) {
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
          className={`text-ink-400 transition-transform shrink-0 ${
            expandido ? "rotate-180" : ""
          }`}
        />
      </button>
      {expandido && tieneContenido && (
        <div className="border-t border-line-200 bg-surface px-4 py-3">
          <div className="space-y-2">
            {bloque.parametros.map((parametro) => (
              <div
                key={parametro.clave}
                className="grid grid-cols-[140px_1fr] gap-x-2 text-xs"
              >
                <span className="font-mono text-ink-500 shrink-0 truncate pt-0.5">
                  {parametro.clave}
                </span>
                <WorkspaceValor valor={parametro.valor} />
              </div>
            ))}
            {bloque.grupos.map((grupo) => (
              <WorkspaceGrupo key={grupo.clave} grupo={grupo} />
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
