import type { ResultadoCrearDesdePlantilla } from "@qlik/contratos/automatizaciones";
import type { CrearDesdePlantilla } from "@qlik/contratos/automatizaciones";
import { ErrorConflicto } from "../../../../nucleo/errores/error-aplicacion.js";
import type { PuertoIdempotencia } from "../../../../nucleo/idempotencia/puerto-idempotencia.js";
import { hashCanonico } from "./utilidades-automatizacion.js";

export interface ContextoIdempotencia {
  organizacionId: string;
  alcance: string;
  clave: string;
  hashSolicitud: string;
  ttlHoras?: number;
}

export async function verificarIdempotencia(
  idempotencia: PuertoIdempotencia,
  contexto: ContextoIdempotencia,
): Promise<{
  esNuevo: boolean;
  resultadoPrevio?: ResultadoCrearDesdePlantilla;
}> {
  const { organizacionId, alcance, clave } = contexto;
  const existente = await idempotencia.obtener(organizacionId, alcance, clave);

  if (existente) {
    if (existente.hashSolicitud !== contexto.hashSolicitud) {
      throw new ErrorConflicto(
        "La clave de idempotencia ya fue usada con otra solicitud",
      );
    }
    if (existente.estado === "completada") {
      return {
        esNuevo: false,
        resultadoPrevio: existente.respuesta as ResultadoCrearDesdePlantilla,
      };
    }
    throw new ErrorConflicto(
      "La solicitud con esta clave todavía está en curso o falló",
    );
  }

  const inicio = await idempotencia.iniciar(
    { organizacionId, alcance, clave, hashSolicitud: contexto.hashSolicitud },
    new Date(Date.now() + 24 * 60 * 60 * 1000),
  );

  if (inicio === "existente") {
    const concurrente = await idempotencia.obtener(
      organizacionId,
      alcance,
      clave,
    );
    if (concurrente?.hashSolicitud !== contexto.hashSolicitud) {
      throw new ErrorConflicto(
        "La clave de idempotencia ya fue usada con otra solicitud",
      );
    }
    if (concurrente?.estado === "completada") {
      return {
        esNuevo: false,
        resultadoPrevio: concurrente.respuesta as ResultadoCrearDesdePlantilla,
      };
    }
    throw new ErrorConflicto(
      "La solicitud con esta clave ya está siendo procesada",
    );
  }

  return { esNuevo: true };
}

export async function completarIdempotencia(
  idempotencia: PuertoIdempotencia,
  contexto: { organizacionId: string; alcance: string; clave: string },
  estadoHttp: number,
  respuesta: unknown,
): Promise<void> {
  await idempotencia.completar(
    contexto.organizacionId,
    contexto.alcance,
    contexto.clave,
    estadoHttp,
    respuesta,
  );
}

export async function fallarIdempotencia(
  idempotencia: PuertoIdempotencia,
  contexto: { organizacionId: string; alcance: string; clave: string },
  estadoHttp: number,
  respuesta: unknown,
): Promise<void> {
  await idempotencia.fallar(
    contexto.organizacionId,
    contexto.alcance,
    contexto.clave,
    estadoHttp,
    respuesta,
  );
}
