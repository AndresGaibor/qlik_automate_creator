import type { ConfigConexionDestino } from "../aplicacion/puertos/fabrica-destino.js";
import type { PuertoDestino } from "../aplicacion/puertos/puerto-destino.js";
import { ClienteBigQuery } from "./cliente-bigquery.js";
import type { OpcionesBigQuery } from "./cliente-bigquery.js";
import { ClienteImpalaDirecto } from "./cliente-impala-directo.js";
import type { OpcionesImpala } from "./cliente-impala-directo.js";
import { ClientePostgres } from "./cliente-postgres.js";
import type { OpcionesPostgres } from "./cliente-postgres.js";
import { ClienteSftp } from "./cliente-sftp.js";
import type { OpcionesSftp } from "./cliente-sftp.js";
import { ImpalaHaciaDestino } from "./impala-hacia-destino.js";

export function crearClienteDestino(
  conexion: ConfigConexionDestino,
): PuertoDestino {
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
