import type {
  EstadoOrganizacion,
  RepositorioAdministracion,
  RolAdministracion,
  TenantQlikAdministrable,
  UsuarioAdministrable,
} from "../aplicacion/puertos/repositorio-administracion.js";
import { ConsultaOrganizacion } from "./consulta-organizacion-postgres.js";
import { ConsultaTenantQlik } from "./consulta-tenant-qlik-postgres.js";
import { ConsultaUsuario } from "./consulta-usuario-postgres.js";

type DbType = {
  query: {
    [key: string]: {
      findFirst: (opts?: any) => Promise<any>;
      findMany: (opts?: any) => Promise<any[]>;
    };
  };
  transaction<T>(fn: (tx: any) => Promise<T>): Promise<T>;
  insert(table: any): any;
  update(table: any): any;
  delete(table: any): any;
  select(...args: any[]): any;
  execute(...args: any[]): any;
};

export class RepositorioAdministracionPostgres
  implements RepositorioAdministracion
{
  constructor(private readonly db: DbType) {}

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
    return ConsultaTenantQlik.crearTenantQlik(
      this.db,
      entrada,
      (id) => this.obtenerOrganizacion(id),
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

  async configurarDestinoTenant(
    organizacionId: string,
    tenantQlikId: string,
    destinoApiUrl: string,
    destinoApiKey: string,
    destinoBaseDatos?: string,
  ): Promise<TenantQlikAdministrable | null> {
    return ConsultaTenantQlik.configurarDestinoTenant(
      this.db,
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
      organizacionId,
      tenantQlikId,
      datos,
    );
  }

  async eliminarTenantQlik(
    organizacionId: string,
    tenantQlikId: string,
  ) {
    return ConsultaTenantQlik.eliminarTenantQlik(
      this.db,
      organizacionId,
      tenantQlikId,
    );
  }
}
