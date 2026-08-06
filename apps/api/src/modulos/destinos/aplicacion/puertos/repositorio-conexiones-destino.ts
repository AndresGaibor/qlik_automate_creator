import type { TipoDestino } from "../../dominio/tipos-destino.js";

export type EstadoConexionDestino = "activo" | "error" | "desconectado";

export interface ConexionDestino {
  id: string;
  organizacionId: string;
  tipo: TipoDestino;
  nombre: string;
  estado: EstadoConexionDestino;
  mensajeError: string | null;
  probadaEn: Date | null;
  config: Record<string, unknown>;
  secretoRefs: Record<string, unknown>;
}

export interface SolicitudCrearConexionDestino {
  organizacionId: string;
  tenantQlikId?: string;
  tipo: TipoDestino;
  nombre: string;
  config: Record<string, unknown>;
  secretoRefs: Record<string, unknown>;
}

export interface EntradaPersistirConexionDestino
  extends SolicitudCrearConexionDestino {
  secreto?: { nombre: string; valor: string };
}

/** Alias temporal para consumidores existentes. */
export type EntradaConexionDestino = SolicitudCrearConexionDestino;

export interface ConexionDestinoConSecreto extends ConexionDestino {
  secreto: { nombre: string; valor: string } | null;
}

export interface CambiosConexionDestino {
  nombre?: string;
  config?: Record<string, unknown>;
  estado?: EstadoConexionDestino;
  mensajeError?: string | null;
  probadaEn?: Date | null;
}

export interface RepositorioConexionesDestino {
  listarPorOrganizacion(organizacionId: string): Promise<ConexionDestino[]>;
  obtener(organizacionId: string, id: string): Promise<ConexionDestino | null>;
  obtenerConSecreto(
    organizacionId: string,
    id: string,
  ): Promise<ConexionDestinoConSecreto | null>;
  crear(entrada: EntradaPersistirConexionDestino): Promise<ConexionDestino>;
  guardarParaTenant(
    entrada: EntradaPersistirConexionDestino,
  ): Promise<ConexionDestino>;
  actualizar(
    organizacionId: string,
    id: string,
    cambios: CambiosConexionDestino,
  ): Promise<boolean>;
  eliminar(organizacionId: string, id: string): Promise<boolean>;
}
