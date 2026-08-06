import type { TonoEstadoEjecucion } from "@/modulos/automatizaciones/utiles-presentacion-automatizacion";
import type { ReactNode } from "react";
import {
  CLASES_TONO_DETALLE,
  PUNTO_TONO_DETALLE,
} from "./modelo-detalle-automatizacion";

export function CabeceraDetalleAutomatizacion({
  espacioNombre,
  enEjecucion,
  estado,
  acciones,
}: {
  espacioNombre?: string | null;
  enEjecucion: boolean;
  estado: { etiqueta: string; tono: TonoEstadoEjecucion };
  acciones: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 border-b border-line-200 px-5 py-5 sm:px-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2.5">
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${CLASES_TONO_DETALLE[estado.tono]}`}
          >
            <span
              className={`h-2 w-2 rounded-full ${PUNTO_TONO_DETALLE[estado.tono]} ${enEjecucion ? "animate-pulse" : ""}`}
            />
            {estado.etiqueta}
          </span>
          <span className="text-xs text-ink-400">
            {espacioNombre || "Espacio personal"}
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
      {acciones}
    </div>
  );
}
