import { clienteApi } from "@/compartido/api/cliente";

export interface EstadoSetup {
  needsSetup: boolean;
}

export interface EntradaSetup {
  organizacionNombre: string;
  qlikTenantHost: string;
  qlikClientId: string;
  qlikClientSecret: string;
  qlikScopes: string[];
  superadminNombre: string;
  superadminCorreo: string;
  frontendUrl?: string;
}

export interface ResultadoSetup {
  organizacionId: string;
  tenantQlikId: string;
  superadminId: string;
}

export function obtenerEstadoSetup() {
  return clienteApi.get<EstadoSetup>("/setup/status");
}

export function completarSetup(datos: EntradaSetup) {
  return clienteApi.post<ResultadoSetup>("/setup/complete", datos);
}
