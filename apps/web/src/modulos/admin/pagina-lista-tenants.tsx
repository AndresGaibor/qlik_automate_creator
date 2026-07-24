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
        title="Administración de Organizaciones"
        description="Gestiona los grupos de trabajo, conexiones con Qlik Cloud y usuarios autorizados."
        actions={
          <Button
            onClick={() => setModalCrear(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            + Nueva Organización
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tenants?.map((tenant) => (
          <Card
            key={tenant.id}
            className="hover:shadow-md transition border-gray-200"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {tenant.nombre}
                </CardTitle>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    tenant.estado === "activa"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {tenant.estado === "activa" ? "● Activa" : "● Inactiva"}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-gray-600 grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-md">
                  <div>
                    <span className="text-xs text-gray-400 block">Usuarios Autorizados</span>
                    <span className="font-semibold text-gray-800">
                      👥 {tenant.cantidadUsuarios} usuario(s)
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block">Identificador</span>
                    <span className="font-mono text-xs text-gray-700">
                      {tenant.slug}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-gray-400">
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
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      ⚙️ Gestionar Usuarios & Qlik
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
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
              No hay organizaciones registradas
            </p>
            <p className="text-xs text-gray-400 mb-4">
              Crea tu primera organización para conectar un tenant de Qlik Cloud y agregar usuarios.
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
