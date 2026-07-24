import { sql } from "drizzle-orm";
import { db } from "../../../plataforma/persistencia/conexion.js";
import type { PuertoBloqueoEjecucion } from "../aplicacion/puertos/puerto-bloqueo-ejecucion.js";

export class BloqueoEjecucionPostgres implements PuertoBloqueoEjecucion {
  async ejecutarExclusivo<T>(
    clave: string,
    tarea: () => Promise<T>,
  ): Promise<T | undefined> {
    return db.transaction(async (tx) => {
      const [fila] = await tx.execute(
        sql`SELECT pg_try_advisory_xact_lock(hashtext(${clave})) AS adquirido`,
      );
      if (!fila?.adquirido) return undefined;
      return tarea();
    });
  }
}
