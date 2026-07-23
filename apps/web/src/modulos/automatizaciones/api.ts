const BASE_URL = "/api/qlik/automatizaciones";

export interface Automatizacion {
  id: string;
  name: string;
  spaceId?: string;
  owner?: { id: string; name: string };
  isEnabled: boolean;
  state?: string;
  lastRunStatus?: string;
  ejecucionActiva?: boolean;
  triggerType?: string;
  runMode?: string;
  trigger?: { type?: string };
  lastExecution?: {
    id: string;
    status: string;
    startTime: string;
    endTime?: string;
  };
  createdDate: string;
  modifiedDate: string;
}

export interface Ejecucion {
  id: string;
  status: string;
  startTime: string;
  endTime?: string;
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

export async function obtenerAutomatizaciones(): Promise<Automatizacion[]> {
  return fetchJson<Automatizacion[]>(BASE_URL);
}

export async function obtenerDetalleAutomatizacion(
  id: string,
): Promise<Automatizacion> {
  return fetchJson<Automatizacion>(`${BASE_URL}/${id}`);
}

export async function obtenerEjecuciones(
  id: string,
): Promise<Ejecucion[]> {
  return fetchJson<Ejecucion[]>(`${BASE_URL}/${id}/runs`);
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
