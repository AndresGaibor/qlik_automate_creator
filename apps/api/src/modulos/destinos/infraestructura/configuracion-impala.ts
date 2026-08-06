import { validarIdentificadorImpala } from "../dominio/identificador-impala.js";

export interface OpcionesImpala {
  host: string;
  port?: number;
  authMechanism?: string;
  user?: string;
  password?: string;
  database?: string;
}

export interface ConfiguracionImpalaNormalizada {
  host: string;
  port: number;
  authMechanism: string;
  user?: string;
  password?: string;
  database: string;
}

export function normalizarOpcionesImpala(
  opciones: OpcionesImpala,
): ConfiguracionImpalaNormalizada {
  if (!opciones.host?.trim()) {
    throw new Error("El host de Impala no puede estar vacío");
  }
  return {
    host: opciones.host.trim(),
    port: opciones.port ?? 21050,
    authMechanism: (opciones.authMechanism ?? "NOSASL").toUpperCase(),
    user: opciones.user ?? undefined,
    password: opciones.password ?? undefined,
    database: validarIdentificadorImpala(
      opciones.database?.trim() || "default",
    ),
  };
}
