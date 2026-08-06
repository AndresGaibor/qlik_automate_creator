import { ErrorAplicacion } from "../../../../nucleo/errores/error-aplicacion.js";
import type {
  CambiosConexionDestino,
  ConexionDestino,
  ConexionDestinoConSecreto,
  EntradaPersistirConexionDestino,
  RepositorioConexionesDestino,
  SolicitudCrearConexionDestino,
} from "../puertos/repositorio-conexiones-destino.js";

export class GestionarConexionesDestino {
  constructor(private readonly repositorio: RepositorioConexionesDestino) {}

  async listar(organizacionId: string): Promise<ConexionDestino[]> {
    return (await this.repositorio.listarPorOrganizacion(organizacionId)).map(
      sanitizarConexion,
    );
  }

  async buscar(
    organizacionId: string,
    id: string,
  ): Promise<ConexionDestino | null> {
    const conexion = await this.repositorio.obtener(organizacionId, id);
    return conexion ? sanitizarConexion(conexion) : null;
  }

  async obtener(organizacionId: string, id: string): Promise<ConexionDestino> {
    const conexion = await this.buscar(organizacionId, id);
    if (!conexion) throw destinoNoEncontrado();
    return conexion;
  }

  async obtenerConSecreto(
    organizacionId: string,
    id: string,
  ): Promise<ConexionDestinoConSecreto> {
    const conexion = await this.repositorio.obtenerConSecreto(
      organizacionId,
      id,
    );
    if (!conexion) throw destinoNoEncontrado();
    return {
      ...conexion,
      config: omitirSecretos(conexion.config),
    };
  }

  async crear(
    entrada: SolicitudCrearConexionDestino,
  ): Promise<ConexionDestino> {
    const persistible = prepararEntrada(entrada);
    return sanitizarConexion(await this.repositorio.crear(persistible));
  }

  async guardarParaTenant(
    entrada: SolicitudCrearConexionDestino,
  ): Promise<ConexionDestino> {
    return sanitizarConexion(
      await this.repositorio.guardarParaTenant(prepararEntrada(entrada)),
    );
  }

  async actualizar(
    organizacionId: string,
    id: string,
    cambios: CambiosConexionDestino,
  ): Promise<void> {
    const seguros = cambios.config
      ? { ...cambios, config: omitirSecretos(cambios.config) }
      : cambios;
    if (!(await this.repositorio.actualizar(organizacionId, id, seguros))) {
      throw destinoNoEncontrado();
    }
  }

  async eliminar(organizacionId: string, id: string): Promise<void> {
    if (!(await this.repositorio.eliminar(organizacionId, id))) {
      throw destinoNoEncontrado();
    }
  }
}

function prepararEntrada(
  entrada: SolicitudCrearConexionDestino,
): EntradaPersistirConexionDestino {
  const password =
    entrada.tipo === "postgres" ? entrada.config.password : undefined;
  const nombreSecreto = `POSTGRES_DESTINO_${normalizarNombre(entrada.nombre)}`;
  return {
    ...entrada,
    config: omitirSecretos(entrada.config),
    secretoRefs:
      typeof password === "string" && password.length > 0
        ? { ...entrada.secretoRefs, password: nombreSecreto }
        : entrada.secretoRefs,
    ...(typeof password === "string" && password.length > 0
      ? { secreto: { nombre: nombreSecreto, valor: password } }
      : {}),
  };
}

function sanitizarConexion(conexion: ConexionDestino): ConexionDestino {
  return { ...conexion, config: omitirSecretos(conexion.config) };
}

function omitirSecretos(
  config: Record<string, unknown>,
): Record<string, unknown> {
  const { password, privateKey, valorCifrado, ...resto } = config;
  return resto;
}

function normalizarNombre(nombre: string): string {
  const normalizado = nombre
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return normalizado || "PRINCIPAL";
}

function destinoNoEncontrado(): ErrorAplicacion {
  return new ErrorAplicacion(
    "DESTINO_NO_ENCONTRADO",
    "Conexión destino no encontrada",
    404,
  );
}
