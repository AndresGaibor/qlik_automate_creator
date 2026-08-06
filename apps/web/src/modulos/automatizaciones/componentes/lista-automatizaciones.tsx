import { Button } from "@/compartido/componentes/ui/button";
import { Icon } from "@/compartido/componentes/ui/icon";
import {
  claseEstado,
  estadoVisual,
  sufijoBusqueda,
} from "@/compartido/utiles/automatizaciones";
import { formatearFechaYHora } from "@/compartido/utiles/formateador-fechas";
import { construirUrlVerAutomatizacionQlik } from "@/compartido/utiles/qlik-urls";
import type { ResumenAutomatizacion } from "@/modulos/automatizaciones/api";

interface Props {
  automatizaciones: ResumenAutomatizacion[];
  idEjecutando: string | null;
  espacioFiltrado?: string;
  onEjecutar: (id: string) => void;
  targetHost?: string;
  hayFiltros: boolean;
}

function textoEjecucion(
  auto: ResumenAutomatizacion,
  idEjecutando: string | null,
) {
  if (idEjecutando === auto.id) return "Iniciando…";
  if (auto.ejecucionActiva) return "En ejecución";
  return "Ejecutar ahora";
}

export function ListaAutomatizaciones({
  automatizaciones,
  idEjecutando,
  espacioFiltrado,
  onEjecutar,
  targetHost,
  hayFiltros,
}: Props) {
  const busqueda = sufijoBusqueda(espacioFiltrado);

  if (automatizaciones.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line-300 bg-surface p-10 text-center">
        <p className="font-semibold text-ink-700">
          {hayFiltros
            ? "No hay automatizaciones con esos filtros"
            : "Aún no hay automatizaciones"}
        </p>
        <p className="mt-1 text-sm text-ink-400">
          {hayFiltros
            ? "Cambia el espacio, la búsqueda o limpia los filtros."
            : "Crea una automatización para verla aquí."}
        </p>
        <Button size="sm" asChild className="mt-4">
          <a href={`/automatizaciones/nueva${busqueda}`}>
            Crear mi primera automatización
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-visible rounded-xl border border-line-200 bg-surface shadow-card">
      <div className="hidden grid-cols-[minmax(0,1.25fr)_minmax(260px,1fr)_150px_auto] gap-5 border-b border-line-200 bg-app/50 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-400 lg:grid">
        <span>Automatización</span>
        <span>Contexto</span>
        <span>Estado</span>
        <span className="text-right">Acciones</span>
      </div>

      <div className="divide-y divide-line-200">
        {automatizaciones.map((auto) => {
          const detalleUrl = `/automatizaciones/${auto.id}${busqueda}`;
          const ejecutando = idEjecutando === auto.id || auto.ejecucionActiva;

          return (
            <article
              key={auto.id}
              className="grid gap-4 px-4 py-4 transition-colors hover:bg-hover/60 sm:px-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(260px,1fr)_150px_auto] lg:items-center lg:gap-5"
            >
              <div className="min-w-0">
                <a
                  href={detalleUrl}
                  title={auto.nombre}
                  className="block truncate font-display text-base font-semibold text-ink-900 transition-colors hover:text-brand-700"
                >
                  {auto.nombre}
                </a>
                <div className="mt-1.5 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-500">
                  <span className="inline-flex min-w-0 items-center gap-1.5">
                    <Icon name="cloud" size="sm" className="text-brand-600" />
                    <span className="truncate">
                      {auto.espacioNombre || "Espacio personal"}
                    </span>
                  </span>
                  <span className="hidden text-line-300 sm:inline">•</span>
                  <span className="inline-flex min-w-0 items-center gap-1.5">
                    <Icon name="users" size="sm" className="text-ink-400" />
                    <span className="truncate">
                      {auto.propietarioNombre || "Sin propietario"}
                    </span>
                  </span>
                </div>
              </div>

              <div className="min-w-0">
                <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-400 lg:hidden">
                  Contexto
                </span>
                <p className="truncate text-sm font-medium capitalize text-ink-700">
                  {auto.modoEjecucion || "Manual"}
                </p>
                <p className="mt-1 text-xs text-ink-400">
                  Actualizada {formatearFechaYHora(auto.modificadoEn)}
                </p>
              </div>

              <div>
                <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-400 lg:hidden">
                  Estado
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${claseEstado(auto)}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {estadoVisual(auto)}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                <Button
                  size="sm"
                  data-accion="ejecutar"
                  disabled={!auto.puedeEjecutar || ejecutando}
                  onClick={() => onEjecutar(auto.id)}
                  className="gap-1.5 text-xs"
                >
                  <Icon name="play" size="sm" />
                  {textoEjecucion(auto, idEjecutando)}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="gap-1.5 text-xs"
                >
                  <a href={detalleUrl}>
                    <Icon name="edit" size="sm" />
                    Ver detalle
                  </a>
                </Button>

                {targetHost && (
                  <details className="group relative">
                    <summary
                      aria-label={`Más acciones para ${auto.nombre}`}
                      className="grid h-8 w-8 cursor-pointer list-none place-items-center rounded-md border border-line-200 bg-surface text-ink-600 transition hover:bg-hover hover:text-ink-900 [&::-webkit-details-marker]:hidden"
                    >
                      <Icon name="more" size="sm" />
                      <span className="sr-only">Más acciones</span>
                    </summary>
                    <div className="absolute right-0 top-full z-20 mt-2 min-w-52 rounded-lg border border-line-200 bg-surface p-1.5 shadow-panel">
                      <a
                        href={construirUrlVerAutomatizacionQlik(
                          targetHost,
                          auto.id,
                          "edit",
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-ink-700 transition hover:bg-hover hover:text-ink-900"
                      >
                        <Icon name="ext" size="sm" />
                        Abrir en Qlik Cloud
                      </a>
                    </div>
                  </details>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
