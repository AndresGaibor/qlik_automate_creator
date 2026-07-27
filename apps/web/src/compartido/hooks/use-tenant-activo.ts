import { obtenerSesion } from "@/modulos/autenticacion/api";
import type { TenantSesionDisponible } from "@qlik/contratos/autenticacion";
import { useQuery } from "@tanstack/react-query";

export function useTenantActivo() {
  const { data: sesion } = useQuery({
    queryKey: ["sesion"],
    queryFn: obtenerSesion,
    staleTime: 5 * 60 * 1000,
  });

  const tenants = sesion?.tenantsDisponibles ?? [];
  const activo =
    tenants.find((t) => t.id === sesion?.tenantActivoId) ?? tenants[0];

  return { tenant: activo, tenants };
}
