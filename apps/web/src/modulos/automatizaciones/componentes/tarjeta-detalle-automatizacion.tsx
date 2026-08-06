import { Button } from "@/compartido/componentes/ui/button";
import { Icon } from "@/compartido/componentes/ui/icon";
import { formatearFechaYHora } from "@/compartido/utiles/formateador-fechas";
import type {
  DetalleAutomatizacion,
  EjecucionResumen,
} from "@/modulos/automatizaciones/api";
import {
  type TonoEstadoEjecucion,
  calcularDuracion,
  extraerMensajeError,
  presentarEstadoEjecucion,
} from "@/modulos/automatizaciones/utiles-presentacion-automatizacion";
import { useState } from "react";
import { VisorWorkspaceModal } from "./visor-workspace-modal";

interface Props {
  automatizacion: DetalleAutomatizacion["automatizacion"];
  ejecutandoActiva: EjecucionResumen | undefined;
  ultimaEjecucion: EjecucionResumen | undefined;
  urlQlik: string | null;
  onEjecutar: () => void;
  onDetener: (runId: string) => void;
  onClonar: () => void;
  mutationEjecutar: { mutate: () => void; isPending: boolean };
  mutationDetener: { mutate: (runId: string) => void; isPending: boolean };
  mostrarWorkspace?: boolean;
}

const CLASES_TONO: Record<TonoEstadoEjecucion, string> = {
  exito: "border-brand-100 bg-brand-50 text-brand-700",
  error: "border-red-200 bg-red-50 text-danger-600",
  progreso: "border-amber-200 bg-amber-50 text-amber-700",
  neutral: "border-line-200 bg-app text-ink-600",
};

const PUNTO_TONO: Record<TonoEstadoEjecucion, string> = {
  exito: "bg-brand-600",
  error: "bg-danger-600",
  progreso: "bg-amber-500",
  neutral: "bg-ink-400",
};

function estadoGeneral(
  activa: boolean,
  enEjecucion: boolean,
  ultimaEjecucion?: EjecucionResumen,
) {
  if (enEjecucion) {
    return { etiqueta: "Ejecutándose", tono: "progreso" as const };
  }
  if (!activa) return { etiqueta: "Inactivo", tono: "neutral" as const };
  const ultimoEstado = ultimaEjecucion
    ? presentarEstadoEjecucion(ultimaEjecucion.estado)
    : null;
  if (ultimoEstado?.tono === "error") {
    return { etiqueta: "Requiere atención", tono: "error" as const };
  }
  return { etiqueta: "Disponible", tono: "exito" as const };
}

export function TarjetaDetalleAutomatizacion({
  automatizacion: auto,
  ejecutandoActiva,
  ultimaEjecucion,
  urlQlik,
  onEjecutar,
  onDetener,
  onClonar,
  mutationEjecutar,
  mutationDetener,
  mostrarWorkspace = true,
}: Props) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const enEjecucion = auto.ejecucionActiva || mutationEjecutar.isPending;
  const estado = estadoGeneral(auto.activa, enEjecucion, ultimaEjecucion);
  const ultimaPresentada = ultimaEjecucion
    ? presentarEstadoEjecucion(ultimaEjecucion.estado)
    : null;
  const mensajeError = ultimaEjecucion
    ? extraerMensajeError(ultimaEjecucion.error)
    : null;

  return (
    <section className="overflow-visible rounded-xl border border-line-200 bg-surface shadow-card">
      <div className="flex flex-col gap-5 border-b border-line-200 px-5 py-5 sm:px-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${CLASES_TONO[estado.tono]}`}
            >
              <span
                className={`h-2 w-2 rounded-full ${PUNTO_TONO[estado.tono]} ${enEjecucion ? "animate-pulse" : ""}`}
              />
              {estado.etiqueta}
            </span>
            <span className="text-xs text-ink-400">
              {auto.espacioNombre || "Espacio personal"}
            </span>
          </div>
          <h2 className="mt-3 font-display text-xl font-semibold text-ink-900">
            Estado de la automatización
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-ink-500">
            {enEjecucion
              ? "Qlik Cloud está procesando la automatización. El estado se actualizará automáticamente."
              : "La automatización está lista para ejecutarse con la configuración guardada."}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {enEjecucion && ejecutandoActiva ? (
            <Button
              variant="destructive"
              size="sm"
              disabled={mutationDetener.isPending}
              onClick={() => onDetener(ejecutandoActiva.id)}
              className="gap-2"
            >
              <Icon name="pause" size="sm" />
              {mutationDetener.isPending ? "Deteniendo…" : "Detener"}
            </Button>
          ) : (
            <Button
              size="default"
              disabled={!auto.puedeEjecutar || enEjecucion}
              onClick={onEjecutar}
              className="gap-2 px-5"
            >
              <Icon name="play" size="sm" />
              {enEjecucion ? "Ejecutando…" : "Ejecutar ahora"}
            </Button>
          )}

          <div className="relative">
            <Button
              variant="outline"
              size="default"
              aria-expanded={menuAbierto}
              aria-haspopup="menu"
              onClick={() => setMenuAbierto((abierto) => !abierto)}
              className="gap-2"
            >
              <Icon name="more" size="sm" />
              Más acciones
            </Button>

            {menuAbierto && (
              <div
                role="menu"
                className="absolute right-0 top-full z-30 mt-2 w-56 rounded-lg border border-line-200 bg-surface p-1.5 shadow-panel"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuAbierto(false);
                    onClonar();
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-ink-700 hover:bg-hover hover:text-ink-900"
                >
                  <Icon name="copy" size="sm" />
                  Clonar automatización
                </button>

                {urlQlik && (
                  <a
                    role="menuitem"
                    href={urlQlik}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-ink-700 hover:bg-hover hover:text-ink-900"
                  >
                    <Icon name="ext" size="sm" />
                    Abrir en Qlik Cloud
                  </a>
                )}

                {mostrarWorkspace && (
                  <div className="border-t border-line-200 pt-1.5">
                    <VisorWorkspaceModal
                      automatizacionId={auto.id}
                      nombreAutomatizacion={auto.nombre}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
        <div className="border-b border-line-200 p-5 sm:p-6 lg:border-b-0 lg:border-r">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-400">
                Última ejecución
              </p>
              {ultimaEjecucion && ultimaPresentada ? (
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold ${CLASES_TONO[ultimaPresentada.tono]}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${PUNTO_TONO[ultimaPresentada.tono]}`}
                    />
                    {ultimaPresentada.etiqueta}
                  </span>
                  <span className="text-sm text-ink-500">
                    {formatearFechaYHora(ultimaEjecucion.iniciadoEn)}
                  </span>
                </div>
              ) : (
                <p className="mt-2 text-sm font-medium text-ink-700">
                  Todavía no hay ejecuciones registradas.
                </p>
              )}
            </div>

            {ultimaEjecucion && (
              <div className="text-left sm:text-right">
                <p className="text-xs text-ink-400">Duración</p>
                <p className="mt-1 font-display text-lg font-semibold text-ink-900">
                  {calcularDuracion(
                    ultimaEjecucion.iniciadoEn,
                    ultimaEjecucion.finalizadoEn,
                  )}
                </p>
              </div>
            )}
          </div>

          {mensajeError && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-danger-600">
                Motivo del fallo
              </p>
              <p className="mt-1 text-sm text-red-800">{mensajeError}</p>
            </div>
          )}
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-5 p-5 sm:p-6 lg:grid-cols-1">
          <div>
            <dt className="text-xs font-medium text-ink-400">Propietario</dt>
            <dd className="mt-1 truncate text-sm font-semibold text-ink-900">
              {auto.propietarioNombre || "Sin propietario"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-ink-400">Ejecución</dt>
            <dd className="mt-1 text-sm font-semibold capitalize text-ink-900">
              {auto.modoEjecucion || "Manual"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-ink-400">
              Última modificación
            </dt>
            <dd className="mt-1 text-sm font-medium text-ink-700">
              {formatearFechaYHora(auto.modificadoEn)}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
