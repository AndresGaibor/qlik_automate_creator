import { esquemaAgregarSuperadmin } from "@qlik/contratos/admin";
import { Hono } from "hono";
import {
  responderError,
  responderExito,
} from "../../../nucleo/http/respuestas.js";
import type { RepositorioAdministracion } from "../aplicacion/puertos/repositorio-administracion.js";
import type { ResolverContextoAdmin } from "./rutas-comunes.js";
import { responderErrorAdmin } from "./rutas-comunes.js";

export interface DependenciasRutasSuperadmins {
  repositorio: RepositorioAdministracion;
  resolverContexto: ResolverContextoAdmin;
}

export function crearRutasSuperadmins({
  repositorio,
  resolverContexto,
}: DependenciasRutasSuperadmins) {
  const rutas = new Hono();

  async function exigirSuperadmin(contexto: { esSuperadmin: boolean }) {
    if (!contexto.esSuperadmin) {
      throw new Error("No tienes permisos para gestionar superadministradores");
    }
  }

  rutas.get("/superadmins", async (c) => {
    try {
      const contexto = await resolverContexto(c);
      await exigirSuperadmin(contexto);

      const superadmins = await repositorio.listarSuperadmins();

      return responderExito(c, superadmins);
    } catch (error) {
      return responderErrorAdmin(c, error);
    }
  });

  rutas.post("/superadmins", async (c) => {
    try {
      const contexto = await resolverContexto(c);
      await exigirSuperadmin(contexto);

      const cuerpo = await c.req.json();
      const entrada = esquemaAgregarSuperadmin.parse(cuerpo);

      const resultado = await repositorio.agregarSuperadmin(entrada);
      if (!resultado) {
        return responderError(
          c,
          "No se pudo crear el superadministrador",
          500,
          {
            codigo: "ERROR_CREACION",
          },
        );
      }

      return responderExito(c, resultado, 201);
    } catch (error) {
      if (error instanceof Error && error.message.includes("ya existe")) {
        return responderError(c, error.message, 409, { codigo: "YA_EXISTE" });
      }
      return responderErrorAdmin(c, error);
    }
  });

  rutas.delete("/superadmins/:id", async (c) => {
    try {
      const id = c.req.param("id");
      const contexto = await resolverContexto(c);
      await exigirSuperadmin(contexto);

      if (contexto.usuarioId === id) {
        return responderError(c, "No puedes eliminarte a ti mismo", 400, {
          codigo: "NO_SELF_DELETE",
        });
      }

      const resultado = await repositorio.eliminarSuperadmin(id);
      if (!resultado.exito) {
        return responderError(
          c,
          resultado.mensaje,
          resultado.codigo === "NO_ENCONTRADO" ? 404 : 400,
          {
            codigo: resultado.codigo,
          },
        );
      }

      return responderExito(c, { eliminado: true });
    } catch (error) {
      return responderErrorAdmin(c, error);
    }
  });

  return rutas;
}
