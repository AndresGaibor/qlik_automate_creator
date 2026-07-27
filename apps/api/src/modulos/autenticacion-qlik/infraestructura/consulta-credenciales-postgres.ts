import { eq } from "drizzle-orm";
import { credencialesQlik } from "../../../plataforma/persistencia/esquema.js";
import type {
  ConexionDb,
  ServicioCifradoPuerto,
} from "../aplicacion/puertos/repositorio-autenticacion.js";
import type { InfoSesion } from "../dominio/modelos.js";
import type { CredencialesQlik } from "../dominio/modelos.js";

export async function obtenerCredenciales(
  db: ConexionDb,
  cifrado: ServicioCifradoPuerto,
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
      token: cifrado.descifrar(datos.cifrado, datos.iv, datos.tag),
    };
  } catch {
    return null;
  }
}
