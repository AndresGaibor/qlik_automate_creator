import type { Context } from "hono";
import type {
  InfoSesion,
  SesionPublica,
} from "../../modulos/autenticacion-qlik/dominio/modelos.js";

export interface ContextoSolicitud {
  idSolicitud: string;
  ip?: string;
  agenteUsuario?: string;
  sesionId?: string;
  usuarioId?: string;
  organizacionId?: string;
  tenantQlikId?: string;
  tenantHost?: string;
  identidadQlikId?: string;
  esSuperadmin?: boolean;
  roles?: Array<"admin" | "usuario">;
}

export function obtenerContextoSolicitud(c: Context): ContextoSolicitud {
  const existente = c.get("contextoSolicitud") as ContextoSolicitud | undefined;
  if (existente) return existente;
  const ip =
    c.req.header("cf-connecting-ip") ??
    c.req.header("x-forwarded-for")?.split(",")[0]?.trim();
  const agenteUsuario = c.req.header("user-agent");
  return {
    idSolicitud:
      c.res.headers.get("x-request-id") ??
      c.req.header("x-request-id") ??
      crypto.randomUUID(),
    ...(ip ? { ip } : {}),
    ...(agenteUsuario ? { agenteUsuario } : {}),
  };
}

export interface ContextoSolicitudAutenticado extends ContextoSolicitud {
  sesionId: string;
  usuarioId: string;
  organizacionId: string;
  tenantQlikId: string;
  tenantHost: string;
  identidadQlikId: string;
  esSuperadmin: boolean;
  roles: Array<"admin" | "usuario">;
}

export function construirContextoSolicitud(entrada: {
  solicitudId: string;
  sesion: InfoSesion;
  sesionPublica: SesionPublica;
  ip?: string;
  agenteUsuario?: string;
}): ContextoSolicitudAutenticado {
  const roles = entrada.sesionPublica.membresias
    .filter((m) => m.organizacionId === entrada.sesion.organizacionId)
    .map((m) => m.rol);
  return {
    idSolicitud: entrada.solicitudId,
    ...(entrada.ip ? { ip: entrada.ip } : {}),
    ...(entrada.agenteUsuario ? { agenteUsuario: entrada.agenteUsuario } : {}),
    sesionId: entrada.sesion.sesionId,
    usuarioId: entrada.sesion.usuarioId,
    organizacionId: entrada.sesion.organizacionId,
    tenantQlikId: entrada.sesion.tenantId,
    tenantHost: entrada.sesion.tenantHost,
    identidadQlikId: entrada.sesion.identidadQlikId,
    esSuperadmin: entrada.sesionPublica.esSuperadmin,
    roles,
  };
}
