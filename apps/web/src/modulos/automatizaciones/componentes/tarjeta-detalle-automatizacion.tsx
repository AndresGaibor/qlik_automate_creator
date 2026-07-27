import { Button } from "@/compartido/componentes/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/compartido/componentes/ui/card";
import { Icon } from "@/compartido/componentes/ui/icon";
import { formatearFechaYHora } from "@/compartido/utiles/formateador-fechas";
import type { DetalleAutomatizacion, EjecucionResumen } from "@/modulos/automatizaciones/api";
import { VisorWorkspaceModal } from "./visor-workspace-modal";

interface Props {
  automatizacion: DetalleAutomatizacion["automatizacion"];
  ejecutandoActiva: EjecucionResumen | undefined;
  urlQlik: string | null;
  onEjecutar: () => void;
  onDetener: (runId: string) => void;
  onClonar: () => void;
  mutationEjecutar: { mutate: () => void; isPending: boolean };
  mutationDetener: { mutate: (runId: string) => void; isPending: boolean };
}

export function TarjetaDetalleAutomatizacion({
  automatizacion: auto,
  ejecutandoActiva,
  urlQlik,
  onEjecutar,
  onDetener,
  onClonar,
  mutationEjecutar,
  mutationDetener,
}: Props) {
  const enEjecucion = auto.ejecucionActiva || mutationEjecutar.isPending;

  return (
    <Card className="mb-6 border-line-200 bg-surface shadow-card">
      <CardHeader className="border-b border-line-200 bg-app/30 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CardTitle className="font-display text-lg font-semibold text-ink-900">
              Información de la Automatización
            </CardTitle>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                enEjecucion
                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                  : auto.activa
                    ? "bg-brand-50 text-brand-700 border border-brand-100"
                    : "bg-ink-100 text-ink-600"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  enEjecucion
                    ? "bg-amber-500 animate-pulse"
                    : auto.activa
                      ? "bg-brand-600 animate-dot-pulse"
                      : "bg-ink-400"
                }`}
              />
              {enEjecucion ? "En Ejecución" : auto.activa ? "Activa" : "Inactiva"}
            </span>

            <VisorWorkspaceModal
              automatizacionId={auto.id}
              nombreAutomatizacion={auto.nombre}
            />

            {urlQlik && (
              <Button variant="outline" size="sm" asChild className="text-xs gap-1.5">
                <a href={urlQlik} target="_blank" rel="noopener noreferrer">
                  <Icon name="ext" size="sm" />
                  Abrir en Qlik Cloud
                </a>
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={onClonar}
              className="text-xs gap-1.5"
            >
              <Icon name="plus" size="sm" />
              Clonar
            </Button>

            <Button
              size="sm"
              disabled={!auto.puedeEjecutar || enEjecucion}
              onClick={onEjecutar}
              className="text-xs gap-1.5"
            >
              <Icon name="play" size="sm" />
              {enEjecucion ? "Ejecutando…" : "Ejecutar ahora"}
            </Button>

            {enEjecucion && ejecutandoActiva && (
              <Button
                variant="outline"
                size="sm"
                disabled={mutationDetener.isPending}
                onClick={() => onDetener(ejecutandoActiva.id)}
                className="text-xs gap-1.5 border-danger-600 text-danger-600 hover:bg-red-50"
              >
                <Icon name="pause" size="sm" />
                Detener
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-line-200 bg-app/40 p-3.5">
            <span className="text-xs font-semibold text-ink-500 block uppercase tracking-wide">Espacio</span>
            <div className="mt-1 flex items-center gap-2">
              <Icon name="cloud" size="sm" className="text-obj-600" />
              <span className="font-semibold text-ink-900 text-sm truncate">{auto.espacioNombre || "Personal"}</span>
            </div>
          </div>

          <div className="rounded-lg border border-line-200 bg-app/40 p-3.5">
            <span className="text-xs font-semibold text-ink-500 block uppercase tracking-wide">Propietario</span>
            <div className="mt-1 flex items-center gap-2">
              <Icon name="users" size="sm" className="text-ink-400" />
              <span className="font-semibold text-ink-900 text-sm truncate">{auto.propietarioNombre}</span>
            </div>
          </div>

          <div className="rounded-lg border border-line-200 bg-app/40 p-3.5">
            <span className="text-xs font-semibold text-ink-500 block uppercase tracking-wide">Modo Disparador</span>
            <div className="mt-1 flex items-center gap-2">
              <Icon name="zap" size="sm" className="text-brand-600" />
              <span className="font-semibold text-ink-900 text-sm">{auto.modoEjecucion || "Manual"}</span>
            </div>
          </div>

          <div className="rounded-lg border border-line-200 bg-app/40 p-3.5">
            <span className="text-xs font-semibold text-ink-500 block uppercase tracking-wide">Fechas</span>
            <div className="mt-1 text-xs text-ink-700 space-y-0.5">
              <div><span className="text-ink-400">Creado:</span> {formatearFechaYHora(auto.creadoEn)}</div>
              <div><span className="text-ink-400">Modificado:</span> {formatearFechaYHora(auto.modificadoEn)}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
