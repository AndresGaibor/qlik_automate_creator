import type { DetalleTenant } from "../api";

export type UsuarioTenant = DetalleTenant["usuarios"][number];
export type RolUsuarioTenant = "admin" | "usuario";

export interface AccionesUsuarioTenant {
  onRol: (usuario: UsuarioTenant, rol: RolUsuarioTenant) => void;
  onQuitar: (usuario: UsuarioTenant) => void;
}
