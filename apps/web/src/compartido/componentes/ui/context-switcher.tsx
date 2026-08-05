import { Icon } from "@/compartido/componentes/ui/icon";
import { useEffect, useId, useRef, useState } from "react";

type Tenant = {
  id: string;
  nombre?: string | null;
  host: string;
  organizacionNombre?: string | null;
};

export function ContextSwitcher({
  tenants,
  activoId,
  onCambiar,
  cargando = false,
}: {
  tenants: Tenant[];
  activoId: string;
  onCambiar: (id: string) => void;
  cargando?: boolean;
}) {
  const tenantsUnicos = Array.from(
    new Map(tenants.map((tenant) => [tenant.id, tenant])).values(),
  );
  const [abierto, setAbierto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const opcionesRef = useRef<(HTMLButtonElement | null)[]>([]);
  const menuId = useId();
  const activo =
    tenantsUnicos.find((t) => t.id === activoId) ?? tenantsUnicos[0];

  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setAbierto(false);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAbierto(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", fuera);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", fuera);
      document.removeEventListener("keydown", esc);
    };
  }, [abierto]);

  if (!activo) return null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={abierto}
        aria-controls={menuId}
        ref={triggerRef}
        disabled={cargando}
        onClick={() => setAbierto((a) => !a)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setAbierto(true);
            requestAnimationFrame(() =>
              opcionesRef.current.find(Boolean)?.focus(),
            );
          }
        }}
        className="flex max-w-[220px] items-center gap-2 rounded-md border border-line-200 bg-surface px-2.5 py-1.5 text-left transition-colors hover:border-line-300 disabled:opacity-60"
      >
        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-sm bg-obj-600 text-white">
          <Icon name="cloud" className="h-3 w-3" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-xs font-semibold text-ink-900">
            {activo.organizacionNombre ?? activo.nombre ?? activo.host}
          </span>
          <span className="block truncate font-mono text-[10px] text-ink-400">
            {activo.host}
          </span>
        </span>
        <Icon
          name="chev"
          size="sm"
          className={`ml-1 rotate-90 text-ink-400 transition-transform ${abierto ? "-rotate-90" : ""}`}
        />
      </button>

      {abierto && (
        <div
          id={menuId}
          role="menu"
          aria-label="Seleccionar tenant Qlik"
          className="absolute right-0 z-30 mt-2 w-72 origin-top-right overflow-hidden rounded-lg border border-line-200 bg-surface shadow-panel"
        >
          <div className="border-b border-line-200 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-ink-400">
            Tenant Qlik activo
          </div>
          <ul className="max-h-72 overflow-y-auto p-1">
            {tenantsUnicos.map((t) => {
              const esActivo = t.id === activoId;
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={esActivo}
                    ref={(elemento) => {
                      opcionesRef.current[tenantsUnicos.indexOf(t)] = elemento;
                    }}
                    onClick={() => {
                      onCambiar(t.id);
                      setAbierto(false);
                    }}
                    onKeyDown={(e) => {
                      const indice = tenantsUnicos.indexOf(t);
                      if (e.key === "Escape") {
                        e.preventDefault();
                        setAbierto(false);
                        triggerRef.current?.focus();
                      }
                      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                        e.preventDefault();
                        const siguiente =
                          (indice +
                            (e.key === "ArrowDown"
                              ? 1
                              : tenantsUnicos.length - 1)) %
                          tenantsUnicos.length;
                        opcionesRef.current[siguiente]?.focus();
                      }
                    }}
                    className={`flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left transition-colors ${esActivo ? "bg-brand-50" : "hover:bg-hover"}`}
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-obj-50 text-obj-600">
                      <Icon name="cloud" className="h-3.5 w-3.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-ink-900">
                        {t.organizacionNombre ?? t.nombre ?? t.host}
                      </span>
                      <span className="block truncate font-mono text-[11px] text-ink-400">
                        {t.host}
                      </span>
                    </span>
                    {esActivo && (
                      <Icon name="check" size="sm" className="text-brand-600" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
