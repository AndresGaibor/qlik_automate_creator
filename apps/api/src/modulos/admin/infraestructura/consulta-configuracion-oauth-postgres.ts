import { and, eq } from "drizzle-orm";
import type { ConexionDb } from "../../../plataforma/persistencia/conexion.js";
import {
  configuracionesOauthQlik,
  tenantsQlik,
} from "../../../plataforma/persistencia/esquema.js";
import type {
  ConfiguracionOauthAdministrable,
  EntradaGuardarConfiguracionOauth,
  ServicioCifradoAdministracion,
} from "../aplicacion/puertos/repositorio-administracion.js";

type FilaConfiguracionOauth = typeof configuracionesOauthQlik.$inferSelect;
type ConsultaOauthDb = {
  query: {
    tenantsQlik: {
      findFirst: ConexionDb["query"]["tenantsQlik"]["findFirst"];
    };
    configuracionesOauthQlik: {
      findFirst: ConexionDb["query"]["configuracionesOauthQlik"]["findFirst"];
    };
  };
};

export async function obtenerConfiguracionOauth(
  db: ConexionDb,
  organizacionId: string,
  tenantQlikId: string,
): Promise<ConfiguracionOauthAdministrable | null> {
  const tenant = await buscarTenant(db, organizacionId, tenantQlikId);
  if (!tenant) return null;
  const fila = await db.query.configuracionesOauthQlik.findFirst({
    where: eq(configuracionesOauthQlik.tenantQlikId, tenantQlikId),
  });
  return fila ? mapearConfiguracionOauth(fila) : null;
}
export async function guardarConfiguracionOauth(
  db: ConexionDb,
  cifrado: ServicioCifradoAdministracion,
  organizacionId: string,
  tenantQlikId: string,
  entrada: EntradaGuardarConfiguracionOauth,
): Promise<ConfiguracionOauthAdministrable | null> {
  return db.transaction(async (tx) => {
    const tenant = await buscarTenant(tx, organizacionId, tenantQlikId);
    if (!tenant) return null;
    const existente = await tx.query.configuracionesOauthQlik.findFirst({
      where: eq(configuracionesOauthQlik.tenantQlikId, tenantQlikId),
    });
    if (!entrada.clienteSecreto && !existente) {
      throw new Error("Debes ingresar el secreto OAuth inicial");
    }

    const clienteSecretoCifrado = entrada.clienteSecreto
      ? JSON.stringify(cifrado.cifrar(entrada.clienteSecreto))
      : existente?.clienteSecretoCifrado;
    const secretoSufijo = entrada.clienteSecreto
      ? entrada.clienteSecreto.slice(-4)
      : existente?.secretoSufijo;
    if (!clienteSecretoCifrado || !secretoSufijo) {
      throw new Error("No se pudo conservar el secreto OAuth");
    }

    const ahora = new Date();
    const [fila] = await tx
      .insert(configuracionesOauthQlik)
      .values({
        tenantQlikId,
        clienteId: entrada.clienteId,
        clienteSecretoCifrado,
        secretoSufijo,
        scopes: entrada.scopes,
        estado: "pendiente",
        verificadaEn: null,
        ultimoError: null,
        creadoPorUsuarioId: entrada.usuarioId ?? null,
        actualizadoPorUsuarioId: entrada.usuarioId ?? null,
        actualizadoEn: ahora,
      })
      .onConflictDoUpdate({
        target: configuracionesOauthQlik.tenantQlikId,
        set: {
          clienteId: entrada.clienteId,
          clienteSecretoCifrado,
          secretoSufijo,
          scopes: entrada.scopes,
          estado: "pendiente",
          verificadaEn: null,
          ultimoError: null,
          actualizadoPorUsuarioId: entrada.usuarioId ?? null,
          actualizadoEn: ahora,
        },
      })
      .returning();
    return fila ? mapearConfiguracionOauth(fila) : null;
  });
}

export async function eliminarConfiguracionOauth(
  db: ConexionDb,
  organizacionId: string,
  tenantQlikId: string,
): Promise<boolean> {
  const tenant = await buscarTenant(db, organizacionId, tenantQlikId);
  if (!tenant) return false;
  const eliminadas = await db
    .delete(configuracionesOauthQlik)
    .where(eq(configuracionesOauthQlik.tenantQlikId, tenantQlikId))
    .returning({ id: configuracionesOauthQlik.id });
  return eliminadas.length > 0;
}
async function buscarTenant(
  db: ConsultaOauthDb,
  organizacionId: string,
  tenantQlikId: string,
) {
  return db.query.tenantsQlik.findFirst({
    where: and(
      eq(tenantsQlik.id, tenantQlikId),
      eq(tenantsQlik.organizacionId, organizacionId),
    ),
  });
}

function mapearConfiguracionOauth(
  fila: FilaConfiguracionOauth,
): ConfiguracionOauthAdministrable {
  return {
    tenantQlikId: fila.tenantQlikId,
    clienteId: fila.clienteId,
    secretoMascara: `••••${fila.secretoSufijo}`,
    scopes: fila.scopes,
    estado: fila.estado as ConfiguracionOauthAdministrable["estado"],
    origen: "tenant",
    verificadaEn: fila.verificadaEn,
    ultimoError: fila.ultimoError,
    actualizadoEn: fila.actualizadoEn,
  };
}
