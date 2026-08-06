import { Icon } from "@/compartido/componentes/ui/icon";

export function SetupTecnicoAcordeon({
  numero,
  titulo,
  descripcionCorta,
  listo,
  expandido,
  onToggle,
  resumen,
  children,
}: {
  numero: number;
  titulo: string;
  descripcionCorta: string;
  listo: boolean;
  expandido: boolean;
  onToggle: () => void;
  resumen?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`border ${expandido ? "border-brand-300" : "border-line-200"} bg-surface`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-hover transition-colors"
      >
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-sm font-bold ${
            listo
              ? "bg-brand-600 text-white"
              : expandido
                ? "bg-ink-900 text-white"
                : "bg-line-200 text-ink-500"
          }`}
        >
          {listo ? <Icon name="check" size="sm" /> : numero}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-ink-900">{titulo}</span>
            <span
              className={
                listo ? "text-xs text-brand-700" : "text-xs text-ink-500"
              }
            >
              {listo ? "Configurado" : "Pendiente"}
            </span>
          </div>

          {!expandido && listo && resumen && (
            <div className="mt-0.5">{resumen}</div>
          )}
          {!expandido && !listo && (
            <p className="text-xs text-ink-400 mt-0.5 truncate">
              {descripcionCorta}
            </p>
          )}
        </div>

        <Icon
          name="chev"
          size="sm"
          className={`shrink-0 text-ink-400 transition-transform duration-200 ${
            expandido ? "rotate-90" : "-rotate-90"
          }`}
        />
      </button>

      {expandido && (
        <div className="border-t border-line-200 px-5 py-5">{children}</div>
      )}
    </div>
  );
}
