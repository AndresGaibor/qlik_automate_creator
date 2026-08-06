import { esquemaActualizarModoAutomatizacion } from "@qlik/contratos/admin";
import { type Context, Hono } from "hono";
import {
  responderError,
  responderExito,
} from "../../../nucleo/http/respuestas.js";
import type { RepositorioAdministracion } from "../aplicacion/puertos/repositorio-administracion.js";
import type { ResolverContextoAdmin } from "./rutas-comunes.js";
import { responderErrorAdmin, servicioAdmin } from "./rutas-comunes.js";

export interface DependenciasRutasConfiguracionPlataforma {
  repositorio: RepositorioAdministracion;
  resolverContexto: ResolverContextoAdmin;
}

export function crearRutasConfiguracionPlataforma({
  repositorio,
  resolverContexto,
}: DependenciasRutasConfiguracionPlataforma) {
  const rutas = new Hono();

  const handlerObtenerModo = async (c: Context) => {
    try {
      await resolverContexto(c);
      const resultado = await repositorio.obtenerModoAutomatizacionGlobal();
      return responderExito(c, resultado);
    } catch (error) {
      return responderErrorAdmin(c, error);
    }
  };

  const handlerActualizarModo = async (c: Context) => {
    try {
      const contexto = await resolverContexto(c);
      if (!servicioAdmin.puedeCambiarModoGlobal(contexto)) {
        return responderError(
          c,
          "No tienes permisos para cambiar el modo global",
          403,
          {
            codigo: "NO_AUTORIZADO",
          },
        );
      }

      const cuerpo = await c.req.json();
      const entrada = esquemaActualizarModoAutomatizacion.parse(cuerpo);

      const resultado = await repositorio.actualizarModoAutomatizacionGlobal(
        entrada.modoAutomatizacionActivo,
        contexto.usuarioId,
      );

      return responderExito(c, resultado);
    } catch (error) {
      return responderErrorAdmin(c, error);
    }
  };

  rutas.get(
    "/configuracion-plataforma/modo-automatizacion",
    handlerObtenerModo,
  );
  rutas.put(
    "/configuracion-plataforma/modo-automatizacion",
    handlerActualizarModo,
  );

  return rutas;
}
