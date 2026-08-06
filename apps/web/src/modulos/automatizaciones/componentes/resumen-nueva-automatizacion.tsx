import { Button } from "@/compartido/componentes/ui/button";
import { Icon } from "@/compartido/componentes/ui/icon";

interface Props {
  flujoNombre: string;
  conexionNombre: string;
  recursoNombre: string;
  nombre: string;
  modoActivo: 1 | 2;
  plantillaNombre: string | null;
  requiereDestino: boolean;
  isCreating: boolean;
  onCrear: () => void;
}

export function ResumenNuevaAutomatizacion({
  flujoNombre,
  conexionNombre,
  recursoNombre,
  nombre,
  modoActivo,
  plantillaNombre,
  requiereDestino,
  isCreating,
  onCrear,
}: Props) {
  const origenCompleto = Boolean(flujoNombre);
  const destinoCompleto = Boolean(
    recursoNombre && (!requiereDestino || conexionNombre),
  );
  const nombreCompleto = Boolean(nombre.trim());
  const completos = [origenCompleto, destinoCompleto, nombreCompleto].filter(
    Boolean,
  ).length;
  const progreso = Math.round((completos / 3) * 100);
  const puedeCrear = completos === 3;
  const faltantes = [
    !origenCompleto ? "Selecciona el Dataflow de origen" : null,
    !destinoCompleto ? "Selecciona el recurso de destino" : null,
    !nombreCompleto ? "Escribe o confirma el nombre" : null,
  ].filter((item): item is string => Boolean(item));

  return (
    <div className="overflow-hidden rounded-xl border border-line-200 bg-surface shadow-card">
      <div className="border-b border-line-200 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
              Resumen
            </p>
            <h2 className="mt-1 font-display text-lg font-semibold text-ink-900">
              Automatización por crear
            </h2>
          </div>
          <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
            {progreso}%
          </span>
        </div>
        <div
          role="progressbar"
          aria-label="Progreso de la automatización"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progreso}
          tabIndex={0}
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-line-200"
        >
          <div
            className="h-full rounded-full bg-brand-600 transition-[width]"
            style={{ width: `${progreso}%` }}
          />
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="rounded-lg border border-brand-100 bg-brand-50/50 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-700">
            Cómo se procesarán los datos
          </p>
          <p className="mt-1 text-sm font-semibold text-ink-900">
            Modo {modoActivo} ·{" "}
            {modoActivo === 2
              ? "Dataflow → SFTP → Talend"
              : "Dataflow → Spark/Python → destino"}
          </p>
          <p className="mt-1 truncate text-xs text-ink-500">
            {plantillaNombre || "Plantilla administrada por la plataforma"}
          </p>
        </div>

        <dl className="space-y-2">
          <DatoResumen
            etiqueta="Origen"
            valor={flujoNombre || "Sin seleccionar"}
          />
          <DatoResumen
            etiqueta="Conexión"
            valor={conexionNombre || "Se elegirá automáticamente"}
          />
          <DatoResumen
            etiqueta="Recurso destino"
            valor={recursoNombre || "Sin seleccionar"}
          />
          <DatoResumen
            etiqueta="Nombre final"
            valor={nombre.trim() || "Pendiente"}
          />
        </dl>

        {faltantes.length > 0 ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs font-semibold text-amber-800">
              Para continuar
            </p>
            <ul className="mt-1.5 space-y-1 text-xs text-amber-800">
              {faltantes.map((faltante) => (
                <li key={faltante} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  {faltante}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-lg border border-brand-100 bg-brand-50/60 p-3 text-xs font-medium text-brand-800">
            <Icon name="check" size="sm" />
            Todo listo para crear la automatización.
          </div>
        )}

        <Button
          type="button"
          disabled={!puedeCrear || isCreating}
          onClick={onCrear}
          className="w-full gap-2"
        >
          {isCreating ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-surface border-t-transparent" />
              Creando en Qlik Cloud…
            </>
          ) : (
            <>
              <Icon name="sparkles" size="sm" />
              Crear automatización
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function DatoResumen({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="grid grid-cols-[110px_minmax(0,1fr)] gap-3 border-b border-line-200 pb-2 last:border-0 last:pb-0">
      <dt className="text-xs text-ink-500">{etiqueta}</dt>
      <dd className="truncate text-right text-xs font-semibold text-ink-800">
        {valor}
      </dd>
    </div>
  );
}
