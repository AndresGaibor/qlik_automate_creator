import { clienteApi } from "@/compartido/api/cliente";
import type { ConexionOrigen } from "./modelo-catalogo-origen";

export function listarConexionesOrigen() {
  return clienteApi.get<ConexionOrigen[]>("/conexiones-origen");
}

export function guardarConexionOrigen(
  id: string | null,
  entrada: Record<string, unknown>,
) {
  return id
    ? clienteApi.put<ConexionOrigen>(`/conexiones-origen/${id}`, entrada)
    : clienteApi.post<ConexionOrigen>("/conexiones-origen", entrada);
}

export function eliminarConexionOrigen(id: string) {
  return clienteApi.delete(`/conexiones-origen/${id}`);
}
