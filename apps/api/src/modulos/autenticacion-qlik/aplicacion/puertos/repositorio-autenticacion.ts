import type { ConexionDb as ConexionDbPostgres } from "../../../../plataforma/persistencia/conexion.js";
import type {
  CredencialesQlik,
  InfoSesion,
  SesionPublica,
  TokensQlik,
  UsuarioOAuthQlik,
} from "../../dominio/modelos.js";

export type ConexionDb = ConexionDbPostgres;

export interface ServicioCifradoPuerto {
  cifrar(valor: string): { cifrado: string; iv: string; tag: string };
  descifrar(cifrado: string, iv: string, tag: string): string;
}

export interface TenantQlikAutenticable {
  id: string;
  host: string;
  estado: "activo" | "desconectado" | "suspendido";
}

export interface DatosNuevaSesion {
  tenantQlikId: string;
  hostTenant: string;
  usuarioQlik: UsuarioOAuthQlik;
  tokens: TokensQlik;
  ip: string;
  agenteUsuario: string;
}

export interface RepositorioAutenticacion {
  obtenerTenantPorHost(host: string): Promise<TenantQlikAutenticable | null>;
  obtenerTenantPorId(id: string): Promise<TenantQlikAutenticable | null>;
  obtenerTenantPorCorreoUsuario(
    correo: string,
  ): Promise<TenantQlikAutenticable | null>;
  guardarAcceso(datos: DatosNuevaSesion): Promise<{ tokenSesion: string }>;
  consultarSesion(tokenSesion: string): Promise<SesionPublica | null>;
  obtenerInfoSesion(tokenSesion: string): Promise<InfoSesion | null>;
  obtenerCredenciales(infoSesion: InfoSesion): Promise<CredencialesQlik | null>;
  listarTenantsDisponibles(
    tokenSesion: string,
  ): Promise<import("../../dominio/modelos.js").TenantSesionDisponible[]>;
  cambiarTenantActivo(
    tokenSesion: string,
    tenantQlikId: string,
  ): Promise<boolean>;
  revocarSesion(tokenSesion: string): Promise<void>;
}
