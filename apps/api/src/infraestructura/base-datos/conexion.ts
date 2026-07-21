import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./esquema.js";

class DbHolder {
  private _db: ReturnType<typeof drizzle> | null = null;

  private get connectionString() {
    const cs = process.env.DATABASE_URL;
    if (!cs) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    return cs;
  }

  private get client() {
    return postgres(this.connectionString);
  }

  get db() {
    if (!this._db) {
      this._db = drizzle(this.client, { schema });
    }
    return this._db;
  }
}

const dbHolder = new DbHolder();
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_, prop) {
    return Reflect.get(dbHolder.db, prop);
  },
});
