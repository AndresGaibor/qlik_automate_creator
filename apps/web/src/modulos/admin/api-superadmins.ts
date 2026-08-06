import { clienteApi } from "@/compartido/api/cliente";
import type { AgregarSuperadmin, Superadmin } from "@qlik/contratos/admin";

const RUTA_SUPERADMINS = "/admin/superadmins";

export function obtenerSuperadmins() {
  return clienteApi.get<Superadmin[]>(RUTA_SUPERADMINS);
}

export function agregarSuperadmin(entrada: AgregarSuperadmin) {
  return clienteApi.post<Superadmin>(RUTA_SUPERADMINS, entrada);
}

export function eliminarSuperadmin(id: string) {
  return clienteApi.delete<{ eliminado: boolean }>(
    `${RUTA_SUPERADMINS}/${encodeURIComponent(id)}`,
  );
}
