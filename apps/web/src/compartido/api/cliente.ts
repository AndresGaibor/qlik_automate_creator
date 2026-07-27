import type { RespuestaApi } from "@qlik/contratos/comun";

interface ConfiguracionSolicitud extends RequestInit {
  parametros?: Record<string, string | number | boolean | undefined>;
}

export class ErrorClienteApi extends Error {
  constructor(
    mensaje: string,
    public readonly estado: number,
    public readonly codigo?: string,
    public readonly detalles?: unknown,
  ) {
    super(mensaje);
    this.name = "ErrorClienteApi";
  }
}

export class ClienteApi {
  private _onUnauthorized?: () => void;

  constructor(private readonly baseUrl = "/api") {}

  set onUnauthorized(fn: (() => void) | undefined) {
    this._onUnauthorized = fn;
  }

  get<T>(ruta: string, configuracion?: ConfiguracionSolicitud): Promise<T> {
    return this.solicitar<T>(ruta, { ...configuracion, method: "GET" });
  }

  post<T>(
    ruta: string,
    datos?: unknown,
    configuracion?: ConfiguracionSolicitud,
  ): Promise<T> {
    return this.solicitar<T>(ruta, {
      ...configuracion,
      method: "POST",
      body: datos === undefined ? undefined : JSON.stringify(datos),
    });
  }

  put<T>(
    ruta: string,
    datos?: unknown,
    configuracion?: ConfiguracionSolicitud,
  ): Promise<T> {
    return this.solicitar<T>(ruta, {
      ...configuracion,
      method: "PUT",
      body: datos === undefined ? undefined : JSON.stringify(datos),
    });
  }

  patch<T>(
    ruta: string,
    datos?: unknown,
    configuracion?: ConfiguracionSolicitud,
  ): Promise<T> {
    return this.solicitar<T>(ruta, {
      ...configuracion,
      method: "PATCH",
      body: datos === undefined ? undefined : JSON.stringify(datos),
    });
  }

  delete<T>(ruta: string, configuracion?: ConfiguracionSolicitud): Promise<T> {
    return this.solicitar<T>(ruta, { ...configuracion, method: "DELETE" });
  }

  private async solicitar<T>(
    ruta: string,
    configuracion: ConfiguracionSolicitud,
  ): Promise<T> {
    const { parametros = {}, ...opcionesFetch } = configuracion;
    const origen = globalThis.location?.origin ?? "http://localhost";
    const url = new URL(`${this.baseUrl}${ruta}`, origen);
    for (const [clave, valor] of Object.entries(parametros)) {
      if (valor !== undefined) url.searchParams.set(clave, String(valor));
    }

    const respuesta = await fetch(url, {
      ...opcionesFetch,
      credentials: "include",
      headers: {
        Accept: "application/json",
        ...(opcionesFetch.body ? { "Content-Type": "application/json" } : {}),
        ...opcionesFetch.headers,
      },
    });

    const contenido = await leerRespuesta<T>(respuesta);
    if (!respuesta.ok || !contenido.exito) {
      const error = contenido.exito
        ? { mensaje: `HTTP ${respuesta.status}` }
        : contenido.error;
      if (respuesta.status === 401) {
        this._onUnauthorized?.();
      }
      throw new ErrorClienteApi(
        error.mensaje,
        respuesta.status,
        error.codigo,
        error.detalles,
      );
    }
    return contenido.datos;
  }
}

async function leerRespuesta<T>(respuesta: Response): Promise<RespuestaApi<T>> {
  try {
    return (await respuesta.json()) as RespuestaApi<T>;
  } catch {
    throw new ErrorClienteApi(
      `El servidor devolvió una respuesta inválida (${respuesta.status})`,
      respuesta.status,
    );
  }
}

export const clienteApi = new ClienteApi();
