import type { MiddlewareHandler } from "hono";
import { responderError } from "../respuestas.js";

export interface ReglaLimiteSolicitudes {
  ruta: string;
  metodos?: string[];
  maximo: number;
  ventanaMs: number;
}

interface ContadorVentana {
  solicitudes: number;
  reiniciaEn: number;
}

export function crearMiddlewareLimiteSolicitudes(
  reglas: ReglaLimiteSolicitudes[],
  ahora: () => number = Date.now,
): MiddlewareHandler {
  const contadores = new Map<string, ContadorVentana>();

  return async (c, siguiente) => {
    const regla = reglas.find(
      (candidata) =>
        candidata.ruta === c.req.path &&
        (!candidata.metodos || candidata.metodos.includes(c.req.method)),
    );
    if (!regla) return siguiente();

    const instante = ahora();
    for (const [claveExistente, contadorExistente] of contadores) {
      if (contadorExistente.reiniciaEn <= instante) {
        contadores.delete(claveExistente);
      }
    }
    const clave = `${regla.ruta}:${c.req.method}:${obtenerCliente(c)}`;
    const contador = contadores.get(clave);
    const actual =
      !contador || contador.reiniciaEn <= instante
        ? { solicitudes: 0, reiniciaEn: instante + regla.ventanaMs }
        : contador;
    actual.solicitudes += 1;
    contadores.set(clave, actual);
    c.header("x-ratelimit-limit", String(regla.maximo));
    c.header(
      "x-ratelimit-remaining",
      String(Math.max(0, regla.maximo - actual.solicitudes)),
    );

    if (actual.solicitudes > regla.maximo) {
      const reintentarEn = Math.max(
        1,
        Math.ceil((actual.reiniciaEn - instante) / 1000),
      );
      c.header("retry-after", String(reintentarEn));
      return responderError(
        c,
        "Demasiadas solicitudes; intenta nuevamente más tarde",
        429,
        {
          codigo: "LIMITE_SOLICITUDES_EXCEDIDO",
        },
      );
    }

    return siguiente();
  };
}

function obtenerCliente(c: Parameters<MiddlewareHandler>[0]): string {
  const cloudflare = c.req.header("cf-connecting-ip");
  if (cloudflare) return cloudflare;
  return (
    c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ?? "desconocido"
  );
}
