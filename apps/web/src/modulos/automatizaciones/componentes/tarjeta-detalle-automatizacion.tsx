import { Button } from "@/compartido/componentes/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/compartido/componentes/ui/card";
import { formatearFechaYHora } from "@/compartido/utiles/formateador-fechas";
import type { DetalleAutomatizacion, EjecucionResumen } from "@/modulos/automatizaciones/api";

interface Props {
  automatizacion: DetalleAutomatizacion["automatizacion"];
  ejecutandoActiva: EjecucionResumen | undefined;
  urlQlik: string | null;
  onEjecutar: () => void;
  onDetener: (runId: string) => void;
  mutationEjecutar: { mutate: () => void; isPending: boolean };
  mutationDetener: { mutate: (runId: string) => void; isPending: boolean };
}

export function TarjetaDetalleAutomatizacion({
  automatizacion: auto,
  ejecutandoActiva,
  urlQlik,
  onEjecutar,
  onDetener,
  mutationEjecutar,
}: Props) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Detalles</CardTitle>
          {auto.ejecucionActiva ? (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
              Actualización automática activa
            </span>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-2 text-sm text-gray-600 sm:grid-cols-2">
          <div>
            <dt className="font-medium text-gray-900">Estado</dt>
            <dd>
              {auto.ejecucionActiva
                ? "En ejecución"
                : auto.activa
                  ? "Activa"
                  : "Inactiva"}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-gray-900">Espacio</dt>
            <dd>{auto.espacioNombre}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-900">Propietario</dt>
            <dd>{auto.propietarioNombre}</dd>
          </div>
          {auto.modoEjecucion && (
            <div>
              <dt className="font-medium text-gray-900">Disparador</dt>
              <dd>{auto.modoEjecucion}</dd>
            </div>
          )}
          <div>
            <dt className="font-medium text-gray-900">Creado</dt>
            <dd>{formatearFechaYHora(auto.creadoEn)}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-900">Modificado</dt>
            <dd>{formatearFechaYHora(auto.modificadoEn)}</dd>
          </div>
        </dl>
        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            data-accion="ejecutar"
            disabled={!auto.puedeEjecutar}
            onClick={onEjecutar}
          >
            {auto.ejecucionActiva ? "En ejecución" : "Ejecutar"}
          </Button>
          {auto.ejecucionActiva && ejecutandoActiva && (
            <Button
              variant="outline"
              data-accion="detener"
              onClick={() => onDetener(ejecutandoActiva.id)}
            >
              Detener
            </Button>
          )}
          {urlQlik ? (
            <Button variant="outline" asChild>
              <a href={urlQlik} target="_blank" rel="noopener noreferrer">
                Abrir en Qlik Cloud
              </a>
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
