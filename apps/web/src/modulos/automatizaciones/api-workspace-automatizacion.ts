import { clienteApi } from "@/compartido/api/cliente";

const RUTA = "/automatizaciones";

export interface WorkspaceAutomatizacion {
  id: string;
  nombre: string;
  workspace: Record<string, unknown>;
  schedules: Array<Record<string, unknown>>;
}

export function obtenerWorkspaceAutomatizacion(id: string) {
  return clienteApi.get<WorkspaceAutomatizacion>(
    `${RUTA}/${encodeURIComponent(id)}/workspace`,
  );
}

export function actualizarWorkspaceAutomatizacion(
  id: string,
  workspace: Record<string, unknown>,
) {
  return clienteApi.put<WorkspaceAutomatizacion>(
    `${RUTA}/${encodeURIComponent(id)}/workspace`,
    { workspace },
  );
}
