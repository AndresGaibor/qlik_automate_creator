import type { TokensQlik, UsuarioOAuthQlik } from "../../dominio/modelos.js";

export interface PuertoOAuthQlik {
  generarEstado(): string;
  generarVerificadorPkce(): string;
  generarDesafioPkce(verificador: string): Promise<string>;
  obtenerUrlAutorizacion(estado: string, desafio: string): string;
  intercambiarCodigo(codigo: string, verificador: string): Promise<TokensQlik>;
  obtenerUsuario(tokenAcceso: string): Promise<UsuarioOAuthQlik>;
}
