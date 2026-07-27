import { describe, expect, it } from "bun:test";
import { ServicioSetup } from "./servicio-setup.js";

const entrada = {
  organizacionNombre: "Empresa",
  qlikTenantHost: "empresa.us.qlikcloud.com",
  qlikClientId: "cliente-1",
  qlikClientSecret: "secreto-super-privado",
  qlikScopes: ["user_default"],
  superadminNombre: "Ada Lovelace",
  superadminCorreo: "ada@example.com",
};

const resultado = {
  organizacionId: "org-1",
  tenantQlikId: "tenant-1",
  superadminId: "admin-1",
};

describe("ServicioSetup", () => {
  it("rechaza completar el setup cuando ya está completado", async () => {
    const servicio = new ServicioSetup(
      {
        obtener: async () => null,
        guardar: async () => undefined,
        obtenerConfiguracionSetup: async () => ({ completado: true }),
        marcarSetupCompleto: async () => undefined,
        estaConfigurado: async () => true,
        ejecutarSiPendiente: async (tarea) => tarea(),
      },
      async () => resultado,
    );

    await expect(servicio.completar(entrada)).rejects.toThrow(
      "SETUP_YA_COMPLETADO",
    );
  });

  it("ejecuta una sola inicialización cuando dos solicitudes compiten", async () => {
    let completado = false;
    let enCurso = false;
    let liberar!: () => void;
    let ejecucionesBootstrap = 0;
    const bloqueo = new Promise<void>((resolve) => {
      liberar = resolve;
    });

    const servicio = new ServicioSetup(
      {
        obtener: async () => null,
        guardar: async (clave) => {
          if (clave === "setup.completado") completado = true;
        },
        obtenerConfiguracionSetup: async () => ({ completado }),
        marcarSetupCompleto: async () => undefined,
        estaConfigurado: async () => completado,
        ejecutarSiPendiente: async (tarea) => {
          if (enCurso || completado) return undefined;
          enCurso = true;
          return tarea();
        },
      },
      async () => {
        ejecucionesBootstrap++;
        await bloqueo;
        return resultado;
      },
    );

    const primera = servicio.completar(entrada);
    const segunda = servicio.completar(entrada);
    const segundaRechazada = expect(segunda).rejects.toThrow(
      "SETUP_YA_COMPLETADO",
    );
    liberar();

    await expect(primera).resolves.toEqual(resultado);
    await segundaRechazada;
    expect(ejecucionesBootstrap).toBe(1);
  });

  it("guarda solo claves de setup y no persiste el secreto OAuth en app_config", async () => {
    const claves: string[] = [];
    const valores: unknown[] = [];
    const secretosOAuth: string[] = [];
    const servicio = new ServicioSetup(
      {
        obtener: async () => null,
        guardar: async (clave, valor) => {
          claves.push(clave);
          valores.push(valor);
        },
        obtenerConfiguracionSetup: async () => ({ completado: false }),
        marcarSetupCompleto: async () => undefined,
        estaConfigurado: async () => false,
        ejecutarSiPendiente: async (tarea) => tarea(),
      },
      async () => resultado,
      async (_tenantId, _clienteId, secreto) => {
        secretosOAuth.push(secreto);
        return "oauth-1";
      },
    );

    await servicio.completar(entrada);

    expect(claves).toEqual(["setup.organizacion", "setup.completado"]);
    expect(JSON.stringify(valores)).not.toContain(entrada.qlikClientSecret);
    expect(secretosOAuth).toEqual([entrada.qlikClientSecret]);
  });
});
