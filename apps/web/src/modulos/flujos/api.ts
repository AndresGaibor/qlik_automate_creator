import { clienteApi } from "@/compartido/api/cliente";
import type { EspacioDisponible } from "@qlik/contratos/automatizaciones";
import type { ResumenFlujo } from "@qlik/contratos/flujos";

export type { ResumenFlujo };
export function obtenerFlujos() {
  return clienteApi.get<ResumenFlujo[]>("/flujos");
}

export function obtenerFlujosConFiltros(espacioId?: string, busqueda?: string) {
  return clienteApi.get<ResumenFlujo[]>("/flujos", {
    parametros: {
      ...(espacioId ? { espacioId } : {}),
      ...(busqueda ? { q: busqueda } : {}),
    },
  });
}

export function obtenerEspacios() {
  return clienteApi.get<EspacioDisponible[]>("/automatizaciones/espacios");
}

export interface RespuestaScriptFlujo {
  id: string;
  script: string;
  versionMessage?: string | null;
}

export interface RespuestaCatalogoSpark {
  id: string;
  catalogoJson: Record<string, unknown>;
  scriptOriginal: string;
  conexionesFaltantes?: string[];
}

export function obtenerScriptFlujo(id: string) {
  return clienteApi.get<RespuestaScriptFlujo>(
    `/flujos/${encodeURIComponent(id)}/script`,
  );
}

export function obtenerCatalogoSparkFlujo(id: string) {
  return clienteApi.get<RespuestaCatalogoSpark>(
    `/flujos/${encodeURIComponent(id)}/catalogo-spark`,
  );
}
