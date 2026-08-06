import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

export const COOKIE_SESION = "sesion_usuario";
const COOKIE_ESTADO = "oauth_estado";
const COOKIE_VERIFICADOR = "oauth_verifier";
const COOKIE_TENANT_QLIK = "oauth_tenant_qlik";
const COOKIE_CONFIGURACION_OAUTH = "oauth_configuracion_id";
const COOKIE_RETORNO = "oauth_retorno";

export interface OpcionesCookieSegura {
  httpOnly: true;
  secure: boolean;
  sameSite: "Lax";
  path: "/";
}

export interface InicioOauthHttp {
  estado: string;
  verificador: string;
  tenantQlikId: string;
  configuracionOauthId?: string;
  url: string;
}

export function crearOpcionesCookie(produccion: boolean): OpcionesCookieSegura {
  return {
    httpOnly: true,
    secure: produccion,
    sameSite: "Lax",
    path: "/",
  };
}

export function guardarInicioOauth(
  c: Context,
  inicio: InicioOauthHttp,
  retorno: string | undefined,
  opciones: OpcionesCookieSegura,
): void {
  const temporales = { ...opciones, maxAge: 600 };
  setCookie(c, COOKIE_ESTADO, inicio.estado, temporales);
  setCookie(c, COOKIE_VERIFICADOR, inicio.verificador, temporales);
  setCookie(c, COOKIE_TENANT_QLIK, inicio.tenantQlikId, temporales);

  if (inicio.configuracionOauthId) {
    setCookie(
      c,
      COOKIE_CONFIGURACION_OAUTH,
      inicio.configuracionOauthId,
      temporales,
    );
  }
  if (retorno) setCookie(c, COOKIE_RETORNO, retorno, temporales);
}

export function solicitaRespuestaJson(c: Context): boolean {
  return (
    (c.req.header("accept") ?? "").includes("application/json") ||
    c.req.query("format") === "json"
  );
}

export function leerYLimpiarCallback(c: Context) {
  const contexto = {
    estadoGuardado: getCookie(c, COOKIE_ESTADO),
    verificador: getCookie(c, COOKIE_VERIFICADOR),
    tenantQlikId: getCookie(c, COOKIE_TENANT_QLIK),
    configuracionOauthId: getCookie(c, COOKIE_CONFIGURACION_OAUTH),
    retorno: normalizarRutaRetorno(getCookie(c, COOKIE_RETORNO)),
  };

  for (const nombre of [
    COOKIE_ESTADO,
    COOKIE_VERIFICADOR,
    COOKIE_TENANT_QLIK,
    COOKIE_CONFIGURACION_OAUTH,
    COOKIE_RETORNO,
  ]) {
    deleteCookie(c, nombre, { path: "/" });
  }
  return contexto;
}

export function normalizarRutaRetorno(ruta?: string): string | undefined {
  if (!ruta) return undefined;
  let valor: string;
  try {
    valor = decodeURIComponent(ruta);
  } catch {
    return undefined;
  }
  if (!valor.startsWith("/") || valor.startsWith("//")) return undefined;
  return valor;
}
