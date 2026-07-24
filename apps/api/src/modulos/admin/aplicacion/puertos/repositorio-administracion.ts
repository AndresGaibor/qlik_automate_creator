export type RolAdministracion = "admin" | "usuario";
export type EstadoOrganizacion = "activa" | "suspendida";

export interface OrganizacionAdministrable {
  id: string;
  nombre: string;
  estado: EstadoOrganizacion;
  creadoEn: Date;
}

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
}
