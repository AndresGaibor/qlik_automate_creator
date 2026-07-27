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

export function obtenerScriptFlujo(id: string) {
  return clienteApi.get<RespuestaScriptFlujo>(
    `/flujos/${encodeURIComponent(id)}/script`,
  );
}
