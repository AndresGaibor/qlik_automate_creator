import type { TipoDestino } from "../../dominio/tipos-destino.js";

export type EstadoConexionDestino = "activo" | "error" | "desconectado";

export interface ConexionDestino {
  id: string;
  organizacionId: string;
  tipo: TipoDestino;
  nombre: string;
  estado: EstadoConexionDestino;
  mensajeError: string | null;
  config: Record<string, unknown>;
  secretoRefs: Record<string, unknown>;
}

export interface EntradaConexionDestino {
  organizacionId: string;
  tipo: TipoDestino;
  nombre: string;
  config: Record<string, unknown>;
  secretoRefs: Record<string, unknown>;
}

export interface CambiosConexionDestino {
  nombre?: string;
  config?: Record<string, unknown>;
  estado?: EstadoConexionDestino;
  mensajeError?: string | null;
}

export interface RepositorioConexionesDestino {
  listarPorOrganizacion(organizacionId: string): Promise<ConexionDestino[]>;
  obtener(organizacionId: string, id: string): Promise<ConexionDestino | null>;
  crear(entrada: EntradaConexionDestino): Promise<ConexionDestino>;
  actualizar(
    organizacionId: string,
    id: string,
    cambios: CambiosConexionDestino,
  ): Promise<boolean>;
  eliminar(organizacionId: string, id: string): Promise<boolean>;
}
