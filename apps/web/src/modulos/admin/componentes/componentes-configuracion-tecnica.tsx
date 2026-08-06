import { Icon } from "@/compartido/componentes/ui/icon";

export function EstadoConfiguracionTecnica({ listo }: { listo: boolean }) {
  return (
    <span
      className={`hidden shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold sm:inline-flex ${
        listo
          ? "border-brand-100 bg-brand-50 text-brand-700"
          : "border-amber-200 bg-amber-50 text-amber-700"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${listo ? "bg-brand-600" : "bg-amber-500"}`}
      />
      {listo ? "Configuración lista" : "Requiere atención"}
    </span>
  );
}

export function DatoResumenConfiguracion({
  etiqueta,
  valor,
  configurado,
}: {
  etiqueta: string;
  valor: string;
  configurado: boolean;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-line-200 bg-surface px-3.5 py-3">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-ink-400">
          {etiqueta}
        </p>
        <span
          className={`h-2 w-2 shrink-0 rounded-full ${configurado ? "bg-brand-600" : "bg-amber-500"}`}
          aria-label={configurado ? "Configurado" : "Pendiente"}
        />
      </div>
      <p
        className={`mt-1.5 text-sm font-semibold leading-5 ${
          configurado ? "text-ink-800" : "text-amber-700"
        }`}
        title={valor}
      >
        {valor}
      </p>
    </div>
  );
}

export function CabeceraBloqueConfiguracion({
  numero,
  titulo,
  lista,
  descripcion,
}: {
  numero: string;
  titulo: string;
  lista: boolean;
  descripcion: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
          lista ? "bg-brand-600 text-white" : "bg-amber-400 text-white"
        }`}
      >
        {lista ? <Icon name="check" size="sm" /> : numero}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-ink-900">{titulo}</h3>
          <span
            className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
              lista
                ? "border-brand-100 bg-brand-50 text-brand-700"
                : "border-amber-200 bg-amber-50 text-amber-700"
            }`}
          >
            {lista ? "Listo" : "Pendiente"}
          </span>
        </div>
        <p className="mt-1 text-xs leading-5 text-ink-500">{descripcion}</p>
      </div>
    </div>
  );
}
