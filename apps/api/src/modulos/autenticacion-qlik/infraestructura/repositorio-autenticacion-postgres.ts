import type { ConexionDb } from "../../../plataforma/persistencia/conexion.js";
import type {
  DatosNuevaSesion,
  RepositorioAutenticacion,
  ServicioCifradoPuerto,
} from "../aplicacion/puertos/repositorio-autenticacion.js";
import type { CredencialesQlik, InfoSesion } from "../dominio/modelos.js";
import { cambiarTenantActivoPostgres } from "./cambiar-tenant-activo-postgres.js";
import { obtenerCredenciales as obtenerCredencialesHelper } from "./consulta-credenciales-postgres.js";
import {
  obtenerTenantPorCorreoUsuario,
  obtenerTenantPorHost,
  obtenerTenantPorId,
} from "./consulta-identidad-postgres.js";
import { obtenerInfoSesionPostgres } from "./consulta-info-sesion-postgres.js";
import {
  buscarSesionValida,
  revocarSesion as revocarSesionHelper,
} from "./consulta-sesion-postgres.js";
import { consultarSesionPublicaPostgres } from "./consulta-sesion-publica-postgres.js";
import { listarTenantsDisponiblesPostgres } from "./consulta-tenants-disponibles-postgres.js";
import { guardarAccesoPostgres } from "./persistencia-acceso-postgres.js";

export class RepositorioAutenticacionPostgres
  implements RepositorioAutenticacion
{
  constructor(
    private readonly db: ConexionDb,
    private readonly cifrado: ServicioCifradoPuerto,
    private readonly superadminMail?: string,
  ) {}

  obtenerTenantPorHost(host: string) {
    return obtenerTenantPorHost(this.db, host);
  }

  obtenerTenantPorId(id: string) {
    return obtenerTenantPorId(this.db, id);
  }

  obtenerTenantPorCorreoUsuario(correo: string) {
    return obtenerTenantPorCorreoUsuario(this.db, correo, this.superadminMail);
  }

  guardarAcceso(datos: DatosNuevaSesion) {
    return guardarAccesoPostgres(
      this.db,
      this.cifrado,
      this.superadminMail,
      datos,
    );
  }

  consultarSesion(tokenSesion: string) {
    return consultarSesionPublicaPostgres(
      this.db,
      this.superadminMail,
      tokenSesion,
      (token) => listarTenantsDisponiblesPostgres(this.db, token),
    );
  }

  obtenerInfoSesion(tokenSesion: string): Promise<InfoSesion | null> {
    return obtenerInfoSesionPostgres(this.db, tokenSesion);
  }

  obtenerCredenciales(
    infoSesion: InfoSesion,
  ): Promise<CredencialesQlik | null> {
    return obtenerCredencialesHelper(this.db, this.cifrado, infoSesion);
  }

  listarTenantsDisponibles(tokenSesion: string) {
    return listarTenantsDisponiblesPostgres(this.db, tokenSesion);
  }

  cambiarTenantActivo(tokenSesion: string, tenantQlikId: string) {
    return cambiarTenantActivoPostgres(this.db, tokenSesion, tenantQlikId);
  }

  async revocarSesion(tokenSesion: string): Promise<void> {
    await revocarSesionHelper(this.db, tokenSesion);
  }
}
