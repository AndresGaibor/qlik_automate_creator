import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/compartido/componentes/ui/card";
import { Icon } from "@/compartido/componentes/ui/icon";
import type { TenantQlik } from "@/modulos/admin/api";
import { obtenerConexionesDestino } from "@/modulos/automatizaciones/publico";
import { useQuery } from "@tanstack/react-query";
import { ConfiguracionTecnicaEntorno } from "./configuracion-tecnica-entorno";

interface Props {
  organizacionId: string;
  tenantsQlik: TenantQlik[];
}

export function SeccionAutomatizacionBaseTenant({
  organizacionId,
  tenantsQlik,
}: Props) {
  const { data: conexionesDestino = [] } = useQuery({
    queryKey: ["destinos-conexiones"],
    queryFn: obtenerConexionesDestino,
    retry: false,
  });

  if (tenantsQlik.length === 0) return null;

  return (
    <Card className="border-line-200 bg-surface shadow-card">
      <CardHeader className="border-b border-line-200 bg-app/30 pb-4">
        <CardTitle className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
          <Icon name="robot" className="text-brand-600" />
          Plantilla y destinos
        </CardTitle>
        <p className="mt-1 text-xs text-ink-500">
          Define qué automatización se clonará en cada modo y dónde se
          escribirán los resultados.
        </p>
      </CardHeader>
      <CardContent className="space-y-4 p-4 sm:p-5">
        {tenantsQlik.map((tenantQlik) => (
          <ConfiguracionTecnicaEntorno
            key={tenantQlik.id}
            organizacionId={organizacionId}
            tenantQlik={tenantQlik}
            cantidadDestinos={conexionesDestino.length}
          />
        ))}
      </CardContent>
    </Card>
  );
}
