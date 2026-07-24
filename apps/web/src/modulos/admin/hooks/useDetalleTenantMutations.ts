import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import type { ActualizarUsuario } from "@/modulos/admin/api";
import {
  actualizarTenant,
  actualizarUsuarioTenant,
  agregarUsuarioTenant,
  crearTenantQlik,
  eliminarTenantQlik,
  eliminarUsuarioTenant,
  marcarTenantQlikPrincipal,
} from "@/modulos/admin/api";

interface UseDetalleTenantMutationsProps {
  tenantId: string;
  correoUsuario: string;
  rolUsuario: "admin" | "usuario";
  onLimpiarFormularioUsuario: () => void;
}

export function useDetalleTenantMutations({
  tenantId,
  correoUsuario,
  rolUsuario,
  onLimpiarFormularioUsuario,
}: UseDetalleTenantMutationsProps) {
  const queryClient = useQueryClient();
  const { mostrarExito, mostrarError } = useNotificaciones();

  const actualizar = useMutation({
    mutationFn: (cambios: { nombre?: string; estado?: "activa" | "suspendida" }) =>
      actualizarTenant(tenantId, cambios),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tenant", tenantId] });
      queryClient.invalidateQueries({ queryKey: ["admin-tenants"] });
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
      onLimpiarFormularioUsuario();
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
    mutationFn: (params: { host: string; nombre?: string }) =>
      crearTenantQlik(tenantId, params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-tenants-qlik", tenantId],
      });
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

  return {
    actualizar,
    agregarUsuario,
    actualizarUsuario,
    eliminarUsuario,
    crearQlik,
    hacerPrincipal,
    eliminarQlik,
  };
}
