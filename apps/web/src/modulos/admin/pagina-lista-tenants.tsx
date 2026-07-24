import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import { Button } from "@/compartido/componentes/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/compartido/componentes/ui/card";
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
  const [nombreNuevo, setNombreNuevo] = useState("");

  const { data: tenants, isLoading } = useQuery<TenantResumen[]>({
    queryKey: ["admin-tenants"],
    queryFn: obtenerTenants,
  });

  const crear = useMutation({
    mutationFn: crearTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tenants"] });
      setModalCrear(false);
      setNombreNuevo("");
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

  const handleCrear = () => {
    if (nombreNuevo.trim()) {
      crear.mutate({ nombre: nombreNuevo.trim() });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-gray-500 animate-pulse">Cargando organizaciones...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Administración de Organizaciones
          </h2>
          <p className="text-sm text-gray-500">
            Gestiona los grupos de trabajo, conexiones con Qlik Cloud y usuarios autorizados.
          </p>
        </div>
        <Button
          onClick={() => setModalCrear(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          + Nueva Organización
        </Button>
      </div>

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
                        if (
                          confirm(
                            `¿Estás seguro de eliminar la organización "${tenant.nombre}"? esta acción no se puede deshacer.`,
                          )
                        ) {
                          eliminar.mutate(tenant.id);
                        }
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

      {modalCrear && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl border">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Nueva Organización
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Registra un nombre descriptivo para la empresa o área de trabajo.
            </p>
            <div className="mb-4">
              <label
                htmlFor="nombre-tenant"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre de la Empresa / Organización
              </label>
              <input
                id="nombre-tenant"
                type="text"
                value={nombreNuevo}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNombreNuevo(e.target.value)
                }
                className="w-full border rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="ej: Bancolombia - Finanzas"
              />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="outline" onClick={() => setModalCrear(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleCrear}
                disabled={!nombreNuevo.trim() || crear.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {crear.isPending ? "Guardando..." : "Crear Organización"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
