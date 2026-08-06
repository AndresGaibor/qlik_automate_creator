import postgres from "postgres";
import SftpClient from "ssh2-sftp-client";
import type { ProbadorConexionOrigen } from "../aplicacion/puertos/probador-conexion-origen.js";

export class ProbadorConexionOrigenReal implements ProbadorConexionOrigen {
  async probarPostgres(entrada: {
    url: string;
    usuario: string;
    clave: string;
  }): Promise<void> {
    const conexion = postgres(entrada.url.replace(/^jdbc:/, ""), {
      username: entrada.usuario,
      password: entrada.clave,
      max: 1,
      connect_timeout: 8,
      idle_timeout: 1,
    });
    try {
      await conexion`SELECT 1 AS ok`;
    } finally {
      await conexion.end({ timeout: 2 });
    }
  }

  async probarSftp(entrada: {
    host: string;
    puerto: number;
    usuario: string;
    llavePrivada: string;
  }): Promise<void> {
    const cliente = new SftpClient();
    try {
      await cliente.connect({
        host: entrada.host,
        port: entrada.puerto,
        username: entrada.usuario,
        privateKey: entrada.llavePrivada,
        readyTimeout: 8_000,
      });
    } finally {
      await cliente.end().catch(() => undefined);
    }
  }
}
