import type {
  AutomatizacionQlik,
  EjecucionQlik,
  EspacioQlik,
  FlujoQlik,
} from "./tipos.js";

export class ClienteQlik {
  private host: string;
  private accessToken: string;

  constructor(host: string, accessToken: string) {
    this.host = host;
    this.accessToken = accessToken;
  }

  private async request<T>(
    endpoint: string,
    opciones: RequestInit = {},
  ): Promise<T> {
    const url = `https://${this.host}${endpoint}`;
    const response = await fetch(url, {
      ...opciones,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
        ...opciones.headers,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Qlik API error: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }

  async listarEspacios(): Promise<EspacioQlik[]> {
    const data = await this.request<{ data: EspacioQlik[] }>("/api/v1/spaces");
    return data.data;
  }

  async listarFlujos(espacioId?: string): Promise<FlujoQlik[]> {
    const params = espacioId ? `?spaceId=${espacioId}` : "";
    const data = await this.request<{ data: FlujoQlik[] }>(
      `/api/v1/dataflows${params}`,
    );
    return data.data;
  }

  async listarAutomatizaciones(
    opciones: { spaceId?: string; ownerId?: string; name?: string } = {},
  ): Promise<AutomatizacionQlik[]> {
    const params = new URLSearchParams();
    if (opciones.spaceId) params.set("spaceId", opciones.spaceId);
    if (opciones.ownerId) params.set("ownerId", opciones.ownerId);
    if (opciones.name) params.set("name", opciones.name);

    const query = params.toString() ? `?${params.toString()}` : "";
    const data = await this.request<{ data: AutomatizacionQlik[] }>(
      `/api/workflows/automations${query}`,
    );
    return data.data;
  }

  async obtenerAutomatizacion(id: string): Promise<AutomatizacionQlik> {
    const data = await this.request<{ data: AutomatizacionQlik }>(
      `/api/workflows/automations/${id}`,
    );
    return data.data;
  }

  async listarEjecuciones(
    automatizacionId: string,
    opciones: { limit?: number } = {},
  ): Promise<EjecucionQlik[]> {
    const limit = opciones.limit ?? 10;
    const data = await this.request<{ data: EjecucionQlik[] }>(
      `/api/workflows/automations/${automatizacionId}/runs?limit=${limit}`,
    );
    return data.data;
  }

  async crearAutomatizacion(
    nombre: string,
    espacioId: string,
    flujoId: string,
  ): Promise<{ id: string }> {
    const data = await this.request<{ data: { id: string } }>(
      "/api/workflows/automations",
      {
        method: "POST",
        body: JSON.stringify({
          name: nombre,
          spaceId: espacioId,
          trigger: { type: "manual" },
          actions: [{ type: "executeDataFlow", dataFlowId: flujoId }],
        }),
      },
    );
    return data.data;
  }

  async ejecutarAutomatizacion(id: string): Promise<{ runId: string }> {
    const data = await this.request<{ data: { runId: string } }>(
      `/api/workflows/automations/${id}/runs`,
      { method: "POST" },
    );
    return data.data;
  }
}
