import { Button } from "@/compartido/componentes/ui/button";
import { Icon } from "@/compartido/componentes/ui/icon";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  type WorkspaceAutomatizacion,
  obtenerWorkspaceAutomatizacion,
} from "../api";
import { EditorJsonWorkspace } from "./editor-json-workspace";
import { VistaBloquesWorkspace } from "./vista-bloques-workspace";

interface Props {
  automatizacionId: string;
  nombreAutomatizacion: string;
}

export function VisorWorkspaceModal({
  automatizacionId,
  nombreAutomatizacion,
}: Props) {
  const [abierto, setAbierto] = useState(false);
  const [pestana, setPestana] = useState<"bloques" | "json">("bloques");
  const { data, isLoading, isError, error } = useQuery<WorkspaceAutomatizacion>(
    {
      queryKey: ["automatizacion-workspace", automatizacionId],
      queryFn: () => obtenerWorkspaceAutomatizacion(automatizacionId),
      enabled: abierto,
      staleTime: 60 * 1000,
    },
  );

  const workspaceObj = data?.workspace || {};
  const totalBloques = Array.isArray(workspaceObj.blocks)
    ? workspaceObj.blocks.length
    : 0;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setAbierto(true)}
        className="text-xs gap-1.5 border-line-300 hover:bg-app"
      >
        <Icon name="edit" size="sm" className="text-brand-600" />
        Ver Script / Workspace
      </Button>

      {abierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="flex flex-col w-full max-w-4xl max-h-[88vh] bg-surface rounded-xl border border-line-200 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-line-200 bg-app/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 border border-brand-100">
                  <Icon name="zap" size="md" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg text-ink-900">
                    Flujo Visual de Automate
                  </h3>
                  <p className="text-xs text-ink-500 font-mono">
                    {nombreAutomatizacion} (ID: {automatizacionId})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex rounded-lg bg-line-200/60 p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setPestana("bloques")}
                    className={`px-3 py-1 rounded-md font-medium transition-all ${
                      pestana === "bloques"
                        ? "bg-surface text-ink-900 shadow-sm"
                        : "text-ink-500 hover:text-ink-900"
                    }`}
                  >
                    Pasos de la automatización ({totalBloques})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPestana("json")}
                    className={`px-3 py-1 rounded-md font-medium transition-all ${
                      pestana === "json"
                        ? "bg-surface text-ink-900 shadow-sm"
                        : "text-ink-500 hover:text-ink-900"
                    }`}
                  >
                    Edición avanzada (JSON)
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

            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/70">
              {isLoading && (
                <div className="flex min-h-[350px] flex-col items-center justify-center gap-2">
                  <div className="h-7 w-7 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
                  <p className="text-sm text-ink-500 font-medium">
                    Cargando la topología de la automatización...
                  </p>
                </div>
              )}

              {isError && (
                <div className="rounded-lg border border-danger-200 bg-red-50 p-4 text-sm text-danger-700">
                  <p className="font-semibold mb-1">
                    Error al obtener el workspace:
                  </p>
                  <p className="font-mono text-xs">
                    {(error as Error)?.message || "Error desconocido"}
                  </p>
                </div>
              )}

              {!isLoading && !isError && data && (
                <>
                  {pestana === "bloques" && (
                    <VistaBloquesWorkspace workspace={workspaceObj} />
                  )}

                  {pestana === "json" && (
                    <div className="space-y-4">
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 font-medium">
                        Esta sección es para usuarios con experiencia técnica.
                        Modificar el JSON directamente puede afectar el
                        funcionamiento de la automatización.
                      </div>
                      <EditorJsonWorkspace
                        automatizacionId={automatizacionId}
                        workspaceInicial={workspaceObj}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
