import { describe, expect, it, vi } from "bun:test";
import { cifrarSecretosDestinoExistentes } from "./cifrar-secretos-destino.js";

describe("cifrarSecretosDestinoExistentes", () => {
  it("migra password una vez y elimina el valor de config", async () => {
    const listarPendientes = vi
      .fn()
      .mockResolvedValueOnce([
        { id: "destino-1", config: { user: "demo", password: "secreto" } },
      ])
      .mockResolvedValueOnce([]);
    const guardarMigracion = vi.fn(async () => undefined);

    const resultado = await cifrarSecretosDestinoExistentes(
      { listarPendientes, guardarMigracion },
      {
        cifrar: (valor) => ({
          cifrado: `cifrado:${valor}`,
          iv: "iv",
          tag: "tag",
        }),
      },
    );

    expect(guardarMigracion).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "destino-1",
        config: { user: "demo" },
        valorCifrado: JSON.stringify({
          cifrado: "cifrado:secreto",
          iv: "iv",
          tag: "tag",
        }),
      }),
    );
    expect(resultado).toEqual({ migrados: 1, omitidos: 0 });
  });
});
