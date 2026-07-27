import { and, eq, isNull, sql } from "drizzle-orm";
import { sesionesUsuario } from "../../../plataforma/persistencia/esquema.js";
import type { ConexionDb } from "../aplicacion/puertos/repositorio-autenticacion.js";
import { hash } from "./hashing-postgres.js";

export async function buscarSesionValida(db: ConexionDb, tokenSesion: string) {
  return db.query.sesionesUsuario.findFirst({
    where: and(
      eq(sesionesUsuario.tokenSesionHash, hash(tokenSesion)),
      sql`${sesionesUsuario.expiraEn} > NOW()`,
      isNull(sesionesUsuario.revocadaEn),
    ),
  });
}

export async function revocarSesion(
  db: ConexionDb,
  tokenSesion: string,
): Promise<void> {
  await db
    .update(sesionesUsuario)
    .set({ revocadaEn: new Date() })
    .where(eq(sesionesUsuario.tokenSesionHash, hash(tokenSesion)));
}
