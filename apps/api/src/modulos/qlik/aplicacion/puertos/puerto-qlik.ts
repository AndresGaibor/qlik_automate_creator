export type MetodoHttpQlik = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface SolicitudQlik {
  metodo: MetodoHttpQlik;
  ruta: string;
  consulta?:
    | URLSearchParams
    | Record<string, string | number | boolean | undefined>;
  cuerpo?: unknown;
  encabezados?: Record<string, string>;
}

export interface RespuestaCrudaQlik {
  estado: number;
  estadoTexto: string;
  encabezados: Headers;
  cuerpo: ReadableStream<Uint8Array> | null;
}

export interface PuertoQlik {
  solicitarJson<T>(solicitud: SolicitudQlik): Promise<T>;
  solicitarCrudo(solicitud: SolicitudQlik): Promise<RespuestaCrudaQlik>;
  listarEspacios(
    consulta?: Record<string, string | number | boolean | undefined>,
  ): Promise<import("../../dominio/modelos-qlik.js").EspacioQlik[]>;
  obtenerEspacio(
    id: string,
  ): Promise<import("../../dominio/modelos-qlik.js").EspacioQlik>;
  obtenerUsuario(
    id: string,
    campos?: string,
  ): Promise<import("../../dominio/modelos-qlik.js").UsuarioQlik>;
  listarAutomatizaciones(
    consulta?: Record<string, string | number | boolean | undefined>,
  ): Promise<import("../../dominio/modelos-qlik.js").AutomatizacionQlik[]>;
  obtenerAutomatizacion(
    id: string,
  ): Promise<import("../../dominio/modelos-qlik.js").AutomatizacionQlik>;
  actualizarAutomatizacion(
    id: string,
    definicion: {
      name?: string;
      schedules?: Array<Record<string, unknown>>;
      workspace?: Record<string, unknown>;
      description?: string;
      maxConcurrentRuns?: number;
    },
  ): Promise<import("../../dominio/modelos-qlik.js").AutomatizacionQlik>;
  eliminarAutomatizacion(id: string): Promise<void>;
  listarEjecuciones(
    id: string,
    opciones?: { limit?: number; sort?: "asc" | "desc" },
  ): Promise<import("../../dominio/modelos-qlik.js").EjecucionQlik[]>;
  ejecutarAutomatizacion(id: string): Promise<{ runId: string }>;
  detenerEjecucion(automatizacionId: string, runId: string): Promise<void>;
  copiarAutomatizacion(id: string, nombre: string): Promise<{ id: string }>;
  cambiarEspacioAutomatizacion(id: string, espacioId: string): Promise<void>;
  cambiarPropietarioAutomatizacion(
    id: string,
    usuarioId: string,
  ): Promise<void>;
  listarFlujos(
    espacioId?: string,
  ): Promise<import("../../dominio/modelos-qlik.js").FlujoQlik[]>;
  obtenerScriptApp(
    appId: string,
    scriptId?: string,
  ): Promise<{ script: string; versionMessage?: string }>;
}

export type ServicioQlik = PuertoQlik;
