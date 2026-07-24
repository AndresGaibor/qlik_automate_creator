import type { Context } from "hono";

export interface ContextoSolicitud {
  idSolicitud: string;
  ip?: string;
  agenteUsuario?: string;
}

export function obtenerContextoSolicitud(c: Context): ContextoSolicitud {
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
