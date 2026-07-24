const ESTADOS_EN_CURSO = new Set([
  "running",
  "starting",
  "queued",
  "must stop",
]);

export function estaEjecucionEnCurso(estado: string | undefined): boolean {
  return estado ? ESTADOS_EN_CURSO.has(estado) : false;
}
