import { describe, expect, it } from "bun:test";
import { crearRutasSetup } from "./rutas-setup.js";

const entrada = {
  organizacionNombre: "Empresa",
  qlikTenantHost: "empresa.us.qlikcloud.com",
  qlikClientId: "cliente-1",
  qlikClientSecret: "secreto-super-privado",
  qlikScopes: ["user_default"],
  superadminNombre: "Ada Lovelace",
  superadminCorreo: "ada@example.com",
};

describe("rutas de setup", () => {
  it("no expone secretos ni detalles internos cuando falla la inicialización", async () => {
    const app = crearRutasSetup(
      {
        obtener: async () => null,
        guardar: async () => undefined,
        obtenerConfiguracionSetup: async () => ({ completado: false }),
        marcarSetupCompleto: async () => undefined,
        estaConfigurado: async () => false,
        ejecutarSiPendiente: async (tarea) => tarea(),
      },
      async () => {
        throw new Error("fallo postgres: secreto-super-privado");
      },
    );

    const respuesta = await app.request("/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entrada),
    });
    const cuerpo = await respuesta.json();

    expect(respuesta.status).toBe(500);
    expect(cuerpo.error.codigo).toBe("SETUP_ERROR");
    expect(cuerpo.error.mensaje).toBe(
      "No se pudo completar la configuración inicial",
    );
    expect(JSON.stringify(cuerpo)).not.toContain("secreto-super-privado");
    expect(JSON.stringify(cuerpo)).not.toContain("postgres");
  });
});
