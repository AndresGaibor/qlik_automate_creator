import { useState } from "react";
import { Button } from "@/compartido/componentes/ui/button";
import { ConfirmDialog } from "@/compartido/componentes/ui/confirm-dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/compartido/componentes/ui/card";
import type { DetalleTenant } from "../api";

interface Props {
  tenant: DetalleTenant;
  onActualizarEstado: (estado: "activa" | "suspendida") => void;
  onActualizarNombre: (nombre: string) => void;
  actualizar: {
    isPending: boolean;
  };
}

export function SeccionInfoTenant({
  tenant,
  onActualizarEstado,
  onActualizarNombre,
  actualizar,
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {tenant.nombre}
                </CardTitle>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    tenant.estado === "activa"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {tenant.estado === "activa" ? "● Activa" : "● Suspendida"}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Identificador del sistema:{" "}
                <code className="bg-gray-100 px-1 py-0.5 rounded font-mono">
                  {tenant.slug}
                </code>
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className={
                  tenant.estado === "activa"
                    ? "text-red-700 hover:bg-red-50 border-red-200"
                    : "text-green-700 hover:bg-green-50 border-green-200"
                }
                onClick={() => {
                  const nuevoEstado =
                    tenant.estado === "activa" ? "suspendida" : "activa";
                  setConfirmDialog({
                    open: true,
                    mensaje: `¿Deseas ${
                      nuevoEstado === "suspendida"
                        ? "suspender/desactivar"
                        : "activar"
                    } esta organización?`,
                    onConfirm: () => onActualizarEstado(nuevoEstado),
                  });
                }}
              >
                {tenant.estado === "activa"
                  ? "⏸️ Desactivar Organización"
                  : "▶️ Activar Organización"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <NombreEditor
            nombre={tenant.nombre}
            isPending={actualizar.isPending}
            onActualizarNombre={onActualizarNombre}
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmDialog.open}
        mensaje={confirmDialog.mensaje}
        titulo="Confirmar cambio de estado"
        confirmText="Confirmar"
        variant="default"
        onConfirm={() => {
          confirmDialog.onConfirm();
          setConfirmDialog({ ...confirmDialog, open: false });
        }}
        onCancel={() => setConfirmDialog({ ...confirmDialog, open: false })}
      />
    </>
  );
}

function NombreEditor({
  nombre,
  isPending,
  onActualizarNombre,
}: {
  nombre: string;
  isPending: boolean;
  onActualizarNombre: (nombre: string) => void;
}) {
  const [editando, setEditando] = useState(false);
  const [nombreEditado, setNombreEditado] = useState("");

  if (!editando) {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          setNombreEditado(nombre);
          setEditando(true);
        }}
      >
        ✏️ Editar Nombre
      </Button>
    );
  }

  return (
    <div className="flex gap-2 items-center bg-blue-50/50 p-4 rounded-lg border border-blue-100">
      <input
        type="text"
        value={nombreEditado}
        onChange={(e) => setNombreEditado(e.target.value)}
        className="border rounded-md px-3 py-1.5 text-sm w-full max-w-sm"
        placeholder="Nombre de la organización"
      />
      <Button
        size="sm"
        className="bg-blue-600 text-white hover:bg-blue-700"
        onClick={() => {
          onActualizarNombre(nombreEditado.trim());
          setEditando(false);
        }}
        disabled={isPending || !nombreEditado.trim()}
      >
        Guardar
      </Button>
      <Button size="sm" variant="ghost" onClick={() => setEditando(false)}>
        Cancelar
      </Button>
    </div>
  );
}
