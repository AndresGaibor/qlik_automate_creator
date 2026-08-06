import { describe, expect, it } from "bun:test";
import { RepositorioConexionesDestinoPostgres } from "./repositorio-conexiones-destino-postgres.js";

describe("RepositorioConexionesDestinoPostgres", () => {
  it("hace upsert de la conexión administrativa vinculada al tenant", async () => {
    let valores: Record<string, unknown> | undefined;
    let cambios: Record<string, unknown> | undefined;
    const db = {
      insert: () => ({
        values: (entrada: Record<string, unknown>) => {
          valores = entrada;
          return {
            onConflictDoUpdate: (opciones: {
              set: Record<string, unknown>;
            }) => {
              cambios = opciones.set;
              return {
                returning: async () => [{ id: "destino-1" }],
              };
            },
          };
        },
      }),
    };
    const repositorio = new RepositorioConexionesDestinoPostgres(db as never);

    const resultado = await repositorio.guardarParaTenant({
      organizacionId: "org-1",
      tenantQlikId: "tenant-1",
      tipo: "postgres",
      nombre: "Producción",
      config: { host: "db.interno" },
    });

    expect(resultado).toEqual({ id: "destino-1" });
    expect(valores).toMatchObject({
      organizacionId: "org-1",
      tenantQlikId: "tenant-1",
      tipo: "postgres",
      nombre: "Producción",
      estado: "activo",
    });
    expect(cambios).toMatchObject({
      tenantQlikId: "tenant-1",
      config: { host: "db.interno" },
    });
  });
});
