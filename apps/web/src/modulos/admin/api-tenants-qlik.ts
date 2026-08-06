import { clienteApi } from "@/compartido/api/cliente";
import type {
  ConfigurarConexionDestino,
  ConfigurarDestinoTenant,
  ConfigurarImpalaTenant,
  CrearTenantQlik,
  ModoPlantilla,
  TenantQlik,
} from "@qlik/contratos/admin";
import type { ResumenAutomatizacion } from "@qlik/contratos/automatizaciones";

function rutaTenantsQlik(organizacionId: string) {
  return `/admin/organizaciones/${encodeURIComponent(organizacionId)}/tenants-qlik`;
}

function rutaTenantQlik(organizacionId: string, tenantQlikId: string) {
  return `${rutaTenantsQlik(organizacionId)}/${encodeURIComponent(tenantQlikId)}`;
}

export function obtenerTenantsQlik(organizacionId: string) {
  return clienteApi.get<TenantQlik[]>(rutaTenantsQlik(organizacionId));
}

export function crearTenantQlik(
  organizacionId: string,
  entrada: CrearTenantQlik,
) {
  return clienteApi.post<TenantQlik>(rutaTenantsQlik(organizacionId), entrada);
}

export function marcarTenantQlikPrincipal(
  organizacionId: string,
  tenantQlikId: string,
) {
  return clienteApi.put<TenantQlik>(
    `${rutaTenantQlik(organizacionId, tenantQlikId)}/principal`,
  );
}

export function eliminarTenantQlik(
  organizacionId: string,
  tenantQlikId: string,
) {
  return clienteApi.delete<{ eliminado: boolean }>(
    rutaTenantQlik(organizacionId, tenantQlikId),
  );
}

export function configurarPlantillaAutomatizacionTenant(
  organizacionId: string,
  tenantQlikId: string,
  modo: ModoPlantilla,
  automatizacionBaseIdQlik: string,
  automatizacionBaseNombre?: string,
) {
  return clienteApi.put<TenantQlik>(
    `${rutaTenantQlik(organizacionId, tenantQlikId)}/automatizacion-base`,
    { modo, automatizacionBaseIdQlik, automatizacionBaseNombre },
  );
}

export function configurarDestinoTenant(
  organizacionId: string,
  tenantQlikId: string,
  entrada: ConfigurarDestinoTenant,
) {
  return clienteApi.put<TenantQlik>(
    `${rutaTenantQlik(organizacionId, tenantQlikId)}/destino`,
    entrada,
  );
}

export function configurarImpalaTenant(
  organizacionId: string,
  tenantQlikId: string,
  datos: ConfigurarImpalaTenant,
) {
  return clienteApi.put<TenantQlik>(
    `${rutaTenantQlik(organizacionId, tenantQlikId)}/impala`,
    datos,
  );
}

export function configurarConexionDestino(
  organizacionId: string,
  tenantQlikId: string,
  entrada: ConfigurarConexionDestino,
) {
  return clienteApi.put<{ id: string }>(
    `${rutaTenantQlik(organizacionId, tenantQlikId)}/destino-generico`,
    entrada,
  );
}

export function listarAutomatizacionesParaAdmin() {
  return clienteApi.get<ResumenAutomatizacion[]>("/automatizaciones", {
    parametros: { incluirBase: "true" },
  });
}
