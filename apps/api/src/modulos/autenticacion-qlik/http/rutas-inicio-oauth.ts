import type { Context, Hono } from "hono";
import {
  responderError,
  responderExito,
} from "../../../nucleo/http/respuestas.js";
import type { ServicioAutenticacionQlik } from "../aplicacion/servicio-autenticacion.js";
import {
  type InicioOauthHttp,
  type OpcionesCookieSegura,
  guardarInicioOauth,
  normalizarRutaRetorno,
  solicitaRespuestaJson,
} from "./utiles-oauth-http.js";

interface ErrorInicio {
  codigo: string;
  mensaje: string;
  motivoRedirect: string;
}

export function registrarRutasInicioOauth(
  rutas: Hono,
  servicio: ServicioAutenticacionQlik,
  frontendUrl: string,
  cookieSegura: OpcionesCookieSegura,
): void {
  rutas.get("/iniciar", async (c) => {
    const host = c.req.query("host")?.trim();
    if (!host) {
      return responderError(c, "Debes indicar el host del tenant Qlik", 400, {
        codigo: "TENANT_QLIK_REQUERIDO",
      });
    }
    return ejecutarInicio(
      c,
      () => servicio.iniciar(host),
      frontendUrl,
      cookieSegura,
      {
        codigo: "TENANT_QLIK_INVALIDO",
        mensaje: "Tenant Qlik inválido",
        motivoRedirect: "tenant_not_found",
      },
    );
  });

  rutas.get("/iniciar-por-correo", async (c) => {
    const correo = c.req.query("correo")?.trim();
    if (!correo) {
      return responderError(c, "Debes ingresar tu correo electrónico", 400, {
        codigo: "CORREO_REQUERIDO",
      });
    }
    return ejecutarInicio(
      c,
      () => servicio.iniciarPorCorreo(correo),
      frontendUrl,
      cookieSegura,
      {
        codigo: "USUARIO_TENANT_NO_ENCONTRADO",
        mensaje: "Usuario o tenant no encontrado",
        motivoRedirect: "user_not_found",
      },
    );
  });
}

async function ejecutarInicio(
  c: Context,
  iniciar: () => Promise<InicioOauthHttp>,
  frontendUrl: string,
  cookieSegura: OpcionesCookieSegura,
  errorInicio: ErrorInicio,
) {
  try {
    const inicio = await iniciar();
    const retorno = normalizarRutaRetorno(c.req.query("retorno"));
    guardarInicioOauth(c, inicio, retorno, cookieSegura);

    if (solicitaRespuestaJson(c)) {
      return responderExito(c, { url: inicio.url });
    }
    return c.redirect(inicio.url);
  } catch (error) {
    if (solicitaRespuestaJson(c)) {
      return responderError(
        c,
        error instanceof Error ? error.message : errorInicio.mensaje,
        400,
        { codigo: errorInicio.codigo },
      );
    }
    const url = new URL("/login", frontendUrl);
    url.searchParams.set("oauth_error", errorInicio.motivoRedirect);
    return c.redirect(url.toString());
  }
}
