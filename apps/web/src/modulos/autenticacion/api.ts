import { clienteApi } from "@/compartido/api/cliente";
import type { SesionPublica } from "@qlik/contratos/autenticacion";

export function obtenerSesion() {
  return clienteApi.get<SesionPublica>("/auth/qlik/sesion");
}

export function cerrarSesion() {
  return clienteApi.post<{ cerrada: true }>("/auth/qlik/cerrar-sesion");
}
