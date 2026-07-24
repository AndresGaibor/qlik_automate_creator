export type ResultadoValidacionEliminacionTenantQlik =
  | "PERMITIDA"
  | "REQUIERE_REEMPLAZO";

export function decidirSiNuevoTenantEsPrincipal(
  cantidadTenantsExistentes: number,
): boolean {
  return cantidadTenantsExistentes === 0;
}

export function validarEliminacionTenantQlik(tenant: {
  esPrincipal: boolean;
}): ResultadoValidacionEliminacionTenantQlik {
  return tenant.esPrincipal ? "REQUIERE_REEMPLAZO" : "PERMITIDA";
}
