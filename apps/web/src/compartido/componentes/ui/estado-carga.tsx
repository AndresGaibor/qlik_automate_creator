interface Props {
  mensaje?: string;
  compacto?: boolean;
}

export function EstadoCarga({
  mensaje = "Cargando…",
  compacto = false,
}: Props) {
  return (
    <output
      aria-live="polite"
      aria-busy="true"
      className={`flex flex-col items-center justify-center gap-3 text-center text-sm text-ink-500 ${
        compacto ? "py-8" : "min-h-56 py-12"
      }`}
    >
      <span
        data-spinner="true"
        aria-hidden="true"
        className="h-7 w-7 animate-spin rounded-full border-2 border-brand-100 border-t-brand-600"
      />
      <span>{mensaje}</span>
    </output>
  );
}
