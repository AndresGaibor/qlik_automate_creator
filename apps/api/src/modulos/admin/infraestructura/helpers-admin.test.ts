import { describe, expect, it } from "bun:test";
import { mapearTenantQlik } from "./helpers-admin.js";

describe("mapearTenantQlik", () => {
  it("oculta los secretos y solo expone indicadores y máscaras", () => {
    const tenant = mapearTenantQlik({
      id: "tenant-1",
      organizacionId: "org-1",
      tenantIdQlik: "qlik-1",
      host: "empresa.us.qlikcloud.com",
      nombre: null,
      estado: "activo",
      esPrincipal: true,
      automatizacionBaseIdQlik: null,
      automatizacionBaseNombre: null,
      destinoApiUrl: "https://destino.empresa.test",
      destinoApiKey: "api-key-secreta",
      destinoApiKeyCifrada: "{\\\"cifrado\\\":\\\"...\\\"}",
      destinoBaseDatos: null,
      impalaHost: "impala.empresa.test",
      impalaPort: 21050,
      impalaAuthMechanism: "PLAIN",
      impalaUser: "usuario",
      impalaPassword: "password-secreta",
      impalaPasswordCifrada: "{\\\"cifrado\\\":\\\"...\\\"}",
      impalaDatabase: "default",
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    } as never);

    expect(tenant).toMatchObject({
      tieneDestinoApiKey: true,
      destinoApiKeyMascara: "••••••••",
      tieneImpalaPassword: true,
      impalaPasswordMascara: "••••••••",
    });
    expect(JSON.stringify(tenant)).not.toContain("api-key-secreta");
    expect(JSON.stringify(tenant)).not.toContain("password-secreta");
    expect(tenant).not.toHaveProperty("destinoApiKey");
    expect(tenant).not.toHaveProperty("impalaPassword");
  });
});
