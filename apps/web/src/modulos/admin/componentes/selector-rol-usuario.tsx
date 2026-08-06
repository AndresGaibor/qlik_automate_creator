import type {
  AccionesUsuarioTenant,
  RolUsuarioTenant,
  UsuarioTenant,
} from "./tipos-usuarios-tenant";
import { puedeCambiarRolUsuario } from "./usuarios-permisos";

export function SelectorRolUsuario({
  usuario,
  usuarios,
  ocupado,
  onRol,
}: {
  usuario: UsuarioTenant;
  usuarios: UsuarioTenant[];
  ocupado: boolean;
  onRol: AccionesUsuarioTenant["onRol"];
}) {
  const ultimoAdmin =
    usuario.rol === "admin" &&
    !puedeCambiarRolUsuario(usuario, "usuario", usuarios);
  return (
    <div>
      <select
        aria-label={`Rol de ${usuario.nombre}`}
        value={usuario.rol}
        disabled={ocupado || ultimoAdmin}
        onChange={(evento) =>
          onRol(usuario, evento.target.value as RolUsuarioTenant)
        }
        className="min-h-10 rounded-md border border-line-200 bg-surface px-3 py-2 text-xs text-ink-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <option value="usuario">Usuario final</option>
        <option value="admin">Administrador</option>
      </select>
      {ultimoAdmin && (
        <p className="mt-1 text-[11px] text-ink-500">Último administrador</p>
      )}
    </div>
  );
}
