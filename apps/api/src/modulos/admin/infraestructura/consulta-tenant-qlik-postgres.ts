import { and, eq } from "drizzle-orm";
import type { ConexionDb } from "../../../plataforma/persistencia/conexion.js";
import { tenantsQlik } from "../../../plataforma/persistencia/esquema.js";
import { cifrarSecretoParaPersistencia } from "../../../plataforma/seguridad/secreto-cifrado.js";
import type {
  EstadoTenantQlik,
  ResultadoEliminarTenantQlik,
  ServicioCifradoAdministracion,
  TenantQlikAdministrable,
} from "../aplicacion/puertos/repositorio-administracion.js";
import {
  decidirSiNuevoTenantEsPrincipal,
  validarEliminacionTenantQlik,
} from "../dominio/tenant-qlik.js";
import { validarYNormalizarHost } from "../dominio/validador-host-qlik.js";
import { mapearTenantQlik } from "./helpers-admin.js";

type DbType = ConexionDb;

export const ConsultaTenantQlik = {
  async listarTenantsQlik(db: DbType, organizacionId: string) {
    const filas = await db.query.tenantsQlik.findMany({
      where: eq(tenantsQlik.organizacionId, organizacionId),
    });
    return filas.map(mapearTenantQlik);
  },

  async crearTenantQlik(
    db: DbType,
    entrada: {
      organizacionId: string;
      tenantIdQlik?: string;
      host: string;
      nombre?: string;
    },
    obtenerOrganizacion: (id: string) => Promise<{ id: string } | null>,
  ) {
    if (!(await obtenerOrganizacion(entrada.organizacionId))) return null;
    const hostNormalizado = validarYNormalizarHost(entrada.host);
    const tenantIdResolved =
      entrada.tenantIdQlik?.trim() ||
      `qlik_${hostNormalizado.replace(/[^a-zA-Z0-9]/g, "_")}`;

    return db.transaction(async (tx) => {
      const existentes = await tx.query.tenantsQlik.findMany({
        where: eq(tenantsQlik.organizacionId, entrada.organizacionId),
      });
      const [fila] = await tx
        .insert(tenantsQlik)
        .values({
          organizacionId: entrada.organizacionId,
          tenantIdQlik: tenantIdResolved,
          host: hostNormalizado,
          nombre: entrada.nombre ?? null,
          esPrincipal: decidirSiNuevoTenantEsPrincipal(existentes.length),
        })
        .returning();
      if (!fila) throw new Error("No se pudo crear el tenant Qlik");
      return mapearTenantQlik(fila);
    });
  },

  async marcarTenantQlikPrincipal(
    db: DbType,
    organizacionId: string,
    tenantQlikId: string,
  ) {
    return db.transaction(async (tx) => {
      const tenant = await tx.query.tenantsQlik.findFirst({
        where: and(
          eq(tenantsQlik.id, tenantQlikId),
          eq(tenantsQlik.organizacionId, organizacionId),
        ),
      });
      if (!tenant) return null;
      await tx
        .update(tenantsQlik)
        .set({ esPrincipal: false, actualizadoEn: new Date() })
        .where(eq(tenantsQlik.organizacionId, organizacionId));
      const [actualizado] = await tx
        .update(tenantsQlik)
        .set({ esPrincipal: true, actualizadoEn: new Date() })
        .where(eq(tenantsQlik.id, tenantQlikId))
        .returning();
      return actualizado ? mapearTenantQlik(actualizado) : null;
    });
  },

  async configurarAutomatizacionBase(
    db: DbType,
    organizacionId: string,
    tenantQlikId: string,
    automatizacionBaseIdQlik: string,
    automatizacionBaseNombre?: string,
  ) {
    const [fila] = await db
      .update(tenantsQlik)
      .set({
        automatizacionBaseIdQlik,
        automatizacionBaseNombre: automatizacionBaseNombre ?? null,
        actualizadoEn: new Date(),
      })
      .where(
        and(
          eq(tenantsQlik.id, tenantQlikId),
          eq(tenantsQlik.organizacionId, organizacionId),
        ),
      )
      .returning();

    return fila ? mapearTenantQlik(fila) : null;
  },

  async configurarDestinoTenant(
    db: DbType,
    cifrado: ServicioCifradoAdministracion,
    organizacionId: string,
    tenantQlikId: string,
    destinoApiUrl: string,
    destinoApiKey?: string,
    destinoBaseDatos?: string,
  ) {
    const existente = await db.query.tenantsQlik.findFirst({
      where: and(
        eq(tenantsQlik.id, tenantQlikId),
        eq(tenantsQlik.organizacionId, organizacionId),
      ),
    });
    if (!existente) return null;
    const secretoNuevo = destinoApiKey?.trim();
    const destinoApiKeyCifrada = secretoNuevo
      ? cifrarSecretoParaPersistencia(cifrado, secretoNuevo)
      : existente.destinoApiKeyCifrada;
    if (!destinoApiKeyCifrada) {
      throw new Error("Debes ingresar la API key inicial del destino");
    }
    const [fila] = await db
      .update(tenantsQlik)
      .set({
        destinoApiUrl,
        destinoApiKeyCifrada,
        destinoBaseDatos: destinoBaseDatos ?? "default",
        actualizadoEn: new Date(),
      })
      .where(
        and(
          eq(tenantsQlik.id, tenantQlikId),
          eq(tenantsQlik.organizacionId, organizacionId),
        ),
      )
      .returning();

    return fila ? mapearTenantQlik(fila) : null;
  },

  async configurarImpalaTenant(
    db: DbType,
    cifrado: ServicioCifradoAdministracion,
    organizacionId: string,
    tenantQlikId: string,
    datos: {
      impalaHost: string;
      impalaPort?: number;
      impalaAuthMechanism?: string;
      impalaUser?: string;
      impalaPassword?: string;
      impalaDatabase?: string;
    },
  ) {
    const existente = await db.query.tenantsQlik.findFirst({
      where: and(
        eq(tenantsQlik.id, tenantQlikId),
        eq(tenantsQlik.organizacionId, organizacionId),
      ),
    });
    if (!existente) return null;
    const secretoNuevo = datos.impalaPassword?.trim();
    const impalaPasswordCifrada = secretoNuevo
      ? cifrarSecretoParaPersistencia(cifrado, secretoNuevo)
      : existente.impalaPasswordCifrada;
    const [fila] = await db
      .update(tenantsQlik)
      .set({
        impalaHost: datos.impalaHost,
        impalaPort: datos.impalaPort ?? 21050,
        impalaAuthMechanism: datos.impalaAuthMechanism ?? "NOSASL",
        impalaUser: datos.impalaUser ?? null,
        impalaPasswordCifrada,
        impalaDatabase: datos.impalaDatabase ?? "default",
        actualizadoEn: new Date(),
      })
      .where(
        and(
          eq(tenantsQlik.id, tenantQlikId),
          eq(tenantsQlik.organizacionId, organizacionId),
        ),
      )
      .returning();

    return fila ? mapearTenantQlik(fila) : null;
  },

  async eliminarTenantQlik(
    db: DbType,
    organizacionId: string,
    tenantQlikId: string,
  ): Promise<ResultadoEliminarTenantQlik> {
    const tenant = await db.query.tenantsQlik.findFirst({
      where: and(
        eq(tenantsQlik.id, tenantQlikId),
        eq(tenantsQlik.organizacionId, organizacionId),
      ),
    });
    if (!tenant) return "NO_ENCONTRADO";
    if (validarEliminacionTenantQlik(tenant) === "REQUIERE_REEMPLAZO") {
      return "REQUIERE_REEMPLAZO";
    }
    await db.delete(tenantsQlik).where(eq(tenantsQlik.id, tenantQlikId));
    return "ELIMINADO";
  },
};
