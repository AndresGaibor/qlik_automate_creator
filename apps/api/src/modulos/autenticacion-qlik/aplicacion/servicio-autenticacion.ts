import type { PuertoOAuthQlik } from "./puertos/puerto-oauth-qlik.js";
import type { RepositorioAutenticacion } from "./puertos/repositorio-autenticacion.js";

export type FabricaOAuthQlik = (hostTenant: string) => PuertoOAuthQlik;

export class ServicioAutenticacionQlik {
  constructor(
    private readonly crearOAuth: FabricaOAuthQlik,
    private readonly repositorio: RepositorioAutenticacion,
  ) {}

  async iniciar(hostTenant: string) {
    const tenant = await this.repositorio.obtenerTenantPorHost(hostTenant);
    if (!tenant || tenant.estado !== "activo") {
      throw new Error("Tenant Qlik no registrado o inactivo");
    }
    const oauth = this.crearOAuth(tenant.host);
    const estado = oauth.generarEstado();
    const verificador = oauth.generarVerificadorPkce();
    const desafio = await oauth.generarDesafioPkce(verificador);
    return {
      tenantQlikId: tenant.id,
      estado,
      verificador,
      url: oauth.obtenerUrlAutorizacion(estado, desafio),
    };
  }

  async completar(entrada: {
    tenantQlikId: string;
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
    const oauth = this.crearOAuth(tenant.host);
    const tokens = await oauth.intercambiarCodigo(
      entrada.codigo,
      entrada.verificador,
    );
    const usuarioQlik = await oauth.obtenerUsuario(tokens.tokenAcceso);
    return this.repositorio.guardarAcceso({
      tenantQlikId: tenant.id,
      hostTenant: tenant.host,
      usuarioQlik,
      tokens,
      ip: entrada.ip,
      agenteUsuario: entrada.agenteUsuario,
    });
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

  cerrarSesion(tokenSesion: string) {
    return this.repositorio.revocarSesion(tokenSesion);
  }
}
