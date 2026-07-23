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
 * Normaliza un nombre visible: null, undefined, "" o solo whitespace → undefined.
 * Cualquier otro string se trim() para eliminar bordes.
 * Útil para que valores en blanco no se rendericen ni se guarden en mapas.
 */
export function normalizarNombre(valor: string | null | undefined): string | undefined {
  if (valor == null) return undefined;
  const trimmed = valor.trim();
  return trimmed === "" ? undefined : trimmed;
}

/**
 * Construye un mapa de spaceId → nombre de espacio.
 * Ignora entradas cuyo name sea blank (null | undefined | "" | whitespace).
 */
export function mapaEspacios(espacios: EspacioQlik[]): Map<string, string> {
  const mapa = new Map<string, string>();
  for (const esp of espacios) {
    const nombre = normalizarNombre(esp.name);
    if (nombre !== undefined) {
      mapa.set(esp.id, nombre);
    }
  }
  return mapa;
}

/**
 * Construye un mapa de userId → nombre de usuario.
 * Ignora entradas cuyo name sea blank (null | undefined | "" | whitespace).
 */
export function mapaUsuarios(usuarios: UsuarioQlik[]): Map<string, string> {
  const mapa = new Map<string, string>();
  for (const usr of usuarios) {
    const nombre = normalizarNombre(usr.name);
    if (nombre !== undefined) {
      mapa.set(usr.id, nombre);
    }
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
  // ── espacioNombre: nombre normalizado del mapa → spaceId → "Sin espacio" ──
  const nombreEspacioRaw =
    auto.spaceId ? mapaEsp.get(auto.spaceId) : undefined;
  const espacioNombre =
    auto.spaceId
      ? normalizarNombre(nombreEspacioRaw) ?? auto.spaceId
      : "Sin espacio";

  // ── isEnabled: schema real usa `state`, legacy usa `isEnabled` ─────
  const isEnabled =
    auto.isEnabled !== undefined ? auto.isEnabled : auto.state === "available";

  // ── triggerType: schema real usa `runMode`, legacy usa `triggerType` ─
  const triggerType = auto.triggerType ?? auto.runMode ?? "unknown";

  // ── ownerNombre: normalizado(owner.name) → normalizado(mapaUsr) → ownerId → owner.id (legacy) → fallback ──
  const ownerNombreRaw =
    normalizarNombre(auto.owner?.name)
    ?? normalizarNombre(auto.ownerId ? mapaUsr?.get(auto.ownerId) : undefined)
    ?? auto.ownerId
    ?? auto.owner?.id;
  const ownerNombre = ownerNombreRaw ?? "Sin propietario";

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
