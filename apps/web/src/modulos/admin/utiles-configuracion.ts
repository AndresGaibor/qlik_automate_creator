import type { TenantResumen } from "./api";

export function seleccionarConfiguracionPrincipal(
  tenants: TenantResumen[],
): TenantResumen | undefined {
  return tenants.find((tenant) => tenant.estado === "activa") ?? tenants[0];
}
