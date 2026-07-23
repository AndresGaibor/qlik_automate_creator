import { z } from "zod";

const DataflowRecordSchema = z.object({
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

export type DataflowRecord = z.infer<typeof DataflowRecordSchema>;

function validarConfiguracionDestinos(
  baseUrl: string,
  apiKey: string,
): { url: string; key: string } {
  const url = baseUrl.trim();
  const key = apiKey.trim();

  if (!url) {
    throw new Error(
      "REMOTE_API_URL no puede estar vacío. Configura la URL base de la API de destinos.",
    );
  }

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    throw new Error(
      `REMOTE_API_URL debe ser una URL válida que comience con http:// o https://. Valor recibido: "${url}"`,
    );
  }

  if (!key) {
    throw new Error(
      "REMOTE_API_KEY no puede estar vacío. Configura la clave de API para la API de destinos.",
    );
  }

  return { url, key };
}

export class ClienteDestinos {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    const config = validarConfiguracionDestinos(baseUrl, apiKey);
    this.baseUrl = config.url;
    this.apiKey = config.key;
  }

  private async request<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        "X-API-Key": this.apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Destinos API error: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    return data.data ?? data;
  }

  async listarDatabases(): Promise<string[]> {
    const response = await this.request<{ name: string }[]>(
      "/api/v1/impala/databases",
    );
    return response.map((db) => db.name);
  }

  async listarTablas(database: string): Promise<string[]> {
    const response = await this.request<{ name: string }[]>(
      `/api/v1/impala/databases/${database}/tables`,
    );
    return response.map((t) => t.name);
  }

  async listarColumnas(
    database: string,
    table: string,
  ): Promise<{
    database: string;
    table: string;
    columns: { name: string; type: string }[];
    schemaSpec: string;
  }> {
    return this.request(
      `/api/v1/impala/databases/${database}/tables/${table}/columns`,
    );
  }

  async listarDataflows(): Promise<DataflowRecord[]> {
    const response = await this.request<DataflowRecord[]>("/api/v1/dataflows");
    return z.array(DataflowRecordSchema).parse(response);
  }

  async obtenerDataflow(dataflowId: string): Promise<DataflowRecord> {
    const response = await this.request<DataflowRecord>(
      `/api/v1/dataflows/${dataflowId}`,
    );
    return DataflowRecordSchema.parse(response);
  }
}
