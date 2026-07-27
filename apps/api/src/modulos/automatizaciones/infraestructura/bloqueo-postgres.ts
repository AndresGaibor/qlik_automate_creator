import { sql } from "drizzle-orm";
import type { ConexionDb } from "../../../plataforma/persistencia/conexion.js";
import type { PuertoBloqueoEjecucion } from "../aplicacion/puertos/puerto-bloqueo-ejecucion.js";

type DbType = ConexionDb;

export class BloqueoEjecucionPostgres implements PuertoBloqueoEjecucion {
  constructor(private readonly db: DbType) {}

  async ejecutarExclusivo<T>(
    clave: string,
    tarea: () => Promise<T>,
  ): Promise<T | undefined> {
    return this.db.transaction(async (tx) => {
      const [fila] = await tx.execute(
        sql`SELECT pg_try_advisory_xact_lock(hashtext(${clave})) AS adquirido`,
      );
      if (!fila?.adquirido) return undefined;
      return tarea();
    });
  }
}
