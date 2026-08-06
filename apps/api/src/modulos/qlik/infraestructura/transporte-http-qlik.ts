import type {
  RespuestaCrudaQlik,
  SolicitudQlik,
} from "../aplicacion/puertos/puerto-qlik.js";
import { ErrorApiQlik } from "./error-api-qlik.js";

export class TransporteHttpQlik {
  private readonly origen: string;

  constructor(
    host: string,
    private readonly tokenAcceso: string,
    private readonly fetchFn: typeof fetch = fetch,
  ) {
    this.origen = normalizarOrigenQlik(host);
  }

  async solicitarCrudo(solicitud: SolicitudQlik): Promise<RespuestaCrudaQlik> {
    const url = construirUrl(this.origen, solicitud);
    const tieneCuerpo = solicitud.cuerpo !== undefined;
    const respuesta = await this.fetchFn(url, {
      method: solicitud.metodo,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.tokenAcceso}`,
        ...(tieneCuerpo ? { "Content-Type": "application/json" } : {}),
        ...solicitud.encabezados,
      },
      body: tieneCuerpo ? JSON.stringify(solicitud.cuerpo) : undefined,
    });

    if (!respuesta.ok) {
      throw await construirErrorQlik(respuesta, url);
    }

    return {
      estado: respuesta.status,
      estadoTexto: respuesta.statusText,
      encabezados: respuesta.headers,
      cuerpo: respuesta.body,
    };
  }

  async solicitarJson<T>(solicitud: SolicitudQlik): Promise<T> {
    const respuesta = await this.solicitarCrudo(solicitud);
    if (respuesta.estado === 204 || !respuesta.cuerpo) return undefined as T;
    return new Response(respuesta.cuerpo, {
      status: respuesta.estado,
      headers: respuesta.encabezados,
    }).json() as Promise<T>;
  }
}

function normalizarOrigenQlik(host: string): string {
  const conProtocolo = /^https?:\/\//i.test(host) ? host : `https://${host}`;
  const url = new URL(conProtocolo);
  if (url.protocol !== "https:") {
    throw new Error("El host de Qlik debe usar HTTPS");
  }
  if (url.pathname !== "/" || url.search || url.hash) {
    throw new Error(
      "El host de Qlik no puede incluir ruta, query ni fragmento",
    );
  }
  return url.origin;
}

function construirUrl(origen: string, solicitud: SolicitudQlik): URL {
  if (!solicitud.ruta.startsWith("/api/")) {
    throw new Error("La ruta de Qlik debe comenzar con /api/");
  }
  const url = new URL(solicitud.ruta, origen);
  if (solicitud.consulta instanceof URLSearchParams) {
    url.search = solicitud.consulta.toString();
  } else if (solicitud.consulta) {
    for (const [clave, valor] of Object.entries(solicitud.consulta)) {
      if (valor !== undefined) url.searchParams.set(clave, String(valor));
    }
  }
  return url;
}

async function construirErrorQlik(
  respuesta: Response,
  url: URL,
): Promise<ErrorApiQlik> {
  const cuerpo = await leerCuerpoError(respuesta);
  const trazaId =
    respuesta.headers.get("x-qlik-trace-id") ??
    (cuerpo && typeof cuerpo === "object"
      ? String((cuerpo as Record<string, unknown>).traceId ?? "") || undefined
      : undefined);

  return new ErrorApiQlik(
    respuesta.status,
    respuesta.statusText,
    `${url.pathname}${url.search}`,
    cuerpo,
    trazaId,
  );
}

async function leerCuerpoError(respuesta: Response): Promise<unknown> {
  const tipo = respuesta.headers.get("content-type") ?? "";
  if (tipo.includes("application/json")) {
    return respuesta.json().catch(() => undefined);
  }
  const texto = await respuesta.text().catch(() => "");
  return texto ? { detail: texto.slice(0, 4000) } : undefined;
}
