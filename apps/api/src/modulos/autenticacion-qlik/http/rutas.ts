import { Hono } from "hono";
import type { ServicioAutenticacionQlik } from "../aplicacion/servicio-autenticacion.js";
import { registrarRutaCallbackOauth } from "./rutas-callback-oauth.js";
import { registrarRutasInicioOauth } from "./rutas-inicio-oauth.js";
import { registrarRutasSesion } from "./rutas-sesion.js";
import { crearOpcionesCookie } from "./utiles-oauth-http.js";

export interface OpcionesRutasAutenticacion {
  frontendUrl: string;
  produccion: boolean;
}

export function crearRutasAutenticacionQlik(
  servicio: ServicioAutenticacionQlik,
  opciones: OpcionesRutasAutenticacion,
) {
  const rutas = new Hono();
  const cookieSegura = crearOpcionesCookie(opciones.produccion);

  registrarRutasInicioOauth(
    rutas,
    servicio,
    opciones.frontendUrl,
    cookieSegura,
  );
  registrarRutaCallbackOauth(
    rutas,
    servicio,
    opciones.frontendUrl,
    cookieSegura,
  );
  registrarRutasSesion(rutas, servicio, cookieSegura);

  return rutas;
}
