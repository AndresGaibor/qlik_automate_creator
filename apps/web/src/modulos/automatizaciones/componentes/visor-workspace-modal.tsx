import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import { Button } from "@/compartido/componentes/ui/button";
import { Icon, type IconName } from "@/compartido/componentes/ui/icon";
import { VisorJsonInteractivo } from "@/compartido/componentes/ui/visor-json-interactivo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  type WorkspaceAutomatizacion,
  actualizarWorkspaceAutomatizacion,
  obtenerWorkspaceAutomatizacion,
} from "../api";

interface Props {
  automatizacionId: string;
  nombreAutomatizacion: string;
}

function VisorEditorJsonTab({
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

interface InputParam {
  id: string;
  label?: string;
  type?: string;
  value?: unknown;
}

interface BloqueProcesado {
  id: string;
  type: string;
  title: string;
  connector?: string;
  operation?: string;
  childId?: string;
  nextBlockId?: string;
  inputs: InputParam[];
  comment?: string | null;
  disabled?: boolean;
}

export function VisorWorkspaceModal({
  automatizacionId,
  nombreAutomatizacion,
}: Props) {
  const [abierto, setAbierto] = useState(false);
  const [pestana, setPestana] = useState<"bloques" | "json">("bloques");
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState<string | null>(
    null,
  );
  const [copiado, setCopiado] = useState(false);

  const { data, isLoading, isError, error } = useQuery<WorkspaceAutomatizacion>(
    {
      queryKey: ["automatizacion-workspace", automatizacionId],
      queryFn: () => obtenerWorkspaceAutomatizacion(automatizacionId),
      enabled: abierto,
      staleTime: 60 * 1000,
    },
  );

  const workspaceObj = data?.workspace || {};
  const bloquesRaw = (
    Array.isArray(workspaceObj.blocks) ? workspaceObj.blocks : []
  ) as Record<string, unknown>[];

  const bloques: BloqueProcesado[] = bloquesRaw.map((b) => {
    const rawInputs = (Array.isArray(b.inputs) ? b.inputs : []) as Record<
      string,
      unknown
    >[];
    const inputs: InputParam[] = rawInputs.map((inp) => ({
      id: String(inp.id || inp.name || ""),
      label: inp.label ? String(inp.label) : String(inp.id || inp.name || ""),
      type: inp.type ? String(inp.type) : undefined,
      value: inp.value,
    }));

    return {
      id: String(b.id || ""),
      type: String(b.type || b.blockType || "Block"),
      title: String(
        b.displayName || b.name || b.title || b.type || "Bloque sin título",
      ),
      connector:
        b.connector || b.connectorId
          ? String(b.connector || b.connectorId)
          : undefined,
      operation:
        b.operation || b.action ? String(b.operation || b.action) : undefined,
      childId: b.childId ? String(b.childId) : undefined,
      nextBlockId: b.nextBlockId
        ? String(b.nextBlockId)
        : b.childId
          ? String(b.childId)
          : undefined,
      inputs,
      comment: typeof b.comment === "string" ? b.comment : null,
      disabled: Boolean(b.disabled),
    };
  });

  const copiarJson = () => {
    const texto = JSON.stringify(workspaceObj, null, 2);
    navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const getTipoBadges = (
    type: string,
  ): { bg: string; icon: IconName; label: string } => {
    if (type.includes("Start"))
      return {
        bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: "play",
        label: "Inicio / Disparador",
      };
    if (type.includes("Endpoint"))
      return {
        bg: "bg-sky-50 text-sky-700 border-sky-200",
        icon: "zap",
        label: "Acción API / Conector",
      };
    if (type.includes("Show") || type.includes("Output"))
      return {
        bg: "bg-indigo-50 text-indigo-700 border-indigo-200",
        icon: "sparkles",
        label: "Salida / Output",
      };
    if (type.includes("Stop"))
      return {
        bg: "bg-rose-50 text-rose-700 border-rose-200",
        icon: "x",
        label: "Fin de Flujo",
      };
    return {
      bg: "bg-slate-100 text-slate-700 border-slate-200",
      icon: "flow",
      label: type,
    };
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
        Ver Script / Workspace
      </Button>

      {abierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="flex flex-col w-full max-w-4xl max-h-[88vh] bg-surface rounded-xl border border-line-200 shadow-2xl overflow-hidden">
            {/* Header */}
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
                    Pasos de la automatización ({bloques.length})
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

            {/* Content */}
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
                    <div className="space-y-6 max-w-3xl mx-auto">
                      <div className="flex items-center justify-between text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                        <span className="flex items-center gap-2 font-medium text-slate-700">
                          <Icon
                            name="flow"
                            size="sm"
                            className="text-brand-600"
                          />
                          Secuencia ejecutable de bloques conectados
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={copiarJson}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-medium transition-colors"
                          >
                            <Icon name="copy" size="sm" />
                            {copiado ? "¡Copiado!" : "Copiar JSON Workspace"}
                          </button>
                        </div>
                      </div>

                      {bloques.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500 text-sm bg-white">
                          No se encontraron bloques explícitos en este workspace
                          o el script está vacío.
                        </div>
                      ) : (
                        <div className="relative space-y-0">
                          {bloques.map((bloque, idx) => {
                            const estaSeleccionado =
                              bloqueSeleccionado === bloque.id;
                            const datosBloqueRaw = bloquesRaw.find(
                              (b) => String(b.id) === bloque.id,
                            );
                            const badge = getTipoBadges(bloque.type);
                            const esUltimo = idx === bloques.length - 1;

                            return (
                              <div
                                key={bloque.id || idx}
                                className="relative flex flex-col items-center"
                              >
                                {/* Card del Bloque */}
                                <div
                                  className={`w-full rounded-2xl border transition-all duration-200 bg-white shadow-sm hover:shadow-md ${
                                    estaSeleccionado
                                      ? "border-brand-500 ring-2 ring-brand-100 shadow-md"
                                      : "border-slate-200 hover:border-slate-300"
                                  }`}
                                >
                                  {/* Encabezado del Bloque */}
                                  <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50/50 rounded-t-2xl">
                                    <div className="flex items-center gap-3">
                                      <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-brand-600 text-xs font-bold text-white shadow-sm">
                                        {idx + 1}
                                      </span>
                                      <div>
                                        <h4 className="font-display font-semibold text-slate-900 text-base flex items-center gap-2">
                                          {bloque.title}
                                          {bloque.disabled && (
                                            <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-normal">
                                              Deshabilitado
                                            </span>
                                          )}
                                        </h4>
                                        {bloque.comment && (
                                          <p className="text-xs text-slate-500 italic mt-0.5">
                                            Comentario: "{bloque.comment}"
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <span
                                        className={`inline-flex items-center gap-1.5 border px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.bg}`}
                                      >
                                        <Icon name={badge.icon} size="sm" />
                                        {badge.label}
                                      </span>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          setBloqueSeleccionado(
                                            estaSeleccionado ? null : bloque.id,
                                          )
                                        }
                                        className="text-xs font-medium text-brand-600 hover:text-brand-800 hover:bg-brand-50 px-2.5 py-1 rounded-lg transition-colors border border-transparent hover:border-brand-100 ml-1"
                                      >
                                        {estaSeleccionado
                                          ? "Ocultar JSON"
                                          : "Ver JSON"}
                                      </button>
                                    </div>
                                  </div>

                                  {/* Cuerpo / Parámetros del Bloque */}
                                  <div className="p-4 space-y-3">
                                    {/* Inputs / Configuración */}
                                    {bloque.inputs.length > 0 ? (
                                      <div className="space-y-2">
                                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                                          Parámetros y Entradas (
                                          {bloque.inputs.length})
                                        </span>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                          {bloque.inputs.map((inp) => (
                                            <div
                                              key={inp.id}
                                              className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs flex flex-col justify-between"
                                            >
                                              <span className="text-slate-500 font-medium text-[11px] block">
                                                {inp.label}:
                                              </span>
                                              <span className="font-mono text-slate-800 font-semibold mt-0.5 truncate break-all">
                                                {inp.value === null ||
                                                inp.value === undefined ? (
                                                  <span className="text-slate-400 italic">
                                                    sin configurar
                                                  </span>
                                                ) : typeof inp.value ===
                                                  "object" ? (
                                                  JSON.stringify(inp.value)
                                                ) : (
                                                  String(inp.value)
                                                )}
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="text-xs text-slate-400 italic">
                                        Sin parámetros de entrada adicionales.
                                      </div>
                                    )}

                                    {/* Metadata secundaria */}
                                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 font-mono">
                                      <span>ID: {bloque.id}</span>
                                      {bloque.nextBlockId && (
                                        <span className="text-brand-600 font-semibold bg-brand-50 border border-brand-100 px-2 py-0.5 rounded-md">
                                          Conectado a{" "}
                                          {bloque.nextBlockId.substring(0, 8)}…
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Desplegable JSON del Nodo */}
                                  {estaSeleccionado && datosBloqueRaw && (
                                    <div className="border-t border-slate-200 bg-slate-50 p-4 rounded-b-2xl">
                                      <div className="flex items-center justify-between text-xs text-slate-600 mb-2 border-b border-slate-200 pb-2">
                                        <span className="font-mono text-brand-700 font-semibold">
                                          ESQUEMA JSON DEL BLOQUE [
                                          {bloque.title}]
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            navigator.clipboard.writeText(
                                              JSON.stringify(
                                                datosBloqueRaw,
                                                null,
                                                2,
                                              ),
                                            );
                                          }}
                                          className="text-[11px] text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md shadow-sm font-medium"
                                        >
                                          Copiar Bloque
                                        </button>
                                      </div>
                                      <VisorJsonInteractivo
                                        data={datosBloqueRaw}
                                      />
                                    </div>
                                  )}
                                </div>

                                {/* Conector / Flecha entre Bloques */}
                                {!esUltimo && (
                                  <div className="flex flex-col items-center py-2">
                                    <div className="w-0.5 h-6 bg-brand-300" />
                                    <div className="flex items-center justify-center h-5 w-5 rounded-full bg-brand-100 text-brand-700 border border-brand-200 shadow-sm text-[10px]">
                                      Ver detalles
                                    </div>
                                    <div className="w-0.5 h-2 bg-brand-300" />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {pestana === "json" && (
                    <div className="space-y-4">
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 font-medium">
                        Esta sección es para usuarios con experiencia técnica.
                        Modificar el JSON directamente puede afectar el
                        funcionamiento de la automatización.
                      </div>
                      <VisorEditorJsonTab
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
