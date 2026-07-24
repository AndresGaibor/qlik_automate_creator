export interface InfoSesion {
  sesionId: string;
  usuarioId: string;
  identidadQlikId: string;
  tenantId: string;
  tenantHost: string;
  organizacionId: string;
}

export interface TenantSesionDisponible {
  id: string;
  host: string;
  nombre: string | null;
  organizacionId: string;
  organizacionNombre: string;
  esPrincipal: boolean;
}

export interface SesionPublica {
  tenantHost: string;
  tenantActivoId: string;
  tenantsDisponibles: TenantSesionDisponible[];
  usuario: {
    id: string;
    nombre: string;
    correo: string | null;
    avatarUrl: string | null;
  } | null;
  identidad: {
    id: string;
    nombreQlik: string | null;
    correoQlik: string | null;
  } | null;
  esSuperadmin: boolean;
  membresias: Array<{
    organizacionId: string;
    organizacionNombre: string;
    rol: "admin" | "usuario";
  }>;
}
