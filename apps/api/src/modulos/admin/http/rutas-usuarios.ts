import {
  esquemaActualizarUsuario,
  esquemaAgregarUsuario,
} from "@qlik/contratos/admin";
import { Hono } from "hono";
import {
  responderError,
  responderExito,
} from "../../../nucleo/http/respuestas.js";
import { actualizarUsuario } from "../aplicacion/casos-de-uso/actualizar-usuario.js";
import { agregarUsuario } from "../aplicacion/casos-de-uso/agregar-usuario.js";
import { eliminarUsuario } from "../aplicacion/casos-de-uso/eliminar-usuario.js";
import type { RepositorioAdministracion } from "../aplicacion/puertos/repositorio-administracion.js";
import type { ResolverContextoAdmin } from "./rutas-comunes.js";
import {
  exigirAccesoOrganizacion,
  responderErrorAdmin,
} from "./rutas-comunes.js";

export interface DependenciasRutasUsuarios {
  repositorio: RepositorioAdministracion;
  resolverContexto: ResolverContextoAdmin;
}

export function crearRutasUsuarios({
  repositorio,
  resolverContexto,
}: DependenciasRutasUsuarios) {
  const rutas = new Hono();

  rutas.post("/tenants/:id/usuarios", async (c) => {
    try {
      const id = c.req.param("id");
      const contexto = await resolverContexto(c);
      exigirAccesoOrganizacion(contexto, id);

      const cuerpo = await c.req.json();
      const entrada = esquemaAgregarUsuario.parse(cuerpo);

      const resultado = await agregarUsuario(repositorio, id, entrada);
      if (!resultado) {
        return responderError(c, "Tenant no encontrado", 404, {
          codigo: "NO_ENCONTRADO",
        });
      }

      return responderExito(c, resultado, 201);
    } catch (error) {
      return responderErrorAdmin(c, error);
    }
  });

  rutas.patch("/tenants/:id/usuarios/:usuarioId", async (c) => {
    try {
      const id = c.req.param("id");
      const usuarioId = c.req.param("usuarioId");
      const contexto = await resolverContexto(c);
      exigirAccesoOrganizacion(contexto, id);

      const cuerpo = await c.req.json();
      const entrada = esquemaActualizarUsuario.parse(cuerpo);

      const resultado = await actualizarUsuario(
        repositorio,
        id,
        usuarioId,
        entrada,
      );
      if (!resultado) {
        return responderError(c, "Usuario no encontrado", 404, {
          codigo: "NO_ENCONTRADO",
        });
      }

      return responderExito(c, resultado);
    } catch (error) {
      return responderErrorAdmin(c, error);
    }
  });

  rutas.delete("/tenants/:id/usuarios/:usuarioId", async (c) => {
    try {
      const id = c.req.param("id");
      const usuarioId = c.req.param("usuarioId");
      const contexto = await resolverContexto(c);
      exigirAccesoOrganizacion(contexto, id);

      const resultado = await eliminarUsuario(repositorio, id, usuarioId);
      if (!resultado.eliminado) {
        return responderError(c, "Usuario no encontrado", 404, {
          codigo: "NO_ENCONTRADO",
        });
      }

      return responderExito(c, resultado);
    } catch (error) {
      return responderErrorAdmin(c, error);
    }
  });

  return rutas;
}
