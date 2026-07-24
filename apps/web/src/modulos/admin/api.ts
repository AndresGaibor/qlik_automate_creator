import { clienteApi } from "@/compartido/api/cliente";
import type {
  ActualizarTenant,
  ActualizarUsuario,
  AgregarUsuario,
  CrearTenant,
  CrearTenantQlik,
  DetalleTenant,
  TenantQlik,
  TenantResumen,
} from "@qlik/contratos/admin";

const RUTA = "/admin/tenants";

export type {
  AgregarUsuario,
  ActualizarTenant,
  CrearTenant,
  DetalleTenant,
  TenantResumen,
  ActualizarUsuario,
  TenantQlik,
  CrearTenantQlik,
};

export function obtenerTenants() {
  return clienteApi.get<TenantResumen[]>(RUTA);
}

export function obtenerDetalleTenant(id: string) {
  return clienteApi.get<DetalleTenant>(`${RUTA}/${encodeURIComponent(id)}`);
}

export function crearTenant(entrada: CrearTenant) {
  return clienteApi.post<TenantResumen>(RUTA, entrada);
}

export function actualizarTenant(id: string, entrada: ActualizarTenant) {
  return clienteApi.patch<TenantResumen>(
    `${RUTA}/${encodeURIComponent(id)}`,
    entrada,
  );
}

export function eliminarTenant(id: string) {
  return clienteApi.delete<{ eliminado: boolean }>(
    `${RUTA}/${encodeURIComponent(id)}`,
  );
}

export function agregarUsuarioTenant(id: string, entrada: AgregarUsuario) {
  return clienteApi.post<{
    usuario: {
      id: string;
      correo: string | null;
      nombre: string;
      rol: "admin" | "usuario";
    };
  }>(`${RUTA}/${encodeURIComponent(id)}/usuarios`, entrada);
}

export function actualizarUsuarioTenant(
  id: string,
  usuarioId: string,
  entrada: ActualizarUsuario,
) {
  return clienteApi.patch<{
    usuario: {
      id: string;
      correo: string | null;
      nombre: string;
      rol: "admin" | "usuario";
    };
  }>(
    `${RUTA}/${encodeURIComponent(id)}/usuarios/${encodeURIComponent(usuarioId)}`,
    entrada,
  );
}

export function eliminarUsuarioTenant(id: string, usuarioId: string) {
  return clienteApi.delete<{ eliminado: boolean }>(
    `${RUTA}/${encodeURIComponent(id)}/usuarios/${encodeURIComponent(usuarioId)}`,
  );
}

export function obtenerTenantsQlik(organizacionId: string) {
  return clienteApi.get<TenantQlik[]>(
    `/admin/organizaciones/${encodeURIComponent(organizacionId)}/tenants-qlik`,
  );
}

export function crearTenantQlik(
  organizacionId: string,
  entrada: CrearTenantQlik,
) {
  return clienteApi.post<TenantQlik>(
    `/admin/organizaciones/${encodeURIComponent(organizacionId)}/tenants-qlik`,
    entrada,
  );
}

export function marcarTenantQlikPrincipal(
  organizacionId: string,
  tenantQlikId: string,
) {
  return clienteApi.put<TenantQlik>(
    `/admin/organizaciones/${encodeURIComponent(organizacionId)}/tenants-qlik/${encodeURIComponent(tenantQlikId)}/principal`,
  );
}

export function eliminarTenantQlik(
  organizacionId: string,
  tenantQlikId: string,
) {
  return clienteApi.delete<{ eliminado: boolean }>(
    `/admin/organizaciones/${encodeURIComponent(organizacionId)}/tenants-qlik/${encodeURIComponent(tenantQlikId)}`,
  );
}

export function configurarAutomatizacionBaseTenant(
  organizacionId: string,
  tenantQlikId: string,
  automatizacionBaseIdQlik: string,
  automatizacionBaseNombre?: string,
) {
  return clienteApi.put<TenantQlik>(
    `/admin/organizaciones/${encodeURIComponent(organizacionId)}/tenants-qlik/${encodeURIComponent(tenantQlikId)}/automatizacion-base`,
    {
      automatizacionBaseIdQlik,
      automatizacionBaseNombre,
    },
  );
}

export function configurarDestinoTenant(
  organizacionId: string,
  tenantQlikId: string,
  destinoApiUrl: string,
  destinoApiKey: string,
  destinoBaseDatos?: string,
) {
  return clienteApi.put<TenantQlik>(
    `/admin/organizaciones/${encodeURIComponent(organizacionId)}/tenants-qlik/${encodeURIComponent(tenantQlikId)}/destino`,
    {
      destinoApiUrl,
      destinoApiKey,
      destinoBaseDatos,
    },
  );
}

export function configurarImpalaTenant(
  organizacionId: string,
  tenantQlikId: string,
  datos: {
    impalaHost: string;
    impalaPort?: number;
    impalaAuthMechanism?: string;
    impalaUser?: string;
    impalaPassword?: string;
    impalaDatabase?: string;
  },
) {
  return clienteApi.put<TenantQlik>(
    `/admin/organizaciones/${encodeURIComponent(organizacionId)}/tenants-qlik/${encodeURIComponent(tenantQlikId)}/impala`,
    datos,
  );
}

export function listarAutomatizacionesParaAdmin() {
  return clienteApi.get<import("@qlik/contratos/automatizaciones").ResumenAutomatizacion[]>("/automatizaciones", {
    parametros: { incluirBase: "true" },
  });
}
