import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/compartido/componentes/ui/card";
import type { TenantQlik } from "@/modulos/admin/api";
import { SeccionConfigurarAutomatizacionBase } from "./seccion-configurar-automatizacion-base";
import { SeccionConfigurarImpalaTenant } from "./seccion-configurar-impala-tenant";

interface Props {
  organizacionId: string;
  tenantsQlik: TenantQlik[];
}

export function SeccionAutomatizacionBaseTenant({
  organizacionId,
  tenantsQlik,
}: Props) {
  if (tenantsQlik.length === 0) return null;

  return (
    <Card className="border-gray-200">
      <CardHeader className="border-b bg-gray-50/50 pb-4">
        <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
          🤖 Automatización Base (Plantilla Máster del Tenant)
        </CardTitle>
        <p className="text-xs text-gray-500 mt-0.5">
          Selecciona la automatización de Qlik Automate que servirá como plantilla
          base. Esta plantilla se duplicará automáticamente cuando los usuarios
          creen nuevos flujos y permanecerá oculta para los usuarios finales.
        </p>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {tenantsQlik.map((tQlik) => (
          <div
            key={tQlik.id}
            className="p-4 rounded-lg border bg-white space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 text-sm">
                  {tQlik.nombre || tQlik.host}
                </span>
                {tQlik.automatizacionBaseIdQlik ? (
                  <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                    ✓ Plantilla Base Configurada
                  </span>
                ) : (
                  <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-medium">
                    ⚠️ Sin Plantilla Base Asignada
                  </span>
                )}
              </div>
            </div>

            {tQlik.automatizacionBaseNombre && (
              <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-md flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-500 block">
                    Plantilla máster activa:
                  </span>
                  <span className="font-bold text-emerald-900 text-sm">
                    ⭐ {tQlik.automatizacionBaseNombre}
                  </span>
                  <span className="text-gray-400 font-mono block text-[11px]">
                    ID Qlik: {tQlik.automatizacionBaseIdQlik}
                  </span>
                </div>
              </div>
            )}

            <SeccionConfigurarAutomatizacionBase
              organizacionId={organizacionId}
              tenantQlik={tQlik}
            />

            <SeccionConfigurarImpalaTenant
              organizacionId={organizacionId}
              tenantQlik={tQlik}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
