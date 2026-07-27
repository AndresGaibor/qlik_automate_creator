import { eq, sql } from "drizzle-orm";
import type { ConexionDb } from "../../../plataforma/persistencia/conexion.js";
import { appConfig } from "../../../plataforma/persistencia/esquema.js";
import type { PuertoConfiguracionApp } from "../aplicacion/puerto/puerto-configuracion-app.js";

const CLAVE_SETUP_COMPLETADO = "setup.completado";
const CLAVE_ORGANIZACION = "setup.organizacion";

export class ConfiguracionAppPostgres implements PuertoConfiguracionApp {
  constructor(private readonly db: ConexionDb) {}

  async obtener(clave: string): Promise<unknown | null> {
    const fila = await this.db.query.appConfig.findFirst({
      where: eq(appConfig.clave, clave),
    });
    return fila?.valor ?? null;
  }

  async guardar(clave: string, valor: unknown): Promise<void> {
    await this.db
      .insert(appConfig)
      .values({ clave, valor: valor as Record<string, unknown> })
      .onConflictDoUpdate({
        target: appConfig.clave,
        set: {
          valor: valor as Record<string, unknown>,
          actualizadoEn: new Date(),
        },
      });
  }

  async estaConfigurado(): Promise<boolean> {
    return (await this.obtener(CLAVE_SETUP_COMPLETADO)) !== null;
  }

  async marcarSetupCompleto(): Promise<void> {
    await this.guardar(CLAVE_SETUP_COMPLETADO, { valor: true });
  }

  async ejecutarSiPendiente<T>(
    tarea: () => Promise<T>,
  ): Promise<T | undefined> {
    return this.db.transaction(async (tx) => {
      await tx.execute(
        sql`SELECT pg_advisory_xact_lock(hashtext('setup-inicial'))`,
      );
      const [fila] = await tx
        .select({ clave: appConfig.clave })
        .from(appConfig)
        .where(eq(appConfig.clave, CLAVE_SETUP_COMPLETADO));
      if (fila) return undefined;
      return tarea();
    });
  }

  async obtenerConfiguracionSetup() {
    const [completado, organizacion] = await Promise.all([
      this.obtener(CLAVE_SETUP_COMPLETADO),
      this.obtener(CLAVE_ORGANIZACION),
    ]);
    return {
      completado: completado !== null,
      organizacionNombre:
        typeof organizacion === "object" && organizacion !== null
          ? ((organizacion as Record<string, unknown>).nombre as string)
          : undefined,
    };
  }
}
