import { BigQuery } from "@google-cloud/bigquery";
import type { PuertoDestino } from "../aplicacion/puertos/puerto-destino.js";
import type {
  CapacidadesDestino,
  DetalleRecursoDestino,
  RecursoDestino,
} from "../dominio/tipos-destino.js";

export interface OpcionesBigQuery {
  projectId: string;
  dataset: string;
  keyFilename?: string;
}

export class ClienteBigQuery implements PuertoDestino {
  readonly tipo = "bigquery" as const;
  private readonly cliente: BigQuery;
  private readonly dataset: string;

  constructor(opciones: OpcionesBigQuery) {
    if (!opciones.projectId.trim())
      throw new Error("El proyecto de BigQuery es obligatorio");
    if (!opciones.dataset.trim())
      throw new Error("El dataset de BigQuery es obligatorio");
    this.cliente = new BigQuery({
      projectId: opciones.projectId.trim(),
      ...(opciones.keyFilename ? { keyFilename: opciones.keyFilename } : {}),
    });
    this.dataset = opciones.dataset.trim();
  }

  async probar(): Promise<void> {
    await this.cliente.query({ query: "SELECT 1 AS ok", useLegacySql: false });
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
    const [tablas] = await this.cliente.dataset(this.dataset).getTables();
    return tablas.map((tabla) => ({
      id: tabla.id ?? "",
      nombre: tabla.id ?? "",
      tipo: "tabla",
      espacioDeNombres: this.dataset,
      metadatos: {},
    }));
  }

  async obtenerRecurso(id: string): Promise<DetalleRecursoDestino> {
    const [metadata] = await this.cliente
      .dataset(this.dataset)
      .table(id)
      .getMetadata();
    const columnas = (metadata.schema?.fields ?? []).map(
      (campo: { name?: string; type?: string }) => ({
        nombre: campo.name ?? "",
        tipo: campo.type ?? "",
      }),
    );
    const [filas] = await this.cliente.query({
      query: `SELECT COUNT(*) AS total FROM \`${this.cliente.projectId}.${this.dataset}.${id}\``,
      useLegacySql: false,
    });

    return {
      id,
      nombre: id,
      tipo: "tabla",
      espacioDeNombres: this.dataset,
      columnas,
      totalFilas: Number(filas[0]?.total ?? 0),
      actualizadoEn: new Date().toISOString(),
      metadatos: {},
    };
  }
}
