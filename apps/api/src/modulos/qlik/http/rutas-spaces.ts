import {
  esquemaActualizarAsignacionEspacioQlik,
  esquemaActualizarEspacioQlik,
  esquemaConsultaEspacios,
  esquemaCrearAsignacionEspacioQlik,
  esquemaCrearComparticionEspacioQlik,
  esquemaCrearEspacioQlik,
  esquemaCuerpoObjetoQlik,
  esquemaParcheComparticionEspacioQlik,
  esquemaParcheEspacioQlik,
} from "@qlik/contratos/qlik";
import { Hono } from "hono";
import {
  type ResolverClienteQlik,
  id,
  reenviar,
  rutaEspacio,
} from "./proxy-utils.js";

export function crearRutasSpaces(resolverCliente: ResolverClienteQlik) {
  const rutas = new Hono();

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

  return rutas;
}
