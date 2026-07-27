import type {
  PuertoQlik,
  RespuestaCrudaQlik,
  ServicioQlik,
  SolicitudQlik,
} from "../aplicacion/puertos/puerto-qlik.js";
import type {
  AutomatizacionQlik,
  EjecucionQlik,
  EspacioQlik,
  FlujoQlik,
  UsuarioQlik,
} from "../dominio/modelos-qlik.js";
import { ErrorApiQlik } from "./error-api-qlik.js";

interface ListaQlik<T> {
  data?: T[];
  links?: Record<string, unknown>;
}

const esListaQlik = <T>(valor: unknown): valor is ListaQlik<T> =>
  !!valor &&
  typeof valor === "object" &&
  Array.isArray((valor as ListaQlik<T>).data);

export class ClienteHttpQlik implements ServicioQlik {
  private readonly origen: string;

  constructor(
    host: string,
    private readonly tokenAcceso: string,
    private readonly fetchFn: typeof fetch = fetch,
  ) {
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
    this.origen = url.origin;
  }

  async solicitarCrudo(solicitud: SolicitudQlik): Promise<RespuestaCrudaQlik> {
    if (!solicitud.ruta.startsWith("/api/")) {
      throw new Error("La ruta de Qlik debe comenzar con /api/");
    }

    const url = new URL(solicitud.ruta, this.origen);
    if (solicitud.consulta instanceof URLSearchParams) {
      url.search = solicitud.consulta.toString();
    } else if (solicitud.consulta) {
      for (const [clave, valor] of Object.entries(solicitud.consulta)) {
        if (valor !== undefined) url.searchParams.set(clave, String(valor));
      }
    }

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
      const cuerpo = await leerCuerpoError(respuesta);
      throw new ErrorApiQlik(
        respuesta.status,
        respuesta.statusText,
        `${url.pathname}${url.search}`,
        cuerpo,
        respuesta.headers.get("x-qlik-trace-id") ??
          (cuerpo && typeof cuerpo === "object"
            ? String((cuerpo as Record<string, unknown>).traceId ?? "") ||
              undefined
            : undefined),
      );
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

  async listarEspacios(
    consulta: Record<string, string | number | boolean | undefined> = {},
  ) {
    const respuesta = await this.solicitarJson<ListaQlik<EspacioQlik>>({
      metodo: "GET",
      ruta: "/api/v1/spaces",
      consulta,
    });
    return respuesta.data ?? [];
  }

  obtenerEspacio(id: string) {
    return this.solicitarJson<EspacioQlik>({
      metodo: "GET",
      ruta: `/api/v1/spaces/${encodeURIComponent(id)}`,
    });
  }

  obtenerUsuario(id: string, campos?: string) {
    return this.solicitarJson<UsuarioQlik>({
      metodo: "GET",
      ruta: `/api/v1/users/${encodeURIComponent(id)}`,
      consulta: campos ? { fields: campos } : undefined,
    });
  }

  async listarAutomatizaciones(
    consulta: Record<string, string | number | boolean | undefined> = {},
  ) {
    const respuesta = await this.solicitarJson<ListaQlik<AutomatizacionQlik>>({
      metodo: "GET",
      ruta: "/api/workflows/automations",
      consulta,
    });
    return respuesta.data ?? [];
  }

  obtenerAutomatizacion(id: string) {
    return this.solicitarJson<AutomatizacionQlik>({
      metodo: "GET",
      ruta: `/api/workflows/automations/${encodeURIComponent(id)}`,
    });
  }

  actualizarAutomatizacion(
    id: string,
    definicion: {
      name?: string;
      schedules?: Array<Record<string, unknown>>;
      workspace?: Record<string, unknown>;
      description?: string;
      maxConcurrentRuns?: number;
    },
  ) {
    return this.solicitarJson<AutomatizacionQlik>({
      metodo: "PUT",
      ruta: `/api/workflows/automations/${encodeURIComponent(id)}`,
      cuerpo: definicion,
    });
  }

  async eliminarAutomatizacion(id: string): Promise<void> {
    await this.solicitarJson<void>({
      metodo: "DELETE",
      ruta: `/api/workflows/automations/${encodeURIComponent(id)}`,
    });
  }

  async listarEjecuciones(
    automatizacionId: string,
    opciones: { limit?: number; sort?: "asc" | "desc" } = {},
  ) {
    const respuesta = await this.solicitarJson<ListaQlik<EjecucionQlik>>({
      metodo: "GET",
      ruta: `/api/workflows/automations/${encodeURIComponent(automatizacionId)}/runs`,
      consulta: {
        limit: opciones.limit ?? 10,
        sort: opciones.sort === "asc" ? "+startTime" : "-startTime",
      },
    });
    return respuesta.data ?? [];
  }

  async ejecutarAutomatizacion(id: string): Promise<{ runId: string }> {
    const ejecucion = await this.solicitarJson<EjecucionQlik>({
      metodo: "POST",
      ruta: `/api/workflows/automations/${encodeURIComponent(id)}/runs`,
      cuerpo: { context: "api" },
    });
    return { runId: ejecucion.id };
  }

  async detenerEjecucion(
    automatizacionId: string,
    runId: string,
  ): Promise<void> {
    await this.solicitarJson<void>({
      metodo: "POST",
      ruta: `/api/workflows/automations/${encodeURIComponent(automatizacionId)}/runs/${encodeURIComponent(runId)}/actions/stop`,
    });
  }

  async copiarAutomatizacion(
    id: string,
    nombre: string,
  ): Promise<{ id: string }> {
    return this.solicitarJson<{ id: string }>({
      metodo: "POST",
      ruta: `/api/workflows/automations/${encodeURIComponent(id)}/actions/copy`,
      cuerpo: { name: nombre },
    });
  }

  async cambiarEspacioAutomatizacion(
    id: string,
    espacioId: string,
  ): Promise<void> {
    await this.solicitarJson<void>({
      metodo: "POST",
      ruta: `/api/workflows/automations/${encodeURIComponent(id)}/actions/change-space`,
      cuerpo: { spaceId: espacioId },
    });
  }

  async cambiarPropietarioAutomatizacion(
    id: string,
    usuarioId: string,
  ): Promise<void> {
    await this.solicitarJson<void>({
      metodo: "POST",
      ruta: `/api/workflows/automations/${encodeURIComponent(id)}/actions/change-owner`,
      cuerpo: { userId: usuarioId },
    });
  }

  async listarFlujos(espacioId?: string): Promise<FlujoQlik[]> {
    const consulta: Record<string, string | number | boolean | undefined> = {
      resourceType: "app",
      limit: 100,
    };
    if (espacioId) consulta.spaceId = espacioId;
    const respuesta = await this.solicitarJson<unknown>({
      metodo: "GET",
      ruta: "/api/v1/items",
      consulta,
    });
    if (
      respuesta &&
      typeof respuesta === "object" &&
      "data" in respuesta &&
      Array.isArray((respuesta as Record<string, unknown>).data)
    ) {
      const items = (respuesta as { data: Array<Record<string, unknown>> })
        .data;
      return items
        .filter(
          (item) =>
            item.resourceSubType === "qix-df" ||
            (item.resourceCustomAttributes as Record<string, unknown>)
              ?.usage === "DATAFLOW_PREP" ||
            (item.resourceAttributes as Record<string, unknown>)?.usage ===
              "DATAFLOW_PREP",
        )
        .map((item) => ({
          id: String(item.resourceId ?? item.id),
          name: String(item.name ?? ""),
          spaceId: item.spaceId ? String(item.spaceId) : undefined,
          ownerId: item.ownerId ? String(item.ownerId) : undefined,
          createdAt: item.resourceCreatedAt
            ? String(item.resourceCreatedAt)
            : undefined,
          updatedAt: item.resourceUpdatedAt
            ? String(item.resourceUpdatedAt)
            : undefined,
        }));
    }
    return [];
  }

  obtenerScriptApp(
    appId: string,
    scriptId: string = "current",
  ): Promise<{ script: string; versionMessage?: string }> {
    return this.solicitarJson<{ script: string; versionMessage?: string }>({
      metodo: "GET",
      ruta: `/api/v1/apps/${encodeURIComponent(appId)}/scripts/${encodeURIComponent(scriptId)}`,
    });
  }
}

async function leerCuerpoError(respuesta: Response): Promise<unknown> {
  const tipo = respuesta.headers.get("content-type") ?? "";
  if (tipo.includes("application/json")) {
    return respuesta.json().catch(() => undefined);
  }
  const texto = await respuesta.text().catch(() => "");
  return texto ? { detail: texto.slice(0, 4000) } : undefined;
}
