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
import { mapearItemsAFlujos } from "./mapeador-flujos-qlik.js";
import { TransporteHttpQlik } from "./transporte-http-qlik.js";

interface ListaQlik<T> {
  data?: T[];
  links?: Record<string, unknown>;
}

export class ClienteHttpQlik implements ServicioQlik {
  private readonly transporte: TransporteHttpQlik;

  constructor(
    host: string,
    tokenAcceso: string,
    fetchFn: typeof fetch = fetch,
  ) {
    this.transporte = new TransporteHttpQlik(host, tokenAcceso, fetchFn);
  }

  solicitarCrudo(solicitud: SolicitudQlik): Promise<RespuestaCrudaQlik> {
    return this.transporte.solicitarCrudo(solicitud);
  }

  solicitarJson<T>(solicitud: SolicitudQlik): Promise<T> {
    return this.transporte.solicitarJson<T>(solicitud);
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
    return mapearItemsAFlujos(respuesta);
  }

  obtenerScriptApp(
    appId: string,
    scriptId = "current",
  ): Promise<{ script: string; versionMessage?: string }> {
    return this.solicitarJson<{ script: string; versionMessage?: string }>({
      metodo: "GET",
      ruta: `/api/v1/apps/${encodeURIComponent(appId)}/scripts/${encodeURIComponent(scriptId)}`,
    });
  }
}
