import type { PuertoOAuthQlik } from "./puertos/puerto-oauth-qlik.js";
import type {
  RepositorioAutenticacion,
  TenantQlikAutenticable,
} from "./puertos/repositorio-autenticacion.js";

export type OrigenConfiguracionOAuth = "tenant" | "entorno_global";

export interface OAuthQlikResuelto {
  cliente: PuertoOAuthQlik;
  origen: OrigenConfiguracionOAuth;
  configuracionId?: string;
}

export type FabricaOAuthQlik = (
  tenant: TenantQlikAutenticable,
  configuracionId?: string,
) => OAuthQlikResuelto | Promise<OAuthQlikResuelto>;

export interface EstadoConfiguracionOAuthQlik {
  marcarVerificada(configuracionId: string): Promise<void>;
  marcarError(configuracionId: string, mensaje: string): Promise<void>;
}

export class ServicioAutenticacionQlik {
  constructor(
    private readonly crearOAuth: FabricaOAuthQlik,
    private readonly repositorio: RepositorioAutenticacion,
    private readonly estadoConfiguracion?: EstadoConfiguracionOAuthQlik,
  ) {}
  async iniciar(hostTenant: string) {
    const tenant = await this.repositorio.obtenerTenantPorHost(hostTenant);
    if (!tenant || tenant.estado !== "activo") {
      throw new Error("Tenant Qlik no registrado o inactivo");
    }
    const resuelta = await this.crearOAuth(tenant);
    const estado = resuelta.cliente.generarEstado();
    const verificador = resuelta.cliente.generarVerificadorPkce();
    const desafio = await resuelta.cliente.generarDesafioPkce(verificador);
    return {
      tenantQlikId: tenant.id,
      configuracionOauthId: resuelta.configuracionId,
      origenOAuth: resuelta.origen,
      estado,
      verificador,
      url: resuelta.cliente.obtenerUrlAutorizacion(estado, desafio),
    };
  }

  async iniciarPorCorreo(correo: string) {
    const tenant = await this.repositorio.obtenerTenantPorCorreoUsuario(correo);
    if (!tenant || tenant.estado !== "activo") {
      throw new Error(
        "El correo ingresado no está registrado en ningún tenant de Qlik activo",
      );
    }
    return this.iniciar(tenant.host);
  }
  async completar(entrada: {
    tenantQlikId: string;
    configuracionOauthId?: string;
    codigo: string;
    verificador: string;
    ip: string;
    agenteUsuario: string;
  }) {
    const tenant = await this.repositorio.obtenerTenantPorId(
      entrada.tenantQlikId,
    );
    if (!tenant || tenant.estado !== "activo") {
      throw new Error("Tenant Qlik no registrado o inactivo");
    }

    try {
      const resuelta = await this.crearOAuth(
        tenant,
        entrada.configuracionOauthId,
      );
      const tokens = await resuelta.cliente.intercambiarCodigo(
        entrada.codigo,
        entrada.verificador,
      );
      const usuarioQlik = await resuelta.cliente.obtenerUsuario(
        tokens.tokenAcceso,
      );
      const resultado = await this.repositorio.guardarAcceso({
        tenantQlikId: tenant.id,
        hostTenant: tenant.host,
        usuarioQlik,
        tokens,
        ip: entrada.ip,
        agenteUsuario: entrada.agenteUsuario,
      });
      const configuracionId =
        entrada.configuracionOauthId ?? resuelta.configuracionId;
      if (configuracionId && this.estadoConfiguracion) {
        await this.estadoConfiguracion.marcarVerificada(configuracionId);
      }
      return resultado;
    } catch (error) {
      if (entrada.configuracionOauthId && this.estadoConfiguracion) {
        await this.estadoConfiguracion.marcarError(
          entrada.configuracionOauthId,
          error instanceof Error ? error.message : "Error OAuth desconocido",
        );
      }
      throw error;
    }
  }

  consultarSesion(tokenSesion: string) {
    return this.repositorio.consultarSesion(tokenSesion);
  }

  listarTenants(tokenSesion: string) {
    return this.repositorio.listarTenantsDisponibles(tokenSesion);
  }

  cambiarTenant(tokenSesion: string, tenantQlikId: string) {
    return this.repositorio.cambiarTenantActivo(tokenSesion, tenantQlikId);
  }
  async verificarCredenciales(tokenSesion: string): Promise<boolean> {
    const info = await this.repositorio.obtenerInfoSesion(tokenSesion);
    if (!info) return false;
    const credenciales = await this.repositorio.obtenerCredenciales(info);
    return credenciales !== null;
  }

  cerrarSesion(tokenSesion: string) {
    return this.repositorio.revocarSesion(tokenSesion);
  }
}
