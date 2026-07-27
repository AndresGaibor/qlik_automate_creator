import {
  esquemaActualizarAutomatizacionQlik,
  esquemaCambiarEspacioAutomatizacionQlik,
  esquemaCambiarPropietarioQlik,
  esquemaConfiguracionAutomatizacionesQlik,
  esquemaConsultaAutomatizaciones,
  esquemaConsultaEjecuciones,
  esquemaCopiarAutomatizacionQlik,
  esquemaCrearAutomatizacionQlik,
  esquemaCrearEjecucionQlik,
} from "@qlik/contratos/qlik";
import { Hono } from "hono";
import {
  type ResolverClienteQlik,
  reenviar,
  rutaAutomatizacion,
  rutaEjecucion,
} from "./proxy-utils.js";

export function crearRutasAutomations(resolverCliente: ResolverClienteQlik) {
  const rutas = new Hono();

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

  return rutas;
}
