import { Icon } from "@/compartido/componentes/ui/icon";
import type { RespuestaScriptFlujo } from "../api";
import { useCopiaTemporal } from "./use-copia-temporal";

interface Props {
  flujoId: string;
  datos?: RespuestaScriptFlujo;
  cargando: boolean;
  error: unknown;
}

export function VistaScriptFlujo({ flujoId, datos, cargando, error }: Props) {
  const copia = useCopiaTemporal();

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-xs shadow-sm">
        <span className="flex items-center gap-2 font-medium text-slate-600">
          <Icon name="sparkles" size="sm" className="text-brand-600" />
          Script original extraído vía Qlik REST API (/api/v1/apps/{flujoId}
          /scripts/current)
        </span>

        <button
          type="button"
          onClick={() => datos?.script && void copia.copiar(datos.script)}
          disabled={!datos?.script}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line-300 bg-surface px-3 py-1.5 text-xs font-semibold text-ink-800 shadow-sm transition-colors hover:bg-app disabled:opacity-50"
        >
          <Icon name="copy" size="sm" className="text-brand-600" />
          {copia.copiado ? "¡Script Copiado!" : "Copiar Script QVS"}
        </button>
      </div>

      {cargando && (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-2">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
          <p className="text-sm font-medium text-ink-500">
            Extrayendo script de carga del Dataflow desde Qlik Cloud...
          </p>
        </div>
      )}

      {Boolean(error) && (
        <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
          <p className="font-semibold">
            Nota sobre el script de este Dataflow:
          </p>
          <p className="leading-relaxed">
            {error instanceof Error
              ? error.message
              : "No se pudo recuperar el script directamente."}{" "}
            Si el Dataflow utiliza transformación exclusivamente visual en Qlik
            Cloud, la lógica se almacena en la definición del pipeline QIX del
            proyecto.
          </p>
        </div>
      )}

      {!cargando && !error && datos && (
        <div className="relative space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          {datos.versionMessage && (
            <div className="border-b border-slate-100 pb-2 font-mono text-xs text-slate-500">
              Mensaje de versión: {datos.versionMessage}
            </div>
          )}
          <pre className="max-h-[500px] overflow-x-auto whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs leading-relaxed text-slate-800">
            {datos.script || "// El script de carga está vacío."}
          </pre>
        </div>
      )}
    </div>
  );
}
