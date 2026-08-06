import { Icon } from "@/compartido/componentes/ui/icon";
import type { ResumenAutomatizacion } from "@/modulos/automatizaciones/publico";
import type { ConexionDestino, RecursoDestino } from "../api";
import {
  ETIQUETA_TIPO_DESTINO,
  buscarAutomatizacionVinculada,
} from "../modelo-presentacion";

export interface ListaReportesProps {
  conexiones: ConexionDestino[];
  conexionActiva?: ConexionDestino;
  recursos: RecursoDestino[];
  automatizaciones: ResumenAutomatizacion[];
  busqueda: string;
  recursoSeleccionadoId: string | null;
  onBusquedaChange(valor: string): void;
  onConexionChange(id: string): void;
  onRecursoChange(id: string): void;
}

export function ListaReportes({
  conexiones,
  conexionActiva,
  recursos,
  automatizaciones,
  busqueda,
  recursoSeleccionadoId,
  onBusquedaChange,
  onConexionChange,
  onRecursoChange,
}: ListaReportesProps) {
  const termino = busqueda.trim().toLocaleLowerCase("es");
  const filtrados = termino
    ? recursos.filter((recurso) =>
        recurso.nombre.toLocaleLowerCase("es").includes(termino),
      )
    : recursos;

  return (
    <section
      aria-labelledby="lista-reportes"
      className="space-y-3 lg:sticky lg:top-24"
    >
      <div className="flex items-center justify-between gap-3 px-1">
        <div>
          <h2
            id="lista-reportes"
            className="text-sm font-semibold text-ink-900"
          >
            Reportes disponibles
          </h2>
          <p className="mt-0.5 text-xs text-ink-500">
            {filtrados.length} {filtrados.length === 1 ? "reporte" : "reportes"}
          </p>
        </div>
        {conexiones.length > 0 ? (
          <select
            value={conexionActiva?.id ?? ""}
            onChange={(evento) => onConexionChange(evento.target.value)}
            aria-label="Seleccionar conexión de destino"
            className="max-w-[180px] rounded-md border border-line-200 bg-surface px-2.5 py-1.5 text-xs font-medium text-ink-700 outline-none focus:border-brand-600"
          >
            {conexiones.map((conexion) => (
              <option key={conexion.id} value={conexion.id}>
                {conexion.nombre} · {ETIQUETA_TIPO_DESTINO[conexion.tipo]}
              </option>
            ))}
          </select>
        ) : (
          <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700">
            Impala heredado
          </span>
        )}
      </div>

      <label className="relative block">
        <Icon
          name="search"
          size="sm"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
        />
        <input
          type="search"
          value={busqueda}
          onChange={(evento) => onBusquedaChange(evento.target.value)}
          placeholder="Buscar un reporte…"
          aria-label="Buscar un reporte"
          className="h-10 w-full rounded-md border border-line-200 bg-surface pl-9 pr-3 text-sm text-ink-900 outline-none placeholder:text-ink-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
        />
      </label>

      <div className="max-h-[650px] space-y-2 overflow-y-auto pr-1">
        {filtrados.length === 0 ? (
          <div className="rounded-lg border border-dashed border-line-300 bg-surface p-8 text-center text-sm text-ink-500">
            No se encontraron reportes.
          </div>
        ) : (
          filtrados.map((recurso) => (
            <BotonReporte
              key={recurso.id}
              recurso={recurso}
              seleccionada={recursoSeleccionadoId === recurso.id}
              automatizacion={buscarAutomatizacionVinculada(
                recurso,
                automatizaciones,
              )}
              onSelect={() => onRecursoChange(recurso.id)}
            />
          ))
        )}
      </div>
    </section>
  );
}

function BotonReporte({
  recurso,
  seleccionada,
  automatizacion,
  onSelect,
}: {
  recurso: RecursoDestino;
  seleccionada: boolean;
  automatizacion?: ResumenAutomatizacion;
  onSelect(): void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={seleccionada}
      className={`w-full rounded-lg border p-3 text-left transition ${
        seleccionada
          ? "border-brand-500 bg-brand-50 ring-2 ring-brand-100"
          : "border-line-200 bg-surface hover:border-brand-300"
      }`}
    >
      <div className="flex items-center gap-2">
        <Icon
          name="db"
          size="sm"
          className={seleccionada ? "text-brand-600" : "text-ink-400"}
        />
        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink-900">
          {recurso.nombre}
        </span>
      </div>
      {automatizacion ? (
        <p className="mt-1.5 truncate pl-6 text-xs text-positive-700">
          Usado por {automatizacion.nombre}
        </p>
      ) : null}
    </button>
  );
}
