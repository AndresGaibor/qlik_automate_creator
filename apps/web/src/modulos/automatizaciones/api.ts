import { clienteApi } from "@/compartido/api/cliente";
import type {
  CrearDesdePlantilla,
  DetalleAutomatizacion,
  EntradaCrearModo1,
  EspacioDisponible,
  PreflightAutomatizacion,
  ResultadoCrearDesdePlantilla,
  ResumenAutomatizacion,
} from "@qlik/contratos/automatizaciones";
import type {
  CapacidadesDestino,
  ConexionDestino,
  CrearConexionDestino,
  RecursoDestino,
  TipoDestino,
} from "@qlik/contratos/destinos";

const RUTA = "/automatizaciones";

export interface ConfiguracionTenant {
  modoAutomatizacionActivo: 1 | 2;
  plantillaEfectivaIdQlik: string | null;
  plantillaEfectivaNombre: string | null;
  configurada: boolean;
  puedeAdministrarConexiones: boolean;
  accesoEspacios: {
    restringido: boolean;
    configurado: boolean;
    cerrado: boolean;
    cantidadEspacios: number;
    permitirRecursosSinEspacio: boolean;
  };
}

export function obtenerConfiguracionTenant(): Promise<ConfiguracionTenant> {
  return clienteApi.get<ConfiguracionTenant>(`${RUTA}/configuracion-tenant`);
}

export type {
  CrearDesdePlantilla,
  DetalleAutomatizacion,
  EntradaCrearModo1,
  EspacioDisponible,
  PreflightAutomatizacion,
  ResumenAutomatizacion,
  ResultadoCrearDesdePlantilla,
};
export type EjecucionResumen = DetalleAutomatizacion["ejecuciones"][number];

export interface ResultadoPruebaConexionOrigen {
  estado: "disponible";
  probadaEn: string;
  mensaje: null;
}

export type EntradaConexionOrigen =
  | {
      tipo: "jdbc";
      nombre: string;
      config: {
        url: string;
        driver: string;
        secreto_nombre: string;
        propiedades: Record<string, string>;
        secretoValor?: string;
      };
    }
  | {
      tipo: "sftp";
      nombre: string;
      config: {
        host: string;
        puerto: number;
        usuario: string;
        secreto_clave_privada_nombre: string;
        ruta_base: string;
        secretoClavePrivadaValor?: string;
      };
    };

export function obtenerPreflightAutomatizacion(flujoId: string) {
  return clienteApi.post<PreflightAutomatizacion>(`${RUTA}/preflight`, {
    flujoId,
  });
}

export function guardarConexionOrigen(entrada: EntradaConexionOrigen) {
  return clienteApi.post<{ id: string }>("/conexiones-origen", entrada);
}

export function probarConexionOrigen(id: string) {
  return clienteApi.post<ResultadoPruebaConexionOrigen>(
    `/conexiones-origen/${encodeURIComponent(id)}/probar`,
    {},
  );
}

export function obtenerAutomatizaciones() {
  return clienteApi.get<ResumenAutomatizacion[]>(RUTA);
}

export function obtenerAutomatizacionesConFiltros(
  espacioId?: string,
  busqueda?: string,
) {
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
  entrada:
    | EntradaCrearModo1
    | (Omit<CrearDesdePlantilla, "plantillaIdQlik"> & {
        plantillaIdQlik?: string;
      }),
) {
  const clave = entrada.claveIdempotencia ?? crypto.randomUUID();
  return clienteApi.post<ResultadoCrearDesdePlantilla>(
    `${RUTA}/desde-plantilla`,
    { ...entrada, claveIdempotencia: clave },
    { headers: { "idempotency-key": clave } },
  );
}

export type {
  ConexionDestino,
  CapacidadesDestino,
  RecursoDestino,
  TipoDestino,
};

export interface TablaImpala {
  nombre: string;
}

/** Conexiones de destino configuradas para la organización */
export function obtenerConexionesDestino(): Promise<ConexionDestino[]> {
  return clienteApi.get<ConexionDestino[]>("/destinos/conexiones");
}

/** Prueba la conexión de un destino */
export function probarConexionDestino(id: string): Promise<{
  exitoso: boolean;
  mensaje: string;
  capacidades?: CapacidadesDestino;
}> {
  return clienteApi.post(
    `/destinos/conexiones/${encodeURIComponent(id)}/probar`,
    {},
  );
}

/** Recursos disponibles en una conexión de destino */
export function obtenerRecursosDestino(id: string): Promise<RecursoDestino[]> {
  return clienteApi.get<RecursoDestino[]>(
    `/destinos/conexiones/${encodeURIComponent(id)}/recursos`,
  );
}

/** Detalle de un recurso específico */
export function obtenerDetalleRecursoDestino(
  conexionId: string,
  recursoId: string,
): Promise<RecursoDestino & { totalFilas?: number; actualizadoEn: string }> {
  return clienteApi.get(
    `/destinos/conexiones/${encodeURIComponent(conexionId)}/recursos/${encodeURIComponent(recursoId)}`,
  );
}

/** Capacidades de una conexión de destino */
export function obtenerCapacidadesDestino(
  id: string,
): Promise<CapacidadesDestino> {
  return clienteApi.get<CapacidadesDestino>(
    `/destinos/conexiones/${encodeURIComponent(id)}/capacidades`,
  );
}

/** Crea una nueva conexión de destino */
export function crearConexionDestino(
  entrada: CrearConexionDestino,
): Promise<{ id: string }> {
  return clienteApi.post("/destinos/conexiones", entrada);
}

/** Trae las tablas del tenant activo (legacy, para compatibilidad) */
export function obtenerTablasImpala(): Promise<TablaImpala[]> {
  return clienteApi.get<TablaImpala[]>("/destinos/bases-datos/default/tablas");
}

export function obtenerFlujosConFiltros(espacioId?: string) {
  return clienteApi.get<import("@qlik/contratos").ResumenFlujo[]>("/flujos", {
    parametros: espacioId ? { espacioId } : undefined,
  });
}

export interface WorkspaceAutomatizacion {
  id: string;
  nombre: string;
  workspace: Record<string, unknown>;
  schedules: Array<Record<string, unknown>>;
}

export function obtenerWorkspaceAutomatizacion(id: string) {
  return clienteApi.get<WorkspaceAutomatizacion>(
    `${RUTA}/${encodeURIComponent(id)}/workspace`,
  );
}

export function actualizarWorkspaceAutomatizacion(
  id: string,
  workspace: Record<string, unknown>,
) {
  return clienteApi.put<WorkspaceAutomatizacion>(
    `${RUTA}/${encodeURIComponent(id)}/workspace`,
    { workspace },
  );
}

export function clonarAutomatizacion(
  id: string,
  opciones?: { nombre?: string; espacioIdQlik?: string },
) {
  return clienteApi.post<{ id: string; nombre: string }>(
    `${RUTA}/${encodeURIComponent(id)}/clonar`,
    opciones ?? {},
  );
}
