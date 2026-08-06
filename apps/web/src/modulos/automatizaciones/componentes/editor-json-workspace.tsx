import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import { Icon } from "@/compartido/componentes/ui/icon";
import { VisorJsonInteractivo } from "@/compartido/componentes/ui/visor-json-interactivo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { actualizarWorkspaceAutomatizacion } from "../api";

export function EditorJsonWorkspace({
  automatizacionId,
  workspaceInicial,
}: {
  automatizacionId: string;
  workspaceInicial: Record<string, unknown>;
}) {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [jsonTexto, setJsonTexto] = useState(() =>
    JSON.stringify(workspaceInicial, null, 2),
  );
  const [errorJson, setErrorJson] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  const { mostrarExito, mostrarError } = useNotificaciones();
  const queryClient = useQueryClient();

  const mutationGuardar = useMutation({
    mutationFn: (workspaceNuevo: Record<string, unknown>) =>
      actualizarWorkspaceAutomatizacion(automatizacionId, workspaceNuevo),
    onSuccess: () => {
      mostrarExito("Workspace actualizado en Qlik Cloud");
      setModoEdicion(false);
      setErrorJson(null);
      queryClient.invalidateQueries({
        queryKey: ["automatizacion-workspace", automatizacionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["automatizacion", automatizacionId],
      });
    },
    onError: (err: Error) => {
      mostrarError(`Error al guardar workspace: ${err.message}`);
    },
  });

  const handleGuardar = () => {
    try {
      const objetoParsed = JSON.parse(jsonTexto);
      if (typeof objetoParsed !== "object" || objetoParsed === null) {
        throw new Error("El JSON debe ser un objeto válido ({})");
      }
      setErrorJson(null);
      mutationGuardar.mutate(objetoParsed);
    } catch (err: unknown) {
      setErrorJson(
        err instanceof Error ? err.message : "JSON sintácticamente inválido",
      );
    }
  };

  const copiarJson = () => {
    navigator.clipboard.writeText(jsonTexto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="space-y-3 max-w-4xl mx-auto">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-slate-500 font-medium">
          {modoEdicion
            ? "Edita la estructura JSON del script directamente y guarda los cambios en Qlik Cloud"
            : "Estructura colapsable completa del workspace"}
        </span>

        <div className="flex items-center gap-2">
          {!modoEdicion ? (
            <>
              <button
                type="button"
                onClick={copiarJson}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-line-300 text-ink-800 hover:bg-app text-xs font-semibold transition-colors shadow-sm"
              >
                <Icon name="copy" size="sm" className="text-brand-600" />
                {copiado ? "¡JSON Copiado!" : "Copiar JSON"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setJsonTexto(JSON.stringify(workspaceInicial, null, 2));
                  setModoEdicion(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700 text-xs font-semibold transition-colors shadow-sm"
              >
                <Icon name="edit" size="sm" />
                Editar JSON
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setModoEdicion(false);
                  setErrorJson(null);
                }}
                disabled={mutationGuardar.isPending}
                className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 text-xs font-medium transition-colors"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleGuardar}
                disabled={mutationGuardar.isPending}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold transition-colors shadow-sm disabled:opacity-50"
              >
                <Icon name="check" size="sm" />
                {mutationGuardar.isPending
                  ? "Guardando en Qlik..."
                  : "Guardar Cambios"}
              </button>
            </>
          )}
        </div>
      </div>

      {errorJson && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-mono">
          <strong>Sintaxis JSON inválida:</strong> {errorJson}
        </div>
      )}

      {modoEdicion ? (
        <div className="relative rounded-xl border border-slate-300 bg-white p-2 shadow-inner">
          <textarea
            value={jsonTexto}
            onChange={(e) => setJsonTexto(e.target.value)}
            rows={18}
            className="w-full font-mono text-xs p-3 text-slate-800 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium leading-relaxed"
            placeholder="Pega o edita el JSON de workspace aquí..."
          />
        </div>
      ) : (
        <div className="relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm min-h-[400px]">
          <VisorJsonInteractivo data={workspaceInicial} />
        </div>
      )}
    </div>
  );
}
