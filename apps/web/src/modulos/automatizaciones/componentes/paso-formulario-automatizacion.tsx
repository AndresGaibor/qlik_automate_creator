import { Icon } from "@/compartido/componentes/ui/icon";
import type { ReactNode } from "react";

export function PasoFormularioAutomatizacion({
  numero,
  titulo,
  descripcion,
  completo,
  bloqueado = false,
  children,
}: {
  numero: number;
  titulo: string;
  descripcion: string;
  completo: boolean;
  bloqueado?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      className={`overflow-hidden rounded-xl border bg-surface shadow-card transition ${
        completo
          ? "border-brand-200"
          : bloqueado
            ? "border-line-200 opacity-75"
            : "border-line-200"
      }`}
    >
      <div className="flex items-start gap-3 border-b border-line-200 bg-app/30 px-4 py-3">
        <span
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold ${
            completo
              ? "bg-brand-600 text-white"
              : bloqueado
                ? "bg-line-200 text-ink-500"
                : "bg-brand-50 text-brand-700"
          }`}
        >
          {completo ? <Icon name="check" size="sm" /> : numero}
        </span>
        <div>
          <h2 className="font-display text-base font-semibold text-ink-900">
            {titulo}
          </h2>
          <p className="mt-0.5 text-xs text-ink-500">{descripcion}</p>
        </div>
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}
