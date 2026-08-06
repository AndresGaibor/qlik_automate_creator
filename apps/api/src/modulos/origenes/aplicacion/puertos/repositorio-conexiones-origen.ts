export type TipoConexionOrigen = "jdbc" | "sftp";
export type EstadoPruebaConexion = "sin_probar" | "disponible" | "error";

export interface ConexionOrigen {
  id: string;
  organizacionId: string;
  tipo: TipoConexionOrigen;
  nombre: string;
  config: Record<string, unknown>;
  estado: EstadoPruebaConexion;
  probadaEn: Date | null;
  mensajeError: string | null;
  creadoEn: Date;
  actualizadoEn: Date;
}

export interface EntradaConexionOrigen {
  tipo: TipoConexionOrigen;
  nombre: string;
  config: Record<string, unknown>;
  secreto?: {
    nombre: string;
    valor?: string;
  };
}

export interface RepositorioConexionesOrigen {
  listar(organizacionId: string): Promise<ConexionOrigen[]>;
  buscarPorNombre(
    organizacionId: string,
    nombre: string,
  ): Promise<ConexionOrigen | null>;
  buscarPorTipoYNombre(
    organizacionId: string,
    tipo: TipoConexionOrigen,
    nombre: string,
  ): Promise<ConexionOrigen | null>;
  buscarPorId(
    organizacionId: string,
    id: string,
  ): Promise<ConexionOrigen | null>;
  crear(
    organizacionId: string,
    entrada: EntradaConexionOrigen,
  ): Promise<ConexionOrigen>;
  actualizar(
    organizacionId: string,
    id: string,
    entrada: EntradaConexionOrigen,
  ): Promise<ConexionOrigen | null>;
  eliminar(organizacionId: string, id: string): Promise<boolean>;
  leerSecreto(
    organizacionId: string,
    conexionId: string,
    nombre: string,
  ): Promise<string | null>;
  registrarPrueba(
    organizacionId: string,
    conexionId: string,
    resultado: {
      estado: "disponible" | "error";
      probadaEn: Date;
      mensajeError: string | null;
    },
  ): Promise<boolean>;
}
