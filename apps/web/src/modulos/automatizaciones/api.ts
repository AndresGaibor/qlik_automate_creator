const BASE_URL = "/api/qlik/automatizaciones";

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

export interface EjecucionResumen {
  id: string;
  automationId: string;
  status: string;
  startTime: string;
  endTime?: string;
  error?: string;
}

export interface DetalleAutomatizacion {
  automatizacion: ResumenAutomatizacion;
  ejecuciones: EjecucionResumen[];
}

export interface RespuestaApi<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  let json: RespuestaApi<T>;
  try {
    json = await res.json();
  } catch {
    throw new Error("Error al cargar datos");
  }
  if (!res.ok)
    throw new Error(json?.error ?? "Error al cargar datos");
  if (typeof json !== "object" || json === null)
    throw new Error("Error al cargar datos");
  if (!json.success)
    throw new Error(json?.error ?? "Error al cargar datos");
  return (json.data as T) ?? ([] as unknown as T);
}

export async function obtenerAutomatizaciones(): Promise<ResumenAutomatizacion[]> {
  return fetchJson<ResumenAutomatizacion[]>(BASE_URL);
}

export async function obtenerDetalleAutomatizacion(
  id: string,
): Promise<DetalleAutomatizacion> {
  return fetchJson<DetalleAutomatizacion>(`${BASE_URL}/${id}`);
}

export async function ejecutarAutomatizacion(
  id: string,
): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}/run`, { method: "POST" });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json?.error ?? "Error al ejecutar");
  }
}

export async function detenerEjecucion(
  id: string,
  runId: string,
): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}/runs/${runId}/stop`, {
    method: "POST",
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json?.error ?? "Error al detener");
  }
}
