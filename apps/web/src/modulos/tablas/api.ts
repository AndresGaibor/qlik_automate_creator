import { clienteApi } from "@/compartido/api/cliente";
import type {
  ConexionDestino,
  DetalleRecursoDestino,
  RecursoDestino,
  TipoDestino,
} from "@qlik/contratos/destinos";

export type {
  ConexionDestino,
  DetalleRecursoDestino,
  RecursoDestino,
  TipoDestino,
};

export interface TablaImpala {
  nombre: string;
}

export interface DetalleTablaImpala {
  baseDatos: string;
  tabla: string;
  totalFilas: number;
  columnas: Array<{ nombre: string; tipo: string }>;
  actualizadoEn: string;
}

export function obtenerConexionesDestino(): Promise<ConexionDestino[]> {
  return clienteApi.get<ConexionDestino[]>("/destinos/conexiones");
}

export function obtenerRecursosDestino(
  conexionId: string,
): Promise<RecursoDestino[]> {
  return clienteApi.get<RecursoDestino[]>(
    `/destinos/conexiones/${encodeURIComponent(conexionId)}/recursos`,
  );
}

export function obtenerDetalleRecursoDestino(
  conexionId: string,
  recursoId: string,
): Promise<DetalleRecursoDestino> {
  return clienteApi.get<DetalleRecursoDestino>(
    `/destinos/conexiones/${encodeURIComponent(conexionId)}/recursos/${encodeURIComponent(recursoId)}`,
  );
}

// Compatibilidad con tenants que todavía guardan Impala en el esquema heredado.
export function obtenerTablasImpala(): Promise<TablaImpala[]> {
  return clienteApi.get<TablaImpala[]>("/destinos/bases-datos/default/tablas");
}

export function obtenerDetalleTablaImpala(
  tabla: string,
): Promise<DetalleTablaImpala> {
  return clienteApi.get<DetalleTablaImpala>(
    `/destinos/bases-datos/default/tablas/${encodeURIComponent(tabla)}/detalle`,
  );
}
