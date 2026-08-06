import { Button } from "@/compartido/componentes/ui/button";
import { Icon } from "@/compartido/componentes/ui/icon";
import type {
  DetalleAutomatizacion,
  EjecucionResumen,
} from "@/modulos/automatizaciones/api";
import { useState } from "react";
import { VisorWorkspaceModal } from "./visor-workspace-modal";

export function AccionesDetalleAutomatizacion({
  automatizacion,
  enEjecucion,
  ejecutandoActiva,
  urlQlik,
  onEjecutar,
  onDetener,
  onClonar,
  deteniendo,
  mostrarWorkspace,
}: {
  automatizacion: DetalleAutomatizacion["automatizacion"];
  enEjecucion: boolean;
  ejecutandoActiva: EjecucionResumen | undefined;
  urlQlik: string | null;
  onEjecutar: () => void;
  onDetener: (runId: string) => void;
  onClonar: () => void;
  deteniendo: boolean;
  mostrarWorkspace: boolean;
}) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2">
      {enEjecucion && ejecutandoActiva ? (
        <Button
          variant="destructive"
          size="sm"
          disabled={deteniendo}
          onClick={() => onDetener(ejecutandoActiva.id)}
          className="gap-2"
        >
          <Icon name="pause" size="sm" />
          {deteniendo ? "Deteniendo…" : "Detener"}
        </Button>
      ) : (
        <Button
          size="default"
          disabled={!automatizacion.puedeEjecutar || enEjecucion}
          onClick={onEjecutar}
          className="gap-2 px-5"
        >
          <Icon name="play" size="sm" />
          {enEjecucion ? "Ejecutando…" : "Ejecutar ahora"}
        </Button>
      )}
      <div className="relative">
        <Button
          variant="outline"
          size="default"
          aria-expanded={menuAbierto}
          aria-haspopup="menu"
          onClick={() => setMenuAbierto((abierto) => !abierto)}
          className="gap-2"
        >
          <Icon name="more" size="sm" />
          Más acciones
        </Button>
        {menuAbierto && (
          <div
            role="menu"
            className="absolute right-0 top-full z-30 mt-2 w-56 rounded-lg border border-line-200 bg-surface p-1.5 shadow-panel"
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setMenuAbierto(false);
                onClonar();
              }}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-ink-700 hover:bg-hover hover:text-ink-900"
            >
              <Icon name="copy" size="sm" />
              Clonar automatización
            </button>
            {urlQlik && (
              <a
                role="menuitem"
                href={urlQlik}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-ink-700 hover:bg-hover hover:text-ink-900"
              >
                <Icon name="ext" size="sm" />
                Abrir en Qlik Cloud
              </a>
            )}
            {mostrarWorkspace && (
              <div className="border-t border-line-200 pt-1.5">
                <VisorWorkspaceModal
                  automatizacionId={automatizacion.id}
                  nombreAutomatizacion={automatizacion.nombre}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
