export function CampoDestinoTenant({
  label,
  value,
  onChange,
  type = "text",
  className = "",
  requerido = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  className?: string;
  requerido?: boolean;
}) {
  return (
    <label className={`block text-xs font-semibold text-ink-700 ${className}`}>
      {label} {requerido && <span className="text-danger-600">*</span>}
      <input
        type={type}
        value={value}
        onChange={(evento) => onChange(evento.target.value)}
        className="mt-1 h-10 w-full rounded-md border border-line-200 bg-surface px-3 text-sm font-normal outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
      />
    </label>
  );
}
