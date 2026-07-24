import { clienteApi } from "@/compartido/api/cliente";
import type { ResumenFlujo } from "@qlik/contratos/flujos";

export type { ResumenFlujo };
export function obtenerFlujos() {
  return clienteApi.get<ResumenFlujo[]>("/flujos");
}
