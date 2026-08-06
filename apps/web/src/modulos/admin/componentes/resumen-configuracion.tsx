import { Icon, type IconName } from "@/compartido/componentes/ui/icon";
import { useEffect, useState } from "react";
import type { ItemResumenConfiguracion } from "../utiles-estado-configuracion";

interface Props {
  items: ItemResumenConfiguracion[];
}

const iconos: Record<ItemResumenConfiguracion["id"], IconName> = {
  general: "gear",
  qlik: "cloud",
  espacios: "users",
  oauth: "zap",
  plantilla: "robot",
  impala: "db",
  origenes: "flow",
  usuarios: "users",
};

const estilos = {
  exito: "border-brand-100 bg-brand-50/60 text-brand-700",
  pendiente: "border-amber-200 bg-amber-50 text-amber-800",
  error: "border-red-200 bg-red-50 text-danger-600",
  neutral: "border-line-200 bg-app text-ink-600",
} as const;

export function ResumenConfiguracion({ items }: Props) {
  const completos = items.filter((item) => item.completo).length;
  const pendientes = items.length - completos;
  const todoCompleto = items.length > 0 && pendientes === 0;
  const progreso =
    items.length === 0 ? 0 : Math.round((completos / items.length) * 100);
  const [expandido, setExpandido] = useState(!todoCompleto);

  useEffect(() => setExpandido(!todoCompleto), [todoCompleto]);

  const titulo = todoCompleto
    ? "Todo configurado"
    : `${pendientes} ${pendientes === 1 ? "configuración requiere" : "configuraciones requieren"} atención`;

  return (
    <section
      aria-labelledby="titulo-resumen-configuracion"
      className="overflow-hidden rounded-xl border border-line-200 bg-surface shadow-card"
    >
      <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${
              todoCompleto
                ? "bg-brand-50 text-brand-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            <Icon name={todoCompleto ? "check" : "gear"} size="sm" />
          </span>
          <div className="min-w-0">
            <h2
              id="titulo-resumen-configuracion"
              className="font-display text-base font-semibold text-ink-900"
            >
              {titulo}
            </h2>
            <p className="mt-0.5 text-xs text-ink-500">
              {completos} de {items.length} configuraciones listas
            </p>
          </div>
        </div>

        <div className="flex min-w-0 items-center gap-3 sm:w-auto">
          <div className="min-w-28 flex-1 sm:w-44 sm:flex-none">
            <div
              role="progressbar"
              aria-label="Progreso de configuración"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progreso}
              tabIndex={0}
              className="h-1.5 overflow-hidden rounded-full bg-line-200"
            >
              <div
                className="h-full rounded-full bg-brand-600 transition-[width]"
                style={{ width: `${progreso}%` }}
              />
            </div>
            <p className="mt-1 text-right text-[11px] font-medium text-ink-500">
              {progreso}%
            </p>
          </div>
          <button
            type="button"
            aria-expanded={expandido}
            aria-controls="detalle-resumen-configuracion"
            onClick={() => setExpandido((actual) => !actual)}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium text-ink-600 transition-colors hover:bg-hover hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            {expandido ? "Ocultar" : "Ver detalle"}
            <Icon
              name="chev"
              size="sm"
              className={`transition-transform ${expandido ? "rotate-90" : "-rotate-90"}`}
            />
          </button>
        </div>
      </div>

      {expandido && (
        <div
          id="detalle-resumen-configuracion"
          className="grid gap-px border-t border-line-200 bg-line-200 sm:grid-cols-2 xl:grid-cols-4"
        >
          {items.map((item, indice) => {
            const esUltimo = indice === items.length - 1;
            const completaFilaDos = esUltimo && items.length % 2 === 1;
            const completaFilaCuatro = esUltimo && items.length % 4 === 3;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`group flex min-w-0 items-center gap-3 bg-surface px-4 py-3.5 transition-colors hover:bg-hover focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                  completaFilaDos ? "sm:col-span-2" : ""
                } ${
                  completaFilaCuatro
                    ? "xl:col-span-2"
                    : completaFilaDos
                      ? "xl:col-span-1"
                      : ""
                }`}
              >
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg border ${estilos[item.tono]}`}
                >
                  <Icon name={iconos[item.id]} size="sm" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-medium text-ink-500">
                    {item.etiqueta}
                  </span>
                  <span className="mt-0.5 block truncate text-sm font-semibold text-ink-900">
                    {item.estado}
                  </span>
                  {item.detalle && (
                    <span className="mt-0.5 block truncate font-mono text-[10px] text-ink-400">
                      {item.detalle}
                    </span>
                  )}
                </span>
                <Icon
                  name="chev"
                  size="sm"
                  className="rotate-180 text-ink-300 transition-transform group-hover:translate-x-0.5 group-hover:text-ink-500"
                />
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
}
