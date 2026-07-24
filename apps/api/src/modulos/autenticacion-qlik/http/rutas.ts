import { Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import {
  responderError,
  responderExito,
} from "../../../plataforma/http/respuestas.js";
import type { ServicioAutenticacionQlik } from "../aplicacion/servicio-autenticacion.js";

const COOKIE_SESION = "sesion_usuario";
const COOKIE_ESTADO = "oauth_estado";
const COOKIE_VERIFICADOR = "oauth_verifier";

export function crearRutasAutenticacionQlik(
  servicio: ServicioAutenticacionQlik,
  opciones: { frontendUrl: string; produccion: boolean },
) {
  const rutas = new Hono();
  const cookieSegura = {
    httpOnly: true,
    secure: opciones.produccion,
    sameSite: "Lax" as const,
    path: "/",
  };

  rutas.get("/iniciar", async (c) => {
    const inicio = await servicio.iniciar();
    setCookie(c, COOKIE_ESTADO, inicio.estado, {
      ...cookieSegura,
      maxAge: 600,
    });
    setCookie(c, COOKIE_VERIFICADOR, inicio.verificador, {
      ...cookieSegura,
      maxAge: 600,
    });
    return c.redirect(inicio.url);
  });

  rutas.get("/callback", async (c) => {
    const { code: codigo, state: estado } = c.req.query();
    const estadoGuardado = getCookie(c, COOKIE_ESTADO);
    const verificador = getCookie(c, COOKIE_VERIFICADOR);
    deleteCookie(c, COOKIE_ESTADO, { path: "/" });
    deleteCookie(c, COOKIE_VERIFICADOR, { path: "/" });

    if (!codigo || !estado || estado !== estadoGuardado || !verificador) {
      return responderError(c, "Estado OAuth inválido", 400, {
        codigo: "OAUTH_ESTADO_INVALIDO",
      });
    }

    try {
      const { tokenSesion } = await servicio.completar({
        codigo,
        verificador,
        ip:
          c.req.header("cf-connecting-ip") ??
          c.req.header("x-forwarded-for") ??
          "desconocida",
        agenteUsuario: c.req.header("user-agent") ?? "desconocido",
      });
      setCookie(c, COOKIE_SESION, tokenSesion, {
        ...cookieSegura,
        maxAge: 60 * 60 * 24 * 7,
      });
      return c.redirect(new URL("/", opciones.frontendUrl).toString());
    } catch (error) {
      const url = new URL("/login", opciones.frontendUrl);
      const mensaje = error instanceof Error ? error.message : "";
      url.searchParams.set(
        "oauth_error",
        mensaje.includes("users/me") || mensaje.includes("401")
          ? "identity_scope_error"
          : "login_failed",
      );
      return c.redirect(url.toString());
    }
  });

  rutas.get("/sesion", async (c) => {
    const token = getCookie(c, COOKIE_SESION);
    if (!token) {
      return responderError(c, "No hay sesión", 401, {
        codigo: "SESION_REQUERIDA",
      });
    }
    const sesion = await servicio.consultarSesion(token);
    if (!sesion) {
      deleteCookie(c, COOKIE_SESION, { path: "/" });
      return responderError(c, "Sesión inválida o expirada", 401, {
        codigo: "SESION_INVALIDA",
      });
    }
    return responderExito(c, sesion);
  });

  rutas.post("/cerrar-sesion", async (c) => {
    const token = getCookie(c, COOKIE_SESION);
    if (token) await servicio.cerrarSesion(token);
    deleteCookie(c, COOKIE_SESION, { path: "/" });
    return responderExito(c, { cerrada: true });
  });

  return rutas;
}
