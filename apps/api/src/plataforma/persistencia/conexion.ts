import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./esquema.js";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

class DbHolder {
  private _db: ReturnType<typeof drizzle<typeof schema>> | null = null;
  private _client: ReturnType<typeof postgres> | null = null;

  private get connectionString() {
    const cs =
      process.env.DATABASE_URL ??
      "postgres://qlik_app:desarrollo@localhost:5432/qlik_automatizaciones";
    return cs;
  }

  get client() {
    if (!this._client) {
      this._client = postgres(this.connectionString);
    }
    return this._client;
  }

  get db() {
    if (!this._db) {
      this._db = drizzle(this.client, { schema });
    }
    return this._db;
  }

  async cerrar(): Promise<void> {
    if (!this._client) return;
    const cliente = this._client;
    this._client = null;
    this._db = null;
    await cliente.end({ timeout: 5 });
  }
}

const dbHolder = new DbHolder();
export const db = dbHolder.db;
export { dbHolder };
export type ConexionDb = typeof db;

export async function cerrarConexion(): Promise<void> {
  await dbHolder.cerrar();
}

export async function ejecutarMigraciones(): Promise<void> {
  await db.execute(sql`SET client_min_messages = 'WARNING'`);

  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS _migrations_lock (
        id INTEGER PRIMARY KEY,
        locked BOOLEAN DEFAULT FALSE
      )
    `);
  } catch {
    // tabla _migrations_lock puede no existir aún
  }

  const migrationsDir = join(process.cwd(), "drizzle");

  let archivos: string[] = [];
  try {
    archivos = readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();
  } catch {
    console.warn("No se encontró directorio de migraciones:", migrationsDir);
    return;
  }

  for (const archivo of archivos) {
    try {
      const contenido = readFileSync(join(migrationsDir, archivo), "utf8");
      await db.execute(sql.raw(contenido));
      console.log("✓ Migración:", archivo);
    } catch (error) {
      console.warn("✗ Error en migración", archivo + ":", error);
    }
  }
}

export async function asegurarEsquemaTablas(): Promise<void> {
  await ejecutarMigraciones();

  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS app_config (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        clave text NOT NULL UNIQUE,
        valor jsonb NOT NULL DEFAULT '{}',
        actualizado_en timestamp with time zone NOT NULL DEFAULT NOW()
      )
    `);
  } catch (error) {
    console.warn("Aviso al asegurar esquema de app_config:", error);
  }

  try {
    await db.execute(sql`
      ALTER TABLE tenants_qlik ADD COLUMN IF NOT EXISTS automatizacion_base_id_qlik TEXT;
      ALTER TABLE tenants_qlik ADD COLUMN IF NOT EXISTS automatizacion_base_nombre TEXT;
      ALTER TABLE tenants_qlik ADD COLUMN IF NOT EXISTS destino_api_url TEXT;
      ALTER TABLE tenants_qlik ADD COLUMN IF NOT EXISTS destino_api_key_cifrada TEXT;
      ALTER TABLE tenants_qlik ADD COLUMN IF NOT EXISTS destino_base_datos TEXT;
      ALTER TABLE tenants_qlik ADD COLUMN IF NOT EXISTS impala_host TEXT;
      ALTER TABLE tenants_qlik ADD COLUMN IF NOT EXISTS impala_port INTEGER;
      ALTER TABLE tenants_qlik ADD COLUMN IF NOT EXISTS impala_auth_mechanism TEXT;
      ALTER TABLE tenants_qlik ADD COLUMN IF NOT EXISTS impala_user TEXT;
      ALTER TABLE tenants_qlik ADD COLUMN IF NOT EXISTS impala_password_cifrada TEXT;
      ALTER TABLE tenants_qlik ADD COLUMN IF NOT EXISTS impala_database TEXT;
    `);
  } catch (error) {
    console.warn("Aviso al asegurar esquema de tenants_qlik:", error);
  }
}
