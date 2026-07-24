import type {
  CredencialesQlik,
  InfoSesion,
  SesionPublica,
  TokensQlik,
  UsuarioOAuthQlik,
} from "../../dominio/modelos.js";

export interface DatosNuevaSesion {
  hostTenant: string;
  usuarioQlik: UsuarioOAuthQlik;
  tokens: TokensQlik;
  ip: string;
  agenteUsuario: string;
}

export interface RepositorioAutenticacion {
  guardarAcceso(datos: DatosNuevaSesion): Promise<{ tokenSesion: string }>;
  consultarSesion(tokenSesion: string): Promise<SesionPublica | null>;
  obtenerInfoSesion(tokenSesion: string): Promise<InfoSesion | null>;
  obtenerCredenciales(infoSesion: InfoSesion): Promise<CredencialesQlik | null>;
  revocarSesion(tokenSesion: string): Promise<void>;
}
