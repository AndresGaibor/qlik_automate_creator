import type { MiddlewareHandler } from "hono";
import { generarUuid } from "../../../nucleo/valores/generar-uuid.js";
import type { Registrador } from "../../observabilidad/registrador.js";

export function crearMiddlewareObservabilidad(
  registrador: Registrador,
): MiddlewareHandler {
  return async (c, siguiente) => {
    const inicio = Date.now();
    const trazaId = c.req.header("x-request-id") ?? generarUuid();
    c.header("x-request-id", trazaId);

    await siguiente();

    registrador.info("http.solicitud", {
      trazaId,
      metodo: c.req.method,
      ruta: c.req.path,
      estado: c.res.status,
      duracionMs: Date.now() - inicio,
    });
  };
}
