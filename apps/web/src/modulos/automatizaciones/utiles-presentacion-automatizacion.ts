export type TonoEstadoEjecucion = "exito" | "error" | "progreso" | "neutral";

export interface EstadoEjecucionPresentado {
  etiqueta: string;
  tono: TonoEstadoEjecucion;
  enCurso: boolean;
}

const ESTADOS: Record<string, EstadoEjecucionPresentado> = {
  finished: { etiqueta: "Completada", tono: "exito", enCurso: false },
  completed: { etiqueta: "Completada", tono: "exito", enCurso: false },
  succeeded: { etiqueta: "Completada", tono: "exito", enCurso: false },
  failed: { etiqueta: "Fallida", tono: "error", enCurso: false },
  error: { etiqueta: "Fallida", tono: "error", enCurso: false },
  "timed out": {
    etiqueta: "Tiempo agotado",
    tono: "error",
    enCurso: false,
  },
  running: { etiqueta: "En ejecución", tono: "progreso", enCurso: true },
  starting: { etiqueta: "Iniciando", tono: "progreso", enCurso: true },
  queued: { etiqueta: "En cola", tono: "progreso", enCurso: true },
  stopped: { etiqueta: "Detenida", tono: "neutral", enCurso: false },
  "must stop": { etiqueta: "Deteniendo", tono: "progreso", enCurso: true },
};

export function presentarEstadoEjecucion(
  estado: string,
): EstadoEjecucionPresentado {
  const normalizado = estado.trim().toLowerCase();
  return (
    ESTADOS[normalizado] ?? {
      etiqueta: normalizado
        ? normalizado.charAt(0).toUpperCase() + normalizado.slice(1)
        : "Sin estado",
      tono: "neutral",
      enCurso: false,
    }
  );
}

export function calcularDuracion(
  iniciadoEn?: string,
  finalizadoEn?: string,
  ahora: Date | number = Date.now(),
): string {
  if (!iniciadoEn) return "—";
  const inicio = new Date(iniciadoEn).getTime();
  const fin = finalizadoEn
    ? new Date(finalizadoEn).getTime()
    : typeof ahora === "number"
      ? ahora
      : ahora.getTime();
  if (!Number.isFinite(inicio) || !Number.isFinite(fin) || fin < inicio) {
    return "—";
  }

  const segundos = Math.floor((fin - inicio) / 1000);
  if (segundos < 1) return "< 1 s";
  if (segundos < 60) return `${segundos} s`;

  const minutos = Math.floor(segundos / 60);
  const segundosRestantes = segundos % 60;
  if (minutos < 60) {
    return segundosRestantes > 0
      ? `${minutos} min ${segundosRestantes} s`
      : `${minutos} min`;
  }

  const horas = Math.floor(minutos / 60);
  const minutosRestantes = minutos % 60;
  return minutosRestantes > 0
    ? `${horas} h ${minutosRestantes} min`
    : `${horas} h`;
}

export function abreviarIdEjecucion(id: string): string {
  if (id.length <= 18) return id;
  return `${id.slice(0, 8)}…${id.slice(-6)}`;
}

export function extraerMensajeError(error: unknown): string | null {
  if (typeof error === "string") return error.trim() || null;
  if (!error || typeof error !== "object") return null;

  const registro = error as Record<string, unknown>;
  if (typeof registro.message === "string") {
    return registro.message.trim() || null;
  }
  return extraerMensajeError(registro.error);
}
