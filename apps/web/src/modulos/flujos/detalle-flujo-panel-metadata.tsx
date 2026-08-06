import { VisorJsonInteractivo } from "@/compartido/componentes/ui/visor-json-interactivo";
import { useState } from "react";
import type { ResumenFlujo } from "./api";

interface Props {
  flujo: ResumenFlujo;
  metadata: Record<string, unknown>;
}

export function DetalleFlujoPanelMetadata({ flujo, metadata }: Props) {
  const [copiado, setCopiado] = useState(false);

  const copiar = () => {
    navigator.clipboard.writeText(JSON.stringify(metadata, null, 2));
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-line-200 bg-surface p-5 shadow-sm space-y-4">
        <h4 className="font-semibold text-sm text-ink-900">
          Detalles del Dataflow
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <Detalle
            etiqueta="ID del Dataflow:"
            valor={flujo.id}
            claseValor="font-mono font-semibold text-ink-900"
          />
          <Detalle
            etiqueta="Espacio en Qlik Cloud:"
            valor={flujo.espacioNombre || "Personal"}
            claseValor="font-semibold text-ink-900"
          />
          <Detalle
            etiqueta="Última actualización:"
            valor={
              flujo.modificadoEn
                ? new Date(flujo.modificadoEn).toLocaleString()
                : "—"
            }
            claseValor="font-mono text-ink-900"
          />
          <Detalle
            etiqueta="Tipo de Dataflow:"
            valor="Dataflow de Qlik"
            claseValor="font-mono text-brand-600 font-semibold"
          />
        </div>
      </div>

      <details className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
        <summary className="cursor-pointer font-medium text-xs text-brand-600 hover:underline">
          Ver JSON avanzado (para usuarios con experiencia técnica)
        </summary>
        <div className="mt-3 text-[11px] font-mono text-slate-500 border-t border-slate-200 pt-3 flex justify-between items-center">
          <span>METADATA_JSON_DATAFLOW</span>
          <button
            type="button"
            onClick={copiar}
            className="text-xs text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2.5 py-1 rounded transition-colors font-medium"
          >
            {copiado ? "¡JSON Copiado!" : "Copiar JSON"}
          </button>
        </div>
        <VisorJsonInteractivo data={metadata} />
      </details>
    </div>
  );
}

function Detalle({
  etiqueta,
  valor,
  claseValor,
}: {
  etiqueta: string;
  valor: string;
  claseValor: string;
}) {
  return (
    <div className="p-3 bg-app/50 rounded-lg border border-line-200">
      <span className="text-ink-400 block mb-1">{etiqueta}</span>
      <span className={claseValor}>{valor}</span>
    </div>
  );
}
