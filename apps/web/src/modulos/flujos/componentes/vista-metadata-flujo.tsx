import { VisorJsonInteractivo } from "@/compartido/componentes/ui/visor-json-interactivo";
import type { ResumenFlujo } from "../api";
import { crearMetadataDataflow } from "./modelo-visor-flujo";
import { useCopiaTemporal } from "./use-copia-temporal";

interface Props {
  flujo: ResumenFlujo;
}

export function VistaMetadataFlujo({ flujo }: Props) {
  const metadata = crearMetadataDataflow(flujo);
  const copia = useCopiaTemporal();

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div className="space-y-3 rounded-xl border border-line-200 bg-surface p-4 shadow-sm">
        <h4 className="text-sm font-semibold text-ink-900">
          Metadatos del Flujo de Datos
        </h4>
        <div className="grid grid-cols-1 gap-3 text-xs text-ink-600 sm:grid-cols-2">
          <DatoMetadata etiqueta="ID Artefacto" valor={flujo.id} mono />
          <DatoMetadata
            etiqueta="Espacio"
            valor={flujo.espacioNombre || "Espacio Personal"}
          />
          <DatoMetadata
            etiqueta="Última Modificación"
            valor={
              flujo.modificadoEn
                ? new Date(flujo.modificadoEn).toLocaleString()
                : "—"
            }
            mono
          />
          <DatoMetadata
            etiqueta="Tipo Qlik Item"
            valor="qix-df (Dataflow QIX Engine)"
            mono
            destacado
          />
        </div>
      </div>

      <div className="relative space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2 font-mono text-[11px] text-slate-500">
          <span>METADATA_JSON_DATAFLOW</span>
          <button
            type="button"
            onClick={() => void copia.copiar(JSON.stringify(metadata, null, 2))}
            className="rounded border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs text-slate-700 transition-colors hover:bg-slate-200 hover:text-slate-900"
          >
            {copia.copiado ? "¡JSON Copiado!" : "Copiar JSON"}
          </button>
        </div>
        <VisorJsonInteractivo data={metadata} />
      </div>
    </div>
  );
}

function DatoMetadata({
  etiqueta,
  valor,
  mono = false,
  destacado = false,
}: {
  etiqueta: string;
  valor: string;
  mono?: boolean;
  destacado?: boolean;
}) {
  const clase = destacado
    ? "font-mono text-brand-600"
    : mono
      ? "font-mono text-ink-800"
      : "font-semibold text-ink-800";
  return (
    <div>
      <span className="block text-ink-400">{etiqueta}:</span>
      <span className={clase}>{valor}</span>
    </div>
  );
}
