import postgres from "postgres";
import type { PuertoDestino } from "../aplicacion/puertos/puerto-destino.js";
import type {
  CapacidadesDestino,
  DetalleRecursoDestino,
  RecursoDestino,
} from "../dominio/tipos-destino.js";

export interface OpcionesPostgres {
  host: string;
  port?: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean;
}

export class ClientePostgres implements PuertoDestino {
  readonly tipo = "postgres" as const;
  private readonly sql;

  constructor(opciones: OpcionesPostgres) {
    if (!opciones.host.trim()) throw new Error("El host de PostgreSQL es obligatorio");
    if (!opciones.database.trim()) throw new Error("La base de datos de PostgreSQL es obligatoria");
    if (!opciones.user.trim()) throw new Error("El usuario de PostgreSQL es obligatorio");

    this.sql = postgres({
      host: opciones.host.trim(),
      port: opciones.port ?? 5432,
      database: opciones.database.trim(),
      username: opciones.user.trim(),
      password: opciones.password,
      ssl: opciones.ssl ? "require" : false,
      max: 4,
    });
  }

  obtenerCapacidades(): CapacidadesDestino {
    return {
      listarRecursos: true,
      esquema: true,
      conteoRegistros: true,
      vistaPrevia: true,
      escritura: true,
    };
  }

  async listarRecursos(): Promise<RecursoDestino[]> {
    const filas = await this.sql<{ schema_name: string; table_name: string }[]>`
      SELECT table_schema AS schema_name, table_name
      FROM information_schema.tables
      WHERE table_type = 'BASE TABLE'
        AND table_schema NOT IN ('pg_catalog', 'information_schema')
      ORDER BY table_schema, table_name
    `;

    return filas.map((fila) => ({
      id: `${fila.schema_name}.${fila.table_name}`,
      nombre: fila.table_name,
      tipo: "tabla",
      espacioDeNombres: fila.schema_name,
      metadatos: {},
    }));
  }

  async obtenerRecurso(id: string): Promise<DetalleRecursoDestino> {
    const [schema, tabla] = id.split(".");
    if (!schema || !tabla || id.split(".").length !== 2) {
      throw new Error("El identificador de PostgreSQL debe tener formato esquema.tabla");
    }

    const columnas = await this.sql<{ column_name: string; data_type: string }[]>`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = ${schema} AND table_name = ${tabla}
      ORDER BY ordinal_position
    `;
    const [conteo] = await this.sql.unsafe(
      `SELECT COUNT(*)::bigint AS total FROM ${identificador(schema)}.${identificador(tabla)}`,
    );

    return {
      id,
      nombre: tabla,
      tipo: "tabla",
      espacioDeNombres: schema,
      columnas: columnas.map((columna) => ({
        nombre: columna.column_name,
        tipo: columna.data_type,
      })),
      totalFilas: Number(conteo?.total ?? 0),
      actualizadoEn: new Date().toISOString(),
      metadatos: {},
    };
  }
}

function identificador(valor: string): string {
  if (!/^[A-Za-z_][A-Za-z0-9_$]*$/.test(valor)) {
    throw new Error("Identificador PostgreSQL inválido");
  }
  return `"${valor.replaceAll('"', '""')}"`;
}
