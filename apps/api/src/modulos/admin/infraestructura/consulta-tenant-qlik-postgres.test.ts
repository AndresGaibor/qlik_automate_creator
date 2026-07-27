import { describe, expect, it } from "bun:test";
import { ConsultaTenantQlik } from "./consulta-tenant-qlik-postgres.js";

function crearDb(tenant: Record<string, unknown>) {
  let cambios: Record<string, unknown> | undefined;
  const db = {
    query: { tenantsQlik: { findFirst: async () => tenant } },
    update: () => ({
      set: (valores: Record<string, unknown>) => {
        cambios = valores;
        return {
          where: () => ({ returning: async () => [{ ...tenant, ...valores }] }),
        };
      },
    }),
  };
  return { db, obtenerCambios: () => cambios };
}

const cifrado = {
  cifrar: (valor: string) => ({
    cifrado: `cifrado:${valor}`,
    iv: "iv",
    tag: "tag",
  }),
  descifrar: () => "",
};

describe("ConsultaTenantQlik y secretos", () => {
  it("cifra una API key nueva antes de persistirla", async () => {
    const { db, obtenerCambios } = crearDb({
      id: "tenant-1",
      organizacionId: "org-1",
      destinoApiKeyCifrada: null,
    });

    await ConsultaTenantQlik.configurarDestinoTenant(
      db as never,
      cifrado,
      "org-1",
      "tenant-1",
      "https://destino.empresa.test",
      "api-key-nueva",
    );

    expect(obtenerCambios()).toMatchObject({
      destinoApiKeyCifrada: JSON.stringify({
        cifrado: "cifrado:api-key-nueva",
        iv: "iv",
        tag: "tag",
      }),
    });
  });

  it("conserva la contraseña cifrada cuando el formulario la deja vacía", async () => {
    const { db, obtenerCambios } = crearDb({
      id: "tenant-1",
      organizacionId: "org-1",
      impalaPasswordCifrada: JSON.stringify({
        cifrado: "password-cifrada",
        iv: "iv",
        tag: "tag",
      }),
    });

    await ConsultaTenantQlik.configurarImpalaTenant(
      db as never,
      cifrado,
      "org-1",
      "tenant-1",
      { impalaHost: "impala.empresa.test" },
    );

    expect(obtenerCambios()).toMatchObject({
      impalaPasswordCifrada: JSON.stringify({
        cifrado: "password-cifrada",
        iv: "iv",
        tag: "tag",
      }),
    });
  });

  it("requiere la API key al configurar un destino por primera vez", async () => {
    const { db } = crearDb({
      id: "tenant-1",
      organizacionId: "org-1",
      destinoApiKey: null,
      destinoApiKeyCifrada: null,
    });

    await expect(
      ConsultaTenantQlik.configurarDestinoTenant(
        db as never,
        cifrado,
        "org-1",
        "tenant-1",
        "https://destino.empresa.test",
      ),
    ).rejects.toThrow("Debes ingresar la API key inicial del destino");
  });
});
