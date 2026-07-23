interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | undefined>;
}

export class ClienteApi {
  private baseUrl: string;

  constructor(baseUrl = "/api") {
    this.baseUrl = baseUrl;
  }

  private async buildUrl(
    endpoint: string,
    params?: Record<string, string | number | undefined>,
  ): Promise<string> {
    const url = new URL(`${this.baseUrl}${endpoint}`, window.location.origin);

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      }
    }

    return url.toString();
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const url = await this.buildUrl(endpoint, config?.params);
    const res = await fetch(url, {
      ...config,
      method: "GET",
      credentials: "include",
    });
    return this.handleResponse<T>(res);
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      ...config,
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...config?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse<T>(res);
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      ...config,
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...config?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse<T>(res);
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      ...config,
      method: "DELETE",
      credentials: "include",
    });
    return this.handleResponse<T>(res);
  }

  private async handleResponse<T>(res: Response): Promise<T> {
    let json: ApiResponse<T>;
    try {
      json = await res.json();
    } catch {
      throw new Error(`Error en respuesta del servidor (${res.status})`);
    }

    if (!res.ok || !json.success) {
      throw new Error(json.error || `HTTP error ${res.status}`);
    }

    return json.data as T;
  }
}

export const apiCliente = new ClienteApi();
