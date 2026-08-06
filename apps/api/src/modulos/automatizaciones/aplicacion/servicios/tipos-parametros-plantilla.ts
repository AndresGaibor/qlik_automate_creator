import type { FabricaDestino } from "../../../destinos/publico.js";
import type { PuertoQlik } from "../../../qlik/publico.js";

export interface ParametrosPlantillaModo1 {
  modo: 1;
  Appid: string;
  DFScript: string;
  ConexionJSON: string;
  BaseDestinoJSON: string;
  SECRETOSJSON: string;
}

export interface ParametrosPlantillaModo2 {
  modo: 2;
  DataflowId: string;
  RutasSftpContenido: string;
  EsquemaTablaDestino: string;
  EjecucionId: string;
  TablaDestino: string;
}

export type ParametrosPlantilla =
  | ParametrosPlantillaModo1
  | ParametrosPlantillaModo2;

export interface ConexionOrigenPreparacion {
  id?: string;
  tipo: string;
  nombre: string;
  config: Record<string, unknown>;
  estado?: "sin_probar" | "disponible" | "error";
  probadaEn?: Date | null;
  mensajeError?: string | null;
}

export interface ConexionDestinoPreparacion {
  id: string;
  tipo: string;
  nombre: string;
  estado: "activo" | "error" | "desconectado";
  probadaEn: Date | null;
  mensajeError: string | null;
  config: Record<string, unknown>;
  secreto: { nombre: string; valor: string } | null;
}

export interface DependenciasPrepararParametros {
  qlik: PuertoQlik;
  consultarConexionesOrigen(
    organizacionId: string,
  ): Promise<ConexionOrigenPreparacion[]>;
  probarConexionOrigen?: (
    organizacionId: string,
    id: string,
  ) => Promise<unknown>;
  leerSecretoOrigen?: (
    organizacionId: string,
    id: string,
    nombre: string,
  ) => Promise<string | null>;
  obtenerConexionDestinoConSecreto?: (
    destinoId: string,
    organizacionId: string,
  ) => Promise<ConexionDestinoPreparacion | null>;
  probarConexionDestino?: (
    organizacionId: string,
    destinoId: string,
  ) => Promise<unknown>;
  consultarConexionDestino?: (
    destinoId: string,
    organizacionId: string,
  ) => Promise<{ tipo: string; config: Record<string, unknown> } | null>;
  crearCliente?: FabricaDestino;
}

export interface EntradaPreparar {
  modo: 1 | 2;
  organizacionId: string;
  flujoId: string;
  tablaId?: string;
  destinoId?: string;
}
