export type MotivoSesion =
  | "credenciales_qlik_invalidas"
  | "sesion_terminada";

const MENSAJES_SESION: Record<MotivoSesion, string> = {
  credenciales_qlik_invalidas:
    "Tu conexión con Qlik Cloud venció. Inicia sesión nuevamente.",
  sesion_terminada: "Tu sesión terminó. Inicia sesión nuevamente.",
};

export function obtenerMotivoSesion(codigo?: string): MotivoSesion {
  return codigo === "CREDENCIALES_QLIK_INVALIDAS"
    ? "credenciales_qlik_invalidas"
    : "sesion_terminada";
}

export function obtenerMensajeMotivoSesion(
  motivo: string | null,
): string | null {
  if (motivo === null) return null;
  if (motivo === "credenciales_qlik_invalidas")
    return MENSAJES_SESION.credenciales_qlik_invalidas;
  if (motivo === "sesion_terminada")
    return MENSAJES_SESION.sesion_terminada;
  return null;
}
