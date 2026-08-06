import { Button } from "@/compartido/componentes/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/compartido/componentes/ui/card";
import { ConfirmDialog } from "@/compartido/componentes/ui/confirm-dialog";
import { Icon } from "@/compartido/componentes/ui/icon";
import { useState } from "react";
import type { DetalleTenant } from "../api";
import { ModalAgregarUsuario } from "./modal-agregar-usuario";
import {
  puedeCambiarRolUsuario,
  puedeQuitarUsuario,
} from "./usuarios-permisos";

type UsuarioTenant = DetalleTenant["usuarios"][number];
interface Props {
  usuarios: UsuarioTenant[];
  onActualizarRol: (params: {
    usuarioId: string;
    rol: "admin" | "usuario";
  }) => void;
  onEliminarUsuario: (usuarioId: string) => void;
  onAbrirModalAgregar: () => void;
  modalAgregar: {
    open: boolean;
    onClose: () => void;
    onAgregar: (correo: string, rol: "admin" | "usuario") => void;
    isPending: boolean;
  };
  actualizar: { isPending: boolean };
  eliminar: { isPending: boolean };
}

export function SeccionUsuarios({
  usuarios,
  onActualizarRol,
  onEliminarUsuario,
  onAbrirModalAgregar,
  modalAgregar,
  actualizar,
  eliminar,
}: Props) {
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    titulo: string;
    mensaje: string;
    onConfirm: () => void;
  }>({
    open: false,
    titulo: "Confirmar cambio",
    mensaje: "",
    onConfirm: () => {},
  });

  const solicitarRol = (usuario: UsuarioTenant, rol: "admin" | "usuario") => {
    if (!puedeCambiarRolUsuario(usuario, rol, usuarios)) return;
    if (usuario.rol === "admin" && rol === "usuario") {
      setConfirmDialog({
        open: true,
        titulo: "Retirar permisos de administrador",
        mensaje: `¿Cambiar a "${usuario.nombre}" a Usuario final? Dejará de administrar configuraciones y usuarios.`,
        onConfirm: () => onActualizarRol({ usuarioId: usuario.id, rol }),
      });
      return;
    }
    onActualizarRol({ usuarioId: usuario.id, rol });
  };

  const solicitarQuitar = (usuario: UsuarioTenant) => {
    if (!puedeQuitarUsuario(usuario, usuarios)) return;
    setConfirmDialog({
      open: true,
      titulo: "Quitar acceso al usuario",
      mensaje: `¿Quitar el acceso a "${usuario.nombre}" (${usuario.correo})? Esta persona dejará de poder iniciar sesión.`,
      onConfirm: () => onEliminarUsuario(usuario.id),
    });
  };

  return (
    <>
      <Card className="border-line-200 bg-surface shadow-card">
        <CardHeader className="border-b border-line-200 bg-app/30 pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
                <Icon name="users" className="text-brand-600" /> Usuarios y
                permisos
              </CardTitle>
              <p className="mt-1 text-xs text-ink-500">
                {usuarios.length}{" "}
                {usuarios.length === 1
                  ? "usuario autorizado"
                  : "usuarios autorizados"}{" "}
                en la plataforma.
              </p>
            </div>
            <Button
              size="sm"
              onClick={onAbrirModalAgregar}
              className="shrink-0 gap-1.5 sm:self-auto"
            >
              <Icon name="plus" size="sm" /> Autorizar usuario
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {usuarios.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm font-medium text-ink-700">
                No hay usuarios autorizados
              </p>
              <p className="mt-1 text-xs text-ink-500">
                Autoriza al menos un administrador para gestionar la plataforma.
              </p>
            </div>
          ) : usuarios.length === 1 ? (
            <div className="p-4">
              <div className="overflow-hidden rounded-lg border border-line-200 bg-app/20">
                <TarjetaUsuario
                  usuario={usuarios[0]}
                  usuarios={usuarios}
                  ocupado={actualizar.isPending || eliminar.isPending}
                  onRol={solicitarRol}
                  onQuitar={solicitarQuitar}
                />
              </div>
            </div>
          ) : (
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
                        ocupado={actualizar.isPending || eliminar.isPending}
                        onRol={solicitarRol}
                        onQuitar={solicitarQuitar}
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
                    ocupado={actualizar.isPending || eliminar.isPending}
                    onRol={solicitarRol}
                    onQuitar={solicitarQuitar}
                  />
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <ModalAgregarUsuario
        open={modalAgregar.open}
        onClose={modalAgregar.onClose}
        onAgregar={modalAgregar.onAgregar}
        isPending={modalAgregar.isPending}
      />
      <ConfirmDialog
        open={confirmDialog.open}
        onCancel={() =>
          setConfirmDialog((actual) => ({ ...actual, open: false }))
        }
        onConfirm={() => {
          confirmDialog.onConfirm();
          setConfirmDialog((actual) => ({ ...actual, open: false }));
        }}
        titulo={confirmDialog.titulo}
        mensaje={confirmDialog.mensaje}
      />
    </>
  );
}

function SelectorRol({
  usuario,
  usuarios,
  ocupado,
  onRol,
}: {
  usuario: UsuarioTenant;
  usuarios: UsuarioTenant[];
  ocupado: boolean;
  onRol: (usuario: UsuarioTenant, rol: "admin" | "usuario") => void;
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
        onChange={(e) => onRol(usuario, e.target.value as "admin" | "usuario")}
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
function FilaUsuario({
  usuario,
  usuarios,
  ocupado,
  onRol,
  onQuitar,
}: {
  usuario: UsuarioTenant;
  usuarios: UsuarioTenant[];
  ocupado: boolean;
  onRol: (usuario: UsuarioTenant, rol: "admin" | "usuario") => void;
  onQuitar: (usuario: UsuarioTenant) => void;
}) {
  const puedeQuitar = puedeQuitarUsuario(usuario, usuarios);
  return (
    <tr className="transition-colors hover:bg-hover">
      <td className="px-4 py-3 font-medium text-ink-900">{usuario.nombre}</td>
      <td className="px-4 py-3 font-mono text-xs text-ink-600">
        {usuario.correo || "—"}
      </td>
      <td className="px-4 py-3">
        <SelectorRol
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
}: {
  usuario: UsuarioTenant;
  usuarios: UsuarioTenant[];
  ocupado: boolean;
  onRol: (usuario: UsuarioTenant, rol: "admin" | "usuario") => void;
  onQuitar: (usuario: UsuarioTenant) => void;
}) {
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
        <SelectorRol
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
