import { construirUrlCrearFlujoQlik } from "@/compartido/utiles/qlik-urls";
import { useEffect, useId, useRef } from "react";
import { Button } from "./button";
import { Icon } from "./icon";

export interface TenantQlikOpcion {
  id: string;
  host: string;
  nombre?: string | null;
  organizacionNombre?: string | null;
}

interface ModalSeleccionarTenantQlikProps {
  abierto: boolean;
  onCerrar: () => void;
  tenants: TenantQlikOpcion[];
  tenantActivoId?: string;
  espacioId?: string;
}

export function ModalSeleccionarTenantQlik({
  abierto,
  onCerrar,
  tenants,
  tenantActivoId,
  espacioId,
}: ModalSeleccionarTenantQlikProps) {
  const cerrarRef = useRef<HTMLButtonElement>(null);
  const dialogoRef = useRef<HTMLDialogElement>(null);
  const tituloId = useId();
  useEffect(() => {
    if (!abierto) return;
    const previo = document.activeElement as HTMLElement | null;
    cerrarRef.current?.focus();
    const alTeclado = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") {
        evento.preventDefault();
        onCerrar();
      }
      if (evento.key === "Tab" && dialogoRef.current) {
        const focos =
          dialogoRef.current.querySelectorAll<HTMLElement>("button, [href]");
        if (!focos.length) return;
        const primero = focos[0];
        const ultimo = focos[focos.length - 1];
        if (evento.shiftKey && document.activeElement === primero) {
          evento.preventDefault();
          ultimo.focus();
        } else if (!evento.shiftKey && document.activeElement === ultimo) {
          evento.preventDefault();
          primero.focus();
        }
      }
    };
    document.addEventListener("keydown", alTeclado);
    return () => {
      document.removeEventListener("keydown", alTeclado);
      previo?.focus();
    };
  }, [abierto, onCerrar]);
  if (!abierto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-150"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCerrar();
      }}
    >
      <dialog
        ref={dialogoRef}
        open
        aria-labelledby={tituloId}
        className="relative w-full max-w-2xl rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl sm:p-8"
      >
        <button
          ref={cerrarRef}
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar selector de tenant"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition text-sm"
        >
          <Icon name="x" size="sm" />
        </button>

        <div className="text-center max-w-md mx-auto mb-6">
          <h3 id={tituloId} className="text-2xl font-bold text-gray-900">
            ¿En qué entorno de Qlik quieres crear el flujo?
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Tienes acceso a múltiples entornos de Qlik Cloud. Elige uno para ser
            redirigido y crear tu nuevo Dataflow.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto p-1">
          {tenants.map((t) => {
            const esActivo = t.id === tenantActivoId;
            const nombreMostrar = t.nombre || t.organizacionNombre || t.host;
            const targetUrl = construirUrlCrearFlujoQlik(t.host, espacioId);

            return (
              <a
                key={t.id}
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onCerrar}
                className={`group relative flex flex-col justify-between p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 bg-white hover:shadow-lg ${
                  esActivo
                    ? "border-green-500 ring-2 ring-green-100 bg-green-50/20"
                    : "border-gray-200 hover:border-green-400"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-green-700 text-lg border border-gray-200">
                      Q
                    </div>
                    {esActivo && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                        Entorno activo
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-gray-900 group-hover:text-green-700 transition text-base">
                    {nombreMostrar}
                  </h4>
                  <p className="text-xs text-gray-500 font-mono mt-1 truncate">
                    {t.host}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                  <span>Qlik Cloud</span>
                  <span className="text-green-600 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    Ir y crear
                  </span>
                </div>
              </a>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t flex justify-end">
          <Button variant="outline" onClick={onCerrar}>
            Cancelar
          </Button>
        </div>
      </dialog>
    </div>
  );
}
