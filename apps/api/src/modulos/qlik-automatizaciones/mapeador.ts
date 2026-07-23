import type {
  AutomatizacionQlik,
  EjecucionQlik,
  EspacioQlik,
  UsuarioQlik,
} from "../../infraestructura/qlik/tipos.js";
import type {
  DetalleAutomatizacion,
  EjecucionResumen,
  ResumenAutomatizacion,
} from "./tipos.js";

const ESTADOS_ACTIVOS = new Set(["running", "queued", "pending", "started"]);

/**
 * Construye un mapa de spaceId → nombre de espacio.
 */
export function mapaEspacios(espacios: EspacioQlik[]): Map<string, string> {
  const mapa = new Map<string, string>();
  for (const esp of espacios) {
    mapa.set(esp.id, esp.name);
  }
  return mapa;
}

/**
 * Construye un mapa de userId → nombre de usuario.
 */
export function mapaUsuarios(usuarios: UsuarioQlik[]): Map<string, string> {
  const mapa = new Map<string, string>();
  for (const usr of usuarios) {
    mapa.set(usr.id, usr.name);
  }
  return mapa;
}

/**
 * Determina si una ejecución está activa (en curso).
 */
export function esEjecucionActiva(status: string): boolean {
  return ESTADOS_ACTIVOS.has(status);
}

/**
 * Mapea una automatización de Qlik a un resumen UI-friendly.
 * Soporta el schema real Qlik (state/runMode/ownerId/createdAt/updatedAt/lastRun)
 * y el legacy (isEnabled/triggerType/owner.name/createdDate/modifiedDate/lastExecution).
 *
 * @param mapaUsr - Mapa opcional de userId → nombre resuelto vía API.
 */
export function aResumen(
  auto: AutomatizacionQlik,
  mapaEsp: Map<string, string>,
  mapaUsr?: Map<string, string>,
): ResumenAutomatizacion {
  const espacioNombre = auto.spaceId
    ? (mapaEsp.get(auto.spaceId) ?? auto.spaceId)
    : "Sin espacio";

  // ── isEnabled: schema real usa `state`, legacy usa `isEnabled` ─────
  const isEnabled =
    auto.isEnabled !== undefined ? auto.isEnabled : auto.state === "available";

  // ── triggerType: schema real usa `runMode`, legacy usa `triggerType` ─
  const triggerType = auto.triggerType ?? auto.runMode ?? "unknown";

  // ── ownerNombre: owner.name → nombre resuelto → ownerId → fallback ──
  const ownerNombre =
    auto.owner?.name
    ?? (auto.ownerId && mapaUsr?.get(auto.ownerId))
    ?? auto.ownerId
    ?? "Sin propietario";

  // ── Fechas: schema real usa `createdAt`/`updatedAt`, legacy `createdDate`/`modifiedDate`
  const creadoEn = auto.createdAt ?? auto.createdDate ?? "";
  const modificadoEn = auto.updatedAt ?? auto.modifiedDate ?? "";

  // ── Última ejecución: schema real usa `lastRun`, legacy `lastExecution`
  const ultimaEjecucion = auto.lastRun ?? auto.lastExecution;
  const ejecucionActiva = ultimaEjecucion
    ? esEjecucionActiva(ultimaEjecucion.status)
    : false;

  return {
    id: auto.id,
    name: auto.name,
    spaceId: auto.spaceId,
    espacioNombre,
    ownerNombre,
    isEnabled,
    triggerType,
    ejecucionActiva,
    puedeEjecutar: isEnabled && !ejecucionActiva,
    creadoEn,
    modificadoEn,
  };
}

/**
 * Mapea ejecuciones de Qlik a formato UI-friendly.
 * Acepta stopTime/endTime y tolera ejecuciones vacías/undefined.
 */
export function mapearEjecuciones(
  ejecuciones: EjecucionQlik[] | undefined | null,
): EjecucionResumen[] {
  if (!ejecuciones || !Array.isArray(ejecuciones)) {
    return [];
  }
  return ejecuciones.map((ej) => ({
    id: ej.id,
    automationId: ej.automationId,
    status: ej.status,
    startTime: ej.startTime,
    // Qlik real usa stopTime; endTime es compatibilidad legacy
    endTime: ej.stopTime ?? ej.endTime,
    error: ej.error,
  }));
}

/**
 * Construye el detalle completo de una automatización.
 * Tolerante: ejecuciones ausentes no provocan 500.
 */
export function aDetalle(
  auto: AutomatizacionQlik,
  ejecuciones: EjecucionQlik[] | undefined | null,
  mapaEsp: Map<string, string>,
  mapaUsr?: Map<string, string>,
): DetalleAutomatizacion {
  return {
    automatizacion: aResumen(auto, mapaEsp, mapaUsr),
    ejecuciones: mapearEjecuciones(ejecuciones),
  };
}
