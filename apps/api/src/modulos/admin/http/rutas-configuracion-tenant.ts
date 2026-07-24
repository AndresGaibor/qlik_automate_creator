import {
  esquemaConfigurarAutomatizacionBase,
  esquemaConfigurarDestinoTenant,
  esquemaConfigurarImpalaTenant,
} from "@qlik/contratos/admin";
import { type Context, Hono } from "hono";
import { responderError, responderExito } from "../../../nucleo/http/respuestas.js";
import type { RepositorioAdministracion } from "../aplicacion/puertos/repositorio-administracion.js";
import type { ResolverContextoAdmin } from "./rutas-comunes.js";
import { responderErrorAdmin, exigirAccesoOrganizacion } from "./rutas-comunes.js";

export interface DependenciasRutasConfiguracionTenant {
  repositorio: RepositorioAdministracion;
  resolverContexto: ResolverContextoAdmin;
}

export function crearRutasConfiguracionTenant({
  repositorio,
  resolverContexto,
}: DependenciasRutasConfiguracionTenant) {
  const rutas = new Hono();

  const handlerAutomatizacionBase = async (c: Context) => {
    try {
      const organizacionId = c.req.param("id")!;
      const tenantQlikId = c.req.param("tenantQlikId")!;
      const contexto = await resolverContexto(c);
      exigirAccesoOrganizacion(contexto, organizacionId);

      const cuerpo = await c.req.json();
      const entrada = esquemaConfigurarAutomatizacionBase.parse(cuerpo);

      const resultado = await repositorio.configurarAutomatizacionBase(
        organizacionId,
        tenantQlikId,
        entrada.automatizacionBaseIdQlik,
        entrada.automatizacionBaseNombre,
      );

      if (!resultado) {
        return responderError(c, "Tenant Qlik no encontrado", 404, {
          codigo: "NO_ENCONTRADO",
        });
      }

      return responderExito(c, resultado);
    } catch (error) {
      return responderErrorAdmin(c, error);
    }
  };

  rutas.put(
    "/organizaciones/:id/tenants-qlik/:tenantQlikId/automatizacion-base",
    handlerAutomatizacionBase,
  );
  rutas.put(
    "/tenants/:id/qlik/:tenantQlikId/automatizacion-base",
    handlerAutomatizacionBase,
  );

  const handlerDestino = async (c: Context) => {
    try {
      const organizacionId = c.req.param("id")!;
      const tenantQlikId = c.req.param("tenantQlikId")!;
      const contexto = await resolverContexto(c);
      exigirAccesoOrganizacion(contexto, organizacionId);

      const cuerpo = await c.req.json();
      const entrada = esquemaConfigurarDestinoTenant.parse(cuerpo);

      const resultado = await repositorio.configurarDestinoTenant(
        organizacionId,
        tenantQlikId,
        entrada.destinoApiUrl,
        entrada.destinoApiKey,
        entrada.destinoBaseDatos,
      );

      if (!resultado) {
        return responderError(c, "Tenant Qlik no encontrado", 404, {
          codigo: "NO_ENCONTRADO",
        });
      }

      return responderExito(c, resultado);
    } catch (error) {
      return responderErrorAdmin(c, error);
    }
  };

  rutas.put(
    "/organizaciones/:id/tenants-qlik/:tenantQlikId/destino",
    handlerDestino,
  );
  rutas.put(
    "/tenants/:id/qlik/:tenantQlikId/destino",
    handlerDestino,
  );

  const handlerImpala = async (c: Context) => {
    try {
      const organizacionId = c.req.param("id")!;
      const tenantQlikId = c.req.param("tenantQlikId")!;
      const contexto = await resolverContexto(c);
      exigirAccesoOrganizacion(contexto, organizacionId);

      const cuerpo = await c.req.json();
      const entrada = esquemaConfigurarImpalaTenant.parse(cuerpo);

      const resultado = await repositorio.configurarImpalaTenant(
        organizacionId,
        tenantQlikId,
        entrada,
      );

      if (!resultado) {
        return responderError(c, "Tenant Qlik no encontrado", 404, {
          codigo: "NO_ENCONTRADO",
        });
      }

      return responderExito(c, resultado);
    } catch (error) {
      return responderErrorAdmin(c, error);
    }
  };

  rutas.put(
    "/organizaciones/:id/tenants-qlik/:tenantQlikId/impala",
    handlerImpala,
  );
  rutas.put(
    "/tenants/:id/qlik/:tenantQlikId/impala",
    handlerImpala,
  );

  return rutas;
}
