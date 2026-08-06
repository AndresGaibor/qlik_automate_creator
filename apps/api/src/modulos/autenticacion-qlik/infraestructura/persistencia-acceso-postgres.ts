import crypto from "node:crypto";
import { and, eq } from "drizzle-orm";
import type { ConexionDb } from "../../../plataforma/persistencia/conexion.js";
import {
  credencialesQlik,
  identidadesQlik,
  membresiasOrganizacion,
  sesionesUsuario,
  tenantsQlik,
  usuarios,
} from "../../../plataforma/persistencia/esquema.js";
import type {
  DatosNuevaSesion,
  ServicioCifradoPuerto,
} from "../aplicacion/puertos/repositorio-autenticacion.js";
import { resolverEsSuperadministrador } from "../dominio/superadministrador.js";
import { validarYNormalizarHost } from "../dominio/validador-host-qlik.js";
import { hash } from "./hashing-postgres.js";

export async function guardarAccesoPostgres(
  db: ConexionDb,
  cifrado: ServicioCifradoPuerto,
  superadminMail: string | undefined,
  datos: DatosNuevaSesion,
): Promise<{ tokenSesion: string }> {
  const tokenSesion = crypto.randomBytes(32).toString("hex");
  const tokenSesionHash = hash(tokenSesion);
  const expiraSesionEn = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const tokenExpiraEn = new Date(
    Date.now() + datos.tokens.expiraEnSegundos * 1000,
  );

  await db.transaction(async (tx) => {
    const tenant = await tx.query.tenantsQlik.findFirst({
      where: and(
        eq(tenantsQlik.id, datos.tenantQlikId),
        eq(tenantsQlik.host, validarYNormalizarHost(datos.hostTenant)),
      ),
    });
    if (!tenant || tenant.estado !== "activo") {
      throw new Error("Tenant Qlik no registrado o inactivo");
    }
    const organizacionId = tenant.organizacionId;

    let identidad = await tx.query.identidadesQlik.findFirst({
      where: and(
        eq(identidadesQlik.usuarioIdQlik, datos.usuarioQlik.id),
        eq(identidadesQlik.tenantQlikId, tenant.id),
      ),
    });

    let usuario = identidad
      ? await tx.query.usuarios.findFirst({
          where: eq(usuarios.id, identidad.usuarioId),
        })
      : undefined;

    const correoNormalizado = datos.usuarioQlik.correo?.trim().toLowerCase();
    if (!usuario && correoNormalizado) {
      usuario = await tx.query.usuarios.findFirst({
        where: eq(usuarios.correo, correoNormalizado),
      });
    }

    const esSuperadmin = resolverEsSuperadministrador({
      persistido: Boolean(usuario?.esSuperadmin),
      correo: correoNormalizado,
      correosHeredados:
        superadminMail ??
        process.env.SUPERADMINMAIL ??
        process.env.SUPERADMIN_EMAIL,
    });

    if (!usuario && !esSuperadmin) {
      const superadminDeOrg = await tx.query.usuarios.findFirst({
        where: and(
          eq(usuarios.esSuperadmin, true),
          eq(usuarios.estado, "activo"),
        ),
      });
      if (superadminDeOrg) {
        const membresiaSuperadmin =
          await tx.query.membresiasOrganizacion.findFirst({
            where: and(
              eq(membresiasOrganizacion.usuarioId, superadminDeOrg.id),
              eq(membresiasOrganizacion.organizacionId, organizacionId),
            ),
          });
        if (membresiaSuperadmin) {
          usuario = superadminDeOrg;
        }
      }
    }

    if (!usuario && !esSuperadmin) {
      throw new Error(
        "Acceso denegado. Tu correo no ha sido pre-registrado por el administrador del tenant.",
      );
    }

    if (!usuario) {
      const [usuarioCreado] = await tx
        .insert(usuarios)
        .values({
          nombre:
            datos.usuarioQlik.nombre ??
            datos.usuarioQlik.correo ??
            "Usuario Qlik",
          correo: correoNormalizado ?? null,
          avatarUrl: datos.usuarioQlik.avatarUrl ?? null,
          esSuperadmin,
          ultimoAccesoEn: new Date(),
        })
        .returning();
      if (!usuarioCreado) throw new Error("No se pudo crear el usuario");
      usuario = usuarioCreado;
    } else {
      await tx
        .update(usuarios)
        .set({
          nombre: datos.usuarioQlik.nombre ?? usuario.nombre,
          correo: correoNormalizado ?? usuario.correo,
          avatarUrl: datos.usuarioQlik.avatarUrl ?? usuario.avatarUrl,
          esSuperadmin: Boolean(usuario.esSuperadmin) || esSuperadmin,
          ultimoAccesoEn: new Date(),
          actualizadoEn: new Date(),
        })
        .where(eq(usuarios.id, usuario.id));
    }

    if (!identidad) {
      const [identidadCreada] = await tx
        .insert(identidadesQlik)
        .values({
          usuarioId: usuario.id,
          tenantQlikId: tenant.id,
          usuarioIdQlik: datos.usuarioQlik.id,
          sujetoQlik: datos.usuarioQlik.id,
          nombreQlik: datos.usuarioQlik.nombre ?? null,
          correoQlik: datos.usuarioQlik.correo ?? null,
          avatarQlik: datos.usuarioQlik.avatarUrl ?? null,
          estadoQlik: "activo",
        })
        .returning();
      if (!identidadCreada)
        throw new Error("No se pudo crear la identidad Qlik");
      identidad = identidadCreada;
    } else {
      await tx
        .update(identidadesQlik)
        .set({
          nombreQlik: datos.usuarioQlik.nombre ?? identidad.nombreQlik,
          correoQlik: datos.usuarioQlik.correo ?? identidad.correoQlik,
          avatarQlik: datos.usuarioQlik.avatarUrl ?? identidad.avatarQlik,
          sincronizadoEn: new Date(),
          actualizadoEn: new Date(),
        })
        .where(eq(identidadesQlik.id, identidad.id));
    }

    const membresia = await tx.query.membresiasOrganizacion.findFirst({
      where: and(
        eq(membresiasOrganizacion.organizacionId, organizacionId),
        eq(membresiasOrganizacion.usuarioId, usuario.id),
      ),
    });
    if (!membresia) {
      await tx.insert(membresiasOrganizacion).values({
        organizacionId,
        usuarioId: usuario.id,
        rol: esSuperadmin ? "admin" : "usuario",
      });
    }

    const accesoCifrado = JSON.stringify(
      cifrado.cifrar(datos.tokens.tokenAcceso),
    );
    const refrescoCifrado = datos.tokens.tokenRefresco
      ? JSON.stringify(cifrado.cifrar(datos.tokens.tokenRefresco))
      : null;
    const credencial = await tx.query.credencialesQlik.findFirst({
      where: eq(credencialesQlik.identidadQlikId, identidad.id),
    });
    if (credencial) {
      await tx
        .update(credencialesQlik)
        .set({
          tokenAccesoCifrado: accesoCifrado,
          tokenRefrescoCifrado: refrescoCifrado,
          tokenExpiraEn,
          scopes: datos.tokens.scopes,
          estado: "activa",
          version: credencial.version + 1,
          actualizadoEn: new Date(),
        })
        .where(eq(credencialesQlik.id, credencial.id));
    } else {
      await tx.insert(credencialesQlik).values({
        identidadQlikId: identidad.id,
        tokenAccesoCifrado: accesoCifrado,
        tokenRefrescoCifrado: refrescoCifrado,
        scopes: datos.tokens.scopes,
        tokenExpiraEn,
      });
    }

    await tx.insert(sesionesUsuario).values({
      usuarioId: usuario.id,
      identidadQlikId: identidad.id,
      tenantQlikActivoId: tenant.id,
      tokenSesionHash,
      ipCreacion: datos.ip,
      agenteUsuario: datos.agenteUsuario,
      expiraEn: expiraSesionEn,
    });
  });

  return { tokenSesion };
}
