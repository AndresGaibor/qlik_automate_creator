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
  resolverOrganizacionInicial(datos: {
    nombre: string;
    tenantHost: string;
  }): Promise<{ id: string; nombre: string }>;
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
  const tenantHost = normalizarHostQlik(entrada.tenantHost);
  const organizacion = await repositorio.resolverOrganizacionInicial({
    nombre: entrada.organizacionNombre.trim(),
    tenantHost,
  });
  const tenant = await repositorio.asegurarTenantPrincipal({
    organizacionId: organizacion.id,
    tenantIdQlik: entrada.tenantIdQlik.trim(),
    host: tenantHost,
    nombre: entrada.tenantNombre.trim(),
  });
  const correosSuperadministrador = normalizarCorreos(entrada.superadminCorreo);
  if (correosSuperadministrador.length === 0) {
    throw new Error("Debes configurar al menos un superadministrador");
  }
  const superadministradores: Array<{ id: string }> = [];
  for (const correo of correosSuperadministrador) {
    superadministradores.push(
      await repositorio.asegurarSuperadministrador({
        organizacionId: organizacion.id,
        correo,
        nombre: entrada.superadminNombre.trim(),
      }),
    );
  }
  const superadministradorPrincipal = superadministradores[0];
  if (!superadministradorPrincipal) {
    throw new Error("No se pudo crear el superadministrador inicial");
  }
  return {
    organizacionId: organizacion.id,
    tenantQlikId: tenant.id,
    superadministradorId: superadministradorPrincipal.id,
    superadministradorIds: superadministradores.map(({ id }) => id),
  };
}

function normalizarCorreos(valor: string): string[] {
  return Array.from(
    new Set(
      valor
        .split(",")
        .map((correo) => correo.trim().toLowerCase())
        .filter(Boolean),
    ),
  );
}
