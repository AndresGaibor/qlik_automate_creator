import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { ZodError } from "zod";
import { ErrorAplicacion } from "../../nucleo/errores/error-aplicacion.js";
import { responderError } from "../../nucleo/http/respuestas.js";
import type { Registrador } from "../observabilidad/registrador.js";

interface ErrorRemotoConEstado extends Error {
  estadoHttp: number;
  cuerpo?: unknown;
  trazaId?: string;
}

const esErrorRemotoConEstado = (
  error: unknown,
): error is ErrorRemotoConEstado =>
  error instanceof Error &&
  "estadoHttp" in error &&
  typeof (error as { estadoHttp?: unknown }).estadoHttp === "number";

export function crearManejadorErrores(registrador: Registrador) {
  return (error: Error, c: Context) => {
    const trazaId = c.req.header("x-request-id");

    if (error instanceof ZodError) {
      return responderError(c, "Solicitud inválida", 400, {
        codigo: "VALIDACION",
        detalles: error.flatten(),
        trazaId,
      });
    }

    if (error instanceof ErrorAplicacion) {
      return responderError(
        c,
        error.message,
        error.estadoHttp as ContentfulStatusCode,
        {
          codigo: error.codigo,
          detalles: error.detalles,
          trazaId,
        },
      );
    }

    if (esErrorRemotoConEstado(error)) {
      const estado = error.estadoHttp >= 500 ? 502 : error.estadoHttp;
      registrador.error("integracion.qlik.error", {
        trazaId,
        estadoQlik: error.estadoHttp,
        mensaje: error.message,
      });
      return responderError(c, error.message, estado as ContentfulStatusCode, {
        codigo: "QLIK_API",
        detalles: error.cuerpo,
        trazaId: error.trazaId ?? trazaId,
      });
    }

    registrador.error("http.error-no-controlado", {
      trazaId,
      mensaje: error.message,
      stack: error.stack,
    });

    return responderError(c, "Error interno del servidor", 500, {
      codigo: "INTERNO",
      trazaId,
    });
  };
}
