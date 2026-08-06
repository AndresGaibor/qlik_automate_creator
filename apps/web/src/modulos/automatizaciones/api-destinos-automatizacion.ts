import { clienteApi } from "@/compartido/api/cliente";
import type {
  CapacidadesDestino,
  ConexionDestino,
  CrearConexionDestino,
  RecursoDestino,
  TipoDestino,
} from "@qlik/contratos/destinos";

export type {
  CapacidadesDestino,
  ConexionDestino,
  RecursoDestino,
  TipoDestino,
};

export interface TablaImpala {
  nombre: string;
}

export function obtenerConexionesDestino(): Promise<ConexionDestino[]> {
  return clienteApi.get<ConexionDestino[]>("/destinos/conexiones");
}

export function probarConexionDestino(id: string): Promise<{
  exitoso: boolean;
  mensaje: string;
  capacidades?: CapacidadesDestino;
}> {
  return clienteApi.post(
    `/destinos/conexiones/${encodeURIComponent(id)}/probar`,
    {},
  );
}

export function obtenerRecursosDestino(id: string): Promise<RecursoDestino[]> {
  return clienteApi.get<RecursoDestino[]>(
    `/destinos/conexiones/${encodeURIComponent(id)}/recursos`,
  );
}

export function obtenerDetalleRecursoDestino(
  conexionId: string,
  recursoId: string,
): Promise<RecursoDestino & { totalFilas?: number; actualizadoEn: string }> {
  return clienteApi.get(
    `/destinos/conexiones/${encodeURIComponent(conexionId)}/recursos/${encodeURIComponent(recursoId)}`,
  );
}

export function obtenerCapacidadesDestino(
  id: string,
): Promise<CapacidadesDestino> {
  return clienteApi.get<CapacidadesDestino>(
    `/destinos/conexiones/${encodeURIComponent(id)}/capacidades`,
  );
}

export function crearConexionDestino(
  entrada: CrearConexionDestino,
): Promise<{ id: string }> {
  return clienteApi.post("/destinos/conexiones", entrada);
}

export function obtenerTablasImpala(): Promise<TablaImpala[]> {
  return clienteApi.get<TablaImpala[]>("/destinos/bases-datos/default/tablas");
}
