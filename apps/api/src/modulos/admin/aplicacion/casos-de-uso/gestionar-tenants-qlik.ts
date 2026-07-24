import type { RepositorioAdministracion } from "../puertos/repositorio-administracion.js";

export const listarTenantsQlik = (
  repositorio: RepositorioAdministracion,
  organizacionId: string,
) => repositorio.listarTenantsQlik(organizacionId);

export const crearTenantQlik = (
  repositorio: RepositorioAdministracion,
  entrada: {
    organizacionId: string;
    tenantIdQlik?: string;
    host: string;
    nombre?: string;
  },
) => repositorio.crearTenantQlik(entrada);

export const marcarTenantQlikPrincipal = (
  repositorio: RepositorioAdministracion,
  organizacionId: string,
  tenantQlikId: string,
) => repositorio.marcarTenantQlikPrincipal(organizacionId, tenantQlikId);

export const eliminarTenantQlik = (
  repositorio: RepositorioAdministracion,
  organizacionId: string,
  tenantQlikId: string,
) => repositorio.eliminarTenantQlik(organizacionId, tenantQlikId);
