import type { Context } from "hono";
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
  if (error instanceof Error && error.name === "ZodError") {
    return responderError(c, "Datos inválidos", 400, {
      codigo: "DATOS_INVALIDOS",
    });
  }
  return responderError(c, "Error interno", 500);
}
