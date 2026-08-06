import { describe, expect, it } from "bun:test";
import { RepositorioConexionesDestinoPostgres } from "./repositorio-conexiones-destino-postgres.js";

describe("RepositorioConexionesDestinoPostgres", () => {
  it("guarda el secreto cifrado separado de la configuración", async () => {
    const inserciones: Record<string, unknown>[] = [];
    let numeroInsercion = 0;
    const fila = {
      id: "destino-1",
      organizacionId: "org-1",
      tipo: "postgres",
      nombre: "Producción",
      estado: "activo",
      mensajeError: null,
      probadaEn: null,
      config: { host: "db.interno" },
      secretoRefs: { password: "POSTGRES_DESTINO_PRODUCCION" },
    };
    const tx = {
      insert: () => {
        numeroInsercion += 1;
        const actual = numeroInsercion;
        return {
          values: (valores: Record<string, unknown>) => {
            inserciones.push(valores);
            if (actual === 1) {
              return {
                onConflictDoUpdate: () => ({ returning: async () => [fila] }),
              };
            }
            return {
              onConflictDoUpdate: async () => undefined,
            };
          },
        };
      },
    };
    const db = {
      transaction: async (fn: (trx: typeof tx) => Promise<unknown>) => fn(tx),
    };
    const cifrado = {
      cifrar: (valor: string) => ({
        cifrado: `enc:${valor}`,
        iv: "iv",
        tag: "tag",
      }),
      descifrar: () => "secreto",
    };
    const repositorio = new RepositorioConexionesDestinoPostgres(
      db as never,
      cifrado,
    );

    const resultado = await repositorio.guardarParaTenant({
      organizacionId: "org-1",
      tenantQlikId: "tenant-1",
      tipo: "postgres",
      nombre: "Producción",
      config: { host: "db.interno" },
      secretoRefs: { password: "POSTGRES_DESTINO_PRODUCCION" },
      secreto: { nombre: "POSTGRES_DESTINO_PRODUCCION", valor: "secreto" },
    });

    expect(resultado.id).toBe("destino-1");
    expect(inserciones[0]).not.toHaveProperty("password");
    expect(inserciones[1]).toMatchObject({
      conexionDestinoId: "destino-1",
      nombre: "POSTGRES_DESTINO_PRODUCCION",
    });
    expect(JSON.stringify(inserciones[1])).not.toContain('"secreto"');
  });
});
