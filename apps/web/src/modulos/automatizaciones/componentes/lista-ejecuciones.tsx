import { Icon } from "@/compartido/componentes/ui/icon";
import { formatearFechaYHora } from "@/compartido/utiles/formateador-fechas";
import type { EjecucionResumen } from "@/modulos/automatizaciones/api";
import {
  type TonoEstadoEjecucion,
  abreviarIdEjecucion,
  calcularDuracion,
  extraerMensajeError,
  presentarEstadoEjecucion,
} from "@/modulos/automatizaciones/utiles-presentacion-automatizacion";

interface Props {
  ejecuciones: EjecucionResumen[];
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

function tiempoEjecucion(ejecucion: EjecucionResumen) {
  return new Date(ejecucion.iniciadoEn ?? 0).getTime();
}

export function ListaEjecuciones({ ejecuciones }: Props) {
  const ordenadas = [...ejecuciones].sort(
    (a, b) => tiempoEjecucion(b) - tiempoEjecucion(a),
  );

  return (
    <section className="overflow-hidden rounded-xl border border-line-200 bg-surface shadow-card">
      <div className="flex flex-col gap-2 border-b border-line-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-400">
            Actividad reciente
          </p>
          <h2 className="mt-1 font-display text-lg font-semibold text-ink-900">
            Historial de ejecuciones
          </h2>
        </div>
        <span className="text-xs font-medium text-ink-400">
          {ejecuciones.length}{" "}
          {ejecuciones.length === 1
            ? "ejecución registrada"
            : "ejecuciones registradas"}
        </span>
      </div>

      {ordenadas.length === 0 ? (
        <div className="grid min-h-44 place-items-center px-6 py-10 text-center">
          <div>
            <span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-brand-50 text-brand-700">
              <Icon name="play" size="sm" />
            </span>
            <p className="mt-3 text-sm font-semibold text-ink-900">
              Esta automatización todavía no se ha ejecutado
            </p>
            <p className="mt-1 text-sm text-ink-500">
              Usa “Ejecutar ahora” para iniciar la primera ejecución.
            </p>
          </div>
        </div>
      ) : (
        <div>
          <div className="hidden grid-cols-[1.25fr_0.8fr_1fr_1fr_0.65fr] gap-4 border-b border-line-200 bg-app px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink-400 md:grid">
            <span>Ejecución</span>
            <span>Estado</span>
            <span>Inicio</span>
            <span>Fin</span>
            <span>Duración</span>
          </div>

          <ol className="divide-y divide-line-200">
            {ordenadas.map((ejecucion, indice) => {
              const estado = presentarEstadoEjecucion(ejecucion.estado);
              const mensajeError = extraerMensajeError(ejecucion.error);
              const esMasReciente = indice === 0;

              return (
                <li
                  key={ejecucion.id}
                  className={esMasReciente ? "bg-brand-50/30" : "bg-surface"}
                >
                  <div className="grid gap-4 px-5 py-4 md:grid-cols-[1.25fr_0.8fr_1fr_1fr_0.65fr] md:items-center md:px-6">
                    <div className="min-w-0">
                      <span className="text-xs font-medium text-ink-400 md:hidden">
                        Ejecución
                      </span>
                      <div className="mt-1 flex flex-wrap items-center gap-2 md:mt-0">
                        <span
                          title={ejecucion.id}
                          className="truncate font-mono text-xs font-semibold text-ink-700"
                        >
                          {abreviarIdEjecucion(ejecucion.id)}
                        </span>
                        {esMasReciente && (
                          <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[11px] font-semibold text-brand-700">
                            Más reciente
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-medium text-ink-400 md:hidden">
                        Estado
                      </span>
                      <div className="mt-1 md:mt-0">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${CLASES_TONO[estado.tono]}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${PUNTO_TONO[estado.tono]} ${estado.enCurso ? "animate-pulse" : ""}`}
                          />
                          {estado.etiqueta}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-medium text-ink-400 md:hidden">
                        Inicio
                      </span>
                      <p className="mt-1 text-sm text-ink-700 md:mt-0">
                        {formatearFechaYHora(ejecucion.iniciadoEn)}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs font-medium text-ink-400 md:hidden">
                        Fin
                      </span>
                      <p className="mt-1 text-sm text-ink-700 md:mt-0">
                        {ejecucion.finalizadoEn
                          ? formatearFechaYHora(ejecucion.finalizadoEn)
                          : estado.enCurso
                            ? "En curso"
                            : "—"}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs font-medium text-ink-400 md:hidden">
                        Duración
                      </span>
                      <p className="mt-1 font-mono text-xs font-semibold text-ink-700 md:mt-0">
                        {calcularDuracion(
                          ejecucion.iniciadoEn,
                          ejecucion.finalizadoEn,
                        )}
                      </p>
                    </div>

                    {mensajeError && (
                      <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 md:col-span-5">
                        <p className="text-xs font-semibold text-danger-600">
                          Error de ejecución
                        </p>
                        <p className="mt-0.5 text-sm text-red-800">
                          {mensajeError}
                        </p>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </section>
  );
}
