import type { ConexionDb } from "../../../plataforma/persistencia/conexion.js";
import type {
  EntradaGuardarConfiguracionOauth,
  EstadoOrganizacion,
  ModoPlantilla,
  RepositorioAdministracion,
  ResultadoEliminarSuperadmin,
  RolAdministracion,
  ServicioCifradoAdministracion,
  SuperadminAdministrable,
  TenantQlikAdministrable,
  UsuarioAdministrable,
} from "../aplicacion/puertos/repositorio-administracion.js";
import {
  eliminarConfiguracionOauth,
  guardarConfiguracionOauth,
  obtenerConfiguracionOauth,
} from "./consulta-configuracion-oauth-postgres.js";
import { ConsultaConfiguracionPlataforma } from "./consulta-configuracion-plataforma-postgres.js";
import { ConsultaOrganizacion } from "./consulta-organizacion-postgres.js";
import { ConsultaSuperadmin } from "./consulta-superadmin-postgres.js";
import { ConsultaTenantQlik } from "./consulta-tenant-qlik-postgres.js";
import { ConsultaUsuario } from "./consulta-usuario-postgres.js";

type DbType = ConexionDb;

export class RepositorioAdministracionPostgres
  implements RepositorioAdministracion
{
  constructor(
    private readonly db: DbType,
    private readonly cifrado: ServicioCifradoAdministracion,
  ) {}

  async listarOrganizaciones() {
    return ConsultaOrganizacion.listarOrganizaciones(this.db);
  }

  async obtenerOrganizacion(id: string) {
    return ConsultaOrganizacion.obtenerOrganizacion(this.db, id);
  }

  async crearOrganizacion(nombre: string) {
    return ConsultaOrganizacion.crearOrganizacion(this.db, nombre);
  }

  async actualizarOrganizacion(
    id: string,
    cambios: { nombre?: string; estado?: EstadoOrganizacion },
  ) {
    return ConsultaOrganizacion.actualizarOrganizacion(this.db, id, cambios);
  }

  async eliminarOrganizacion(id: string) {
    return ConsultaOrganizacion.eliminarOrganizacion(this.db, id);
  }

  async listarUsuarios(
    organizacionId: string,
  ): Promise<UsuarioAdministrable[]> {
    return ConsultaUsuario.listarUsuarios(this.db, organizacionId);
  }

  async agregarUsuario(
    organizacionId: string,
    correo: string,
    rol: RolAdministracion,
  ) {
    return ConsultaUsuario.agregarUsuario(
      this.db,
      organizacionId,
      correo,
      rol,
      (id) => this.obtenerOrganizacion(id),
    );
  }

  async actualizarRolUsuario(
    organizacionId: string,
    usuarioId: string,
    rol: RolAdministracion,
  ) {
    return ConsultaUsuario.actualizarRolUsuario(
      this.db,
      organizacionId,
      usuarioId,
      rol,
    );
  }

  async eliminarUsuario(organizacionId: string, usuarioId: string) {
    return ConsultaUsuario.eliminarUsuario(this.db, organizacionId, usuarioId);
  }

  async listarTenantsQlik(
    organizacionId: string,
  ): Promise<TenantQlikAdministrable[]> {
    return ConsultaTenantQlik.listarTenantsQlik(this.db, organizacionId);
  }

  async crearTenantQlik(entrada: {
    organizacionId: string;
    tenantIdQlik?: string;
    host: string;
    nombre?: string;
  }): Promise<TenantQlikAdministrable | null> {
    return ConsultaTenantQlik.crearTenantQlik(this.db, entrada, (id) =>
      this.obtenerOrganizacion(id),
    );
  }

  async marcarTenantQlikPrincipal(
    organizacionId: string,
    tenantQlikId: string,
  ): Promise<TenantQlikAdministrable | null> {
    return ConsultaTenantQlik.marcarTenantQlikPrincipal(
      this.db,
      organizacionId,
      tenantQlikId,
    );
  }

  async configurarAutomatizacionBase(
    organizacionId: string,
    tenantQlikId: string,
    automatizacionBaseIdQlik: string,
    automatizacionBaseNombre?: string,
  ): Promise<TenantQlikAdministrable | null> {
    return ConsultaTenantQlik.configurarAutomatizacionBase(
      this.db,
      organizacionId,
      tenantQlikId,
      automatizacionBaseIdQlik,
      automatizacionBaseNombre,
    );
  }

  async configurarPlantillaAutomatizacion(
    organizacionId: string,
    tenantQlikId: string,
    modo: ModoPlantilla,
    automatizacionBaseIdQlik: string,
    automatizacionBaseNombre?: string,
  ): Promise<TenantQlikAdministrable | null> {
    return ConsultaTenantQlik.configurarPlantillaAutomatizacion(
      this.db,
      organizacionId,
      tenantQlikId,
      modo,
      automatizacionBaseIdQlik,
      automatizacionBaseNombre,
    );
  }

  async obtenerModoAutomatizacionGlobal() {
    return ConsultaConfiguracionPlataforma.obtenerModoAutomatizacionGlobal(
      this.db,
    );
  }

  async actualizarModoAutomatizacionGlobal(
    modo: ModoPlantilla,
    usuarioId?: string,
  ) {
    return ConsultaConfiguracionPlataforma.actualizarModoAutomatizacionGlobal(
      this.db,
      modo,
      usuarioId,
    );
  }

  async configurarDestinoTenant(
    organizacionId: string,
    tenantQlikId: string,
    destinoApiUrl: string,
    destinoApiKey?: string,
    destinoBaseDatos?: string,
  ): Promise<TenantQlikAdministrable | null> {
    return ConsultaTenantQlik.configurarDestinoTenant(
      this.db,
      this.cifrado,
      organizacionId,
      tenantQlikId,
      destinoApiUrl,
      destinoApiKey,
      destinoBaseDatos,
    );
  }

  async configurarImpalaTenant(
    organizacionId: string,
    tenantQlikId: string,
    datos: {
      impalaHost: string;
      impalaPort?: number;
      impalaAuthMechanism?: string;
      impalaUser?: string;
      impalaPassword?: string;
      impalaDatabase?: string;
    },
  ): Promise<TenantQlikAdministrable | null> {
    return ConsultaTenantQlik.configurarImpalaTenant(
      this.db,
      this.cifrado,
      organizacionId,
      tenantQlikId,
      datos,
    );
  }

  async eliminarTenantQlik(organizacionId: string, tenantQlikId: string) {
    return ConsultaTenantQlik.eliminarTenantQlik(
      this.db,
      organizacionId,
      tenantQlikId,
    );
  }

  async obtenerConfiguracionOAuth(
    organizacionId: string,
    tenantQlikId: string,
  ) {
    return obtenerConfiguracionOauth(this.db, organizacionId, tenantQlikId);
  }

  async guardarConfiguracionOAuth(
    organizacionId: string,
    tenantQlikId: string,
    entrada: EntradaGuardarConfiguracionOauth,
  ) {
    return guardarConfiguracionOauth(
      this.db,
      this.cifrado,
      organizacionId,
      tenantQlikId,
      entrada,
    );
  }

  async eliminarConfiguracionOAuth(
    organizacionId: string,
    tenantQlikId: string,
  ) {
    return eliminarConfiguracionOauth(this.db, organizacionId, tenantQlikId);
  }

  async listarSuperadmins(): Promise<SuperadminAdministrable[]> {
    return ConsultaSuperadmin.listarSuperadmins(this.db);
  }

  async agregarSuperadmin(entrada: {
    nombre: string;
    correo: string;
  }): Promise<SuperadminAdministrable | null> {
    return ConsultaSuperadmin.agregarSuperadmin(this.db, entrada);
  }

  async eliminarSuperadmin(id: string): Promise<ResultadoEliminarSuperadmin> {
    return ConsultaSuperadmin.eliminarSuperadmin(this.db, id);
  }
}
