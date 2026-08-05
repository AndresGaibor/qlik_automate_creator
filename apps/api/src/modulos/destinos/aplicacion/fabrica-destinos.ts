import type { PuertoDestino } from "./puertos/puerto-destino.js";
import { ClienteImpalaDirecto } from "../infraestructura/cliente-impala-directo.js";
import { ImpalaHaciaDestino } from "../infraestructura/impala-hacia-destino.js";
import { ClientePostgres } from "../infraestructura/cliente-postgres.js";
import { ClienteBigQuery } from "../infraestructura/cliente-bigquery.js";
import { ClienteSftp } from "../infraestructura/cliente-sftp.js";
import type { OpcionesImpala } from "../infraestructura/cliente-impala-directo.js";
import type { OpcionesPostgres } from "../infraestructura/cliente-postgres.js";
import type { OpcionesBigQuery } from "../infraestructura/cliente-bigquery.js";
import type { OpcionesSftp } from "../infraestructura/cliente-sftp.js";
import type { TipoDestino } from "../dominio/tipos-destino.js";

export interface ConfigConexionDestino {
  tipo: TipoDestino;
  config: Record<string, unknown>;
}

export function crearClienteDestino(conexion: ConfigConexionDestino): PuertoDestino {
  switch (conexion.tipo) {
    case "impala": {
      const opts = conexion.config as Partial<OpcionesImpala>;
      const cliente = new ClienteImpalaDirecto({
        host: opts.host ?? "",
        port: opts.port,
        authMechanism: opts.authMechanism,
        user: opts.user,
        password: opts.password,
        database: opts.database,
      });
      return new ImpalaHaciaDestino(cliente);
    }
    case "postgres": {
      const opts = conexion.config as Partial<OpcionesPostgres>;
      return new ClientePostgres({
        host: opts.host ?? "",
        port: opts.port,
        database: opts.database ?? "",
        user: opts.user ?? "",
        password: opts.password ?? "",
        ssl: opts.ssl,
      });
    }
    case "bigquery": {
      const opts = conexion.config as Partial<OpcionesBigQuery>;
      return new ClienteBigQuery({
        projectId: opts.projectId ?? "",
        dataset: opts.dataset ?? "",
        keyFilename: opts.keyFilename,
      });
    }
    case "sftp": {
      const opts = conexion.config as Partial<OpcionesSftp>;
      return new ClienteSftp({
        host: opts.host ?? "",
        port: opts.port,
        user: opts.user ?? "",
        password: opts.password,
        privateKey: opts.privateKey,
        rutaBase: opts.rutaBase,
      });
    }
  }
}
