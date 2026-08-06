import type { ConfigurarConexionDestino } from "@qlik/contratos/admin";

export const TIPOS_DESTINO = [
  { id: "postgres", nombre: "PostgreSQL", deshabilitado: false },
  { id: "bigquery", nombre: "BigQuery", deshabilitado: true },
  { id: "sftp", nombre: "SFTP", deshabilitado: false },
  { id: "impala", nombre: "Impala", deshabilitado: false },
] as const;

export type TipoDestino = (typeof TIPOS_DESTINO)[number]["id"];
export type ConfiguracionDestino = Record<string, string>;

export function configuracionInicialDestino(
  tipo: TipoDestino,
): ConfiguracionDestino {
  if (tipo === "postgres") return { port: "5432" };
  if (tipo === "sftp") return { port: "22", rutaBase: "/" };
  if (tipo === "impala") return { port: "21050", database: "default" };
  return {};
}

export function construirEntradaDestino(
  tipo: TipoDestino,
  nombre: string,
  config: ConfiguracionDestino,
): ConfigurarConexionDestino {
  return { tipo, nombre: nombre.trim(), config };
}

export function puedeGuardarDestino(
  nombre: string,
  config: ConfiguracionDestino,
): boolean {
  return Boolean(nombre.trim() && config.host?.trim());
}
