import { clienteApi } from "@/compartido/api/cliente";
import type {
  CrearDesdePlantilla,
  DetalleAutomatizacion,
  EspacioDisponible,
  ResultadoCrearDesdePlantilla,
  ResumenAutomatizacion,
} from "@qlik/contratos/automatizaciones";

const RUTA = "/automatizaciones";

export type {
  CrearDesdePlantilla,
  DetalleAutomatizacion,
  EspacioDisponible,
  ResumenAutomatizacion,
  ResultadoCrearDesdePlantilla,
};
export type EjecucionResumen = DetalleAutomatizacion["ejecuciones"][number];

export function obtenerAutomatizaciones() {
  return clienteApi.get<ResumenAutomatizacion[]>(RUTA);
}

export function obtenerAutomatizacionesConFiltros(espacioId?: string, busqueda?: string) {
  return clienteApi.get<ResumenAutomatizacion[]>(RUTA, {
    parametros: {
      ...(espacioId ? { espacioId } : {}),
      ...(busqueda ? { q: busqueda } : {}),
    },
  });
}

export function obtenerDetalleAutomatizacion(id: string) {
  return clienteApi.get<DetalleAutomatizacion>(
    `${RUTA}/${encodeURIComponent(id)}`,
  );
}

export function obtenerEspacios() {
  return clienteApi.get<EspacioDisponible[]>(`${RUTA}/espacios`);
}

export function ejecutarAutomatizacion(id: string) {
  return clienteApi.post<{ runId: string }>(
    `${RUTA}/${encodeURIComponent(id)}/ejecuciones`,
  );
}

export function detenerEjecucion(id: string, ejecucionId: string) {
  return clienteApi.post<{ detenida: true }>(
    `${RUTA}/${encodeURIComponent(id)}/ejecuciones/${encodeURIComponent(ejecucionId)}/detener`,
  );
}

export function crearAutomatizacionDesdePlantilla(
  entrada: CrearDesdePlantilla,
) {
  const clave = entrada.claveIdempotencia ?? crypto.randomUUID();
  return clienteApi.post<ResultadoCrearDesdePlantilla>(
    `${RUTA}/desde-plantilla`,
    { ...entrada, claveIdempotencia: clave },
    { headers: { "idempotency-key": clave } },
  );
}

export interface TablaImpala {
  nombre: string;
}

export async function obtenerTablasImpala(): Promise<TablaImpala[]> {
  try {
    return await clienteApi.get<TablaImpala[]>("/destinos/bases-datos/default/tablas");
  } catch {
    const data = await clienteApi.get<{ tableName: string }[]>(
      "https://apiqd.andresgaibor.com/api/v1/impala/databases/default/tables",
    );
    return data.map((t) => ({ nombre: t.tableName }));
  }
}
