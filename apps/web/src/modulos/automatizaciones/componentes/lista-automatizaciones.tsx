import { Button } from "@/compartido/componentes/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/compartido/componentes/ui/card";
import { claseEstado, estadoVisual } from "@/compartido/utiles/automatizaciones";
import { formatearFechaSeguro } from "@/compartido/utiles/formateador-fechas";
import { construirUrlVerAutomatizacionQlik } from "@/compartido/utiles/qlik-urls";
import type { ResumenAutomatizacion } from "@/modulos/automatizaciones/api";

interface Props {
  automatizaciones: ResumenAutomatizacion[];
  idEjecutando: string | null;
  espacioFiltrado?: string;
  onEjecutar: (id: string) => void;
}

export function ListaAutomatizaciones({
  automatizaciones,
  idEjecutando,
  espacioFiltrado,
  onEjecutar,
}: Props) {
  const busqueda = espacioFiltrado ? `?espacio=${espacioFiltrado}` : "";
  const targetHost = "l676lvg3emfvcq2.us.qlikcloud.com";

  if (automatizaciones.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
        <p className="text-gray-500 font-medium mb-1">
          No hay automatizaciones para mostrar en este espacio.
        </p>
        <p className="text-xs text-gray-400 mb-4">
          Prueba realizando otra búsqueda o creando una nueva automatización.
        </p>
        <Button size="sm" asChild className="bg-blue-600 text-white">
          <a href={`/automatizaciones/nueva${busqueda}`}>
            + Crear Automatización
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {automatizaciones.map((auto) => (
        <Card key={auto.id} className="hover:shadow-md transition border-gray-200">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-3">
              <CardTitle className="text-lg font-bold">
                <a
                  href={`/automatizaciones/${auto.id}${busqueda}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {auto.nombre}
                </a>
              </CardTitle>
              <span
                className={`rounded-full px-3 py-0.5 text-xs font-semibold ${claseEstado(auto)}`}
              >
                ● {estadoVisual(auto)}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-gray-600 bg-gray-50 p-3 rounded-md w-full max-w-2xl">
                <div>
                  <span className="text-gray-400 block">Modo Disparador</span>
                  <span className="font-semibold text-gray-800">
                    ⚡ {auto.modoEjecucion || "Manual"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block">Espacio</span>
                  <span className="font-semibold text-gray-800 truncate block">
                    📁 {auto.espacioNombre || "Personal"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block">Propietario</span>
                  <span className="font-semibold text-gray-800 truncate block">
                    👤 {auto.propietarioNombre}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block">Modificado</span>
                  <span className="font-mono text-gray-700">
                    {formatearFechaSeguro(auto.modificadoEn)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  asChild
                  variant="outline"
                  className="text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-medium"
                >
                  <a
                    href={construirUrlVerAutomatizacionQlik(
                      targetHost,
                      auto.id,
                      "edit",
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    👁️ Ver en Qlik Cloud ↗
                  </a>
                </Button>
                <Button
                  variant="outline"
                  data-accion="ejecutar"
                  disabled={!auto.puedeEjecutar || idEjecutando === auto.id}
                  onClick={() => onEjecutar(auto.id)}
                  className="text-xs border-blue-200 text-blue-700 hover:bg-blue-50 font-medium"
                >
                  {idEjecutando === auto.id
                    ? "⏳ Ejecutando…"
                    : auto.ejecucionActiva
                      ? "▶️ En ejecución"
                      : "▶️ Ejecutar"}
                </Button>
                <Button variant="outline" asChild className="text-xs">
                  <a href={`/automatizaciones/${auto.id}${busqueda}`}>
                    ⚙️ Editar
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
