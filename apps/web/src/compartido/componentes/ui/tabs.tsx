import { useEffect, useLayoutEffect, useRef, useState } from "react";

export function Tabs({
  items,
  value,
  onChange,
}: { items: string[]; value: number; onChange: (i: number) => void }) {
  const barRef = useRef<HTMLDivElement>(null);
  const inkRef = useRef<HTMLSpanElement>(null);
  const [, forzar] = useState(0);

  const mover = () => {
    const bar = barRef.current;
    const ink = inkRef.current;
    if (!bar || !ink) return;
    const activo = bar.querySelectorAll<HTMLButtonElement>("[role=tab]")[value];
    if (activo) {
      ink.style.left = `${activo.offsetLeft}px`;
      ink.style.width = `${activo.offsetWidth}px`;
    }
  };
  useLayoutEffect(mover);
  useEffect(() => {
    const onResize = () => forzar((n) => n + 1);
    addEventListener("resize", onResize);
    return () => removeEventListener("resize", onResize);
  }, []);

  return (
    <div
      ref={barRef}
      role="tablist"
      className="relative flex gap-6 border-b border-line-200"
    >
      {items.map((etiqueta, i) => (
        <button
          type="button"
          key={etiqueta}
          role="tab"
          tabIndex={i === value ? 0 : -1}
          aria-selected={i === value}
          onClick={() => onChange(i)}
          onKeyDown={(evento) => {
            let proximo: number | undefined;
            if (evento.key === "ArrowRight") proximo = (i + 1) % items.length;
            if (evento.key === "ArrowLeft")
              proximo = (i - 1 + items.length) % items.length;
            if (evento.key === "Home") proximo = 0;
            if (evento.key === "End") proximo = items.length - 1;
            if (proximo !== undefined) {
              evento.preventDefault();
              onChange(proximo);
              barRef.current
                ?.querySelectorAll<HTMLButtonElement>("[role=tab]")
                [proximo]?.focus();
            }
            if (evento.key === "Escape")
              (evento.currentTarget as HTMLButtonElement).blur();
          }}
          className={`pb-3 text-sm transition-colors ${i === value ? "font-semibold text-ink-900" : "font-medium text-ink-500 hover:text-ink-700"}`}
        >
          {etiqueta}
        </button>
      ))}
      <span
        ref={inkRef}
        aria-hidden
        className="absolute -bottom-px h-0.5 rounded bg-brand-600 transition-[left,width] duration-200 ease-soft"
      />
    </div>
  );
}
