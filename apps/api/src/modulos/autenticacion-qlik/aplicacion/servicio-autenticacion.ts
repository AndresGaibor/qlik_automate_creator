import type { PuertoOAuthQlik } from "./puertos/puerto-oauth-qlik.js";
import type { RepositorioAutenticacion } from "./puertos/repositorio-autenticacion.js";

export class ServicioAutenticacionQlik {
  constructor(
    private readonly oauth: PuertoOAuthQlik,
    private readonly repositorio: RepositorioAutenticacion,
    private readonly hostTenant: string,
  ) {}

  async iniciar() {
    const estado = this.oauth.generarEstado();
    const verificador = this.oauth.generarVerificadorPkce();
    const desafio = await this.oauth.generarDesafioPkce(verificador);
    return {
      estado,
      verificador,
      url: this.oauth.obtenerUrlAutorizacion(estado, desafio),
    };
  }

  async completar(entrada: {
    codigo: string;
    verificador: string;
    ip: string;
    agenteUsuario: string;
  }) {
    const tokens = await this.oauth.intercambiarCodigo(
      entrada.codigo,
      entrada.verificador,
    );
    const usuarioQlik = await this.oauth.obtenerUsuario(tokens.tokenAcceso);
    return this.repositorio.guardarAcceso({
      hostTenant: this.hostTenant,
      usuarioQlik,
      tokens,
      ip: entrada.ip,
      agenteUsuario: entrada.agenteUsuario,
    });
  }

  consultarSesion(tokenSesion: string) {
    return this.repositorio.consultarSesion(tokenSesion);
  }

  cerrarSesion(tokenSesion: string) {
    return this.repositorio.revocarSesion(tokenSesion);
  }
}
