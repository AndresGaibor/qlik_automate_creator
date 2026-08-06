import { formatearFechaYHora } from "@/compartido/utiles/formateador-fechas";
import type { EjecucionResumen } from "@/modulos/automatizaciones/api";
import {
  type TonoEstadoEjecucion,
  calcularDuracion,
} from "@/modulos/automatizaciones/utiles-presentacion-automatizacion";
import {
  CLASES_TONO_DETALLE,
  PUNTO_TONO_DETALLE,
} from "./modelo-detalle-automatizacion";

export function UltimaEjecucionAutomatizacion({
  ejecucion,
  presentacion,
  mensajeError,
}: {
  ejecucion: EjecucionResumen | undefined;
  presentacion: { etiqueta: string; tono: TonoEstadoEjecucion } | null;
  mensajeError: string | null;
}) {
  return (
    <div className="border-b border-line-200 p-5 sm:p-6 lg:border-b-0 lg:border-r">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-400">
            Última ejecución
          </p>
          {ejecucion && presentacion ? (
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold ${CLASES_TONO_DETALLE[presentacion.tono]}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${PUNTO_TONO_DETALLE[presentacion.tono]}`}
                />
                {presentacion.etiqueta}
              </span>
              <span className="text-sm text-ink-500">
                {formatearFechaYHora(ejecucion.iniciadoEn)}
              </span>
            </div>
          ) : (
            <p className="mt-2 text-sm font-medium text-ink-700">
              Todavía no hay ejecuciones registradas.
            </p>
          )}
        </div>
        {ejecucion && (
          <div className="text-left sm:text-right">
            <p className="text-xs text-ink-400">Duración</p>
            <p className="mt-1 font-display text-lg font-semibold text-ink-900">
              {calcularDuracion(ejecucion.iniciadoEn, ejecucion.finalizadoEn)}
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
  );
}
