import type { Hono } from "hono";
import { setCookie } from "hono/cookie";
import { responderError } from "../../../nucleo/http/respuestas.js";
import type { ServicioAutenticacionQlik } from "../aplicacion/servicio-autenticacion.js";
import {
  COOKIE_SESION,
  type OpcionesCookieSegura,
  leerYLimpiarCallback,
} from "./utiles-oauth-http.js";

export function registrarRutaCallbackOauth(
  rutas: Hono,
  servicio: ServicioAutenticacionQlik,
  frontendUrl: string,
  cookieSegura: OpcionesCookieSegura,
): void {
  rutas.get("/callback", async (c) => {
    const { code: codigo, state: estado } = c.req.query();
    const contexto = leerYLimpiarCallback(c);

    if (
      !codigo ||
      !estado ||
      estado !== contexto.estadoGuardado ||
      !contexto.verificador ||
      !contexto.tenantQlikId
    ) {
      return responderError(c, "Estado OAuth inválido", 400, {
        codigo: "OAUTH_ESTADO_INVALIDO",
      });
    }

    try {
      const { tokenSesion } = await servicio.completar({
        tenantQlikId: contexto.tenantQlikId,
        configuracionOauthId: contexto.configuracionOauthId,
        codigo,
        verificador: contexto.verificador,
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
      const url = new URL(contexto.retorno ?? "/", frontendUrl);
      if (contexto.retorno) url.searchParams.set("oauth_verificado", "1");
      return c.redirect(url.toString());
    } catch (error) {
      const url = new URL(contexto.retorno ?? "/login", frontendUrl);
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
}
