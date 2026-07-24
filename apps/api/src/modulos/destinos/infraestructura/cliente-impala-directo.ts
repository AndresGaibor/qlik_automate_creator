import type { PuertoCatalogoDestinos } from "../aplicacion/puertos/puerto-catalogo-destinos.js";
import type {
  EsquemaTablaDestino,
  FlujoDatosDestino,
} from "../dominio/modelos.js";

// hive-driver implementa el protocolo Thrift HiveServer2 que usa Impala en el puerto 21050
// eslint-disable-next-line @typescript-eslint/no-require-imports
const hive = require("hive-driver") as typeof import("hive-driver");
const { TCLIService, TCLIService_types } = hive.thrift;

// Impala usa FETCH_NEXT en la primera llamada; no soporta FETCH_FIRST sin result cache.
const FETCH_NEXT = 1;

export interface OpcionesImpala {
  host: string;
  port?: number;
  authMechanism?: string;
  user?: string;
  password?: string;
  database?: string;
}

export class ClienteImpalaDirecto implements PuertoCatalogoDestinos {
  private readonly host: string;
  private readonly port: number;
  private readonly authMechanism: string;
  private readonly user?: string;
  private readonly password?: string;
  readonly defaultDatabase: string;

  constructor(opciones: OpcionesImpala) {
    if (!opciones.host?.trim()) {
      throw new Error("El host de Impala no puede estar vacío");
    }
    this.host = opciones.host.trim();
    this.port = opciones.port ?? 21050;
    this.authMechanism = opciones.authMechanism ?? "NOSASL";
    this.user = opciones.user ?? undefined;
    this.password = opciones.password ?? undefined;
    this.defaultDatabase = opciones.database?.trim() || "default";
  }

  // ── Autenticación ─────────────────────────────────────────────────────────
  private crearAuth() {
    const mecanismo = this.authMechanism.toUpperCase();
    if (
      (mecanismo === "PLAIN" || mecanismo === "LDAP") &&
      this.user &&
      this.password
    ) {
      return new hive.auth.PlainTcpAuthentication({
        username: this.user,
        password: this.password,
      });
    }
    return new hive.auth.NoSaslAuthentication();
  }

  // ── Extraer columna 0 del resultado columnar de HiveServer2 ───────────────
  private extraerColumna0(data: unknown[]): string[] {
    if (!data || data.length === 0) return [];
    const rowSet = data[0] as {
      columns?: {
        stringVal?: { values?: string[]; nulls?: Buffer | Uint8Array | string | null };
      }[];
      rows?: { colVals?: { stringVal?: { value?: string } }[] }[];
    };

    if (rowSet.columns && rowSet.columns.length > 0) {
      const col = rowSet.columns[0];
      const valores: string[] = col.stringVal?.values ?? [];

      // nulls puede llegar como Buffer, Uint8Array o string según el runtime
      const rawNulls = col.stringVal?.nulls;
      let nullBytes: Uint8Array;
      if (!rawNulls) {
        nullBytes = new Uint8Array(0);
      } else if (rawNulls instanceof Uint8Array) {
        nullBytes = rawNulls;
      } else if (Buffer.isBuffer(rawNulls)) {
        nullBytes = new Uint8Array(rawNulls);
      } else {
        // string — convertir char por char
        nullBytes = new Uint8Array(rawNulls.length);
        for (let i = 0; i < rawNulls.length; i++) {
          nullBytes[i] = rawNulls.charCodeAt(i);
        }
      }

      return valores.filter((_, i) => {
        const byte = nullBytes[Math.floor(i / 8)] ?? 0;
        return !(byte & (1 << i % 8));
      });
    }

    // Formato row-based (fallback)
    return (
      rowSet.rows
        ?.map((r) => r.colVals?.[0]?.stringVal?.value ?? "")
        .filter(Boolean) ?? []
    );
  }


  // ── Ejecutar consulta SQL vía Thrift HiveServer2 ──────────────────────────
  private async ejecutarConsulta(sql: string): Promise<string[]> {
    const client = new hive.HiveClient(TCLIService, TCLIService_types);
    const conexion = await client.connect(
      { host: this.host, port: this.port },
      new hive.connections.TcpConnection(),
      this.crearAuth(),
    );
    const session = await conexion.openSession({
      client_protocol:
        TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V10,
    });
    try {
      const utils = new hive.HiveUtils(TCLIService_types);
      const op = await session.executeStatement(sql, {
        runAsync: false,
        queryTimeout: 30 as unknown as Buffer,
      });
      await utils.waitUntilReady(op, false, () => {});

      // Impala no soporta FETCH_FIRST sin result-cache, usar FETCH_NEXT directamente
      op.setMaxRows(10_000);
      await op.fetch(FETCH_NEXT);
      const data = op.getData();
      await op.close();
      return this.extraerColumna0(data);
    } finally {
      await session.close().catch(() => {});
    }
  }

  // ── PuertoCatalogoDestinos ─────────────────────────────────────────────────

  async listarBasesDatos(): Promise<string[]> {
    return this.ejecutarConsulta("SHOW DATABASES");
  }

  async listarTablas(baseDatos: string): Promise<string[]> {
    const bd = baseDatos.trim() || this.defaultDatabase;
    return this.ejecutarConsulta(`SHOW TABLES IN \`${bd}\``);
  }

  async obtenerEsquemaTabla(
    baseDatos: string,
    tabla: string,
  ): Promise<EsquemaTablaDestino> {
    const bd = baseDatos.trim() || this.defaultDatabase;
    const tb = tabla.trim();
    try {
      const filas = await this.ejecutarConsulta(
        `DESCRIBE \`${bd}\`.\`${tb}\``,
      );
      // DESCRIBE devuelve "nombre\ttipo\tcomentario"
      const columnas = filas
        .map((linea) => {
          const partes = linea.split("\t");
          return { nombre: partes[0]?.trim() ?? "", tipo: partes[1]?.trim() ?? "" };
        })
        .filter((c) => c.nombre && c.tipo);
      return {
        baseDatos: bd,
        tabla: tb,
        columnas,
        especificacionEsquema: columnas.map((c) => `${c.nombre}:${c.tipo}`).join("|"),
      };
    } catch {
      return { baseDatos: bd, tabla: tb, columnas: [], especificacionEsquema: "" };
    }
  }

  async listarFlujosDatos(): Promise<FlujoDatosDestino[]> {
    return [];
  }

  async obtenerFlujoDatos(id: string): Promise<FlujoDatosDestino> {
    return { id, nombre: `Flujo ${id}` };
  }
}
