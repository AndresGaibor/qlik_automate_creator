import type { EstadoEjecucion } from "../../infraestructura/qlik/tipos.js";

/**
 * Resumen de automatización para la lista del panel operacional.
 * Derivado de AutomatizacionQlik + espacio resuelto.
 */
export interface ResumenAutomatizacion {
  id: string;
  name: string;
  spaceId?: string;
  espacioNombre: string;
  ownerNombre: string;
  isEnabled: boolean;
  triggerType: string;
  ejecucionActiva: boolean;
  puedeEjecutar: boolean;
  creadoEn: string;
  modificadoEn: string;
}

/**
 * Detalle de una ejecución para la vista de detalle.
 */
export interface EjecucionResumen {
  id: string;
  automationId: string;
  status: EstadoEjecucion;
  startTime: string;
  endTime?: string;
  error?: string;
}

/**
 * Payload completo de detalle de automatización.
 */
export interface DetalleAutomatizacion {
  automatizacion: ResumenAutomatizacion;
  ejecuciones: EjecucionResumen[];
}
