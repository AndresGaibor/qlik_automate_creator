import { normalizarHostQlik } from "../../nucleo/valores/normalizar-host-qlik.js";

export interface EntradaBootstrap {
  organizacionNombre: string;
  tenantNombre: string;
  tenantHost: string;
  tenantIdQlik: string;
  superadminCorreo: string;
  superadminNombre: string;
}

export interface RepositorioBootstrap {
  asegurarOrganizacion(nombre: string): Promise<{ id: string; nombre: string }>;
  asegurarTenantPrincipal(datos: {
    organizacionId: string;
    tenantIdQlik: string;
    host: string;
    nombre: string;
  }): Promise<{ id: string; organizacionId: string }>;
  asegurarSuperadministrador(datos: {
    organizacionId: string;
    correo: string;
    nombre: string;
  }): Promise<{ id: string }>;
}

export async function ejecutarBootstrap(
  repositorio: RepositorioBootstrap,
  entrada: EntradaBootstrap,
) {
  const organizacion = await repositorio.asegurarOrganizacion(
    entrada.organizacionNombre.trim(),
  );
  const tenant = await repositorio.asegurarTenantPrincipal({
    organizacionId: organizacion.id,
    tenantIdQlik: entrada.tenantIdQlik.trim(),
    host: normalizarHostQlik(entrada.tenantHost),
    nombre: entrada.tenantNombre.trim(),
  });
  const superadministrador = await repositorio.asegurarSuperadministrador({
    organizacionId: organizacion.id,
    correo: entrada.superadminCorreo.trim().toLowerCase(),
    nombre: entrada.superadminNombre.trim(),
  });
  return {
    organizacionId: organizacion.id,
    tenantQlikId: tenant.id,
    superadministradorId: superadministrador.id,
  };
}
