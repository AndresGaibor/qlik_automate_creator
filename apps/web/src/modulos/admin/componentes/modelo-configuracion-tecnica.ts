import {
  nombreVisibleEntornoQlik,
  normalizarHostQlik,
} from "../utiles-presentacion-qlik";

export interface TenantConfiguracionTecnica {
  host: string;
  nombre?: string | null;
  esPrincipal?: boolean;
  automatizacionPlantillaModo1IdQlik?: string | null;
  automatizacionPlantillaModo1Nombre?: string | null;
  automatizacionPlantillaModo2IdQlik?: string | null;
  automatizacionPlantillaModo2Nombre?: string | null;
  automatizacionBaseIdQlik?: string | null;
  automatizacionBaseNombre?: string | null;
  impalaHost?: string | null;
}

export interface ResumenConfiguracionTecnica {
  nombreEntorno: string;
  hostVisible: string;
  tienePlantilla: boolean;
  tieneDestino: boolean;
  lista: boolean;
  plantillaModo1: string;
  plantillaModo2: string;
  cantidadVisible: string;
}

export function construirResumenConfiguracionTecnica(
  tenant: TenantConfiguracionTecnica,
  cantidadDestinos: number,
): ResumenConfiguracionTecnica {
  const tienePlantilla = Boolean(
    tenant.automatizacionPlantillaModo1IdQlik ||
      tenant.automatizacionBaseIdQlik ||
      tenant.automatizacionPlantillaModo2IdQlik,
  );
  const tieneDestino = cantidadDestinos > 0 || Boolean(tenant.impalaHost);
  const plantillaModo1 =
    tenant.automatizacionPlantillaModo1Nombre ||
    tenant.automatizacionBaseNombre ||
    "Sin configurar";
  const plantillaModo2 =
    tenant.automatizacionPlantillaModo2Nombre || "Sin configurar";
  const cantidadVisible =
    cantidadDestinos > 0
      ? `${cantidadDestinos} ${cantidadDestinos === 1 ? "conexión" : "conexiones"}`
      : tenant.impalaHost
        ? "Impala configurado"
        : "Sin destinos";

  return {
    nombreEntorno: nombreVisibleEntornoQlik(tenant),
    hostVisible: normalizarHostQlik(tenant.host),
    tienePlantilla,
    tieneDestino,
    lista: tienePlantilla && tieneDestino,
    plantillaModo1,
    plantillaModo2,
    cantidadVisible,
  };
}
