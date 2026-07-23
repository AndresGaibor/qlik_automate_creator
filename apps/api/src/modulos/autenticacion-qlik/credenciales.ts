import { eq } from "drizzle-orm";
import { db } from "../../infraestructura/base-datos/conexion.js";
import { credencialesQlik } from "../../infraestructura/base-datos/esquema.js";
import { servicioCifrado } from "../../infraestructura/cifrado/servicio.js";
import type { InfoSesion } from "./sesion.js";

export interface CredencialesQlik {
  host: string;
  token: string;
}

/**
 * Obtiene las credenciales Qlik descifradas a partir de la sesión del usuario.
 *
 * Flujo:
 * 1. Busca credencial por `identidadQlikId`
 * 2. Valida estado `activa` y expiración futura
 * 3. Parsea JSON y descifra el token
 * 4. Devuelve `{ host, token }` solo en memoria
 *
 * Returns null si falta, expiró, está revocada o está corrupta.
 * Nunca expone token cifrado ni errores internos al caller.
 */
export async function obtenerCredencialesQlik(
  infoSesion: InfoSesion,
): Promise<CredencialesQlik | null> {
  const credencial = await db.query.credencialesQlik.findFirst({
    where: eq(credencialesQlik.identidadQlikId, infoSesion.identidadQlikId),
  });

  if (!credencial) {
    return null;
  }

  // Validar estado activo
  if (credencial.estado !== "activa") {
    return null;
  }

  // Validar que no esté expirada
  const ahora = new Date();
  if (credencial.tokenExpiraEn.getTime() <= ahora.getTime()) {
    return null;
  }

  // Parsear JSON del token cifrado
  let datosCifrados: { cifrado: string; iv: string; tag: string };
  try {
    datosCifrados = JSON.parse(credencial.tokenAccesoCifrado);
  } catch {
    return null;
  }

  // Descifrar token
  let token: string;
  try {
    token = servicioCifrado.descifrar(
      datosCifrados.cifrado,
      datosCifrados.iv,
      datosCifrados.tag,
    );
  } catch {
    return null;
  }

  return {
    host: infoSesion.tenantHost,
    token,
  };
}
