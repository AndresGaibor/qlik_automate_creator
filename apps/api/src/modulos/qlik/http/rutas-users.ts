import {
  esquemaActualizarUsuarioQlik,
  esquemaConsultaUsuarios,
  esquemaCrearUsuarioQlik,
  esquemaFiltrarUsuariosQlik,
  esquemaInvitarUsuariosQlik,
} from "@qlik/contratos/qlik";
import { Hono } from "hono";
import { type ResolverClienteQlik, id, reenviar } from "./proxy-utils.js";

export function crearRutasUsers(resolverCliente: ResolverClienteQlik) {
  const rutas = new Hono();

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
