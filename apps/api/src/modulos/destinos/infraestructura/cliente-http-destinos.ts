import { z } from "zod";
import type { PuertoCatalogoDestinos } from "../aplicacion/puertos/puerto-catalogo-destinos.js";
import type {
  EsquemaTablaDestino,
  FlujoDatosDestino,
} from "../dominio/modelos.js";

const esquemaFlujoRemoto = z.object({
  dataflow_id: z.string(),
  app_id: z.string().optional(),
  dataflow_name: z.string(),
  description: z.string().optional(),
  target_type: z.string().optional(),
  target_id: z.string().optional(),
  target_label: z.string().optional(),
  filename: z.string().optional(),
  extension: z.string().optional(),
  format: z.string().optional(),
  treat_as_relative: z.boolean().optional(),
});

const esquemaTablaRemota = z.object({
  database: z.string(),
  table: z.string(),
  columns: z.array(z.object({ name: z.string(), type: z.string() })),
  schemaSpec: z.string(),
});

export class ClienteDestinos implements PuertoCatalogoDestinos {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(
    baseUrl: string,
    apiKey: string,
    private readonly fetchFn: typeof fetch = fetch,
  ) {
    const url = baseUrl.trim();
    const clave = apiKey.trim();
    if (!url) throw new Error("REMOTE_API_URL no puede estar vacío");
    const origen = new URL(url);
    if (!["http:", "https:"].includes(origen.protocol)) {
      throw new Error("REMOTE_API_URL debe usar HTTP o HTTPS");
    }
    if (!clave) throw new Error("REMOTE_API_KEY no puede estar vacío");
    this.baseUrl = origen.toString().replace(/\/$/, "");
    this.apiKey = clave;
  }

  async listarBasesDatos(): Promise<string[]> {
    const datos = await this.solicitar<Array<{ name: string }>>(
      "/api/v1/impala/databases",
    );
    return datos.map((item) => item.name);
  }

  async listarTablas(baseDatos: string): Promise<string[]> {
    const datos = await this.solicitar<Array<{ name: string }>>(
      `/api/v1/impala/databases/${encodeURIComponent(baseDatos)}/tables`,
    );
    return datos.map((item) => item.name);
  }

  async obtenerEsquemaTabla(
    baseDatos: string,
    tabla: string,
  ): Promise<EsquemaTablaDestino> {
    const remoto = esquemaTablaRemota.parse(
      await this.solicitar(
        `/api/v1/impala/databases/${encodeURIComponent(baseDatos)}/tables/${encodeURIComponent(tabla)}/columns`,
      ),
    );
    return {
      baseDatos: remoto.database,
      tabla: remoto.table,
      columnas: remoto.columns.map((columna) => ({
        nombre: columna.name,
        tipo: columna.type,
      })),
      especificacionEsquema: remoto.schemaSpec,
    };
  }

  async listarFlujosDatos(): Promise<FlujoDatosDestino[]> {
    const remotos = z
      .array(esquemaFlujoRemoto)
      .parse(await this.solicitar("/api/v1/dataflows"));
    return remotos.map(aFlujoDominio);
  }

  async obtenerFlujoDatos(id: string): Promise<FlujoDatosDestino> {
    const remoto = esquemaFlujoRemoto.parse(
      await this.solicitar(`/api/v1/dataflows/${encodeURIComponent(id)}`),
    );
    return aFlujoDominio(remoto);
  }

  private async solicitar<T = unknown>(ruta: string): Promise<T> {
    const respuesta = await this.fetchFn(`${this.baseUrl}${ruta}`, {
      headers: {
        Accept: "application/json",
        "X-API-Key": this.apiKey,
      },
    });
    if (!respuesta.ok) {
      throw new Error(
        `API de destinos respondió ${respuesta.status} ${respuesta.statusText}`,
      );
    }
    const datos = (await respuesta.json()) as T | { data: T };
    return datos && typeof datos === "object" && "data" in datos
      ? (datos as { data: T }).data
      : (datos as T);
  }
}

function aFlujoDominio(
  remoto: z.infer<typeof esquemaFlujoRemoto>,
): FlujoDatosDestino {
  return {
    id: remoto.dataflow_id,
    nombre: remoto.dataflow_name,
    ...(remoto.app_id ? { aplicacionId: remoto.app_id } : {}),
    ...(remoto.description ? { descripcion: remoto.description } : {}),
    ...(remoto.target_type ? { tipoDestino: remoto.target_type } : {}),
    ...(remoto.target_id ? { destinoId: remoto.target_id } : {}),
    ...(remoto.target_label ? { etiquetaDestino: remoto.target_label } : {}),
    ...(remoto.filename ? { nombreArchivo: remoto.filename } : {}),
    ...(remoto.extension ? { extension: remoto.extension } : {}),
    ...(remoto.format ? { formato: remoto.format } : {}),
    ...(remoto.treat_as_relative !== undefined
      ? { tratarComoRelativo: remoto.treat_as_relative }
      : {}),
  };
}
