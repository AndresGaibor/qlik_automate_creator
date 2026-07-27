import { generarUuid } from "../../../nucleo/valores/generar-uuid.js";
import type { PuertoConfiguracionApp } from "./puerto/puerto-configuracion-app.js";

export interface EntradaSetup {
  organizacionNombre: string;
  qlikTenantHost: string;
  qlikClientId: string;
  qlikClientSecret: string;
  qlikScopes: string[];
  superadminNombre: string;
  superadminCorreo: string;
  frontendUrl?: string;
}

export interface EntradaBootstrap {
  organizacionNombre: string;
  tenantNombre: string;
  tenantHost: string;
  tenantIdQlik: string;
  superadminCorreo: string;
  superadminNombre: string;
}

export interface ResultadoSetup {
  organizacionId: string;
  tenantQlikId: string;
  superadminId: string;
}

export type GuardarOAuthInicial = (
  tenantQlikId: string,
  clienteId: string,
  clienteSecreto: string,
  scopes: string[],
) => Promise<string>;

export class ErrorSetupYaCompletado extends Error {
  constructor() {
    super("SETUP_YA_COMPLETADO");
  }
}

export class ServicioSetup {
  constructor(
    private readonly configApp: PuertoConfiguracionApp,
    private readonly ejecutarBootstrap: (
      entrada: EntradaBootstrap,
    ) => Promise<ResultadoSetup>,
    private readonly guardarOAuthInicial?: GuardarOAuthInicial,
  ) {}

  async obtenerEstado(): Promise<{ needsSetup: boolean }> {
    const configurado = await this.configApp.estaConfigurado();
    return { needsSetup: !configurado };
  }

  async completar(entrada: EntradaSetup): Promise<ResultadoSetup> {
    if (await this.configApp.estaConfigurado()) {
      throw new ErrorSetupYaCompletado();
    }

    const resultado = await this.configApp.ejecutarSiPendiente(async () => {
      const bootstrap = await this.ejecutarBootstrap({
        organizacionNombre: entrada.organizacionNombre,
        tenantNombre: entrada.qlikTenantHost,
        tenantHost: entrada.qlikTenantHost,
        tenantIdQlik: generarUuid(),
        superadminCorreo: entrada.superadminCorreo,
        superadminNombre: entrada.superadminNombre,
      });

      if (this.guardarOAuthInicial) {
        await this.guardarOAuthInicial(
          bootstrap.tenantQlikId,
          entrada.qlikClientId,
          entrada.qlikClientSecret,
          entrada.qlikScopes,
        );
      }

      await this.configApp.guardar("setup.organizacion", {
        nombre: entrada.organizacionNombre,
      });
      await this.configApp.guardar("setup.completado", { valor: true });
      if (entrada.frontendUrl) {
        await this.configApp.guardar("frontend_url", {
          valor: entrada.frontendUrl,
        });
      }
      return bootstrap;
    });

    if (!resultado) throw new ErrorSetupYaCompletado();
    return resultado;
  }
}
