import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import { Button } from "@/compartido/componentes/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/compartido/componentes/ui/card";
import { SelectBuscable } from "@/compartido/componentes/ui/select-buscable";
import type { ResumenAutomatizacion } from "@/modulos/automatizaciones/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  type ActualizarUsuario,
  type DetalleTenant,
  type TenantQlik,
  actualizarTenant,
  actualizarUsuarioTenant,
  agregarUsuarioTenant,
  configurarAutomatizacionBaseTenant,
  configurarDestinoTenant,
  configurarImpalaTenant,
  crearTenantQlik,
  eliminarTenantQlik,
  eliminarUsuarioTenant,
  listarAutomatizacionesParaAdmin,
  marcarTenantQlikPrincipal,
  obtenerDetalleTenant,
  obtenerTenantsQlik,
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
  const [hostQlik, setHostQlik] = useState("");
  const [nombreTenantQlik, setNombreTenantQlik] = useState("");

  const { data: tenant, isLoading } = useQuery<DetalleTenant>({
    queryKey: ["admin-tenant", tenantId],
    queryFn: () => obtenerDetalleTenant(tenantId),
  });

  const { data: tenantsQlik = [] } = useQuery({
    queryKey: ["admin-tenants-qlik", tenantId],
    queryFn: () => obtenerTenantsQlik(tenantId),
  });

  const actualizar = useMutation({
    mutationFn: (cambios: { nombre?: string; estado?: "activa" | "suspendida" }) =>
      actualizarTenant(tenantId, cambios),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tenant", tenantId] });
      queryClient.invalidateQueries({ queryKey: ["admin-tenants"] });
      setEditandoNombre(false);
      mostrarExito("Organización actualizada correctamente");
    },
    onError: (error: Error) => mostrarError(error.message),
  });

  const agregarUsuario = useMutation({
    mutationFn: () =>
      agregarUsuarioTenant(tenantId, {
        correo: correoUsuario.trim(),
        rol: rolUsuario,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tenant", tenantId] });
      setModalUsuario(false);
      setCorreoUsuario("");
      setRolUsuario("usuario");
      mostrarExito("Usuario autorizado correctamente");
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
      mostrarExito("Rol de usuario actualizado");
    },
    onError: (error: Error) => mostrarError(error.message),
  });

  const eliminarUsuario = useMutation({
    mutationFn: (usuarioId: string) =>
      eliminarUsuarioTenant(tenantId, usuarioId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tenant", tenantId] });
      mostrarExito("Usuario removido de la organización");
    },
    onError: (error: Error) => mostrarError(error.message),
  });

  const crearQlik = useMutation({
    mutationFn: () =>
      crearTenantQlik(tenantId, {
        host: hostQlik.trim(),
        ...(nombreTenantQlik.trim() ? { nombre: nombreTenantQlik.trim() } : {}),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-tenants-qlik", tenantId],
      });
      setHostQlik("");
      setNombreTenantQlik("");
      mostrarExito("Conexión con Qlik Cloud registrada");
    },
    onError: (error: Error) => mostrarError(error.message),
  });

  const hacerPrincipal = useMutation({
    mutationFn: (id: string) => marcarTenantQlikPrincipal(tenantId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-tenants-qlik", tenantId],
      });
      mostrarExito("Conexión principal actualizada");
    },
    onError: (error: Error) => mostrarError(error.message),
  });

  const eliminarQlik = useMutation({
    mutationFn: (id: string) => eliminarTenantQlik(tenantId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-tenants-qlik", tenantId],
      });
      mostrarExito("Conexión con Qlik Cloud eliminada");
    },
    onError: (error: Error) => mostrarError(error.message),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-gray-500 animate-pulse">Cargando detalles...</p>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="text-center py-12 text-red-600">
        Organización no encontrada
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          onClick={() => navegar({ to: "/admin/tenants" })}
          className="text-gray-600 hover:text-gray-900 -ml-2 mb-2"
        >
          ← Volver a Organizaciones
        </Button>
      </div>

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
                  if (
                    confirm(
                      `¿Deseas ${
                        nuevoEstado === "suspendida"
                          ? "suspender/desactivar"
                          : "activar"
                      } esta organización?`,
                    )
                  ) {
                    actualizar.mutate({ estado: nuevoEstado });
                  }
                }}
              >
                {tenant.estado === "activa"
                  ? "⏸️ Desactivar Organización"
                  : "▶️ Activar Organización"}
              </Button>
              {!editandoNombre ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setNombreEditado(tenant.nombre);
                    setEditandoNombre(true);
                  }}
                >
                  ✏️ Editar Nombre
                </Button>
              ) : null}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {editandoNombre && (
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
                onClick={() => actualizar.mutate({ nombre: nombreEditado.trim() })}
                disabled={actualizar.isPending || !nombreEditado.trim()}
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
          )}
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardHeader className="border-b bg-gray-50/50 pb-4">
          <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
            ☁️ Conexión con Qlik Cloud
          </CardTitle>
          <p className="text-xs text-gray-500">
            Ingresa la dirección web (Host) de tu entorno Qlik Cloud. No se requieren IDs técnicos complejos.
          </p>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg border grid gap-3 sm:grid-cols-3 items-end">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Host / Dominio Qlik Cloud <span className="text-red-500">*</span>
              </label>
              <input
                value={hostQlik}
                onChange={(evento) => setHostQlik(evento.target.value)}
                placeholder="ej: miempresa.us.qlikcloud.com"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Nombre de la Conexión (Opcional)
              </label>
              <input
                value={nombreTenantQlik}
                onChange={(evento) => setNombreTenantQlik(evento.target.value)}
                placeholder="ej: Entorno Producción"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <Button
              disabled={!hostQlik.trim() || crearQlik.isPending}
              onClick={() => crearQlik.mutate()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium w-full"
            >
              {crearQlik.isPending ? "Conectando..." : "+ Agregar Conexión Qlik"}
            </Button>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-800">
              Conexiones Registradas
            </h4>
            {tenantsQlik.map((tQlik) => (
              <div
                key={tQlik.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border bg-white hover:border-gray-300 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      {tQlik.nombre || tQlik.host}
                    </span>
                    {tQlik.esPrincipal ? (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded font-medium">
                        ⭐ Conexión Principal
                      </span>
                    ) : null}
                  </div>
                  <p className="text-xs text-gray-500 font-mono">{tQlik.host}</p>
                </div>
                <div className="flex gap-2">
                  {!tQlik.esPrincipal && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => hacerPrincipal.mutate(tQlik.id)}
                      className="text-xs"
                    >
                      ⭐ Usar como Principal
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-600 text-xs hover:bg-red-50"
                    onClick={() => {
                      if (confirm("¿Estás seguro de eliminar esta conexión de Qlik?")) {
                        eliminarQlik.mutate(tQlik.id);
                      }
                    }}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
            {tenantsQlik.length === 0 && (
              <p className="text-xs text-gray-400 italic">
                Aún no has agregado la dirección de Qlik Cloud para esta organización.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 🤖 AUTOMATIZACIÓN BASE (PLANTILLA MÁSTER DEL TENANT) */}
      {tenantsQlik.length > 0 && (
        <Card className="border-gray-200">
          <CardHeader className="border-b bg-gray-50/50 pb-4">
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
              🤖 Automatización Base (Plantilla Máster del Tenant)
            </CardTitle>
            <p className="text-xs text-gray-500 mt-0.5">
              Selecciona la automatización de Qlik Automate que servirá como plantilla base. Esta plantilla se duplicará automáticamente cuando los usuarios creen nuevos flujos y permanecerá oculta para los usuarios finales.
            </p>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {tenantsQlik.map((tQlik) => (
              <div
                key={tQlik.id}
                className="p-4 rounded-lg border bg-white space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-sm">
                      {tQlik.nombre || tQlik.host}
                    </span>
                    {tQlik.automatizacionBaseIdQlik ? (
                      <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                        ✓ Plantilla Base Configurada
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-medium">
                        ⚠️ Sin Plantilla Base Asignada
                      </span>
                    )}
                  </div>
                </div>

                {tQlik.automatizacionBaseNombre && (
                  <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-md flex items-center justify-between text-xs">
                    <div>
                      <span className="text-gray-500 block">Plantilla máster activa:</span>
                      <span className="font-bold text-emerald-900 text-sm">
                        ⭐ {tQlik.automatizacionBaseNombre}
                      </span>
                      <span className="text-gray-400 font-mono block text-[11px]">
                        ID Qlik: {tQlik.automatizacionBaseIdQlik}
                      </span>
                    </div>
                  </div>
                )}

                <SeccionConfigurarAutomatizacionBase
                  organizacionId={tenantId}
                  tenantQlik={tQlik}
                />

                <SeccionConfigurarImpalaTenant
                  organizacionId={tenantId}
                  tenantQlik={tQlik}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="border-gray-200">
        <CardHeader className="border-b bg-gray-50/50 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                👥 Integrantes y Permisos de la Organización
              </CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">
                Los usuarios registrados aquí podrán ingresar mediante su correo. Un usuario puede pertenecer a múltiples organizaciones simultáneamente.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setModalUsuario(true)}
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
                {tenant.usuarios.map((usr) => (
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
                            actualizarUsuario.mutate({
                              usuarioId: usr.id,
                              rol: nuevoRol,
                            });
                          }
                        }}
                        className="rounded border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium shadow-sm focus:border-blue-500 focus:outline-none"
                      >
                        <option value="admin">🛡️ Administrador del Tenant</option>
                        <option value="usuario">👤 Usuario Final</option>
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:bg-red-50 text-xs"
                        onClick={() => {
                          if (
                            confirm(
                              `¿Remover a ${usr.correo ?? usr.nombre} de esta organización?`,
                            )
                          ) {
                            eliminarUsuario.mutate(usr.id);
                          }
                        }}
                      >
                        Quitar
                      </Button>
                    </td>
                  </tr>
                ))}
                {tenant.usuarios.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-gray-400 text-xs italic">
                      No hay usuarios autorizados todavía en esta organización.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {modalUsuario && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl border">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Autorizar Usuarios
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Puedes ingresar uno o varios correos electrónicos separados por coma (<code>,</code>) o punto y coma (<code>;</code>). El nombre real se obtendrá automáticamente cuando el usuario ingrese por primera vez.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Correo(s) Electrónico(s) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={correoUsuario}
                  onChange={(e) => setCorreoUsuario(e.target.value)}
                  placeholder="ej: usuario1@empresa.com, usuario2@empresa.com"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Rol en esta Organización
                </label>
                <select
                  value={rolUsuario}
                  onChange={(e) =>
                    setRolUsuario(e.target.value as "admin" | "usuario")
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="usuario">👤 Usuario (Crea y ejecuta automatizaciones)</option>
                  <option value="admin">🛡️ Administrador (Gestiona usuarios y Qlik)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-6">
              <Button variant="outline" onClick={() => setModalUsuario(false)}>
                Cancelar
              </Button>
              <Button
                onClick={() => agregarUsuario.mutate()}
                disabled={!correoUsuario.trim() || agregarUsuario.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {agregarUsuario.isPending ? "Guardando..." : "Autorizar Usuario(s)"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SeccionConfigurarAutomatizacionBase({
  organizacionId,
  tenantQlik,
}: {
  organizacionId: string;
  tenantQlik: TenantQlik;
}) {
  const { mostrarExito, mostrarError } = useNotificaciones();
  const queryClient = useQueryClient();
  const [baseIdSeleccionado, setBaseIdSeleccionado] = useState(
    tenantQlik.automatizacionBaseIdQlik || "",
  );

  const { data: automatizaciones = [], isLoading } = useQuery<
    ResumenAutomatizacion[]
  >({
    queryKey: ["automatizaciones-admin-list", tenantQlik.id],
    queryFn: listarAutomatizacionesParaAdmin,
  });

  const guardarBase = useMutation({
    mutationFn: (auto: ResumenAutomatizacion) =>
      configurarAutomatizacionBaseTenant(
        organizacionId,
        tenantQlik.id,
        auto.id,
        auto.nombre,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-tenants-qlik", organizacionId],
      });
      mostrarExito("Automatización Base del Tenant configurada exitosamente");
    },
    onError: (err: Error) => mostrarError(err.message),
  });

  const handleSeleccionar = (id: string) => {
    setBaseIdSeleccionado(id);
    const auto = automatizaciones.find((a) => a.id === id);
    if (auto) {
      guardarBase.mutate(auto);
    }
  };

  const opciones = automatizaciones.map((a) => ({
    id: a.id,
    nombre: `${a.nombre} (ID: ${a.id.slice(0, 8)}…)`,
    espacioNombre: a.espacioNombre || "Personal",
  }));

  return (
    <div className="pt-2 border-t mt-3">
      <SelectBuscable
        etiqueta="Designar o Cambiar Automatización Base"
        placeholder="Busca y selecciona la automatización plantilla..."
        opciones={opciones}
        valorSeleccionado={baseIdSeleccionado}
        onSeleccionar={handleSeleccionar}
        cargando={isLoading}
      />
    </div>
  );
}



function SeccionConfigurarImpalaTenant({
  organizacionId,
  tenantQlik,
}: {
  organizacionId: string;
  tenantQlik: TenantQlik;
}) {
  const { mostrarExito, mostrarError } = useNotificaciones();
  const queryClient = useQueryClient();
  const [host, setHost] = useState(tenantQlik.impalaHost || "");
  const [port, setPort] = useState(tenantQlik.impalaPort || 21050);
  const [authMechanism, setAuthMechanism] = useState(
    tenantQlik.impalaAuthMechanism || "NOSASL",
  );
  const [user, setUser] = useState(tenantQlik.impalaUser || "");
  const [password, setPassword] = useState(tenantQlik.impalaPassword || "");
  const [database, setDatabase] = useState(tenantQlik.impalaDatabase || "default");

  const guardarImpala = useMutation({
    mutationFn: () =>
      configurarImpalaTenant(organizacionId, tenantQlik.id, {
        impalaHost: host.trim(),
        impalaPort: Number(port),
        impalaAuthMechanism: authMechanism,
        impalaUser: user.trim() || undefined,
        impalaPassword: password.trim() || undefined,
        impalaDatabase: database.trim() || "default",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-tenants-qlik", organizacionId],
      });
      mostrarExito("Conexión Directa a Impala configurada correctamente");
    },
    onError: (err: Error) => mostrarError(err.message),
  });

  return (
    <div className="pt-3 border-t mt-3 space-y-3 bg-blue-50/30 p-3 rounded-lg border border-blue-100">
      <div className="flex items-center justify-between">
        <h5 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
          🐘 Conexión Directa Servidor Impala (Native Impala)
        </h5>
        {tenantQlik.impalaHost ? (
          <span className="text-[11px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-medium">
            ● Host Activo: {tenantQlik.impalaHost}:{tenantQlik.impalaPort || 21050}
          </span>
        ) : (
          <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">
            ● Sin Servidor Impala Registrado
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Host / IP de Impala *
          </label>
          <input
            type="text"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            placeholder="ej: impala.miempresa.com o 10.0.1.50"
            className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Puerto (ej: 21050)
          </label>
          <input
            type="number"
            value={port}
            onChange={(e) => setPort(Number(e.target.value))}
            placeholder="21050"
            className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Autenticación (Auth)
          </label>
          <select
            value={authMechanism}
            onChange={(e) => setAuthMechanism(e.target.value)}
            className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded focus:border-blue-500 focus:outline-none bg-white"
          >
            <option value="NOSASL">NOSASL (Sin auth)</option>
            <option value="PLAIN">PLAIN (Usuario/Contraseña)</option>
            <option value="LDAP">LDAP</option>
            <option value="KERBEROS">KERBEROS</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Usuario Impala (Opcional)
          </label>
          <input
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="ej: impala_user"
            className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Contraseña Impala (Opcional)
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña..."
            className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Base de Datos Impala
          </label>
          <input
            type="text"
            value={database}
            onChange={(e) => setDatabase(e.target.value)}
            placeholder="ej: default o ventas"
            className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          size="sm"
          disabled={!host.trim() || guardarImpala.isPending}
          onClick={() => guardarImpala.mutate()}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium"
        >
          {guardarImpala.isPending ? "Guardando..." : "💾 Guardar Conexión Directa Impala"}
        </Button>
      </div>
    </div>
  );
}
