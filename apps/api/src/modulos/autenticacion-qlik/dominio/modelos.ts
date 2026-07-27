export interface TokensQlik {
  tokenAcceso: string;
  tokenRefresco?: string;
  expiraEnSegundos: number;
  scopes: string[];
}

export interface UsuarioOAuthQlik {
  id: string;
  nombre?: string;
  correo?: string;
  avatarUrl?: string;
}

export type {
  InfoSesion,
  SesionPublica,
} from "../../../nucleo/sesion/tipos-sesion.js";
export type { TenantSesionDisponible } from "../../../nucleo/sesion/tipos-sesion.js";

export interface CredencialesQlik {
  host: string;
  token: string;
}
