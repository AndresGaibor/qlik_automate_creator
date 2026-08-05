import SftpClient from "ssh2-sftp-client";
import type { PuertoDestino } from "../aplicacion/puertos/puerto-destino.js";
import type {
  CapacidadesDestino,
  DetalleRecursoDestino,
  RecursoDestino,
} from "../dominio/tipos-destino.js";

export interface OpcionesSftp {
  host: string;
  port?: number;
  user: string;
  password?: string;
  privateKey?: string;
  rutaBase?: string;
}

export class ClienteSftp implements PuertoDestino {
  readonly tipo = "sftp" as const;
  private readonly opciones: OpcionesSftp;

  constructor(opciones: OpcionesSftp) {
    if (!opciones.host.trim()) throw new Error("El host SFTP es obligatorio");
    if (!opciones.user.trim()) throw new Error("El usuario SFTP es obligatorio");
    if (!opciones.password && !opciones.privateKey) {
      throw new Error("SFTP requiere contraseña o llave privada");
    }
    this.opciones = { ...opciones, rutaBase: opciones.rutaBase?.trim() || "/" };
  }

  obtenerCapacidades(): CapacidadesDestino {
    return {
      listarRecursos: true,
      esquema: false,
      conteoRegistros: false,
      vistaPrevia: false,
      escritura: true,
    };
  }

  async listarRecursos(): Promise<RecursoDestino[]> {
    const cliente = await this.conectar();
    try {
      const entradas = await cliente.list(this.opciones.rutaBase ?? "/");
      return entradas.map((entrada) => ({
        id: `${this.opciones.rutaBase}/${entrada.name}`.replace("//", "/"),
        nombre: entrada.name,
        tipo: entrada.type === "d" ? "carpeta" : "archivo",
        ruta: `${this.opciones.rutaBase}/${entrada.name}`.replace("//", "/"),
        metadatos: { tamaño: entrada.size, modificadoEn: entrada.modifyTime },
      }));
    } finally {
      await cliente.end().catch(() => undefined);
    }
  }

  async obtenerRecurso(id: string): Promise<DetalleRecursoDestino> {
    const cliente = await this.conectar();
    try {
      const entrada = await cliente.stat(id);
      const esCarpeta = entrada.type === "d";
      return {
        id,
        nombre: id.split("/").pop() ?? id,
        tipo: esCarpeta ? "carpeta" : "archivo",
        ruta: id,
        actualizadoEn: new Date(entrada.modifyTime).toISOString(),
        metadatos: { tamaño: entrada.size },
      };
    } finally {
      await cliente.end().catch(() => undefined);
    }
  }

  private async conectar(): Promise<SftpClient> {
    const cliente = new SftpClient();
    await cliente.connect({
      host: this.opciones.host,
      port: this.opciones.port ?? 22,
      username: this.opciones.user,
      ...(this.opciones.password ? { password: this.opciones.password } : {}),
      ...(this.opciones.privateKey ? { privateKey: this.opciones.privateKey } : {}),
    });
    return cliente;
  }
}
