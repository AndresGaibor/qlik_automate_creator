import type { Hono } from "hono";
import { deleteCookie, getCookie } from "hono/cookie";
import {
  responderError,
  responderExito,
} from "../../../nucleo/http/respuestas.js";
import type { ServicioAutenticacionQlik } from "../aplicacion/servicio-autenticacion.js";
import {
  COOKIE_SESION,
  type OpcionesCookieSegura,
} from "./utiles-oauth-http.js";

export function registrarRutasSesion(
  rutas: Hono,
  servicio: ServicioAutenticacionQlik,
  cookieSegura: OpcionesCookieSegura,
): void {
  rutas.get("/sesion", async (c) => {
    const token = getCookie(c, COOKIE_SESION);
    if (!token) {
      return responderError(c, "No hay sesión", 401, {
        codigo: "SESION_REQUERIDA",
      });
    }

    const sesion = await servicio.consultarSesion(token);
    if (!sesion) {
      deleteCookie(c, COOKIE_SESION, cookieSegura);
      return responderError(c, "Sesión inválida o expirada", 401, {
        codigo: "SESION_INVALIDA",
      });
    }

    const credencialesValidas = await servicio.verificarCredenciales(token);
    if (!credencialesValidas) {
      deleteCookie(c, COOKIE_SESION, cookieSegura);
      return responderError(c, "El tenant activo requiere conexión Qlik", 401, {
        codigo: "CREDENCIALES_QLIK_INVALIDAS",
      });
    }
    return responderExito(c, sesion);
  });

  rutas.get("/sesion/tenants", async (c) => {
    const token = getCookie(c, COOKIE_SESION);
    if (!token) {
      return responderError(c, "Sesión requerida", 401, {
        codigo: "SESION_REQUERIDA",
      });
    }
    return responderExito(c, await servicio.listarTenants(token));
  });

  rutas.put("/sesion/tenant-activo", async (c) => {
    const token = getCookie(c, COOKIE_SESION);
    if (!token) {
      return responderError(c, "Sesión requerida", 401, {
        codigo: "SESION_REQUERIDA",
      });
    }
    const cuerpo = (await c.req.json().catch(() => ({}))) as {
      tenantQlikId?: string;
    };
    if (!cuerpo.tenantQlikId) {
      return responderError(c, "Tenant requerido", 400, {
        codigo: "TENANT_REQUERIDO",
      });
    }
    const cambiado = await servicio.cambiarTenant(token, cuerpo.tenantQlikId);
    if (!cambiado) {
      return responderError(c, "Tenant no permitido o requiere conexión", 403, {
        codigo: "TENANT_NO_PERMITIDO",
      });
    }
    return responderExito(c, { cambiado: true });
  });

  rutas.post("/cerrar-sesion", async (c) => {
    const token = getCookie(c, COOKIE_SESION);
    if (token) await servicio.cerrarSesion(token);
    deleteCookie(c, COOKIE_SESION, cookieSegura);
    return responderExito(c, { cerrada: true });
  });
}
