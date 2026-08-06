import crypto from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import type { ConexionDb } from "../../../plataforma/persistencia/conexion.js";
import {
  credencialesQlik,
  identidadesQlik,
  membresiasOrganizacion,
  organizaciones,
  sesionesUsuario,
  tenantsQlik,
  usuarios,
} from "../../../plataforma/persistencia/esquema.js";
import type {
  DatosNuevaSesion,
  RepositorioAutenticacion,
  ServicioCifradoPuerto,
} from "../aplicacion/puertos/repositorio-autenticacion.js";
import type {
  CredencialesQlik,
  InfoSesion,
  SesionPublica,
} from "../dominio/modelos.js";
import { resolverEsSuperadministrador } from "../dominio/superadministrador.js";
import { validarYNormalizarHost } from "../dominio/validador-host-qlik.js";
import { obtenerCredenciales as obtenerCredencialesHelper } from "./consulta-credenciales-postgres.js";
import {
  obtenerTenantPorCorreoUsuario,
  obtenerTenantPorHost,
  obtenerTenantPorId,
} from "./consulta-identidad-postgres.js";
import {
  buscarSesionValida,
  revocarSesion as revocarSesionHelper,
} from "./consulta-sesion-postgres.js";
import { hash } from "./hashing-postgres.js";

export class RepositorioAutenticacionPostgres
  implements RepositorioAutenticacion
{
  constructor(
    private readonly db: ConexionDb,
    private readonly cifrado: ServicioCifradoPuerto,
    private readonly superadminMail?: string,
  ) {}

  async obtenerTenantPorHost(host: string) {
    return obtenerTenantPorHost(this.db, host);
  }

  async obtenerTenantPorId(id: string) {
    return obtenerTenantPorId(this.db, id);
  }

  async obtenerTenantPorCorreoUsuario(correo: string) {
    return obtenerTenantPorCorreoUsuario(this.db, correo, this.superadminMail);
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

    await this.db.transaction(async (tx) => {
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
          this.superadminMail ??
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
        this.cifrado.cifrar(datos.tokens.tokenAcceso),
      );
      const refrescoCifrado = datos.tokens.tokenRefresco
        ? JSON.stringify(this.cifrado.cifrar(datos.tokens.tokenRefresco))
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
    const sesion = await buscarSesionValida(this.db, tokenSesion);
    if (!sesion) return null;
    const [usuario, identidad] = await Promise.all([
      this.db.query.usuarios.findFirst({
        where: eq(usuarios.id, sesion.usuarioId),
      }),
      this.db.query.identidadesQlik.findFirst({
        where: and(
          eq(identidadesQlik.usuarioId, sesion.usuarioId),
          eq(identidadesQlik.tenantQlikId, sesion.tenantQlikActivoId),
        ),
      }),
    ]);
    if (!identidad) return null;
    const tenant = await this.db.query.tenantsQlik.findFirst({
      where: eq(tenantsQlik.id, identidad.tenantQlikId),
    });
    if (!tenant) return null;

    const esSuperadmin = resolverEsSuperadministrador({
      persistido: Boolean(usuario?.esSuperadmin),
      correo: usuario?.correo,
      correosHeredados:
        this.superadminMail ??
        process.env.SUPERADMINMAIL ??
        process.env.SUPERADMIN_EMAIL,
    });
    let membresias: Array<{
      organizacionId: string;
      organizacionNombre: string;
      rol: "admin" | "usuario";
    }> = [];

    if (esSuperadmin) {
      const todasOrg = await this.db.query.organizaciones.findMany();
      membresias = todasOrg.map((org) => ({
        organizacionId: org.id,
        organizacionNombre: org.nombre,
        rol: "admin" as const,
      }));
    } else {
      const membresiasRaw = await this.db.query.membresiasOrganizacion.findMany(
        {
          where: eq(membresiasOrganizacion.usuarioId, sesion.usuarioId),
        },
      );
      for (const m of membresiasRaw) {
        const org = await this.db.query.organizaciones.findFirst({
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
    const sesion = await buscarSesionValida(this.db, tokenSesion);
    if (!sesion) return null;
    const identidad = await this.db.query.identidadesQlik.findFirst({
      where: eq(identidadesQlik.id, sesion.identidadQlikId),
    });
    if (!identidad || identidad.tenantQlikId !== sesion.tenantQlikActivoId) {
      return null;
    }
    const tenant = await this.db.query.tenantsQlik.findFirst({
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
    return obtenerCredencialesHelper(this.db, this.cifrado, infoSesion);
  }

  async listarTenantsDisponibles(tokenSesion: string) {
    const sesion = await buscarSesionValida(this.db, tokenSesion);
    if (!sesion) return [];
    const identidades = await this.db.query.identidadesQlik.findMany({
      where: eq(identidadesQlik.usuarioId, sesion.usuarioId),
    });
    const resultado = new Map<
      string,
      {
        id: string;
        host: string;
        nombre: string | null;
        organizacionId: string;
        organizacionNombre: string;
        esPrincipal: boolean;
      }
    >();
    for (const identidad of identidades) {
      const tenant = await this.db.query.tenantsQlik.findFirst({
        where: and(
          eq(tenantsQlik.id, identidad.tenantQlikId),
          eq(tenantsQlik.estado, "activo"),
        ),
      });
      if (!tenant) continue;
      const organizacion = await this.db.query.organizaciones.findFirst({
        where: eq(organizaciones.id, tenant.organizacionId),
      });
      if (!organizacion || organizacion.estado !== "activa") continue;
      resultado.set(tenant.id, {
        id: tenant.id,
        host: tenant.host,
        nombre: tenant.nombre,
        organizacionId: organizacion.id,
        organizacionNombre: organizacion.nombre,
        esPrincipal: tenant.esPrincipal,
      });
    }
    return Array.from(resultado.values());
  }

  async cambiarTenantActivo(tokenSesion: string, tenantQlikId: string) {
    const sesion = await buscarSesionValida(this.db, tokenSesion);
    if (!sesion) return false;
    const identidad = await this.db.query.identidadesQlik.findFirst({
      where: and(
        eq(identidadesQlik.usuarioId, sesion.usuarioId),
        eq(identidadesQlik.tenantQlikId, tenantQlikId),
      ),
    });
    const tenant = await this.db.query.tenantsQlik.findFirst({
      where: and(
        eq(tenantsQlik.id, tenantQlikId),
        eq(tenantsQlik.estado, "activo"),
      ),
    });
    if (!identidad || !tenant) return false;
    const credencial = await this.db.query.credencialesQlik.findFirst({
      where: eq(credencialesQlik.identidadQlikId, identidad.id),
    });
    if (!credencial || credencial.estado !== "activa") return false;
    await this.db
      .update(sesionesUsuario)
      .set({
        tenantQlikActivoId: tenant.id,
        identidadQlikId: identidad.id,
      })
      .where(eq(sesionesUsuario.id, sesion.id));
    return true;
  }

  async revocarSesion(tokenSesion: string): Promise<void> {
    return revocarSesionHelper(this.db, tokenSesion);
  }
}
