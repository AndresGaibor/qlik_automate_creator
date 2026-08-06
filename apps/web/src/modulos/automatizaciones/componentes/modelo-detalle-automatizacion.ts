import type {
  DetalleAutomatizacion,
  EjecucionResumen,
} from "@/modulos/automatizaciones/api";
import {
  type TonoEstadoEjecucion,
  extraerMensajeError,
  presentarEstadoEjecucion,
} from "@/modulos/automatizaciones/utiles-presentacion-automatizacion";

export const CLASES_TONO_DETALLE: Record<TonoEstadoEjecucion, string> = {
  exito: "border-brand-100 bg-brand-50 text-brand-700",
  error: "border-red-200 bg-red-50 text-danger-600",
  progreso: "border-amber-200 bg-amber-50 text-amber-700",
  neutral: "border-line-200 bg-app text-ink-600",
};

export const PUNTO_TONO_DETALLE: Record<TonoEstadoEjecucion, string> = {
  exito: "bg-brand-600",
  error: "bg-danger-600",
  progreso: "bg-amber-500",
  neutral: "bg-ink-400",
};

export function resolverEstadoGeneralAutomatizacion(
  activa: boolean,
  enEjecucion: boolean,
  ultimaEjecucion?: EjecucionResumen,
) {
  if (enEjecucion) {
    return { etiqueta: "Ejecutándose", tono: "progreso" as const };
  }
  if (!activa) return { etiqueta: "Inactivo", tono: "neutral" as const };
  const ultimoEstado = ultimaEjecucion
    ? presentarEstadoEjecucion(ultimaEjecucion.estado)
    : null;
  if (ultimoEstado?.tono === "error") {
    return { etiqueta: "Requiere atención", tono: "error" as const };
  }
  return { etiqueta: "Disponible", tono: "exito" as const };
}

export function construirPresentacionDetalleAutomatizacion(
  automatizacion: DetalleAutomatizacion["automatizacion"],
  ultimaEjecucion: EjecucionResumen | undefined,
  ejecutandoPendiente: boolean,
) {
  const enEjecucion = automatizacion.ejecucionActiva || ejecutandoPendiente;
  return {
    enEjecucion,
    estado: resolverEstadoGeneralAutomatizacion(
      automatizacion.activa,
      enEjecucion,
      ultimaEjecucion,
    ),
    ultimaPresentada: ultimaEjecucion
      ? presentarEstadoEjecucion(ultimaEjecucion.estado)
      : null,
    mensajeError: ultimaEjecucion
      ? extraerMensajeError(ultimaEjecucion.error)
      : null,
  };
}
