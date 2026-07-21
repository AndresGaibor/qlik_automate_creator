import crypto from "node:crypto";
import { and, eq, isNull } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { db } from "../../../infraestructura/base-datos/conexion.js";
import {
  credencialesQlik,
  identidadesQlik,
  intentosOauthQlik,
  sesionesUsuario,
  tenantsQlik,
  usuarios,
} from "../../../infraestructura/base-datos/esquema.js";
import { servicioCifrado } from "../../../infraestructura/cifrado/servicio.js";
import { ClienteOAuthQlik } from "./qlik-oauth.js";

const router = new Hono();

const getRequiredEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value;
};

const oauth = new ClienteOAuthQlik(
  getRequiredEnv("QLIK_CLIENT_ID"),
  getRequiredEnv("QLIK_CLIENT_SECRET"),
  getRequiredEnv("QLIK_REDIRECT_URI"),
  "l676lvg3emfvcq2.us.qlikcloud.com",
);

const SESION_COOKIE = "sesion_usuario";
const ESTADO_COOKIE = "oauth_estado";
const VERIFIER_COOKIE = "oauth_verifier";

router.get("/iniciar", async (c) => {
  const estado = oauth.generarEstado();
  const verifier = oauth.generarCodeVerifier();
  const challenge = await oauth.generarCodeChallenge(verifier);
  const url = oauth.obtenerUrlAutorizacion(estado, challenge);

  setCookie(c, ESTADO_COOKIE, estado, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 600,
    path: "/",
  });

  setCookie(c, VERIFIER_COOKIE, verifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 600,
    path: "/",
  });

  return c.redirect(url);
});

router.get("/callback", async (c) => {
  const { code, state } = c.req.query();
  const estadoGuardado = getCookie(c, ESTADO_COOKIE);
  const verifier = getCookie(c, VERIFIER_COOKIE);

  deleteCookie(c, ESTADO_COOKIE);
  deleteCookie(c, VERIFIER_COOKIE);

  if (!code || !state || state !== estadoGuardado || !verifier) {
    return c.json({ success: false, error: "OAuth state inválido" }, 400);
  }

  const tokens = await oauth.intercambiaCodigoPorTokens(code, verifier);
  const usuarioQlik = await oauth.obtenerUsuario(tokens.accessToken);

  const hostTenant = "l676lvg3emfvcq2.us.qlikcloud.com";

  let tenant = await db.query.tenantsQlik.findFirst({
    where: eq(tenantsQlik.host, hostTenant),
  });

  if (!tenant) {
    const [nuevoTenant] = await db
      .insert(tenantsQlik)
      .values({
        tenantIdQlik: "default",
        host: hostTenant,
        nombre: "Tenant Principal",
      })
      .returning();
    tenant = nuevoTenant;
  }

  const expiresAt = new Date(Date.now() + tokens.expiresIn * 1000);
  const tokenAccesoCifrado = servicioCifrado.cifrar(tokens.accessToken);
  const tokenRefrescoCifrado = tokens.refreshToken
    ? servicioCifrado.cifrar(tokens.refreshToken)
    : null;

  let usuario = await db.query.usuarios.findFirst({
    where: eq(usuarios.correo, usuarioQlik.email ?? ""),
  });

  if (!usuario) {
    const [nuevoUsuario] = await db
      .insert(usuarios)
      .values({
        nombre: usuarioQlik.name ?? usuarioQlik.email ?? "Usuario Qlik",
        correo: usuarioQlik.email,
        avatarUrl: usuarioQlik.avatar,
        ultimoAccesoEn: new Date(),
      })
      .returning();
    usuario = nuevoUsuario;
  } else {
    await db
      .update(usuarios)
      .set({
        nombre: usuarioQlik.name ?? usuario.nombre,
        avatarUrl: usuarioQlik.avatar ?? usuario.avatarUrl,
        ultimoAccesoEn: new Date(),
      })
      .where(eq(usuarios.id, usuario.id));
  }

  let identidad = await db.query.identidadesQlik.findFirst({
    where: and(
      eq(identidadesQlik.usuarioIdQlik, usuarioQlik.id),
      eq(identidadesQlik.tenantQlikId, tenant.id),
    ),
  });

  if (!identidad) {
    const [nuevaIdentidad] = await db
      .insert(identidadesQlik)
      .values({
        usuarioId: usuario.id,
        tenantQlikId: tenant.id,
        usuarioIdQlik: usuarioQlik.id,
        sujetoQlik: usuarioQlik.name,
        nombreQlik: usuarioQlik.name,
        correoQlik: usuarioQlik.email,
        avatarQlik: usuarioQlik.avatar,
        estadoQlik: "activo",
      })
      .returning();
    identidad = nuevaIdentidad;
  } else {
    await db
      .update(identidadesQlik)
      .set({
        nombreQlik: usuarioQlik.name ?? identidad.nombreQlik,
        correoQlik: usuarioQlik.email ?? identidad.correoQlik,
        avatarQlik: usuarioQlik.avatar ?? identidad.avatarQlik,
        sincronizadoEn: new Date(),
      })
      .where(eq(identidadesQlik.id, identidad.id));
  }

  const credencialExistente = await db.query.credencialesQlik.findFirst({
    where: eq(credencialesQlik.identidadQlikId, identidad.id),
  });

  if (credencialExistente) {
    await db
      .update(credencialesQlik)
      .set({
        tokenAccesoCifrado: JSON.stringify(tokenAccesoCifrado),
        tokenRefrescoCifrado: tokenRefrescoCifrado
          ? JSON.stringify(tokenRefrescoCifrado)
          : null,
        tokenExpiraEn: expiresAt,
        version: credencialExistente.version + 1,
        actualizadoEn: new Date(),
      })
      .where(eq(credencialesQlik.id, credencialExistente.id));
  } else {
    await db.insert(credencialesQlik).values({
      identidadQlikId: identidad.id,
      tokenAccesoCifrado: JSON.stringify(tokenAccesoCifrado),
      tokenRefrescoCifrado: tokenRefrescoCifrado
        ? JSON.stringify(tokenRefrescoCifrado)
        : null,
      scopes: tokens.scope.split(" "),
      tokenExpiraEn: expiresAt,
    });
  }

  const sesionToken = crypto.randomBytes(32).toString("hex");
  const sesionHash = crypto
    .createHash("sha256")
    .update(sesionToken)
    .digest("hex");
  const sesionExpiraEn = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await db.insert(sesionesUsuario).values({
    usuarioId: usuario.id,
    identidadQlikId: identidad.id,
    tokenSesionHash: sesionHash,
    ipCreacion:
      c.req.header("x-forwarded-for") ??
      c.req.header("cf-connecting-ip") ??
      "unknown",
    agenteUsuario: c.req.header("user-agent") ?? "unknown",
    expiraEn: sesionExpiraEn,
  });

  setCookie(c, SESION_COOKIE, sesionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return c.redirect("/");
});

router.get("/sesion", async (c) => {
  const sesionToken = getCookie(c, SESION_COOKIE);
  if (!sesionToken) {
    return c.json({ success: false, error: "No hay sesión" }, 401);
  }

  const sesionHash = crypto
    .createHash("sha256")
    .update(sesionToken)
    .digest("hex");

  const sesion = await db.query.sesionesUsuario.findFirst({
    where: and(
      eq(sesionesUsuario.tokenSesionHash, sesionHash),
      sql`${sesionesUsuario.expiraEn} > NOW()`,
      isNull(sesionesUsuario.revocadaEn),
    ),
  });

  if (!sesion) {
    deleteCookie(c, SESION_COOKIE);
    return c.json({ success: false, error: "Sesión inválida o expirada" }, 401);
  }

  const usuario = await db.query.usuarios.findFirst({
    where: eq(usuarios.id, sesion.usuarioId),
  });

  const identidad = await db.query.identidadesQlik.findFirst({
    where: eq(identidadesQlik.id, sesion.identidadQlikId),
  });

  return c.json({
    success: true,
    data: {
      usuario: usuario
        ? {
            id: usuario.id,
            nombre: usuario.nombre,
            correo: usuario.correo,
            avatarUrl: usuario.avatarUrl,
          }
        : null,
      identidad: identidad
        ? {
            id: identidad.id,
            nombreQlik: identidad.nombreQlik,
            correoQlik: identidad.correoQlik,
          }
        : null,
    },
  });
});

router.post("/cerrar-sesion", async (c) => {
  const sesionToken = getCookie(c, SESION_COOKIE);
  if (sesionToken) {
    const sesionHash = crypto
      .createHash("sha256")
      .update(sesionToken)
      .digest("hex");

    await db
      .update(sesionesUsuario)
      .set({ revocadaEn: new Date() })
      .where(eq(sesionesUsuario.tokenSesionHash, sesionHash));
  }

  deleteCookie(c, SESION_COOKIE);
  return c.json({ success: true });
});

export default router;
