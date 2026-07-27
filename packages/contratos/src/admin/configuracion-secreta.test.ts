import { describe, expect, it } from "bun:test";
import {
  esquemaConfigurarDestinoTenant,
  esquemaConfigurarImpalaTenant,
} from "./index.js";

describe("contratos de configuración secreta", () => {
  it("permite editar un destino sin reenviar su API key", () => {
    expect(
      esquemaConfigurarDestinoTenant.safeParse({
        destinoApiUrl: "https://destino.empresa.test",
        destinoApiKey: "",
      }).success,
    ).toBe(true);
  });

  it("rechaza hosts, puertos e identificadores de Impala inseguros", () => {
    expect(
      esquemaConfigurarImpalaTenant.safeParse({
        impalaHost: "impala.empresa.test; DROP TABLE usuarios",
        impalaPort: 21050,
        impalaDatabase: "default",
      }).success,
    ).toBe(false);
    expect(
      esquemaConfigurarImpalaTenant.safeParse({
        impalaHost: "impala.empresa.test",
        impalaPort: 70000,
        impalaDatabase: "default; DROP TABLE usuarios",
      }).success,
    ).toBe(false);
  });
});
