import { ErrorClienteApi, clienteApi } from "@/compartido/api/cliente";
import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import { cerrarSesion, obtenerSesion } from "@/modulos/autenticacion/publico";
import { obtenerEstadoSetup } from "@/modulos/setup/publico";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useVistaUsuarioFinal } from "./contexto-vista";
import { filtrarNavegacion } from "./navegacion-layout";

export type SesionLayout = Awaited<ReturnType<typeof obtenerSesion>>;

export function useLayoutPrincipal() {
  const navegar = useNavigate();
  const queryClient = useQueryClient();
  const ubicacion = useLocation();
  const { mostrarError } = useNotificaciones();
  const { estado, setModoUsuarioFinal } = useVistaUsuarioFinal();
  const esLogin = ubicacion.pathname === "/login";
  const esSetup = ubicacion.pathname === "/setup";

  useEffect(() => {
    clienteApi.setVistaUsuarioFinal(estado.modoUsuarioFinal);
    void queryClient.invalidateQueries({ queryKey: ["flujos"] });
    void queryClient.invalidateQueries({ queryKey: ["automatizaciones"] });
  }, [estado.modoUsuarioFinal, queryClient]);

  const consultaSetup = useQuery({
    queryKey: ["setup-status"],
    queryFn: obtenerEstadoSetup,
    retry: false,
  });
  const consultaSesion = useQuery({
    queryKey: ["sesion"],
    queryFn: obtenerSesion,
    retry: false,
    enabled: !esLogin && !esSetup,
  });

  useEffect(() => {
    if (consultaSetup.data?.needsSetup === true && !esSetup) {
      navegar({ to: "/setup", replace: true });
    }
    if (consultaSetup.data?.needsSetup === false && esSetup) {
      navegar({ to: "/login", replace: true });
    }
  }, [consultaSetup.data, esSetup, navegar]);

  const cerrar = useMutation({
    mutationFn: cerrarSesion,
    onSuccess: async () => {
      queryClient.clear();
      navegar({ to: "/login", replace: true });
    },
    onError: (error: Error) => mostrarError(error.message),
  });

  useEffect(() => {
    if (!esLogin && consultaSesion.error instanceof ErrorClienteApi) {
      if (consultaSesion.error.estado === 401) {
        navegar({ to: "/login", replace: true });
      } else {
        mostrarError(consultaSesion.error.message);
      }
    }
  }, [consultaSesion.error, esLogin, mostrarError, navegar]);

  const esSuperadmin = consultaSesion.data?.esSuperadmin ?? false;
  const esAdmin =
    esSuperadmin ||
    (consultaSesion.data?.membresias.some(
      (membresia) => membresia.rol === "admin",
    ) ??
      false);
  const puedeVerAdministracion = esAdmin && !estado.modoUsuarioFinal;

  useEffect(() => {
    if (!consultaSesion.data || puedeVerAdministracion) return;
    const rutaBloqueada =
      ubicacion.pathname === "/configuracion" ||
      ubicacion.pathname.startsWith("/admin/");
    if (rutaBloqueada) navegar({ to: "/tablas", replace: true });
  }, [
    consultaSesion.data,
    puedeVerAdministracion,
    ubicacion.pathname,
    navegar,
  ]);

  return {
    navegar,
    consultaSetup,
    consultaSesion,
    esLogin,
    esSetup,
    esAdmin,
    esSuperadmin,
    modoUsuarioFinal: estado.modoUsuarioFinal,
    setModoUsuarioFinal,
    cerrarSesion: () => cerrar.mutate(),
    navegacion: filtrarNavegacion({
      esAdmin,
      esSuperadmin,
      modoUsuarioFinal: estado.modoUsuarioFinal,
    }),
  };
}
