import { describe, expect, it } from "bun:test";
import { RepositorioConfiguracionOAuthPostgres } from "./repositorio-configuracion-oauth-postgres.js";

const cifrado = {
  cifrar: (valor: string) => ({ cifrado: valor, iv: "iv", tag: "tag" }),
  descifrar: (valor: string) => `descifrado:${valor}`,
};

function dbConFila(fila: Record<string, unknown> | null) {
  return {
    query: {
      configuracionesOauthQlik: {
        findFirst: async () => fila,
      },
    },
    update: () => ({
      set: () => ({ where: async () => undefined }),
    }),
  };
}

describe("RepositorioConfiguracionOAuthPostgres", () => {
  it("persiste el secreto inicial cifrado y actualiza la configuración del tenant al repetir setup", async () => {
    let valores: Record<string, unknown> | undefined;
    let usoUpsert = false;
    const db = {
      insert: () => ({
        values: (entrada: Record<string, unknown>) => {
          valores = entrada;
          return {
            returning: async () => [{ id: "oauth-1" }],
            onConflictDoUpdate: () => {
              usoUpsert = true;
              return { returning: async () => [{ id: "oauth-1" }] };
            },
          };
        },
      }),
    };
    const repositorio = new RepositorioConfiguracionOAuthPostgres(
      db as never,
      cifrado,
      {},
    );

    await repositorio.guardarOAuthInicial(
      "tenant-1",
      "cliente-1",
      "secreto-inicial",
      ["user_default"],
    );

    expect(usoUpsert).toBe(true);
    expect(valores?.clienteSecretoCifrado).toBe(
      JSON.stringify({ cifrado: "secreto-inicial", iv: "iv", tag: "tag" }),
    );
    expect(JSON.stringify(valores)).not.toContain('"clienteSecreto"');
  });

  it("resuelve y descifra la configuración propia del tenant", async () => {
    const paquete = JSON.stringify({
      cifrado: "secreto",
      iv: "iv",
      tag: "tag",
    });
    const repositorio = new RepositorioConfiguracionOAuthPostgres(
      dbConFila({
        id: "oauth-1",
        tenantQlikId: "tenant-1",
        clienteId: "cliente-tenant",
        clienteSecretoCifrado: paquete,
        scopes: ["user_default", "offline_access"],
        estado: "pendiente",
      }) as never,
      cifrado,
      {},
    );
    const resultado = await repositorio.obtenerParaTenant("tenant-1");

    expect(resultado).toEqual({
      configuracionId: "oauth-1",
      origen: "tenant",
      clienteId: "cliente-tenant",
      clienteSecreto: "descifrado:secreto",
      scopes: ["user_default", "offline_access"],
    });
  });

  it("usa el entorno global solo cuando el tenant no tiene configuración", async () => {
    const repositorio = new RepositorioConfiguracionOAuthPostgres(
      dbConFila(null) as never,
      cifrado,
      {
        clienteId: "cliente-global",
        clienteSecreto: "secreto-global",
        scopes: ["user_default"],
      },
    );

    const resultado = await repositorio.obtenerParaTenant("tenant-1");

    expect(resultado).toEqual({
      origen: "entorno_global",
      clienteId: "cliente-global",
      clienteSecreto: "secreto-global",
      scopes: ["user_default"],
    });
  });

  it("no cae al entorno global cuando la configuración propia está desactivada", async () => {
    const repositorio = new RepositorioConfiguracionOAuthPostgres(
      dbConFila({
        id: "oauth-1",
        tenantQlikId: "tenant-1",
        clienteId: "cliente-tenant",
        clienteSecretoCifrado: "{}",
        scopes: [],
        estado: "desactivada",
      }) as never,
      cifrado,
      {
        clienteId: "cliente-global",
        clienteSecreto: "secreto-global",
        scopes: [],
      },
    );

    expect(repositorio.obtenerParaTenant("tenant-1")).rejects.toThrow(
      "desactivada",
    );
  });
});
