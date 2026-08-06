import type { PuertoAuditoria } from "../../../../nucleo/auditoria/puerto-auditoria.js";
import { ErrorAplicacion } from "../../../../nucleo/errores/error-aplicacion.js";
import type {
  ConexionOrigen,
  EntradaConexionOrigen,
  RepositorioConexionesOrigen,
} from "../puertos/repositorio-conexiones-origen.js";

export class GestionarConexionesOrigen {
  constructor(
    private readonly repositorio: RepositorioConexionesOrigen,
    private readonly auditoria: PuertoAuditoria,
  ) {}

  async listar(organizacionId: string): Promise<ConexionOrigen[]> {
    const conexiones = await this.repositorio.listar(organizacionId);
    return conexiones.map(sanitizarConexion);
  }

  async crear(
    organizacionId: string,
    entrada: EntradaConexionOrigen,
  ): Promise<ConexionOrigen> {
    const existente = await this.repositorio.buscarPorTipoYNombre(
      organizacionId,
      entrada.tipo,
      entrada.nombre,
    );
    if (existente) throw errorConexionExistente();
    const creada = await this.repositorio.crear(
      organizacionId,
      prepararEntrada(entrada),
    );
    return sanitizarConexion(creada);
  }

  async actualizar(
    organizacionId: string,
    id: string,
    entrada: EntradaConexionOrigen,
  ): Promise<ConexionOrigen> {
    const actual = await this.repositorio.buscarPorId(organizacionId, id);
    if (!actual) throw errorConexionNoEncontrada();

    if (actual.nombre !== entrada.nombre) {
      const repetida = await this.repositorio.buscarPorTipoYNombre(
        organizacionId,
        entrada.tipo,
        entrada.nombre,
      );
      if (repetida && repetida.id !== id) throw errorConexionExistente();
    }

    const actualizada = await this.repositorio.actualizar(
      organizacionId,
      id,
      prepararEntrada(entrada),
    );
    if (!actualizada) throw errorConexionNoEncontrada();
    return sanitizarConexion(actualizada);
  }

  async eliminar(organizacionId: string, id: string): Promise<boolean> {
    return this.repositorio.eliminar(organizacionId, id);
  }

  async leerSecretoInterno(
    organizacionId: string,
    conexionId: string,
    nombre: string,
  ): Promise<string | null> {
    return this.repositorio.leerSecreto(organizacionId, conexionId, nombre);
  }
}

function prepararEntrada(
  entrada: EntradaConexionOrigen,
): EntradaConexionOrigen {
  return {
    ...entrada,
    config: omitirSecretos(entrada.config),
  };
}

function sanitizarConexion(conexion: ConexionOrigen): ConexionOrigen {
  return {
    ...conexion,
    config: omitirSecretos(conexion.config),
  };
}

function omitirSecretos(
  config: Record<string, unknown>,
): Record<string, unknown> {
  const { secretoValor, secretoClavePrivadaValor, ...resto } = config;
  return resto;
}

function errorConexionExistente(): ErrorAplicacion {
  return new ErrorAplicacion(
    "CONEXION_EXISTENTE",
    "Esta conexión ya está registrada",
    409,
  );
}

function errorConexionNoEncontrada(): ErrorAplicacion {
  return new ErrorAplicacion("NO_ENCONTRADA", "Conexión no encontrada", 404);
}
