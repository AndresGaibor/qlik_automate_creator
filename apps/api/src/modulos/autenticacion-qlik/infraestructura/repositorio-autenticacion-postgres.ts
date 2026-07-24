import crypto from "node:crypto";
import { and, eq, isNull, sql } from "drizzle-orm";
import { db } from "../../../plataforma/persistencia/conexion.js";
import {
  credencialesQlik,
  identidadesQlik,
  membresiasOrganizacion,
  organizaciones,
  sesionesUsuario,
  tenantsQlik,
  usuarios,
} from "../../../plataforma/persistencia/esquema.js";
import { servicioCifrado } from "../../../plataforma/seguridad/servicio-cifrado.js";
import type {
  DatosNuevaSesion,
  RepositorioAutenticacion,
} from "../aplicacion/puertos/repositorio-autenticacion.js";
import type {
  CredencialesQlik,
  InfoSesion,
  SesionPublica,
} from "../dominio/modelos.js";

export class RepositorioAutenticacionPostgres
  implements RepositorioAutenticacion
{
  constructor(private readonly superadminMail?: string) {}

  async guardarAcceso(
    datos: DatosNuevaSesion,
  ): Promise<{ tokenSesion: string }> {
    const tokenSesion = crypto.randomBytes(32).toString("hex");
    const tokenSesionHash = hash(tokenSesion);
    const expiraSesionEn = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const tokenExpiraEn = new Date(
      Date.now() + datos.tokens.expiraEnSegundos * 1000,
    );

    await db.transaction(async (tx) => {
      let tenant = await tx.query.tenantsQlik.findFirst({
        where: eq(tenantsQlik.host, datos.hostTenant),
      });

      let organizacionId: string;
      if (!tenant) {
        const [organizacion] = await tx
          .insert(organizaciones)
          .values({ nombre: `Qlik - ${datos.hostTenant}` })
          .returning();
        if (!organizacion) throw new Error("No se pudo crear la organización");
        const [tenantCreado] = await tx
          .insert(tenantsQlik)
          .values({
            tenantIdQlik: datos.hostTenant,
            host: datos.hostTenant,
            nombre: "Tenant principal",
            organizacionId: organizacion.id,
          })
          .returning();
        if (!tenantCreado) throw new Error("No se pudo crear el tenant Qlik");
        tenant = tenantCreado;
        organizacionId = organizacion.id;
      } else {
        organizacionId = tenant.organizacionId;
      }

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

      if (!usuario && datos.usuarioQlik.correo) {
        usuario = await tx.query.usuarios.findFirst({
          where: eq(usuarios.correo, datos.usuarioQlik.correo),
        });
      }

      if (!usuario) {
        const [usuarioCreado] = await tx
          .insert(usuarios)
          .values({
            nombre:
              datos.usuarioQlik.nombre ??
              datos.usuarioQlik.correo ??
              "Usuario Qlik",
            correo: datos.usuarioQlik.correo ?? null,
            avatarUrl: datos.usuarioQlik.avatarUrl ?? null,
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
            correo: datos.usuarioQlik.correo ?? usuario.correo,
            avatarUrl: datos.usuarioQlik.avatarUrl ?? usuario.avatarUrl,
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
          rol: "usuario",
        });
      }

      const accesoCifrado = JSON.stringify(
        servicioCifrado.cifrar(datos.tokens.tokenAcceso),
      );
      const refrescoCifrado = datos.tokens.tokenRefresco
        ? JSON.stringify(servicioCifrado.cifrar(datos.tokens.tokenRefresco))
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
        tokenSesionHash,
        ipCreacion: datos.ip,
        agenteUsuario: datos.agenteUsuario,
        expiraEn: expiraSesionEn,
      });
    });

    return { tokenSesion };
  }

  async consultarSesion(tokenSesion: string): Promise<SesionPublica | null> {
    const sesion = await this.buscarSesionValida(tokenSesion);
    if (!sesion) return null;
    const [usuario, identidad] = await Promise.all([
      db.query.usuarios.findFirst({ where: eq(usuarios.id, sesion.usuarioId) }),
      db.query.identidadesQlik.findFirst({
        where: eq(identidadesQlik.id, sesion.identidadQlikId),
      }),
    ]);
    if (!identidad) return null;
    const tenant = await db.query.tenantsQlik.findFirst({
      where: eq(tenantsQlik.id, identidad.tenantQlikId),
    });
    if (!tenant) return null;

    let esSuperadmin = false;
    let membresias: Array<{
      organizacionId: string;
      organizacionNombre: string;
      rol: "admin" | "usuario";
    }> = [];

    if (usuario?.correo && usuario.correo === this.superadminMail) {
      esSuperadmin = true;
      const todasOrg = await db.query.organizaciones.findMany();
      membresias = todasOrg.map((org) => ({
        organizacionId: org.id,
        organizacionNombre: org.nombre,
        rol: "admin" as const,
      }));
    } else {
      const membresiasRaw = await db.query.membresiasOrganizacion.findMany({
        where: eq(membresiasOrganizacion.usuarioId, sesion.usuarioId),
      });
      for (const m of membresiasRaw) {
        const org = await db.query.organizaciones.findFirst({
          where: eq(organizaciones.id, m.organizacionId),
        });
        if (org) {
          const rolMap: Record<string, "admin" | "usuario"> = {
            administrador: "admin",
            admin: "admin",
            usuario: "usuario",
          };
          membresias.push({
            organizacionId: org.id,
            organizacionNombre: org.nombre,
            rol: rolMap[m.rol] ?? "usuario",
          });
        }
      }
    }

    return {
      tenantHost: tenant.host,
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
      esSuperadmin,
      membresias,
    };
  }

  async obtenerInfoSesion(tokenSesion: string): Promise<InfoSesion | null> {
    const sesion = await this.buscarSesionValida(tokenSesion);
    if (!sesion) return null;
    const identidad = await db.query.identidadesQlik.findFirst({
      where: eq(identidadesQlik.id, sesion.identidadQlikId),
    });
    if (!identidad) return null;
    const tenant = await db.query.tenantsQlik.findFirst({
      where: eq(tenantsQlik.id, identidad.tenantQlikId),
    });
    if (!tenant) return null;
    return {
      sesionId: sesion.id,
      usuarioId: sesion.usuarioId,
      identidadQlikId: identidad.id,
      tenantId: tenant.id,
      tenantHost: tenant.host,
      organizacionId: tenant.organizacionId,
    };
  }

  async obtenerCredenciales(
    infoSesion: InfoSesion,
  ): Promise<CredencialesQlik | null> {
    const credencial = await db.query.credencialesQlik.findFirst({
      where: eq(credencialesQlik.identidadQlikId, infoSesion.identidadQlikId),
    });
    if (
      !credencial ||
      credencial.estado !== "activa" ||
      credencial.tokenExpiraEn <= new Date()
    ) {
      return null;
    }
    try {
      const datos = JSON.parse(credencial.tokenAccesoCifrado) as {
        cifrado: string;
        iv: string;
        tag: string;
      };
      return {
        host: infoSesion.tenantHost,
        token: servicioCifrado.descifrar(datos.cifrado, datos.iv, datos.tag),
      };
    } catch {
      return null;
    }
  }

  async revocarSesion(tokenSesion: string): Promise<void> {
    await db
      .update(sesionesUsuario)
      .set({ revocadaEn: new Date() })
      .where(eq(sesionesUsuario.tokenSesionHash, hash(tokenSesion)));
  }

  private buscarSesionValida(tokenSesion: string) {
    return db.query.sesionesUsuario.findFirst({
      where: and(
        eq(sesionesUsuario.tokenSesionHash, hash(tokenSesion)),
        sql`${sesionesUsuario.expiraEn} > NOW()`,
        isNull(sesionesUsuario.revocadaEn),
      ),
    });
  }
}

function hash(valor: string): string {
  return crypto.createHash("sha256").update(valor).digest("hex");
}
