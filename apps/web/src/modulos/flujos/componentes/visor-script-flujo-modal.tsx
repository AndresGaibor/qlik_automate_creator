import { Button } from "@/compartido/componentes/ui/button";
import { Icon } from "@/compartido/componentes/ui/icon";
import { VisorJsonInteractivo } from "@/compartido/componentes/ui/visor-json-interactivo";
import { type ResumenFlujo, obtenerScriptFlujo } from "@/modulos/flujos/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface Props {
  flujo: ResumenFlujo;
}

export function VisorScriptFlujoModal({ flujo }: Props) {
  const [abierto, setAbierto] = useState(false);
  const [pestana, setPestana] = useState<"script" | "metadata">("script");
  const [copiadoScript, setCopiadoScript] = useState(false);
  const [copiadoMeta, setCopiadoMeta] = useState(false);

  const {
    data: datosScript,
    isLoading: cargandoScript,
    isError: errorScript,
    error,
  } = useQuery({
    queryKey: ["flujo-script", flujo.id],
    queryFn: () => obtenerScriptFlujo(flujo.id),
    enabled: abierto,
    staleTime: 60 * 1000,
  });

  const metadataDataflow = {
    id: flujo.id,
    name: flujo.nombre,
    resourceType: "app",
    resourceSubType: "qix-df",
    spaceId: flujo.espacioId || null,
    spaceName: flujo.espacioNombre || "Personal",
    updatedAt: flujo.modificadoEn || null,
    engine: "QIX Data Pipeline Engine",
  };

  const copiarScript = () => {
    if (datosScript?.script) {
      navigator.clipboard.writeText(datosScript.script);
      setCopiadoScript(true);
      setTimeout(() => setCopiadoScript(false), 2000);
    }
  };

  const copiarMetadata = () => {
    navigator.clipboard.writeText(JSON.stringify(metadataDataflow, null, 2));
    setCopiadoMeta(true);
    setTimeout(() => setCopiadoMeta(false), 2000);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setAbierto(true)}
        className="text-xs gap-1.5 border-line-300 hover:bg-app"
      >
        <Icon name="edit" size="sm" className="text-brand-600" />
        Ver Script / Definición
      </Button>

      {abierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="flex flex-col w-full max-w-4xl max-h-[88vh] bg-surface rounded-xl border border-line-200 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-line-200 bg-app/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 border border-brand-100">
                  <Icon name="cloud" size="md" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg text-ink-900">
                    Script de Carga / Dataflow
                  </h3>
                  <p className="text-xs text-ink-500 font-mono">
                    {flujo.nombre} (ID: {flujo.id})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex rounded-lg bg-line-200/60 p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setPestana("script")}
                    className={`px-3 py-1 rounded-md font-medium transition-all ${
                      pestana === "script"
                        ? "bg-surface text-ink-900 shadow-sm"
                        : "text-ink-500 hover:text-ink-900"
                    }`}
                  >
                    Script de Carga (QVS/QIX)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPestana("metadata")}
                    className={`px-3 py-1 rounded-md font-medium transition-all ${
                      pestana === "metadata"
                        ? "bg-surface text-ink-900 shadow-sm"
                        : "text-ink-500 hover:text-ink-900"
                    }`}
                  >
                    Metadatos JSON
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setAbierto(false)}
                  className="p-1.5 rounded-lg text-ink-400 hover:text-ink-900 hover:bg-line-200/50 transition-colors"
                >
                  <Icon name="x" size="md" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/70">
              {pestana === "script" && (
                <div className="space-y-4 max-w-4xl mx-auto">
                  <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-xs">
                    <span className="text-slate-600 font-medium flex items-center gap-2">
                      <Icon
                        name="sparkles"
                        size="sm"
                        className="text-brand-600"
                      />
                      Script original extraído vía Qlik REST API (/api/v1/apps/
                      {flujo.id}/scripts/current)
                    </span>

                    <button
                      type="button"
                      onClick={copiarScript}
                      disabled={!datosScript?.script}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-line-300 text-ink-800 hover:bg-app text-xs font-semibold transition-colors shadow-sm disabled:opacity-50"
                    >
                      <Icon name="copy" size="sm" className="text-brand-600" />
                      {copiadoScript ? "¡Script Copiado!" : "Copiar Script QVS"}
                    </button>
                  </div>

                  {cargandoScript && (
                    <div className="flex min-h-[300px] flex-col items-center justify-center gap-2">
                      <div className="h-7 w-7 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
                      <p className="text-sm text-ink-500 font-medium">
                        Extrayendo script de carga del Dataflow desde Qlik
                        Cloud...
                      </p>
                    </div>
                  )}

                  {errorScript && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 space-y-2">
                      <p className="font-semibold">
                        Nota sobre el script de este Dataflow:
                      </p>
                      <p className="leading-relaxed">
                        {(error as Error)?.message ||
                          "No se pudo recuperar el script directamente."}{" "}
                        Si el Dataflow utiliza transformación exclusivamente
                        visual en Qlik Cloud, la lógica se almacena en la
                        definición del pipeline QIX del proyecto.
                      </p>
                    </div>
                  )}

                  {!cargandoScript && !errorScript && datosScript && (
                    <div className="relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                      {datosScript.versionMessage && (
                        <div className="text-xs text-slate-500 font-mono border-b border-slate-100 pb-2">
                          Mensaje de versión: {datosScript.versionMessage}
                        </div>
                      )}

                      <pre className="font-mono text-xs text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-200 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[500px]">
                        {datosScript.script ||
                          "// El script de carga está vacío."}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {pestana === "metadata" && (
                <div className="space-y-4 max-w-4xl mx-auto">
                  <div className="rounded-xl border border-line-200 bg-surface p-4 shadow-sm space-y-3">
                    <h4 className="font-semibold text-sm text-ink-900">
                      Metadatos del Flujo de Datos
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-ink-600">
                      <div>
                        <span className="text-ink-400 block">
                          ID Artefacto:
                        </span>
                        <span className="font-mono text-ink-800">
                          {flujo.id}
                        </span>
                      </div>
                      <div>
                        <span className="text-ink-400 block">Espacio:</span>
                        <span className="font-semibold text-ink-800">
                          {flujo.espacioNombre || "Espacio Personal"}
                        </span>
                      </div>
                      <div>
                        <span className="text-ink-400 block">
                          Última Modificación:
                        </span>
                        <span className="font-mono text-ink-800">
                          {flujo.modificadoEn
                            ? new Date(flujo.modificadoEn).toLocaleString()
                            : "—"}
                        </span>
                      </div>
                      <div>
                        <span className="text-ink-400 block">
                          Tipo Qlik Item:
                        </span>
                        <span className="font-mono text-brand-600">
                          qix-df (Dataflow QIX Engine)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                    <div className="text-[11px] font-mono text-slate-500 border-b border-slate-200 pb-2 flex justify-between items-center">
                      <span>METADATA_JSON_DATAFLOW</span>
                      <button
                        type="button"
                        onClick={copiarMetadata}
                        className="text-xs text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2.5 py-1 rounded transition-colors"
                      >
                        {copiadoMeta ? "¡JSON Copiado!" : "Copiar JSON"}
                      </button>
                    </div>
                    <VisorJsonInteractivo data={metadataDataflow} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
