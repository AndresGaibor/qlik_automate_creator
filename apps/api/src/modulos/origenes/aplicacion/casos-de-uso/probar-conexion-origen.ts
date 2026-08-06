import { ErrorAplicacion } from "../../../../nucleo/errores/error-aplicacion.js";
import type { ProbadorConexionOrigen } from "../puertos/probador-conexion-origen.js";
import type {
  ConexionOrigen,
  RepositorioConexionesOrigen,
} from "../puertos/repositorio-conexiones-origen.js";

export class ProbarConexionOrigen {
  constructor(
    private readonly repositorio: RepositorioConexionesOrigen,
    private readonly probador: ProbadorConexionOrigen,
  ) {}

  async ejecutar(organizacionId: string, id: string) {
    const conexion = await this.repositorio.buscarPorId(organizacionId, id);
    if (!conexion) {
      throw new ErrorAplicacion("NO_ENCONTRADA", "Conexión no encontrada", 404);
    }

    const probadaEn = new Date();
    try {
      await this.probar(conexion, organizacionId);
      await this.repositorio.registrarPrueba(organizacionId, id, {
        estado: "disponible",
        probadaEn,
        mensajeError: null,
      });
      return {
        estado: "disponible" as const,
        probadaEn: probadaEn.toISOString(),
        mensaje: null,
      };
    } catch (error) {
      if (
        error instanceof ErrorAplicacion &&
        ["JDBC_NO_SOPORTADO", "CONEXION_ORIGEN_SIN_SECRETO"].includes(
          error.codigo,
        )
      ) {
        throw error;
      }
      const mensaje = "No se pudo conectar con el origen configurado";
      await this.repositorio.registrarPrueba(organizacionId, id, {
        estado: "error",
        probadaEn,
        mensajeError: mensaje,
      });
      throw new ErrorAplicacion("CONEXION_ORIGEN_NO_DISPONIBLE", mensaje, 422);
    }
  }

  private async probar(conexion: ConexionOrigen, organizacionId: string) {
    if (conexion.tipo === "jdbc") {
      const url = texto(conexion.config.url);
      if (!url.startsWith("jdbc:postgresql://")) {
        throw new ErrorAplicacion(
          "JDBC_NO_SOPORTADO",
          "Solo se admiten conexiones JDBC PostgreSQL en este demo",
          422,
        );
      }
      const nombreSecreto = texto(conexion.config.secreto_nombre);
      const credenciales = await this.repositorio.leerSecreto(
        organizacionId,
        conexion.id,
        nombreSecreto,
      );
      if (!credenciales) throw errorSecretoFaltante();
      const separador = credenciales.indexOf(":");
      if (separador <= 0) throw new Error("invalid credentials");
      return this.probador.probarPostgres({
        url,
        usuario: credenciales.slice(0, separador),
        clave: credenciales.slice(separador + 1),
      });
    }

    const nombreSecreto = texto(conexion.config.secreto_clave_privada_nombre);
    const llavePrivada = await this.repositorio.leerSecreto(
      organizacionId,
      conexion.id,
      nombreSecreto,
    );
    if (!llavePrivada) throw errorSecretoFaltante();
    return this.probador.probarSftp({
      host: texto(conexion.config.host),
      puerto: numero(conexion.config.puerto, 22),
      usuario: texto(conexion.config.usuario),
      llavePrivada,
    });
  }
}

function texto(valor: unknown): string {
  return typeof valor === "string" ? valor.trim() : "";
}

function numero(valor: unknown, predeterminado: number): number {
  return typeof valor === "number" && Number.isFinite(valor)
    ? valor
    : predeterminado;
}

function errorSecretoFaltante(): ErrorAplicacion {
  return new ErrorAplicacion(
    "CONEXION_ORIGEN_SIN_SECRETO",
    "Falta configurar la credencial segura",
    422,
  );
}
