import { ErrorClienteApi } from "@/compartido/api/cliente";
import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import { Button } from "@/compartido/componentes/ui/button";
import { cerrarSesion, obtenerSesion } from "@/modulos/autenticacion/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export function LayoutPrincipal() {
  const navegar = useNavigate();
  const ubicacion = useLocation();
  const { mostrarError } = useNotificaciones();
  const esLogin = ubicacion.pathname === "/login";

  const consulta = useQuery({
    queryKey: ["sesion"],
    queryFn: obtenerSesion,
    retry: false,
    enabled: !esLogin,
  });

  useEffect(() => {
    if (!esLogin && consulta.error instanceof ErrorClienteApi) {
      if (consulta.error.estado === 401) {
        navegar({ to: "/login", replace: true });
      } else {
        mostrarError(consulta.error.message);
      }
    }
  }, [consulta.error, esLogin, mostrarError, navegar]);

  const cerrar = useMutation({
    mutationFn: cerrarSesion,
    onSuccess: () => navegar({ to: "/login", replace: true }),
    onError: (error: Error) => mostrarError(error.message),
  });

  if (esLogin) return <Outlet />;
  if (consulta.isLoading || !consulta.data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <p className="text-gray-500" aria-live="polite">
          Verificando sesión...
        </p>
      </div>
    );
  }

  const sesion = consulta.data;
  const esSuperadmin = sesion.esSuperadmin ?? false;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold">Qlik Automatizaciones</h1>
          <nav className="flex gap-4" aria-label="Navegación principal">
            {esSuperadmin && (
              <Button
                variant="ghost"
                onClick={() => navegar({ to: "/admin/tenants" })}
              >
                Administración
              </Button>
            )}
            <Button variant="ghost" onClick={() => navegar({ to: "/flujos" })}>
              Flujos
            </Button>
            <Button
              variant="ghost"
              onClick={() => navegar({ to: "/automatizaciones" })}
            >
              Automatizaciones
            </Button>
            <Button
              variant="outline"
              data-accion="cerrar-sesion"
              onClick={() => cerrar.mutate()}
            >
              Cerrar sesión
            </Button>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
