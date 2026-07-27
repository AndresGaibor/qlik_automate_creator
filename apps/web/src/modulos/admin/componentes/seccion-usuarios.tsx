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
    mensaje: string;
    onConfirm: () => void;
  }>({ open: false, mensaje: "", onConfirm: () => {} });

  return (
    <>
      <Card className="border-line-200 bg-surface shadow-card">
        <CardHeader className="border-b border-line-200 bg-app/30 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="font-display text-lg font-semibold text-ink-900 flex items-center gap-2">
                <Icon name="users" className="text-brand-600" />
                Integrantes y Permisos de la Organización
              </CardTitle>
              <p className="text-xs text-ink-500 mt-1">
                Los usuarios registrados aquí podrán ingresar con su correo
                corporativo. Un usuario puede pertenecer a múltiples
                organizaciones al mismo tiempo.
              </p>
            </div>
            <Button
              size="sm"
              onClick={onAbrirModalAgregar}
              className="gap-1.5 shrink-0"
            >
              <Icon name="plus" size="sm" />
              Autorizar Usuario
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line-200 text-xs text-ink-500 uppercase tracking-wider bg-app/60 font-semibold">
                  <th className="py-3 px-4 font-semibold">Usuario</th>
                  <th className="py-3 px-4 font-semibold">
                    Correo Electrónico
                  </th>
                  <th className="py-3 px-4 font-semibold">Rol / Permisos</th>
                  <th className="py-3 px-4 font-semibold text-right">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-200">
                {usuarios.map((usr) => (
                  <tr key={usr.id} className="hover:bg-hover transition-colors">
                    <td className="py-3 px-4 font-medium text-ink-900">
                      {usr.nombre}
                    </td>
                    <td className="py-3 px-4 text-ink-600 font-mono text-xs">
                      {usr.correo || "—"}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={usr.rol}
                        onChange={(e) => {
                          const nuevoRol = e.target.value as
                            | "admin"
                            | "usuario";
                          if (nuevoRol !== usr.rol) {
                            onActualizarRol({
                              usuarioId: usr.id,
                              rol: nuevoRol,
                            });
                          }
                        }}
                        className="rounded border border-line-200 bg-surface px-2.5 py-1 text-xs text-ink-900 focus:border-brand-600 focus:outline-none"
                      >
                        <option value="usuario">Usuario Final</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-danger-600 hover:bg-red-50 text-xs"
                        onClick={() =>
                          setConfirmDialog({
                            open: true,
                            mensaje: `¿Quitar el acceso a "${usr.nombre}" (${usr.correo})? Esta persona dejará de poder iniciar sesión en esta organización.`,
                            onConfirm: () => onEliminarUsuario(usr.id),
                          })
                        }
                      >
                        Quitar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, open: false }))}
        onConfirm={() => {
          confirmDialog.onConfirm();
          setConfirmDialog((prev) => ({ ...prev, open: false }));
        }}
        titulo="Quitar acceso al usuario"
        mensaje={confirmDialog.mensaje}
      />
    </>
  );
}
