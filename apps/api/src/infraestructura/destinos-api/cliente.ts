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

export class ClienteDestinos {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
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
