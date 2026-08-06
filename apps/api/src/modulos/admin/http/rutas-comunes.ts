import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { ErrorAplicacion } from "../../../nucleo/errores/error-aplicacion.js";
import { responderError } from "../../../nucleo/http/respuestas.js";
import {
  type ContextoSesion,
  ServicioAdmin,
} from "../aplicacion/servicio-admin.js";

export type ResolverContextoAdmin = (c: Context) => Promise<ContextoSesion>;

export const servicioAdmin = new ServicioAdmin();

export function exigirAccesoOrganizacion(
  contexto: ContextoSesion,
  organizacionId: string,
): void {
  if (!servicioAdmin.puedeAcceder(contexto, organizacionId)) {
    throw new Error("No tienes permisos para acceder a este tenant");
  }
}

export function obtenerParametroRequerido(c: Context, nombre: string): string {
  const valor = c.req.param(nombre);
  if (!valor) throw new Error(`Falta el parámetro requerido: ${nombre}`);
  return valor;
}

export function responderErrorAdmin(c: Context, error: unknown) {
  if (error instanceof ErrorAplicacion) {
    return responderError(
      c,
      error.message,
      error.estadoHttp as ContentfulStatusCode,
      {
        codigo: error.codigo,
        detalles: error.detalles,
      },
    );
  }
  if (error instanceof Error && error.message === "No hay sesión") {
    return responderError(c, "Sesión requerida", 401, {
      codigo: "SESION_REQUERIDA",
    });
  }
  if (error instanceof Error && error.message === "Sesión inválida") {
    return responderError(c, "Sesión inválida", 401, {
      codigo: "SESION_INVALIDA",
    });
  }
  if (error instanceof Error && error.message.includes("permisos")) {
    return responderError(c, error.message, 403, { codigo: "NO_AUTORIZADO" });
  }
  if (
    error instanceof Error &&
    error.message.startsWith("Falta el parámetro")
  ) {
    return responderError(c, error.message, 400, {
      codigo: "PARAMETRO_FALTANTE",
    });
  }
  if (error instanceof Error && error.name === "ZodError") {
    return responderError(c, "Datos inválidos", 400, {
      codigo: "DATOS_INVALIDOS",
    });
  }
  if (error instanceof Error && typeof codigoErrorBd(error) === "string") {
    return responderError(c, mensajeErrorBd(codigoErrorBd(error)), 500, {
      codigo: "ERROR_BASE_DATOS",
    });
  }
  const mensaje =
    error instanceof Error && error.message
      ? error.message
      : "Error inesperado";
  return responderError(c, mensaje, 500, { codigo: "ERROR_INTERNO" });
}

function codigoErrorBd(error: Error): string | null {
  const codigo = (error as { code?: unknown }).code;
  return typeof codigo === "string" ? codigo : null;
}

function mensajeErrorBd(codigo: string | null): string {
  switch (codigo) {
    case "23505":
      return "Ya existe una conexión con ese nombre para este tipo y organización.";
    case "23503":
      return "La organización o el tenant indicado no existe.";
    case "23514":
      return "El tipo de conexión no está soportado para guardar un destino.";
    case "42501":
      return "No hay permisos de base de datos para guardar la conexión.";
    case "57P01":
    case "57P02":
    case "57P03":
    case "ECONNREFUSED":
    case "ETIMEDOUT":
      return "La base de datos no está disponible. Inténtalo de nuevo.";
    default:
      return "No se pudo completar la operación en la base de datos.";
  }
}
