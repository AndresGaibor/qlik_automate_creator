import { describe, expect, it } from "bun:test";
import { ConsultaConfiguracionImpalaPostgres } from "./consulta-configuracion-impala-postgres.js";

function crearDb(fila: Record<string, unknown> | null) {
  return {
    query: {
      tenantsQlik: {
        findFirst: async () => fila,
      },
    },
  };
}

const cifrado = {
  cifrar: () => ({ cifrado: "", iv: "", tag: "" }),
  descifrar: (valor: string) => valor.replace("encrypted-", ""),
};

describe("ConsultaConfiguracionImpalaPostgres", () => {
  it("devuelve null cuando el tenant no tiene Impala configurado", async () => {
    const consulta = new ConsultaConfiguracionImpalaPostgres(
      crearDb({ impalaHost: null }) as never,
      cifrado,
    );

    await expect(consulta.obtener("tenant-1")).resolves.toBeNull();
  });

  it("mapea la configuración y descifra la contraseña en infraestructura", async () => {
    const consulta = new ConsultaConfiguracionImpalaPostgres(
      crearDb({
        impalaHost: "impala.interno",
        impalaPort: 21050,
        impalaAuthMechanism: "LDAP",
        impalaUser: "etl",
        impalaPasswordCifrada: JSON.stringify({
          cifrado: "encrypted-secreto",
          iv: "iv",
          tag: "tag",
        }),
        impalaDatabase: "reportes",
      }) as never,
      cifrado,
    );

    await expect(consulta.obtener("tenant-1")).resolves.toEqual({
      host: "impala.interno",
      port: 21050,
      authMechanism: "LDAP",
      user: "etl",
      password: "secreto",
      database: "reportes",
    });
  });
});
