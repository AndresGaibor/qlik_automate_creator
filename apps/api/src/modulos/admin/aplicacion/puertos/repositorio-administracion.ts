export type RolAdministracion = "admin" | "usuario";
export type EstadoOrganizacion = "activa" | "suspendida";
export type EstadoTenantQlik = "activo" | "desconectado" | "suspendido";

export interface OrganizacionAdministrable {
  id: string;
  nombre: string;
  estado: EstadoOrganizacion;
  creadoEn: Date;
}

export interface TenantQlikAdministrable {
  id: string;
  organizacionId: string;
  tenantIdQlik: string;
  host: string;
  nombre: string | null;
  estado: EstadoTenantQlik;
  esPrincipal: boolean;
  creadoEn: Date;
}

export type ResultadoEliminarTenantQlik =
  | "ELIMINADO"
  | "NO_ENCONTRADO"
  | "REQUIERE_REEMPLAZO";

export interface UsuarioAdministrable {
  id: string;
  correo: string | null;
  nombre: string;
  rol: RolAdministracion;
}

export interface RepositorioAdministracion {
  listarOrganizaciones(): Promise<
    Array<OrganizacionAdministrable & { cantidadUsuarios: number }>
  >;
  obtenerOrganizacion(id: string): Promise<OrganizacionAdministrable | null>;
  crearOrganizacion(nombre: string): Promise<OrganizacionAdministrable>;
  actualizarOrganizacion(
    id: string,
    cambios: Partial<Pick<OrganizacionAdministrable, "nombre" | "estado">>,
  ): Promise<OrganizacionAdministrable | null>;
  eliminarOrganizacion(id: string): Promise<boolean>;
  listarUsuarios(organizacionId: string): Promise<UsuarioAdministrable[]>;
  agregarUsuario(
    organizacionId: string,
    correo: string,
    rol: RolAdministracion,
  ): Promise<UsuarioAdministrable | null>;
  actualizarRolUsuario(
    organizacionId: string,
    usuarioId: string,
    rol: RolAdministracion,
  ): Promise<UsuarioAdministrable | null>;
  eliminarUsuario(organizacionId: string, usuarioId: string): Promise<boolean>;
  listarTenantsQlik(organizacionId: string): Promise<TenantQlikAdministrable[]>;
  crearTenantQlik(entrada: {
    organizacionId: string;
    tenantIdQlik: string;
    host: string;
    nombre?: string;
  }): Promise<TenantQlikAdministrable | null>;
  marcarTenantQlikPrincipal(
    organizacionId: string,
    tenantQlikId: string,
  ): Promise<TenantQlikAdministrable | null>;
  eliminarTenantQlik(
    organizacionId: string,
    tenantQlikId: string,
  ): Promise<ResultadoEliminarTenantQlik>;
}
