import {
  esquemaActualizarAsignacionEspacioQlik,
  esquemaActualizarAutomatizacionQlik,
  esquemaActualizarConexionAutomatizacion,
  esquemaActualizarEspacioQlik,
  esquemaActualizarUsuarioQlik,
  esquemaCambiarEspacioAutomatizacionQlik,
  esquemaCambiarEspacioConexionQlik,
  esquemaCambiarPropietarioQlik,
  esquemaConfiguracionAutomatizacionesQlik,
  esquemaConsultaAutomatizaciones,
  esquemaConsultaConectoresAutomatizacion,
  esquemaConsultaConexionesAutomatizacion,
  esquemaConsultaEjecuciones,
  esquemaConsultaEspacios,
  esquemaConsultaUsuarios,
  esquemaCopiarAutomatizacionQlik,
  esquemaCrearAsignacionEspacioQlik,
  esquemaCrearAutomatizacionQlik,
  esquemaCrearComparticionEspacioQlik,
  esquemaCrearConexionAutomatizacion,
  esquemaCrearEjecucionQlik,
  esquemaCrearEspacioQlik,
  esquemaCrearUsuarioQlik,
  esquemaCuerpoObjetoQlik,
  esquemaFiltrarUsuariosQlik,
  esquemaIdQlik,
  esquemaInvitarUsuariosQlik,
  esquemaParcheComparticionEspacioQlik,
  esquemaParcheEspacioQlik,
} from "@qlik/contratos/qlik";
import { type Context, Hono } from "hono";
import { type ZodType, z } from "zod";
import { ErrorAplicacion } from "../../../plataforma/errores/error-aplicacion.js";
import { ReenviarSolicitudQlik } from "../aplicacion/casos-de-uso/reenviar-solicitud-qlik.js";
import type {
  MetodoHttpQlik,
  PuertoQlik,
  SolicitudQlik,
} from "../aplicacion/puertos/puerto-qlik.js";

export type ResolverClienteQlik = (c: Context) => Promise<PuertoQlik>;

interface OpcionesReenvio {
  metodo: MetodoHttpQlik;
  rutaQlik: string | ((c: Context) => string);
  esquemaConsulta?: ZodType;
  esquemaCuerpo?: ZodType;
  cuerpoOpcional?: boolean;
}

const esquemaConsultaLibreQlik = z.record(
  z.string().trim().min(1).max(128),
  z.string().max(8000),
);

export function crearRutasProxyQlik(resolverCliente: ResolverClienteQlik) {
  const rutas = new Hono();

  // Automations: rutas estáticas antes de /:id.
  rutas.get("/workflows/automations/settings", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "GET",
      rutaQlik: "/api/workflows/automations/settings",
    }),
  );
  rutas.put("/workflows/automations/settings", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "PUT",
      rutaQlik: "/api/workflows/automations/settings",
      esquemaCuerpo: esquemaConfiguracionAutomatizacionesQlik,
    }),
  );
  rutas.get("/workflows/automations/usage", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "GET",
      rutaQlik: "/api/workflows/automations/usage",
      esquemaConsulta: esquemaCuerpoObjetoQlik,
    }),
  );
  rutas.get("/workflows/automations", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "GET",
      rutaQlik: "/api/workflows/automations",
      esquemaConsulta: esquemaConsultaAutomatizaciones,
    }),
  );
  rutas.post("/workflows/automations", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "POST",
      rutaQlik: "/api/workflows/automations",
      esquemaCuerpo: esquemaCrearAutomatizacionQlik,
    }),
  );
  rutas.get("/workflows/automations/:id", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "GET",
      rutaQlik: rutaAutomatizacion(c),
    }),
  );
  rutas.put("/workflows/automations/:id", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "PUT",
      rutaQlik: rutaAutomatizacion(c),
      esquemaCuerpo: esquemaActualizarAutomatizacionQlik,
    }),
  );
  rutas.delete("/workflows/automations/:id", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "DELETE",
      rutaQlik: rutaAutomatizacion(c),
    }),
  );
  rutas.post("/workflows/automations/:id/actions/change-owner", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "POST",
      rutaQlik: `${rutaAutomatizacion(c)}/actions/change-owner`,
      esquemaCuerpo: esquemaCambiarPropietarioQlik,
    }),
  );
  rutas.post("/workflows/automations/:id/actions/change-space", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "POST",
      rutaQlik: `${rutaAutomatizacion(c)}/actions/change-space`,
      esquemaCuerpo: esquemaCambiarEspacioAutomatizacionQlik,
    }),
  );
  rutas.post("/workflows/automations/:id/actions/copy", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "POST",
      rutaQlik: `${rutaAutomatizacion(c)}/actions/copy`,
      esquemaCuerpo: esquemaCopiarAutomatizacionQlik,
    }),
  );
  rutas.post("/workflows/automations/:id/actions/disable", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "POST",
      rutaQlik: `${rutaAutomatizacion(c)}/actions/disable`,
    }),
  );
  rutas.post("/workflows/automations/:id/actions/enable", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "POST",
      rutaQlik: `${rutaAutomatizacion(c)}/actions/enable`,
    }),
  );
  rutas.post("/workflows/automations/:id/actions/move", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "POST",
      rutaQlik: `${rutaAutomatizacion(c)}/actions/move`,
      esquemaCuerpo: esquemaCambiarPropietarioQlik,
    }),
  );
  rutas.get("/workflows/automations/:id/runs", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "GET",
      rutaQlik: `${rutaAutomatizacion(c)}/runs`,
      esquemaConsulta: esquemaConsultaEjecuciones,
    }),
  );
  rutas.post("/workflows/automations/:id/runs", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "POST",
      rutaQlik: `${rutaAutomatizacion(c)}/runs`,
      esquemaCuerpo: esquemaCrearEjecucionQlik,
    }),
  );
  rutas.get("/workflows/automations/:id/runs/:runId", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "GET",
      rutaQlik: rutaEjecucion(c),
    }),
  );
  rutas.post("/workflows/automations/:id/runs/:runId/actions/export", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "POST",
      rutaQlik: `${rutaEjecucion(c)}/actions/export`,
    }),
  );
  rutas.post("/workflows/automations/:id/runs/:runId/actions/retry", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "POST",
      rutaQlik: `${rutaEjecucion(c)}/actions/retry`,
    }),
  );
  rutas.post("/workflows/automations/:id/runs/:runId/actions/stop", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "POST",
      rutaQlik: `${rutaEjecucion(c)}/actions/stop`,
    }),
  );
  rutas.get("/workflows/automations/:id/runs/:runId/debug", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "GET",
      rutaQlik: `${rutaEjecucion(c)}/debug`,
    }),
  );

  // Automation connectors.
  rutas.get("/workflows/automation-connectors", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "GET",
      rutaQlik: "/api/workflows/automation-connectors",
      esquemaConsulta: esquemaConsultaConectoresAutomatizacion,
    }),
  );
  rutas.get(
    "/workflows/automation-connectors/:connectorId/webhooks/configuration",
    (c) =>
      reenviar(c, resolverCliente, {
        metodo: "GET",
        rutaQlik: `/api/workflows/automation-connectors/${id(c, "connectorId")}/webhooks/configuration`,
      }),
  );

  // Automation connections.
  rutas.get("/workflows/automation-connections", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "GET",
      rutaQlik: "/api/workflows/automation-connections",
      esquemaConsulta: esquemaConsultaConexionesAutomatizacion,
    }),
  );
  rutas.post("/workflows/automation-connections", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "POST",
      rutaQlik: "/api/workflows/automation-connections",
      esquemaCuerpo: esquemaCrearConexionAutomatizacion,
    }),
  );
  rutas.get("/workflows/automation-connections/:id", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "GET",
      rutaQlik: rutaConexion(c),
    }),
  );
  rutas.put("/workflows/automation-connections/:id", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "PUT",
      rutaQlik: rutaConexion(c),
      esquemaCuerpo: esquemaActualizarConexionAutomatizacion,
    }),
  );
  rutas.delete("/workflows/automation-connections/:id", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "DELETE",
      rutaQlik: rutaConexion(c),
    }),
  );
  rutas.post(
    "/workflows/automation-connections/:id/actions/change-owner",
    (c) =>
      reenviar(c, resolverCliente, {
        metodo: "POST",
        rutaQlik: `${rutaConexion(c)}/actions/change-owner`,
        esquemaCuerpo: esquemaCambiarPropietarioQlik,
      }),
  );
  rutas.post(
    "/workflows/automation-connections/:id/actions/change-space",
    (c) =>
      reenviar(c, resolverCliente, {
        metodo: "POST",
        rutaQlik: `${rutaConexion(c)}/actions/change-space`,
        esquemaCuerpo: esquemaCambiarEspacioConexionQlik,
      }),
  );
  rutas.post("/workflows/automation-connections/:id/actions/check", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "POST",
      rutaQlik: `${rutaConexion(c)}/actions/check`,
    }),
  );

  // Spaces.
  rutas.get("/v1/spaces/types", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "GET",
      rutaQlik: "/api/v1/spaces/types",
    }),
  );
  rutas.get("/v1/spaces", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "GET",
      rutaQlik: "/api/v1/spaces",
      esquemaConsulta: esquemaConsultaEspacios,
    }),
  );
  rutas.post("/v1/spaces", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "POST",
      rutaQlik: "/api/v1/spaces",
      esquemaCuerpo: esquemaCrearEspacioQlik,
    }),
  );
  rutas.get("/v1/spaces/:spaceId", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "GET",
      rutaQlik: rutaEspacio(c),
    }),
  );
  rutas.patch("/v1/spaces/:spaceId", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "PATCH",
      rutaQlik: rutaEspacio(c),
      esquemaCuerpo: esquemaParcheEspacioQlik,
    }),
  );
  rutas.put("/v1/spaces/:spaceId", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "PUT",
      rutaQlik: rutaEspacio(c),
      esquemaCuerpo: esquemaActualizarEspacioQlik,
    }),
  );
  rutas.delete("/v1/spaces/:spaceId", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "DELETE",
      rutaQlik: rutaEspacio(c),
    }),
  );
  rutas.get("/v1/spaces/:spaceId/assignments", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "GET",
      rutaQlik: `${rutaEspacio(c)}/assignments`,
      esquemaConsulta: esquemaCuerpoObjetoQlik,
    }),
  );
  rutas.post("/v1/spaces/:spaceId/assignments", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "POST",
      rutaQlik: `${rutaEspacio(c)}/assignments`,
      esquemaCuerpo: esquemaCrearAsignacionEspacioQlik,
    }),
  );
  rutas.get("/v1/spaces/:spaceId/assignments/:assignmentId", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "GET",
      rutaQlik: `${rutaEspacio(c)}/assignments/${id(c, "assignmentId")}`,
    }),
  );
  rutas.put("/v1/spaces/:spaceId/assignments/:assignmentId", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "PUT",
      rutaQlik: `${rutaEspacio(c)}/assignments/${id(c, "assignmentId")}`,
      esquemaCuerpo: esquemaActualizarAsignacionEspacioQlik,
    }),
  );
  rutas.delete("/v1/spaces/:spaceId/assignments/:assignmentId", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "DELETE",
      rutaQlik: `${rutaEspacio(c)}/assignments/${id(c, "assignmentId")}`,
    }),
  );
  rutas.get("/v1/spaces/:spaceId/shares", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "GET",
      rutaQlik: `${rutaEspacio(c)}/shares`,
      esquemaConsulta: esquemaCuerpoObjetoQlik,
    }),
  );
  rutas.post("/v1/spaces/:spaceId/shares", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "POST",
      rutaQlik: `${rutaEspacio(c)}/shares`,
      esquemaCuerpo: esquemaCrearComparticionEspacioQlik,
    }),
  );
  rutas.get("/v1/spaces/:spaceId/shares/:shareId", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "GET",
      rutaQlik: `${rutaEspacio(c)}/shares/${id(c, "shareId")}`,
    }),
  );
  rutas.patch("/v1/spaces/:spaceId/shares/:shareId", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "PATCH",
      rutaQlik: `${rutaEspacio(c)}/shares/${id(c, "shareId")}`,
      esquemaCuerpo: esquemaParcheComparticionEspacioQlik,
    }),
  );
  rutas.delete("/v1/spaces/:spaceId/shares/:shareId", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "DELETE",
      rutaQlik: `${rutaEspacio(c)}/shares/${id(c, "shareId")}`,
    }),
  );

  // Users: rutas estáticas antes de /:userId.
  rutas.get("/v1/users/actions/count", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "GET",
      rutaQlik: "/api/v1/users/actions/count",
      esquemaConsulta: esquemaConsultaUsuarios,
    }),
  );
  rutas.post("/v1/users/actions/filter", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "POST",
      rutaQlik: "/api/v1/users/actions/filter",
      esquemaCuerpo: esquemaFiltrarUsuariosQlik,
    }),
  );
  rutas.post("/v1/users/actions/invite", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "POST",
      rutaQlik: "/api/v1/users/actions/invite",
      esquemaCuerpo: esquemaInvitarUsuariosQlik,
    }),
  );
  rutas.get("/v1/users/me", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "GET",
      rutaQlik: "/api/v1/users/me",
      esquemaConsulta: esquemaConsultaUsuarios,
    }),
  );
  rutas.get("/v1/users", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "GET",
      rutaQlik: "/api/v1/users",
      esquemaConsulta: esquemaConsultaUsuarios,
    }),
  );
  rutas.post("/v1/users", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "POST",
      rutaQlik: "/api/v1/users",
      esquemaCuerpo: esquemaCrearUsuarioQlik,
    }),
  );
  rutas.get("/v1/users/:userId", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "GET",
      rutaQlik: `/api/v1/users/${id(c, "userId")}`,
      esquemaConsulta: esquemaConsultaUsuarios,
    }),
  );
  rutas.patch("/v1/users/:userId", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "PATCH",
      rutaQlik: `/api/v1/users/${id(c, "userId")}`,
      esquemaCuerpo: esquemaActualizarUsuarioQlik,
    }),
  );
  rutas.delete("/v1/users/:userId", (c) =>
    reenviar(c, resolverCliente, {
      metodo: "DELETE",
      rutaQlik: `/api/v1/users/${id(c, "userId")}`,
    }),
  );

  return rutas;
}

async function reenviar(
  c: Context,
  resolverCliente: ResolverClienteQlik,
  opciones: OpcionesReenvio,
) {
  const consultaValidada = (
    opciones.esquemaConsulta ?? esquemaConsultaLibreQlik
  ).parse(c.req.query()) as Record<string, unknown>;
  const consulta =
    Object.keys(consultaValidada).length > 0
      ? aParametrosConsulta(consultaValidada)
      : undefined;

  let cuerpo: unknown;
  if (opciones.esquemaCuerpo) {
    const recibido = await leerJson(c, opciones.cuerpoOpcional ?? false);
    cuerpo = opciones.esquemaCuerpo.parse(recibido);
  }

  const rutaQlik =
    typeof opciones.rutaQlik === "function"
      ? opciones.rutaQlik(c)
      : opciones.rutaQlik;
  const solicitud: SolicitudQlik = {
    metodo: opciones.metodo,
    ruta: rutaQlik,
    consulta,
    ...(cuerpo !== undefined ? { cuerpo } : {}),
  };

  const cliente = await resolverCliente(c);
  const respuesta = await new ReenviarSolicitudQlik(cliente).ejecutar(
    solicitud,
  );
  return crearRespuestaProxy(respuesta);
}

function id(c: Context, nombre: string): string {
  return encodeURIComponent(esquemaIdQlik.parse(c.req.param(nombre)));
}

function rutaAutomatizacion(c: Context): string {
  return `/api/workflows/automations/${id(c, "id")}`;
}

function rutaEjecucion(c: Context): string {
  return `${rutaAutomatizacion(c)}/runs/${id(c, "runId")}`;
}

function rutaConexion(c: Context): string {
  return `/api/workflows/automation-connections/${id(c, "id")}`;
}

function rutaEspacio(c: Context): string {
  return `/api/v1/spaces/${id(c, "spaceId")}`;
}

async function leerJson(c: Context, opcional: boolean): Promise<unknown> {
  const texto = await c.req.text();
  if (!texto.trim()) {
    if (opcional) return undefined;
    throw new ErrorAplicacion(
      "JSON_REQUERIDO",
      "Se requiere un cuerpo JSON",
      400,
    );
  }
  try {
    return JSON.parse(texto);
  } catch {
    throw new ErrorAplicacion(
      "JSON_INVALIDO",
      "El cuerpo no contiene JSON válido",
      400,
    );
  }
}

function aParametrosConsulta(
  valores: Record<string, unknown>,
): URLSearchParams {
  const parametros = new URLSearchParams();
  for (const [clave, valor] of Object.entries(valores)) {
    if (valor === undefined || valor === null || valor === "") continue;
    if (Array.isArray(valor)) {
      for (const item of valor) parametros.append(clave, String(item));
    } else {
      parametros.set(clave, String(valor));
    }
  }
  return parametros;
}

function crearRespuestaProxy(respuesta: {
  estado: number;
  encabezados: Headers;
  cuerpo: ReadableStream<Uint8Array> | null;
}): Response {
  const encabezados = new Headers();
  for (const nombre of [
    "content-type",
    "content-disposition",
    "location",
    "etag",
    "last-modified",
    "retry-after",
    "x-qlik-trace-id",
  ]) {
    const valor = respuesta.encabezados.get(nombre);
    if (valor) encabezados.set(nombre, valor);
  }

  return new Response(respuesta.cuerpo, {
    status: respuesta.estado,
    headers: encabezados,
  });
}
