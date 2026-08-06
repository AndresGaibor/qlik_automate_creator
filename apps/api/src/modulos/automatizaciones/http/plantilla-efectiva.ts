import type { PuertoConsultaTenantQlik } from "../aplicacion/puertos/puerto-consulta-tenant-qlik.js";
import type { ModoPlantilla } from "./tipos-rutas-panel.js";

export function plantillaEfectivaDelModo(
  tenant: Awaited<ReturnType<PuertoConsultaTenantQlik["obtenerTenant"]>>,
  modo: ModoPlantilla,
): { id: string; nombre: string | null } | null {
  if (modo === 1) {
    const id =
      tenant?.automatizacionPlantillaModo1IdQlik ??
      tenant?.automatizacionBaseIdQlik ??
      null;
    const nombre =
      tenant?.automatizacionPlantillaModo1Nombre ??
      tenant?.automatizacionBaseNombre ??
      null;
    return id ? { id, nombre } : null;
  }

  const id = tenant?.automatizacionPlantillaModo2IdQlik ?? null;
  return id
    ? { id, nombre: tenant?.automatizacionPlantillaModo2Nombre ?? null }
    : null;
}
