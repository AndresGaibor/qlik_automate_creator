import {
  esquemaActualizarConexionAutomatizacion,
  esquemaCambiarEspacioConexionQlik,
  esquemaCambiarPropietarioQlik,
  esquemaConsultaConectoresAutomatizacion,
  esquemaConsultaConexionesAutomatizacion,
  esquemaCrearConexionAutomatizacion,
} from "@qlik/contratos/qlik";
import { Hono } from "hono";
import {
  type ResolverClienteQlik,
  id,
  reenviar,
  rutaConexion,
} from "./proxy-utils.js";

export function crearRutasAutomationConnections(
  resolverCliente: ResolverClienteQlik,
) {
  const rutas = new Hono();

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

  return rutas;
}
