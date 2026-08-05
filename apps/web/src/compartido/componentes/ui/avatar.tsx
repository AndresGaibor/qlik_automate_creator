const TAM = {
  sm: "h-5 w-5 text-[9px]",
  md: "h-8 w-8 text-xs",
  lg: "h-14 w-14 text-xl",
} as const;

export function Avatar({
  iniciales,
  src,
  tam = "md",
  color,
}: {
  iniciales: string;
  src?: string | null;
  tam?: keyof typeof TAM;
  color?: string;
}) {
  return (
    <span
      aria-label={src ? undefined : `Iniciales: ${iniciales}`}
      className={`grid shrink-0 place-items-center overflow-hidden rounded-full font-semibold text-white ${TAM[tam]}`}
      style={{ background: color ?? "var(--color-avatar)" }}
    >
      {src ? (
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        iniciales
      )}
    </span>
  );
}
