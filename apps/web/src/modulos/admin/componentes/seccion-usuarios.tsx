import { useState } from "react";
import { Button } from "@/compartido/componentes/ui/button";
import { ConfirmDialog } from "@/compartido/componentes/ui/confirm-dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/compartido/componentes/ui/card";
import { ModalAgregarUsuario } from "./modal-agregar-usuario";
import type { DetalleTenant } from "../api";

type UsuarioTenant = DetalleTenant["usuarios"][number];

interface Props {
  usuarios: UsuarioTenant[];
  onActualizarRol: (params: { usuarioId: string; rol: "admin" | "usuario" }) => void;
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
      <Card className="border-gray-200">
        <CardHeader className="border-b bg-gray-50/50 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                👥 Integrantes y Permisos de la Organización
              </CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">
                Los usuarios registrados aquí podrán ingresar mediante su
                correo. Un usuario puede pertenecer a múltiples organizaciones
                simultáneamente.
              </p>
            </div>
            <Button
              size="sm"
              onClick={onAbrirModalAgregar}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              + Autorizar Usuario
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-xs text-gray-400 uppercase bg-gray-5">
                  <th className="p-3 font-semibold">Usuario</th>
                  <th className="p-3 font-semibold">Correo Electrónico</th>
                  <th className="p-3 font-semibold">Rol / Permisos</th>
                  <th className="p-3 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {usuarios.map((usr) => (
                  <tr key={usr.id} className="hover:bg-gray-50/50">
                    <td className="p-3 font-medium text-gray-900">
                      {usr.nombre}
                    </td>
                    <td className="p-3 text-gray-600 font-mono text-xs">
                      {usr.correo || "—"}
                    </td>
                    <td className="p-3">
                      <select
                        value={usr.rol}
                        onChange={(e) => {
                          const nuevoRol = e.target.value as "admin" | "usuario";
                          if (nuevoRol !== usr.rol) {
                            onActualizarRol({
                              usuarioId: usr.id,
                              rol: nuevoRol,
                            });
                          }
                        }}
                        disabled={actualizar.isPending}
                        className="rounded border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium shadow-sm focus:border-blue-500 focus:outline-none"
                      >
                        <option value="admin">
                          🛡️ Administrador del Tenant
                        </option>
                        <option value="usuario">👤 Usuario Final</option>
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:bg-red-50 text-xs"
                        onClick={() => {
                          setConfirmDialog({
                            open: true,
                            mensaje: `¿Remover a ${usr.correo ?? usr.nombre} de esta organización?`,
                            onConfirm: () => onEliminarUsuario(usr.id),
                          });
                        }}
                        disabled={eliminar.isPending}
                      >
                        Quitar
                      </Button>
                    </td>
                  </tr>
                ))}
                {usuarios.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-6 text-center text-gray-400 text-xs italic"
                    >
                      No hay usuarios autorizados todavía en esta organización.
                    </td>
                  </tr>
                )}
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
        mensaje={confirmDialog.mensaje}
        titulo="Remover usuario"
        confirmText="Remover"
        variant="danger"
        onConfirm={() => {
          confirmDialog.onConfirm();
          setConfirmDialog({ ...confirmDialog, open: false });
        }}
        onCancel={() => setConfirmDialog({ ...confirmDialog, open: false })}
      />
    </>
  );
}
