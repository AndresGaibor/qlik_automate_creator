import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import { Button } from "@/compartido/componentes/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/compartido/componentes/ui/card";
import { ConfirmDialog } from "@/compartido/componentes/ui/confirm-dialog";
import { EstadoCarga } from "@/compartido/componentes/ui/estado-carga";
import { PageHeader } from "@/compartido/componentes/ui/page-header";
import { PageLayout } from "@/compartido/componentes/ui/page-layout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  type Superadmin,
  agregarSuperadmin,
  eliminarSuperadmin,
  obtenerSuperadmins,
} from "./api";
import { ModalAgregarSuperadmin } from "./componentes/modal-agregar-superadmin";

export function PaginaSuperadmins() {
  const { mostrarExito, mostrarError } = useNotificaciones();
  const queryClient = useQueryClient();
  const [modalCrear, setModalCrear] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    superadminId?: string;
    mensaje: string;
    onConfirm?: () => void;
    titulo?: string;
  }>({ open: false, mensaje: "" });

  const { data: superadmins, isLoading } = useQuery<Superadmin[]>({
    queryKey: ["superadmins"],
    queryFn: obtenerSuperadmins,
  });

  const crear = useMutation({
    mutationFn: (entrada: { nombre: string; correo: string }) =>
      agregarSuperadmin(entrada),
    onSuccess: () => {
      mostrarExito("Superadministrador agregado");
      setModalCrear(false);
      queryClient.invalidateQueries({ queryKey: ["superadmins"] });
    },
    onError: (err: Error) => {
      mostrarError(err.message);
    },
  });

  const eliminar = useMutation({
    mutationFn: eliminarSuperadmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["superadmins"] });
      mostrarExito("Superadministrador eliminado");
    },
    onError: (error: Error) => mostrarError(error.message),
  });

  if (isLoading) {
    return <EstadoCarga mensaje="Cargando superadministradores..." />;
  }

  return (
    <PageLayout>
      <PageHeader
        title="Superadministradores"
        description="Gestiona los usuarios con acceso de superadministrador al sistema."
        actions={
          <Button onClick={() => setModalCrear(true)} font-medium>
            Agregar superadministrador
          </Button>
        }
      />

      <div className="space-y-4">
        {superadmins?.map((superadmin) => (
          <Card
            key={superadmin.id}
            className="hover:shadow-card transition border-[var(--color-line-200)] bg-[var(--color-surface)]"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-[var(--color-ink-900)]">
                  {superadmin.nombre}
                </CardTitle>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    superadmin.estado === "activo"
                      ? "bg-[var(--color-brand-50)] text-[var(--color-brand-700)]"
                      : "bg-red-50 text-[var(--color-danger-600)]"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  {superadmin.estado === "activo" ? "Activo" : "Suspendido"}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-xs text-[var(--color-ink-700)] grid grid-cols-2 gap-2 bg-[var(--color-app)] p-3 rounded-md border border-[var(--color-line-200)]">
                  <div>
                    <span className="text-[11px] text-[var(--color-ink-500)] block font-sans">
                      Correo electrónico
                    </span>
                    <span className="font-medium text-[var(--color-ink-900)]">
                      {superadmin.correo || "No disponible"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[var(--color-ink-500)] block font-sans">
                      Fecha de registro
                    </span>
                    <span className="font-mono text-xs text-[var(--color-ink-700)]">
                      {new Date(superadmin.creadoEn).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[var(--color-danger-600)] hover:bg-red-50"
                    onClick={() => {
                      setConfirmDialog({
                        open: true,
                        titulo: "Eliminar superadministrador",
                        mensaje: `¿Estás seguro de eliminar a "${superadmin.nombre}" como superadministrador? Esta acción lo suspenderá y perderá acceso de inmediato.`,
                        onConfirm: () => eliminar.mutate(superadmin.id),
                      });
                    }}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!superadmins || superadmins.length === 0) && (
          <div className="text-center bg-white border border-dashed border-gray-300 rounded-lg py-12">
            <p className="text-gray-500 font-medium mb-2">
              No hay superadministradores configurados
            </p>
            <p className="text-xs text-gray-400 mb-4">
              Agrega el primer superadministrador para gestionar el sistema.
            </p>
            <Button size="sm" onClick={() => setModalCrear(true)}>
              Agregar superadministrador
            </Button>
          </div>
        )}
      </div>

      <ModalAgregarSuperadmin
        open={modalCrear}
        onClose={() => setModalCrear(false)}
        onAgregar={(datos) => crear.mutate(datos)}
        isPending={crear.isPending}
      />

      <ConfirmDialog
        open={confirmDialog.open}
        mensaje={confirmDialog.mensaje}
        titulo={confirmDialog.titulo ?? "Confirmar acción"}
        confirmText="Eliminar"
        variant="danger"
        onConfirm={() => {
          confirmDialog.onConfirm?.();
          setConfirmDialog({ open: false, mensaje: "" });
        }}
        onCancel={() => setConfirmDialog({ open: false, mensaje: "" })}
      />
    </PageLayout>
  );
}
