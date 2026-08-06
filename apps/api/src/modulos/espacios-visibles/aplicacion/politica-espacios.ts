import type { ConfiguracionEspaciosVisibles } from "@qlik/contratos/admin";

export interface ContextoPoliticaEspacios {
  esAdministrador: boolean;
  forzarVistaUsuarioFinal: boolean;
}

export interface PoliticaEspacios {
  restringida: boolean;
  configurada: boolean;
  espaciosPermitidosIds: string[];
  permitirRecursosSinEspacio: boolean;
  puedeVer(espacioId?: string | null): boolean;
}

export function crearPoliticaEspacios(
  configuracion: ConfiguracionEspaciosVisibles,
  contexto: ContextoPoliticaEspacios,
): PoliticaEspacios {
  const restringida =
    !contexto.esAdministrador || contexto.forzarVistaUsuarioFinal;
  const espaciosPermitidos = new Set(configuracion.espaciosPermitidosIds);

  return {
    restringida,
    configurada: configuracion.configurada,
    espaciosPermitidosIds: configuracion.espaciosPermitidosIds,
    permitirRecursosSinEspacio: configuracion.permitirRecursosSinEspacio,
    puedeVer(espacioId) {
      if (!restringida) return true;
      if (!espacioId) return configuracion.permitirRecursosSinEspacio;
      return espaciosPermitidos.has(espacioId);
    },
  };
}
