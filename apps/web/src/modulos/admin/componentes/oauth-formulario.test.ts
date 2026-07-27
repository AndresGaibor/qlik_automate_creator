import { describe, expect, it } from "vitest";
import { normalizarScopesOauth, puedeGuardarOauth } from "./oauth-formulario";

describe("formulario OAuth", () => {
  it("normaliza scopes separados por espacios, comas y líneas", () => {
    expect(
      normalizarScopesOauth(
        "user_default, offline_access\nidentity.email:read user_default",
      ),
    ).toEqual(["user_default", "offline_access", "identity.email:read"]);
  });

  it("requiere Client ID, scopes y secreto únicamente en la primera configuración", () => {
    expect(
      puedeGuardarOauth({
        clienteId: "cliente",
        scopes: ["user_default"],
        clienteSecreto: "",
        existeConfiguracionPropia: false,
      }),
    ).toBe(false);
    expect(
      puedeGuardarOauth({
        clienteId: "cliente",
        scopes: ["user_default"],
        clienteSecreto: "",
        existeConfiguracionPropia: true,
      }),
    ).toBe(true);
  });
});
