import type {
  AutomatizacionQlik,
  EjecucionQlik,
  EspacioQlik,
  FlujoQlik,
  UsuarioQlik,
} from "./tipos.js";

/**
 * Error que preserva el status code HTTP de la respuesta de Qlik,
 * para que las rutas puedan mapear a un status HTTP adecuado.
 */
export class QlikApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly statusText: string,
    public readonly endpoint: string,
  ) {
    super(`Qlik API error: ${statusCode} ${statusText} (${endpoint})`);
    this.name = "QlikApiError";
  }
}

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
      throw new QlikApiError(response.status, response.statusText, endpoint);
    }

    if (response.status === 204) {
      return undefined as T;
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
      `/api/v1/di-projects${params}`,
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
    opciones: { limit?: number; sort?: "asc" | "desc" } = {},
  ): Promise<EjecucionQlik[]> {
    const limit = opciones.limit ?? 10;
    const sortDir = opciones.sort ?? "desc";
    // El cliente Qlik real usa `-startTime` para descendente y `startTime` para ascendente.
    const sortParam = sortDir === "desc" ? "-startTime" : "startTime";
    const data = await this.request<{ data: EjecucionQlik[] }>(
      `/api/workflows/automations/${automatizacionId}/runs?limit=${limit}&sort=${sortParam}`,
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

  async detenerEjecucion(
    automatizacionId: string,
    runId: string,
  ): Promise<void> {
    await this.request<unknown>(
      `/api/workflows/automations/${automatizacionId}/runs/${runId}/actions/stop`,
      { method: "POST" },
    );
  }

  async obtenerEspacio(id: string): Promise<EspacioQlik> {
    const data = await this.request<{ data: EspacioQlik }>(
      `/api/v1/spaces/${id}`,
    );
    return data.data;
  }

  async obtenerUsuario(id: string): Promise<UsuarioQlik> {
    const data = await this.request<{ data: UsuarioQlik }>(
      `/api/v1/users/${id}`,
    );
    return data.data;
  }
}
