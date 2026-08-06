import { Hono } from "hono";
import { crearRutasAdmin } from "../../modulos/admin/publico.js";
import { crearRutasAutenticacionQlik } from "../../modulos/autenticacion-qlik/publico.js";
import { crearRutasPanelAutomatizaciones } from "../../modulos/automatizaciones/publico.js";
import {
  crearRutasDestinos,
  crearRutasDestinosGenericas,
} from "../../modulos/destinos/publico.js";
import { crearRutasFlujos } from "../../modulos/flujos/publico.js";
import { crearRutasConexionesOrigen } from "../../modulos/origenes/publico.js";
import { crearRutasProxyQlik } from "../../modulos/qlik/publico.js";
import { crearRutasSetup } from "../../modulos/setup/publico.js";
import { crearManejadorErrores } from "../errores/manejador-http.js";
import { responderError, responderExito } from "../http/respuestas.js";
import type { crearDependenciasRutas } from "./crear-dependencias-rutas.js";

type DependenciasRutas = Awaited<ReturnType<typeof crearDependenciasRutas>>;

export function montarAplicacion(dependencias: DependenciasRutas): Hono {
  const aplicacion = new Hono();
  const { middlewares } = dependencias;

  aplicacion.use("*", middlewares.cors);
  aplicacion.use("*", middlewares.seguridad);
  aplicacion.use("*", middlewares.observabilidad);
  aplicacion.use("*", middlewares.csrf);
  aplicacion.use("*", middlewares.limiteSolicitudes);

  aplicacion.get("/api/salud", (c) =>
    responderExito(c, {
      estado: "ok",
      fecha: new Date().toISOString(),
      arquitectura: "monolito-modular",
    }),
  );

  aplicacion.route(
    "/api/setup",
    crearRutasSetup(
      dependencias.setup.configuracionApp,
      dependencias.setup.ejecutar,
      dependencias.setup.guardarOAuthInicial,
    ),
  );
  aplicacion.route(
    "/api/auth/qlik",
    crearRutasAutenticacionQlik(
      dependencias.autenticacion.servicio,
      dependencias.autenticacion.opciones,
    ),
  );
  aplicacion.route(
    "/api/flujos",
    crearRutasFlujos(
      dependencias.flujos.resolverConsulta,
      dependencias.flujos.resolverQlik,
      dependencias.flujos.resolverSesion,
      dependencias.flujos.resolverPoliticaEspacios,
      dependencias.flujos.consultaConexionesOrigen,
    ),
  );
  aplicacion.route(
    "/api/conexiones-origen",
    crearRutasConexionesOrigen(dependencias.origenes),
  );
  aplicacion.route(
    "/api/automatizaciones",
    crearRutasPanelAutomatizaciones(dependencias.panel),
  );
  aplicacion.route(
    "/api/destinos",
    crearRutasDestinos(dependencias.resolverCatalogoDestinos),
  );
  aplicacion.route(
    "/api/destinos/conexiones",
    crearRutasDestinosGenericas(dependencias.destinosGenericos),
  );
  aplicacion.route("/api/qlik", crearRutasProxyQlik(dependencias.resolverQlik));
  aplicacion.route("/api/admin", crearRutasAdmin(dependencias.admin));

  aplicacion.notFound((c) =>
    responderError(c, "Ruta no encontrada", 404, {
      codigo: "RUTA_NO_ENCONTRADA",
    }),
  );
  aplicacion.onError(crearManejadorErrores(dependencias.registrador));

  return aplicacion;
}
