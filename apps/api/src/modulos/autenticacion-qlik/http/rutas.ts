import { Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import {
  responderError,
  responderExito,
} from "../../../nucleo/http/respuestas.js";
import type { ServicioAutenticacionQlik } from "../aplicacion/servicio-autenticacion.js";

const COOKIE_SESION = "sesion_usuario";
const COOKIE_ESTADO = "oauth_estado";
const COOKIE_VERIFICADOR = "oauth_verifier";
const COOKIE_TENANT_QLIK = "oauth_tenant_qlik";

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
    const host = c.req.query("host")?.trim();
    if (!host) {
      return responderError(c, "Debes indicar el host del tenant Qlik", 400, {
        codigo: "TENANT_QLIK_REQUERIDO",
      });
    }
    let inicio: Awaited<ReturnType<ServicioAutenticacionQlik["iniciar"]>>;
    try {
      inicio = await servicio.iniciar(host);
    } catch (error) {
      const acceptHeader = c.req.header("accept") ?? "";
      if (acceptHeader.includes("application/json")) {
        return responderError(
          c,
          error instanceof Error ? error.message : "Tenant Qlik inválido",
          400,
          { codigo: "TENANT_QLIK_INVALIDO" },
        );
      }
      const url = new URL("/login", opciones.frontendUrl);
      url.searchParams.set("oauth_error", "tenant_not_found");
      return c.redirect(url.toString());
    }
    setCookie(c, COOKIE_ESTADO, inicio.estado, {
      ...cookieSegura,
      maxAge: 600,
    });
    setCookie(c, COOKIE_VERIFICADOR, inicio.verificador, {
      ...cookieSegura,
      maxAge: 600,
    });
    setCookie(c, COOKIE_TENANT_QLIK, inicio.tenantQlikId, {
      ...cookieSegura,
      maxAge: 600,
    });
    const acceptHeader = c.req.header("accept") ?? "";
    if (
      acceptHeader.includes("application/json") ||
      c.req.query("format") === "json"
    ) {
      return responderExito(c, { url: inicio.url });
    }
    return c.redirect(inicio.url);
  });

  rutas.get("/iniciar-por-correo", async (c) => {
    const correo = c.req.query("correo")?.trim();
    if (!correo) {
      return responderError(c, "Debes ingresar tu correo electrónico", 400, {
        codigo: "CORREO_REQUERIDO",
      });
    }
    let inicio: Awaited<
      ReturnType<ServicioAutenticacionQlik["iniciarPorCorreo"]>
    >;
    try {
      inicio = await servicio.iniciarPorCorreo(correo);
    } catch (error) {
      const acceptHeader = c.req.header("accept") ?? "";
      if (acceptHeader.includes("application/json")) {
        return responderError(
          c,
          error instanceof Error ? error.message : "Usuario o tenant no encontrado",
          400,
          { codigo: "USUARIO_TENANT_NO_ENCONTRADO" },
        );
      }
      const url = new URL("/login", opciones.frontendUrl);
      url.searchParams.set("oauth_error", "user_not_found");
      return c.redirect(url.toString());
    }
    setCookie(c, COOKIE_ESTADO, inicio.estado, {
      ...cookieSegura,
      maxAge: 600,
    });
    setCookie(c, COOKIE_VERIFICADOR, inicio.verificador, {
      ...cookieSegura,
      maxAge: 600,
    });
    setCookie(c, COOKIE_TENANT_QLIK, inicio.tenantQlikId, {
      ...cookieSegura,
      maxAge: 600,
    });
    const acceptHeader = c.req.header("accept") ?? "";
    if (
      acceptHeader.includes("application/json") ||
      c.req.query("format") === "json"
    ) {
      return responderExito(c, { url: inicio.url });
    }
    return c.redirect(inicio.url);
  });

  rutas.get("/callback", async (c) => {
    const { code: codigo, state: estado } = c.req.query();
    const estadoGuardado = getCookie(c, COOKIE_ESTADO);
    const verificador = getCookie(c, COOKIE_VERIFICADOR);
    const tenantQlikId = getCookie(c, COOKIE_TENANT_QLIK);
    deleteCookie(c, COOKIE_ESTADO, { path: "/" });
    deleteCookie(c, COOKIE_VERIFICADOR, { path: "/" });
    deleteCookie(c, COOKIE_TENANT_QLIK, { path: "/" });

    if (
      !codigo ||
      !estado ||
      estado !== estadoGuardado ||
      !verificador ||
      !tenantQlikId
    ) {
      return responderError(c, "Estado OAuth inválido", 400, {
        codigo: "OAUTH_ESTADO_INVALIDO",
      });
    }

    try {
      const { tokenSesion } = await servicio.completar({
        tenantQlikId,
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
      deleteCookie(c, COOKIE_SESION, cookieSegura);
      return responderError(c, "Sesión inválida o expirada", 401, {
        codigo: "SESION_INVALIDA",
      });
    }
    return responderExito(c, sesion);
  });

  rutas.get("/sesion/tenants", async (c) => {
    const token = getCookie(c, COOKIE_SESION);
    if (!token)
      return responderError(c, "Sesión requerida", 401, {
        codigo: "SESION_REQUERIDA",
      });
    return responderExito(c, await servicio.listarTenants(token));
  });

  rutas.put("/sesion/tenant-activo", async (c) => {
    const token = getCookie(c, COOKIE_SESION);
    if (!token)
      return responderError(c, "Sesión requerida", 401, {
        codigo: "SESION_REQUERIDA",
      });
    const cuerpo = (await c.req.json().catch(() => ({}))) as {
      tenantQlikId?: string;
    };
    if (!cuerpo.tenantQlikId)
      return responderError(c, "Tenant requerido", 400, {
        codigo: "TENANT_REQUERIDO",
      });
    const cambiado = await servicio.cambiarTenant(token, cuerpo.tenantQlikId);
    if (!cambiado)
      return responderError(c, "Tenant no permitido o requiere conexión", 403, {
        codigo: "TENANT_NO_PERMITIDO",
      });
    return responderExito(c, { cambiado: true });
  });

  rutas.post("/cerrar-sesion", async (c) => {
    const token = getCookie(c, COOKIE_SESION);
    if (token) await servicio.cerrarSesion(token);
    deleteCookie(c, COOKIE_SESION, cookieSegura);
    return responderExito(c, { cerrada: true });
  });

  return rutas;
}
