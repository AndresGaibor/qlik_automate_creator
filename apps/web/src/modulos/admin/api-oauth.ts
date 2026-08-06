import { clienteApi } from "@/compartido/api/cliente";
import type {
  ConfiguracionOauthQlik,
  ConfigurarOauthQlik,
} from "@qlik/contratos/admin";

function rutaOauth(organizacionId: string, tenantQlikId: string) {
  return `/admin/organizaciones/${encodeURIComponent(organizacionId)}/tenants-qlik/${encodeURIComponent(tenantQlikId)}/oauth`;
}

export function obtenerConfiguracionOauthTenant(
  organizacionId: string,
  tenantQlikId: string,
) {
  return clienteApi.get<ConfiguracionOauthQlik>(
    rutaOauth(organizacionId, tenantQlikId),
  );
}

export function guardarConfiguracionOauthTenant(
  organizacionId: string,
  tenantQlikId: string,
  entrada: ConfigurarOauthQlik,
) {
  return clienteApi.put<ConfiguracionOauthQlik>(
    rutaOauth(organizacionId, tenantQlikId),
    entrada,
  );
}

export function eliminarConfiguracionOauthTenant(
  organizacionId: string,
  tenantQlikId: string,
) {
  return clienteApi.delete<{ eliminado: boolean }>(
    rutaOauth(organizacionId, tenantQlikId),
  );
}
