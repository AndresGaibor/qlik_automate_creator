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
      mostrarExito("Tenant creado exitosamente");
    },
    onError: (error: Error) => mostrarError(error.message),
  });

  const eliminar = useMutation({
    mutationFn: eliminarTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tenants"] });
      mostrarExito("Tenant eliminado");
    },
    onError: (error: Error) => mostrarError(error.message),
  });

  const handleCrear = () => {
    if (nombreNuevo.trim()) {
      crear.mutate({ nombre: nombreNuevo.trim() });
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Tenants</h2>
        <Button onClick={() => setModalCrear(true)}>Crear Tenant</Button>
      </div>

      <div className="space-y-4">
        {tenants?.map((tenant) => (
          <Card key={tenant.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{tenant.nombre}</CardTitle>
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    tenant.estado === "activa"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {tenant.estado}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 space-y-1">
                  <p>Slug: {tenant.slug}</p>
                  <p>Usuarios: {tenant.cantidadUsuarios}</p>
                  <p>
                    Creado: {new Date(tenant.creadoEn).toLocaleDateString()}
                  </p>
                </div>
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
                    Ver
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600"
                    onClick={() => {
                      if (confirm("¿Estás seguro de eliminar este tenant?")) {
                        eliminar.mutate(tenant.id);
                      }
                    }}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {(!tenants || tenants.length === 0) && (
          <div className="text-center text-gray-500 py-8">
            No hay tenants registrados
          </div>
        )}
      </div>

      {modalCrear && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-bold mb-4">Crear Nuevo Tenant</h3>
            <div className="mb-4">
              <label
                htmlFor="nombre-tenant"
                className="block text-sm font-medium mb-1"
              >
                Nombre
              </label>
              <input
                id="nombre-tenant"
                type="text"
                value={nombreNuevo}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNombreNuevo(e.target.value)
                }
                className="w-full border rounded px-3 py-2"
                placeholder="Nombre del tenant"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setModalCrear(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleCrear}
                disabled={!nombreNuevo.trim() || crear.isPending}
              >
                {crear.isPending ? "Creando..." : "Crear"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
