import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import { Button } from "@/compartido/componentes/ui/button";
import { ConfirmDialog } from "@/compartido/componentes/ui/confirm-dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/compartido/componentes/ui/card";
import { EstadoCarga } from "@/compartido/componentes/ui/estado-carga";
import { PageHeader } from "@/compartido/componentes/ui/page-header";
import { PageLayout } from "@/compartido/componentes/ui/page-layout";
import { ModalCrearOrganizacion } from "./componentes/modal-crear-organizacion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  type TenantResumen,
  crearTenant,
  eliminarTenant,
  obtenerTenants,
} from "./api";

export function PaginaListaTenants() {
  const navegar = useNavigate();
  const { mostrarExito, mostrarError } = useNotificaciones();
  const queryClient = useQueryClient();
  const [modalCrear, setModalCrear] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    mensaje: string;
    onConfirm: () => void;
  }>({ open: false, mensaje: "", onConfirm: () => {} });

  const { data: tenants, isLoading } = useQuery<TenantResumen[]>({
    queryKey: ["admin-tenants"],
    queryFn: obtenerTenants,
  });

  const crear = useMutation({
    mutationFn: crearTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tenants"] });
      setModalCrear(false);
      mostrarExito("Organización creada exitosamente");
    },
    onError: (error: Error) => mostrarError(error.message),
  });

  const eliminar = useMutation({
    mutationFn: eliminarTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tenants"] });
      mostrarExito("Organización eliminada");
    },
    onError: (error: Error) => mostrarError(error.message),
  });

  if (isLoading) {
    return <EstadoCarga mensaje="Cargando organizaciones..." />;
  }

  return (
    <PageLayout>
      <PageHeader
        title="Organizaciones"
        description="Cada organización agrupa un entorno de Qlik Cloud, sus usuarios autorizados y la configuración de Impala."
        actions={
          <Button
            onClick={() => setModalCrear(true)}
            font-medium
          >
            + Nueva organización
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tenants?.map((tenant) => (
          <Card
            key={tenant.id}
            className="hover:shadow-card transition border-[var(--color-line-200)] bg-[var(--color-surface)]"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-[var(--color-ink-900)]">
                  {tenant.nombre}
                </CardTitle>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    tenant.estado === "activa"
                      ? "bg-[var(--color-brand-50)] text-[var(--color-brand-700)]"
                      : "bg-red-50 text-[var(--color-danger-600)]"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  {tenant.estado === "activa" ? "Activa" : "Inactiva"}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-xs text-[var(--color-ink-700)] grid grid-cols-2 gap-2 bg-[var(--color-app)] p-3 rounded-md border border-[var(--color-line-200)]">
                  <div>
                    <span className="text-[11px] text-[var(--color-ink-500)] block font-sans">Usuarios Autorizados</span>
                    <span className="font-semibold text-[var(--color-ink-900)]">
                      {tenant.cantidadUsuarios} {tenant.cantidadUsuarios === 1 ? "usuario" : "usuarios"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[var(--color-ink-500)] block font-sans">Identificador</span>
                    <span className="font-mono text-xs text-[var(--color-ink-700)]">
                      {tenant.slug}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-mono text-[var(--color-ink-500)]">
                    Registrado: {new Date(tenant.creadoEn).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navegar({
                          to: "/admin/tenants/$tenantId",
                          params: { tenantId: tenant.id },
                        })
                      }
                    >
                      Gestionar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[var(--color-danger-600)] hover:bg-red-50"
                      onClick={() => {
                        setConfirmDialog({
                          open: true,
                          mensaje: `¿Estás seguro de eliminar la organización "${tenant.nombre}"? esta acción no se puede deshacer.`,
                          onConfirm: () => eliminar.mutate(tenant.id),
                        });
                      }}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!tenants || tenants.length === 0) && (
          <div className="col-span-full text-center bg-white border border-dashed border-gray-300 rounded-lg py-12">
            <p className="text-gray-500 font-medium mb-2">
              Aún no has creado ninguna organización
            </p>
            <p className="text-xs text-gray-400 mb-4">
              Crea tu primera organización para conectar un entorno de Qlik Cloud y agregar usuarios.
            </p>
            <Button size="sm" onClick={() => setModalCrear(true)}>
              + Crear Organización
            </Button>
          </div>
        )}
      </div>

      <ModalCrearOrganizacion
        open={modalCrear}
        onClose={() => setModalCrear(false)}
        onCrear={(nombre) => crear.mutate({ nombre })}
        isPending={crear.isPending}
      />

      <ConfirmDialog
        open={confirmDialog.open}
        mensaje={confirmDialog.mensaje}
        titulo="Eliminar organización"
        confirmText="Eliminar"
        variant="danger"
        onConfirm={() => {
          confirmDialog.onConfirm();
          setConfirmDialog({ ...confirmDialog, open: false });
        }}
        onCancel={() => setConfirmDialog({ ...confirmDialog, open: false })}
      />
    </PageLayout>
  );
}
