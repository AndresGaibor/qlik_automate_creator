import { Icon } from "@/compartido/componentes/ui/icon";
import type { PestanaDetalleFlujo } from "./modelo-detalle-flujo";

interface Props {
  activa: PestanaDetalleFlujo;
  tieneAutomatizacion: boolean;
  onCambiar: (pestana: PestanaDetalleFlujo) => void;
}

const pestanas: Array<{
  id: PestanaDetalleFlujo;
  etiqueta: string;
  icono?: boolean;
}> = [
  { id: "script", etiqueta: "Script de carga" },
  { id: "spark", etiqueta: "Catálogo Spark (JSON)", icono: true },
  { id: "metadata", etiqueta: "Detalles del Dataflow" },
  { id: "automatizaciones", etiqueta: "Automatización en Qlik Automate" },
];

export function DetalleFlujoNavegacion({
  activa,
  tieneAutomatizacion,
  onCambiar,
}: Props) {
  return (
    <div className="flex rounded-xl bg-line-200/60 p-1 text-sm max-w-fit shadow-xs">
      {pestanas.map((pestana) => (
        <button
          key={pestana.id}
          type="button"
          onClick={() => onCambiar(pestana.id)}
          className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
            activa === pestana.id
              ? "bg-surface text-ink-900 shadow-sm"
              : "text-ink-500 hover:text-ink-900"
          }`}
        >
          {pestana.icono && (
            <Icon name="sparkles" size="sm" className="text-brand-600" />
          )}
          <span>{pestana.etiqueta}</span>
          {pestana.id === "automatizaciones" && tieneAutomatizacion && (
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          )}
        </button>
      ))}
    </div>
  );
}
