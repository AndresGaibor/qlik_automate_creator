export function estaEnCurso(estado: string): boolean {
  return ["running", "starting", "queued", "must stop"].includes(estado);
}

/**
 * @deprecated Reserved for future use when failure state handling is needed
 */
export function esEstadoFallido(estado: string): boolean {
  return ["failed", "stopped", "timed out"].includes(estado);
}
