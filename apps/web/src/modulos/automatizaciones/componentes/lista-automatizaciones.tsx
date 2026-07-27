import { Button } from "@/compartido/componentes/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/compartido/componentes/ui/card";
import { Icon } from "@/compartido/componentes/ui/icon";
import {
  claseEstado,
  estadoVisual,
} from "@/compartido/utiles/automatizaciones";
import { formatearFechaSeguro } from "@/compartido/utiles/formateador-fechas";
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

export function ListaAutomatizaciones({
  automatizaciones,
  idEjecutando,
  espacioFiltrado,
  onEjecutar,
  targetHost,
  hayFiltros,
}: Props) {
  const busqueda = espacioFiltrado ? `?espacio=${espacioFiltrado}` : "";

  if (automatizaciones.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
        <p className="text-gray-500 font-medium mb-1">
          {hayFiltros
            ? "No hay automatizaciones con esos filtros"
            : "Aún no hay automatizaciones"}
        </p>
        <p className="text-xs text-gray-400 mb-4">
          {hayFiltros
            ? "Cambia el espacio o la búsqueda, o limpia los filtros."
            : "Crea una automatización para verla aquí."}
        </p>
        <Button size="sm" asChild className="bg-blue-600 text-white">
          <a href={`/automatizaciones/nueva${busqueda}`}>
            + Crear mi primera automatización
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {automatizaciones.map((auto) => (
        <Card
          key={auto.id}
          className="hover:shadow-md transition border-gray-200"
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-3">
              <CardTitle className="text-lg font-bold">
                <a
                  href={`/automatizaciones/${auto.id}${busqueda}`}
                  className="text-ink-900 hover:text-brand-600 transition-colors"
                >
                  {auto.nombre}
                </a>
              </CardTitle>
              <span
                className={`rounded-full px-3 py-0.5 text-xs font-semibold ${claseEstado(auto)}`}
              >
                {estadoVisual(auto)}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-gray-600 bg-gray-50 p-3 rounded-md w-full max-w-2xl">
                <div>
                  <span className="text-gray-400 block">Modo de ejecución</span>
                  <span className="font-semibold text-gray-800 flex items-center gap-1 mt-0.5">
                    <Icon name="zap" size="sm" className="text-brand-600" />
                    {auto.modoEjecucion || "Manual"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block">Espacio</span>
                  <span className="font-semibold text-gray-800 truncate block">
                    {auto.espacioNombre || "Espacio personal"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block">Propietario</span>
                  <span className="font-semibold text-gray-800 truncate flex items-center gap-1 mt-0.5">
                    <Icon name="users" size="sm" className="text-ink-400" />
                    {auto.propietarioNombre}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block">
                    Última modificación
                  </span>
                  <span className="font-mono text-gray-700">
                    {formatearFechaSeguro(auto.modificadoEn)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {targetHost && (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="text-xs gap-1.5"
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
                      <Icon name="ext" size="sm" /> Abrir en Qlik Cloud
                    </a>
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  data-accion="ejecutar"
                  disabled={!auto.puedeEjecutar || idEjecutando === auto.id}
                  onClick={() => onEjecutar(auto.id)}
                  className="text-xs gap-1.5"
                >
                  <Icon name="play" size="sm" className="text-brand-600" />
                  {idEjecutando === auto.id
                    ? "Ejecutando…"
                    : auto.ejecucionActiva
                      ? "En proceso"
                      : "Ejecutar ahora"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="text-xs gap-1.5"
                >
                  <a href={`/automatizaciones/${auto.id}${busqueda}`}>
                    <Icon name="edit" size="sm" />
                    Ver detalle
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
