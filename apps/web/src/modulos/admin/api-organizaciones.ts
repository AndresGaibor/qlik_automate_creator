import { clienteApi } from "@/compartido/api/cliente";
import type {
  ActualizarTenant,
  ActualizarUsuario,
  AgregarUsuario,
  CrearTenant,
  DetalleTenant,
  TenantResumen,
} from "@qlik/contratos/admin";

const RUTA_TENANTS = "/admin/tenants";

export function obtenerTenants() {
  return clienteApi.get<TenantResumen[]>(RUTA_TENANTS);
}

export function obtenerDetalleTenant(id: string) {
  return clienteApi.get<DetalleTenant>(
    `${RUTA_TENANTS}/${encodeURIComponent(id)}`,
  );
}

export function crearTenant(entrada: CrearTenant) {
  return clienteApi.post<TenantResumen>(RUTA_TENANTS, entrada);
}

export function actualizarTenant(id: string, entrada: ActualizarTenant) {
  return clienteApi.patch<TenantResumen>(
    `${RUTA_TENANTS}/${encodeURIComponent(id)}`,
    entrada,
  );
}

export function eliminarTenant(id: string) {
  return clienteApi.delete<{ eliminado: boolean }>(
    `${RUTA_TENANTS}/${encodeURIComponent(id)}`,
  );
}

export function agregarUsuarioTenant(id: string, entrada: AgregarUsuario) {
  return clienteApi.post<{ usuario: UsuarioTenantRespuesta }>(
    `${RUTA_TENANTS}/${encodeURIComponent(id)}/usuarios`,
    entrada,
  );
}

export function actualizarUsuarioTenant(
  id: string,
  usuarioId: string,
  entrada: ActualizarUsuario,
) {
  return clienteApi.patch<{ usuario: UsuarioTenantRespuesta }>(
    `${RUTA_TENANTS}/${encodeURIComponent(id)}/usuarios/${encodeURIComponent(usuarioId)}`,
    entrada,
  );
}

export function eliminarUsuarioTenant(id: string, usuarioId: string) {
  return clienteApi.delete<{ eliminado: boolean }>(
    `${RUTA_TENANTS}/${encodeURIComponent(id)}/usuarios/${encodeURIComponent(usuarioId)}`,
  );
}

interface UsuarioTenantRespuesta {
  id: string;
  correo: string | null;
  nombre: string;
  rol: "admin" | "usuario";
}
