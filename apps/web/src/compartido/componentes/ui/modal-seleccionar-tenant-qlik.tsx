import { construirUrlCrearFlujoQlik } from "@/compartido/utiles/qlik-urls";
import { Button } from "./button";

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
  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl border border-gray-100 relative">
        <button
          type="button"
          onClick={onCerrar}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition text-sm"
        >
          ✕
        </button>

        <div className="text-center max-w-md mx-auto mb-6">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
            🟢
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            ¿En qué entorno de Qlik quieres crear el flujo?
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Tienes acceso a múItiples entornos de Qlik Cloud. Elige uno para ser redirigido y crear tu nuevo Dataflow.
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
                        ● Entorno activo
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
                  <span className="flex items-center gap-1">
                    🇺🇸 Qlik Cloud
                  </span>
                  <span className="text-green-600 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    Ir y crear ↗
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
      </div>
    </div>
  );
}
