import type { ConfiguracionImpalaNormalizada } from "./configuracion-impala.js";
import {
  extraerColumna0Hive,
  extraerFilasHive,
} from "./modelo-resultados-hive.js";

// hive-driver implementa el protocolo Thrift HiveServer2 usado por Impala.
const hive = require("hive-driver") as typeof import("hive-driver");
const { TCLIService, TCLIService_types } = hive.thrift;
const FETCH_NEXT = 1;

export interface EjecutorConsultasImpala {
  ejecutarFilas(sql: string): Promise<string[][]>;
  ejecutarColumna(sql: string): Promise<string[]>;
}

export function crearEjecutorHiveImpala(
  configuracion: ConfiguracionImpalaNormalizada,
): EjecutorConsultasImpala {
  return new EjecutorHiveImpala(configuracion);
}

class EjecutorHiveImpala implements EjecutorConsultasImpala {
  constructor(private readonly configuracion: ConfiguracionImpalaNormalizada) {}

  async ejecutarFilas(sql: string): Promise<string[][]> {
    return extraerFilasHive(await this.obtenerDatos(sql));
  }

  async ejecutarColumna(sql: string): Promise<string[]> {
    return extraerColumna0Hive(await this.obtenerDatos(sql));
  }

  private crearAutenticacion() {
    const { authMechanism, user, password } = this.configuracion;
    if (
      (authMechanism === "PLAIN" || authMechanism === "LDAP") &&
      user &&
      password
    ) {
      return new hive.auth.PlainTcpAuthentication({
        username: user,
        password,
      });
    }
    return new hive.auth.NoSaslAuthentication();
  }

  private async obtenerDatos(sql: string): Promise<unknown[]> {
    const cliente = new hive.HiveClient(TCLIService, TCLIService_types);
    const conexion = await cliente.connect(
      { host: this.configuracion.host, port: this.configuracion.port },
      new hive.connections.TcpConnection(),
      this.crearAutenticacion(),
    );
    const sesion = await conexion.openSession({
      client_protocol:
        TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V10,
    });
    try {
      const utilidades = new hive.HiveUtils(TCLIService_types);
      const operacion = await sesion.executeStatement(sql, {
        runAsync: false,
        queryTimeout: 30 as unknown as Buffer,
      });
      await utilidades.waitUntilReady(operacion, false, () => {});
      operacion.setMaxRows(10_000);
      await operacion.fetch(FETCH_NEXT);
      const datos = operacion.getData();
      await operacion.close();
      return datos;
    } finally {
      await sesion.close().catch(() => {});
    }
  }
}
