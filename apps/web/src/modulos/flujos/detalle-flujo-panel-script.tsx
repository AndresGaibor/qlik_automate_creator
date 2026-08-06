import { Icon } from "@/compartido/componentes/ui/icon";
import { useState } from "react";
import type { RespuestaScriptFlujo } from "./api";

interface Props {
  datos?: RespuestaScriptFlujo;
  cargando: boolean;
  conError: boolean;
}

export function DetalleFlujoPanelScript({ datos, cargando, conError }: Props) {
  const [copiado, setCopiado] = useState(false);

  const copiar = () => {
    if (!datos?.script) return;
    navigator.clipboard.writeText(datos.script);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm text-xs">
        <span className="text-slate-600 font-medium flex items-center gap-2">
          <Icon name="sparkles" size="sm" className="text-brand-600" />
          Este script se trae directo desde Qlik Cloud y siempre muestra la
          versión más reciente.
        </span>
        <button
          type="button"
          onClick={copiar}
          disabled={!datos?.script}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-line-300 text-ink-800 hover:bg-app text-xs font-semibold transition-colors shadow-sm disabled:opacity-50"
        >
          <Icon name="copy" size="sm" className="text-brand-600" />
          {copiado ? "¡Script copiado!" : "Copiar script"}
        </button>
      </div>

      {cargando && (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-2 bg-white rounded-xl border p-8">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
          <p className="text-sm text-ink-500 font-medium">
            Cargando script de carga desde Qlik Cloud...
          </p>
        </div>
      )}

      {conError && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-xs text-amber-900 space-y-2">
          <p className="font-semibold text-sm">
            Este Dataflow se creó con transformación visual en Qlik Cloud (sin
            escribir código), por eso no hay un script para mostrar aquí. La
            automatización funciona igual de bien.
          </p>
        </div>
      )}

      {!cargando && !conError && datos && (
        <div className="relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          {datos.versionMessage && (
            <div className="text-xs text-slate-500 font-mono border-b border-slate-100 pb-2">
              Mensaje de versión: {datos.versionMessage}
            </div>
          )}
          <pre className="font-mono text-xs text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-200 overflow-x-auto whitespace-pre-wrap leading-relaxed min-h-[400px]">
            {datos.script ||
              "Este Dataflow todavía no tiene un script de carga para mostrar."}
          </pre>
        </div>
      )}
    </div>
  );
}
