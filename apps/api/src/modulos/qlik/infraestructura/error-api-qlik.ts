export class ErrorApiQlik extends Error {
  constructor(
    public readonly estadoHttp: number,
    public readonly estadoTexto: string,
    public readonly ruta: string,
    public readonly cuerpo?: unknown,
    public readonly trazaId?: string,
  ) {
    const detalle = extraerMensaje(cuerpo);
    super(detalle ?? `Qlik respondió ${estadoHttp} ${estadoTexto}`);
    this.name = "ErrorApiQlik";
  }
}

function extraerMensaje(cuerpo: unknown): string | undefined {
  if (!cuerpo || typeof cuerpo !== "object") return undefined;
  const objeto = cuerpo as Record<string, unknown>;
  const errores = objeto.errors;
  if (Array.isArray(errores) && errores.length > 0) {
    const primero = errores[0];
    if (primero && typeof primero === "object") {
      const detalle = (primero as Record<string, unknown>).detail;
      const titulo = (primero as Record<string, unknown>).title;
      if (typeof detalle === "string" && detalle) return detalle;
      if (typeof titulo === "string" && titulo) return titulo;
    }
  }
  const mensaje = objeto.message ?? objeto.error;
  return typeof mensaje === "string" ? mensaje : undefined;
}
