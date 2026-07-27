import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./esquema.js";

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
}

const dbHolder = new DbHolder();
export const db = dbHolder.db;
export type ConexionDb = typeof db;

export async function asegurarEsquemaTablas(): Promise<void> {
  try {
    await db.execute(sql`
      SET client_min_messages = WARNING;
      ALTER TABLE tenants_qlik ADD COLUMN IF NOT EXISTS automatizacion_base_id_qlik TEXT;
      ALTER TABLE tenants_qlik ADD COLUMN IF NOT EXISTS automatizacion_base_nombre TEXT;
      ALTER TABLE tenants_qlik ADD COLUMN IF NOT EXISTS destino_api_url TEXT;
      ALTER TABLE tenants_qlik ADD COLUMN IF NOT EXISTS destino_api_key TEXT;
      ALTER TABLE tenants_qlik ADD COLUMN IF NOT EXISTS destino_base_datos TEXT;
      ALTER TABLE tenants_qlik ADD COLUMN IF NOT EXISTS impala_host TEXT;
      ALTER TABLE tenants_qlik ADD COLUMN IF NOT EXISTS impala_port INTEGER;
      ALTER TABLE tenants_qlik ADD COLUMN IF NOT EXISTS impala_auth_mechanism TEXT;
      ALTER TABLE tenants_qlik ADD COLUMN IF NOT EXISTS impala_user TEXT;
      ALTER TABLE tenants_qlik ADD COLUMN IF NOT EXISTS impala_password TEXT;
      ALTER TABLE tenants_qlik ADD COLUMN IF NOT EXISTS impala_database TEXT;
    `);
  } catch (error) {
    console.warn("Aviso al asegurar esquema de base de datos:", error);
  }
}
