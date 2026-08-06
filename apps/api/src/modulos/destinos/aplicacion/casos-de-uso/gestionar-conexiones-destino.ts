import { ErrorAplicacion } from "../../../../nucleo/errores/error-aplicacion.js";
import type {
  CambiosConexionDestino,
  ConexionDestino,
  EntradaConexionDestino,
  RepositorioConexionesDestino,
} from "../puertos/repositorio-conexiones-destino.js";

export class GestionarConexionesDestino {
  constructor(private readonly repositorio: RepositorioConexionesDestino) {}

  listar(organizacionId: string): Promise<ConexionDestino[]> {
    return this.repositorio.listarPorOrganizacion(organizacionId);
  }

  buscar(
    organizacionId: string,
    id: string,
  ): Promise<ConexionDestino | null> {
    return this.repositorio.obtener(organizacionId, id);
  }

  async obtener(organizacionId: string, id: string): Promise<ConexionDestino> {
    const conexion = await this.repositorio.obtener(organizacionId, id);
    if (!conexion) throw destinoNoEncontrado();
    return conexion;
  }

  crear(entrada: EntradaConexionDestino): Promise<ConexionDestino> {
    return this.repositorio.crear(entrada);
  }

  async actualizar(
    organizacionId: string,
    id: string,
    cambios: CambiosConexionDestino,
  ): Promise<void> {
    if (!(await this.repositorio.actualizar(organizacionId, id, cambios))) {
      throw destinoNoEncontrado();
    }
  }

  async eliminar(organizacionId: string, id: string): Promise<void> {
    if (!(await this.repositorio.eliminar(organizacionId, id))) {
      throw destinoNoEncontrado();
    }
  }
}

function destinoNoEncontrado(): ErrorAplicacion {
  return new ErrorAplicacion(
    "DESTINO_NO_ENCONTRADO",
    "Conexión destino no encontrada",
    404,
  );
}
