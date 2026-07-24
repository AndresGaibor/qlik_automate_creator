import { clienteApi } from "@/compartido/api/cliente";
import type {
  SesionPublica,
  TenantSesionDisponible,
} from "@qlik/contratos/autenticacion";

export function obtenerSesion() {
  return clienteApi.get<SesionPublica>("/auth/qlik/sesion");
}

export function cerrarSesion() {
  return clienteApi.post<{ cerrada: true }>("/auth/qlik/cerrar-sesion");
}

export function obtenerTenantsSesion() {
  return clienteApi.get<TenantSesionDisponible[]>("/auth/qlik/sesion/tenants");
}

export function cambiarTenantActivo(tenantQlikId: string) {
  return clienteApi.put<{ cambiado: true }>("/auth/qlik/sesion/tenant-activo", {
    tenantQlikId,
  });
}
