import { Button } from "@/compartido/componentes/ui/button";
import { SelectorRolUsuario } from "./selector-rol-usuario";
import type {
  AccionesUsuarioTenant,
  UsuarioTenant,
} from "./tipos-usuarios-tenant";
import { puedeQuitarUsuario } from "./usuarios-permisos";

export function ListaUsuariosTenant({
  usuarios,
  ocupado,
  onRol,
  onQuitar,
}: {
  usuarios: UsuarioTenant[];
  ocupado: boolean;
} & AccionesUsuarioTenant) {
  if (usuarios.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm font-medium text-ink-700">
          No hay usuarios autorizados
        </p>
        <p className="mt-1 text-xs text-ink-500">
          Autoriza al menos un administrador para gestionar la plataforma.
        </p>
      </div>
    );
  }

  if (usuarios.length === 1) {
    return (
      <div className="p-4">
        <div className="overflow-hidden rounded-lg border border-line-200 bg-app/20">
          <TarjetaUsuario
            usuario={usuarios[0]}
            usuarios={usuarios}
            ocupado={ocupado}
            onRol={onRol}
            onQuitar={onQuitar}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line-200 bg-app/60 text-xs font-semibold uppercase tracking-wider text-ink-500">
              <th className="px-4 py-3">Usuario</th>
              <th className="px-4 py-3">Correo electrónico</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-200">
            {usuarios.map((usuario) => (
              <FilaUsuario
                key={usuario.id}
                usuario={usuario}
                usuarios={usuarios}
                ocupado={ocupado}
                onRol={onRol}
                onQuitar={onQuitar}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="divide-y divide-line-200 md:hidden">
        {usuarios.map((usuario) => (
          <TarjetaUsuario
            key={usuario.id}
            usuario={usuario}
            usuarios={usuarios}
            ocupado={ocupado}
            onRol={onRol}
            onQuitar={onQuitar}
          />
        ))}
      </div>
    </>
  );
}

interface UsuarioPresentacionProps extends AccionesUsuarioTenant {
  usuario: UsuarioTenant;
  usuarios: UsuarioTenant[];
  ocupado: boolean;
}

function FilaUsuario({
  usuario,
  usuarios,
  ocupado,
  onRol,
  onQuitar,
}: UsuarioPresentacionProps) {
  const puedeQuitar = puedeQuitarUsuario(usuario, usuarios);
  return (
    <tr className="transition-colors hover:bg-hover">
      <td className="px-4 py-3 font-medium text-ink-900">{usuario.nombre}</td>
      <td className="px-4 py-3 font-mono text-xs text-ink-600">
        {usuario.correo || "—"}
      </td>
      <td className="px-4 py-3">
        <SelectorRolUsuario
          usuario={usuario}
          usuarios={usuarios}
          ocupado={ocupado}
          onRol={onRol}
        />
      </td>
      <td className="px-4 py-3 text-right">
        <Button
          size="sm"
          variant="ghost"
          disabled={ocupado || !puedeQuitar}
          title={
            !puedeQuitar
              ? "No puedes quitar al último administrador"
              : undefined
          }
          className="text-danger-600 hover:bg-red-50"
          onClick={() => onQuitar(usuario)}
        >
          Quitar
        </Button>
      </td>
    </tr>
  );
}

function TarjetaUsuario({
  usuario,
  usuarios,
  ocupado,
  onRol,
  onQuitar,
}: UsuarioPresentacionProps) {
  const puedeQuitar = puedeQuitarUsuario(usuario, usuarios);
  return (
    <article className="space-y-4 p-4">
      <div>
        <p className="font-medium text-ink-900">{usuario.nombre}</p>
        <p className="mt-1 break-all font-mono text-xs text-ink-500">
          {usuario.correo || "—"}
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <SelectorRolUsuario
          usuario={usuario}
          usuarios={usuarios}
          ocupado={ocupado}
          onRol={onRol}
        />
        <Button
          size="sm"
          variant="outline"
          disabled={ocupado || !puedeQuitar}
          className="text-danger-600"
          onClick={() => onQuitar(usuario)}
        >
          Quitar acceso
        </Button>
      </div>
    </article>
  );
}
