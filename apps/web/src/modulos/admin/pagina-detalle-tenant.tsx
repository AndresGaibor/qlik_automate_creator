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
  type ActualizarUsuario,
  type DetalleTenant,
  actualizarTenant,
  actualizarUsuarioTenant,
  agregarUsuarioTenant,
  eliminarUsuarioTenant,
  obtenerDetalleTenant,
} from "./api";

interface Props {
  tenantId: string;
}

export function PaginaDetalleTenant({ tenantId }: Props) {
  const navegar = useNavigate();
  const { mostrarExito, mostrarError } = useNotificaciones();
  const queryClient = useQueryClient();
  const [modalUsuario, setModalUsuario] = useState(false);
  const [correoUsuario, setCorreoUsuario] = useState("");
  const [rolUsuario, setRolUsuario] = useState<"admin" | "usuario">("usuario");
  const [editandoNombre, setEditandoNombre] = useState(false);
  const [nombreEditado, setNombreEditado] = useState("");

  const { data: tenant, isLoading } = useQuery<DetalleTenant>({
    queryKey: ["admin-tenant", tenantId],
    queryFn: () => obtenerDetalleTenant(tenantId),
  });

  const actualizar = useMutation({
    mutationFn: (nombre: string) => actualizarTenant(tenantId, { nombre }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tenant", tenantId] });
      setEditandoNombre(false);
      mostrarExito("Tenant actualizado");
    },
    onError: (error: Error) => mostrarError(error.message),
  });

  const agregarUsuario = useMutation({
    mutationFn: () =>
      agregarUsuarioTenant(tenantId, {
        correo: correoUsuario,
        rol: rolUsuario,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tenant", tenantId] });
      setModalUsuario(false);
      setCorreoUsuario("");
      setRolUsuario("usuario");
      mostrarExito("Usuario agregado");
    },
    onError: (error: Error) => mostrarError(error.message),
  });

  const actualizarUsuario = useMutation({
    mutationFn: (params: {
      usuarioId: string;
      rol: ActualizarUsuario["rol"];
    }) =>
      actualizarUsuarioTenant(tenantId, params.usuarioId, { rol: params.rol }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tenant", tenantId] });
      mostrarExito("Rol actualizado");
    },
    onError: (error: Error) => mostrarError(error.message),
  });

  const eliminarUsuario = useMutation({
    mutationFn: (usuarioId: string) =>
      eliminarUsuarioTenant(tenantId, usuarioId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tenant", tenantId] });
      mostrarExito("Usuario eliminado");
    },
    onError: (error: Error) => mostrarError(error.message),
  });

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!tenant) {
    return <div>Tenant no encontrado</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navegar({ to: "/admin/tenants" })}
        >
          ← Volver
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Información del Tenant</CardTitle>
        </CardHeader>
        <CardContent>
          {editandoNombre ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={nombreEditado}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNombreEditado(e.target.value)
                }
                className="border rounded px-2 py-1"
              />
              <Button
                size="sm"
                onClick={() => actualizar.mutate(nombreEditado)}
                disabled={actualizar.isPending}
              >
                Guardar
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditandoNombre(false)}
              >
                Cancelar
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{tenant.nombre}</p>
                <p className="text-gray-500">Slug: {tenant.slug}</p>
                <p className="text-gray-500">Estado: {tenant.estado}</p>
                <p className="text-gray-500">
                  Creado: {new Date(tenant.creadoEn).toLocaleDateString()}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setNombreEditado(tenant.nombre);
                  setEditandoNombre(true);
                }}
              >
                Editar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Usuarios</CardTitle>
            <Button size="sm" onClick={() => setModalUsuario(true)}>
              Agregar Usuario
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Nombre</th>
                <th className="text-left p-2">Correo</th>
                <th className="text-left p-2">Rol</th>
                <th className="text-right p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tenant.usuarios.map(
                (usuario: {
                  id: string;
                  correo: string | null;
                  nombre: string;
                  rol: "admin" | "usuario";
                }) => (
                  <tr key={usuario.id} className="border-b">
                    <td className="p-2">{usuario.nombre}</td>
                    <td className="p-2 text-gray-500">
                      {usuario.correo || "—"}
                    </td>
                    <td className="p-2">
                      <select
                        value={usuario.rol}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                          const nuevoRol = e.target.value as
                            | "admin"
                            | "usuario";
                          if (nuevoRol !== usuario.rol) {
                            setRolUsuario(nuevoRol);
                            actualizarUsuario.mutate({
                              usuarioId: usuario.id,
                              rol: nuevoRol,
                            });
                          }
                        }}
                        className="border rounded px-2 py-1"
                      >
                        <option value="admin">Admin</option>
                        <option value="usuario">Usuario</option>
                      </select>
                    </td>
                    <td className="p-2 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600"
                        onClick={() => {
                          if (confirm("¿Eliminar este usuario?")) {
                            eliminarUsuario.mutate(usuario.id);
                          }
                        }}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ),
              )}
              {tenant.usuarios.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    No hay usuarios en este tenant
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {modalUsuario && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-bold mb-4">Agregar Usuario</h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="correo-usuario"
                  className="block text-sm font-medium mb-1"
                >
                  Correo
                </label>
                <input
                  id="correo-usuario"
                  type="email"
                  value={correoUsuario}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCorreoUsuario(e.target.value)
                  }
                  className="w-full border rounded px-3 py-2"
                  placeholder="correo@ejemplo.com"
                />
              </div>
              <div>
                <label
                  htmlFor="rol-usuario"
                  className="block text-sm font-medium mb-1"
                >
                  Rol
                </label>
                <select
                  id="rol-usuario"
                  value={rolUsuario}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setRolUsuario(e.target.value as "admin" | "usuario")
                  }
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="admin">Admin</option>
                  <option value="usuario">Usuario</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-6 justify-end">
              <Button variant="outline" onClick={() => setModalUsuario(false)}>
                Cancelar
              </Button>
              <Button
                onClick={() => agregarUsuario.mutate()}
                disabled={!correoUsuario || agregarUsuario.isPending}
              >
                {agregarUsuario.isPending ? "Agregando..." : "Agregar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
