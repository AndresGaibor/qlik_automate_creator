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

  async obtenerTenantPorHost(host: string) {
    const tenant = await db.query.tenantsQlik.findFirst({
      where: eq(tenantsQlik.host, normalizarHost(host)),
    });
    return tenant
      ? {
          id: tenant.id,
          host: tenant.host,
          estado: tenant.estado as "activo" | "desconectado" | "suspendido",
        }
      : null;
  }

  async obtenerTenantPorId(id: string) {
    const tenant = await db.query.tenantsQlik.findFirst({
      where: eq(tenantsQlik.id, id),
    });
    return tenant
      ? {
          id: tenant.id,
          host: tenant.host,
          estado: tenant.estado as "activo" | "desconectado" | "suspendido",
        }
      : null;
  }

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
      const tenant = await tx.query.tenantsQlik.findFirst({
        where: and(
          eq(tenantsQlik.id, datos.tenantQlikId),
          eq(tenantsQlik.host, normalizarHost(datos.hostTenant)),
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
        tenantQlikActivoId: tenant.id,
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
        where: and(
          eq(identidadesQlik.usuarioId, sesion.usuarioId),
          eq(identidadesQlik.tenantQlikId, sesion.tenantQlikActivoId),
        ),
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

    const tenantsDisponibles = await this.listarTenantsDisponibles(tokenSesion);
    return {
      tenantHost: tenant.host,
      tenantActivoId: tenant.id,
      tenantsDisponibles,
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
      where: and(
        eq(identidadesQlik.usuarioId, sesion.usuarioId),
        eq(identidadesQlik.tenantQlikId, sesion.tenantQlikActivoId),
      ),
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

  async listarTenantsDisponibles(tokenSesion: string) {
    const sesion = await this.buscarSesionValida(tokenSesion);
    if (!sesion) return [];
    const identidades = await db.query.identidadesQlik.findMany({
      where: eq(identidadesQlik.usuarioId, sesion.usuarioId),
    });
    const resultado = [];
    for (const identidad of identidades) {
      const tenant = await db.query.tenantsQlik.findFirst({
        where: and(
          eq(tenantsQlik.id, identidad.tenantQlikId),
          eq(tenantsQlik.estado, "activo"),
        ),
      });
      if (!tenant) continue;
      const organizacion = await db.query.organizaciones.findFirst({
        where: eq(organizaciones.id, tenant.organizacionId),
      });
      if (!organizacion || organizacion.estado !== "activa") continue;
      resultado.push({
        id: tenant.id,
        host: tenant.host,
        nombre: tenant.nombre,
        organizacionId: organizacion.id,
        organizacionNombre: organizacion.nombre,
        esPrincipal: tenant.esPrincipal,
      });
    }
    return resultado;
  }

  async cambiarTenantActivo(tokenSesion: string, tenantQlikId: string) {
    const sesion = await this.buscarSesionValida(tokenSesion);
    if (!sesion) return false;
    const identidad = await db.query.identidadesQlik.findFirst({
      where: and(
        eq(identidadesQlik.usuarioId, sesion.usuarioId),
        eq(identidadesQlik.tenantQlikId, tenantQlikId),
      ),
    });
    const tenant = await db.query.tenantsQlik.findFirst({
      where: and(
        eq(tenantsQlik.id, tenantQlikId),
        eq(tenantsQlik.estado, "activo"),
      ),
    });
    if (!identidad || !tenant) return false;
    const credencial = await db.query.credencialesQlik.findFirst({
      where: eq(credencialesQlik.identidadQlikId, identidad.id),
    });
    if (!credencial || credencial.estado !== "activa") return false;
    await db
      .update(sesionesUsuario)
      .set({
        tenantQlikActivoId: tenant.id,
        identidadQlikId: identidad.id,
      })
      .where(eq(sesionesUsuario.id, sesion.id));
    return true;
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

function normalizarHost(host: string): string {
  const valor = /^https?:\/\//i.test(host) ? host : `https://${host}`;
  const url = new URL(valor);
  if (url.protocol !== "https:" || url.pathname !== "/") {
    throw new Error("El host Qlik debe ser HTTPS y no contener ruta");
  }
  return url.host.toLowerCase();
}
