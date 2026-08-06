import { useEffect, useState } from "react";
import type { ItemResumenConfiguracion } from "../utiles-estado-configuracion";

interface Props {
  items: ItemResumenConfiguracion[];
}

function idDesdeHash(items: ItemResumenConfiguracion[]) {
  const hash = window.location.hash.replace("#", "");
  return items.some((item) => item.id === hash) ? hash : items[0]?.id;
}

export function NavegacionConfiguracion({ items }: Props) {
  const [activo, setActivo] = useState(() => idDesdeHash(items));

  useEffect(() => {
    const actualizar = () => setActivo(idDesdeHash(items));
    window.addEventListener("hashchange", actualizar);
    return () => window.removeEventListener("hashchange", actualizar);
  }, [items]);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const secciones = items
      .map((item) => document.getElementById(item.id))
      .filter((seccion): seccion is HTMLElement => Boolean(seccion));
    if (secciones.length === 0) return;

    const visibles = new Map<string, IntersectionObserverEntry>();
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) visibles.set(entrada.target.id, entrada);
          else visibles.delete(entrada.target.id);
        }
        const siguiente = [...visibles.values()].sort(
          (a, b) =>
            Math.abs((a.boundingClientRect?.top ?? 0) - 112) -
            Math.abs((b.boundingClientRect?.top ?? 0) - 112),
        )[0];
        if (siguiente?.target.id) setActivo(siguiente.target.id);
      },
      { rootMargin: "-96px 0px -55% 0px", threshold: [0, 0.1, 0.5] },
    );

    for (const seccion of secciones) observador.observe(seccion);
    return () => observador.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="Secciones de configuración"
      className="overflow-x-auto rounded-xl border border-line-200 bg-surface p-2 shadow-card lg:sticky lg:top-24"
    >
      <ul className="flex min-w-max gap-1 lg:min-w-0 lg:flex-col">
        {items.map((item) => {
          const seleccionado = activo === item.id;
          return (
            <li key={item.id} className="lg:w-full">
              <a
                href={`#${item.id}`}
                aria-current={seleccionado ? "location" : undefined}
                onClick={() => setActivo(item.id)}
                className={`flex min-h-10 items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                  seleccionado
                    ? "bg-brand-50 font-semibold text-brand-800"
                    : "text-ink-600 hover:bg-hover hover:text-ink-900"
                }`}
              >
                <span>{item.etiqueta}</span>
                <span
                  className={`h-2 w-2 rounded-full ${
                    item.tono === "error"
                      ? "bg-danger-600"
                      : item.completo
                        ? "bg-brand-600"
                        : "bg-amber-500"
                  }`}
                  aria-label={item.estado}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
