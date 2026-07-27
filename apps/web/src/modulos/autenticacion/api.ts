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

interface RespuestaIniciarSesion {
  exito: boolean;
  datos?: { url: string };
  error?: { mensaje: string };
}

export async function iniciarSesion(
  host: string,
): Promise<RespuestaIniciarSesion> {
  const res = await fetch(
    `/api/auth/qlik/iniciar?host=${encodeURIComponent(host)}&format=json`,
    { headers: { Accept: "application/json" } },
  );
  return res.json();
}

export async function iniciarSesionPorCorreo(
  correo: string,
): Promise<RespuestaIniciarSesion> {
  const res = await fetch(
    `/api/auth/qlik/iniciar-por-correo?correo=${encodeURIComponent(correo)}&format=json`,
    { headers: { Accept: "application/json" } },
  );
  return res.json();
}

export async function iniciarVerificacionOauth(
  host: string,
  retorno: string,
): Promise<RespuestaIniciarSesion> {
  const parametros = new URLSearchParams({
    host,
    retorno,
    format: "json",
  });
  const res = await fetch(`/api/auth/qlik/iniciar?${parametros.toString()}`, {
    headers: { Accept: "application/json" },
  });
  return res.json();
}
