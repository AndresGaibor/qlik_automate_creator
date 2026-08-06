import { Icon } from "@/compartido/componentes/ui/icon";
import { Link } from "@tanstack/react-router";
import type { ReferenciaWorkspace } from "./modelo-workspace";

export function WorkspaceReferencias({
  referencia,
}: { referencia: ReferenciaWorkspace }) {
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
        <ReferenciaDataflow referencia={referencia} />
        <DatoReferencia
          etiqueta="Dataset / Archivo"
          valor={
            referencia.archivoODataset ? (
              <span className="inline-flex items-center gap-1">
                <span className="font-semibold text-indigo-700">
                  {referencia.archivoODataset}
                </span>
                {referencia.extension && (
                  <span className="text-[10px] bg-slate-100 px-1 rounded text-slate-500 font-mono">
                    .{referencia.extension}
                  </span>
                )}
              </span>
            ) : (
              "—"
            )
          }
        />
        <DatoReferencia
          etiqueta="Tabla Destino Impala"
          valor={referencia.tablaDestino || "—"}
          claseValor="font-mono text-xs font-bold text-emerald-700 truncate"
        />
        <DatoReferencia
          etiqueta="Motor Ejecutor"
          valor={
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Talend + Spark / Impala
            </span>
          }
        />
      </div>
    </div>
  );
}

function ReferenciaDataflow({
  referencia,
}: { referencia: ReferenciaWorkspace }) {
  const contenido = (
    <>
      <Icon name="cloud" size="sm" className="text-brand-600 shrink-0" />
      <span className="truncate">{referencia.nombreDataflow}</span>
    </>
  );
  return (
    <DatoReferencia
      etiqueta="Dataflow Origen"
      valor={
        referencia.flujoId ? (
          <Link
            to="/flujos/$id"
            params={{ id: referencia.flujoId }}
            className="hover:underline flex items-center gap-1.5"
          >
            {contenido}
          </Link>
        ) : (
          <Link
            to="/flujos"
            className="hover:underline flex items-center gap-1.5"
          >
            {contenido}
          </Link>
        )
      }
      claseValor="font-semibold text-xs text-brand-700 truncate"
    />
  );
}

function DatoReferencia({
  etiqueta,
  valor,
  claseValor = "font-medium text-xs text-slate-800 truncate",
}: {
  etiqueta: string;
  valor: React.ReactNode;
  claseValor?: string;
}) {
  return (
    <div className="p-3 bg-white/90 rounded-lg border border-slate-200 shadow-xs space-y-1">
      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
        {etiqueta}
      </span>
      <div className={claseValor}>{valor}</div>
    </div>
  );
}
