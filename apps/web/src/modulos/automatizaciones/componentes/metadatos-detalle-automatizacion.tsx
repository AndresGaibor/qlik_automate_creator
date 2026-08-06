import { formatearFechaYHora } from "@/compartido/utiles/formateador-fechas";
import type { DetalleAutomatizacion } from "@/modulos/automatizaciones/api";

export function MetadatosDetalleAutomatizacion({
  automatizacion,
}: {
  automatizacion: DetalleAutomatizacion["automatizacion"];
}) {
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-5 p-5 sm:p-6 lg:grid-cols-1">
      <div>
        <dt className="text-xs font-medium text-ink-400">Propietario</dt>
        <dd className="mt-1 truncate text-sm font-semibold text-ink-900">
          {automatizacion.propietarioNombre || "Sin propietario"}
        </dd>
      </div>
      <div>
        <dt className="text-xs font-medium text-ink-400">Ejecución</dt>
        <dd className="mt-1 text-sm font-semibold capitalize text-ink-900">
          {automatizacion.modoEjecucion || "Manual"}
        </dd>
      </div>
      <div>
        <dt className="text-xs font-medium text-ink-400">
          Última modificación
        </dt>
        <dd className="mt-1 text-sm font-medium text-ink-700">
          {formatearFechaYHora(automatizacion.modificadoEn)}
        </dd>
      </div>
    </dl>
  );
}
