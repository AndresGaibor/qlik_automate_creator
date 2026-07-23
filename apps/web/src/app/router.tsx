import { useNotificaciones } from "@/componentes/feedback/notificaciones";
import { Button } from "@/componentes/ui/button";
import { PaginaLogin } from "@/modulos/autenticacion/pagina-login";
import { PaginaAutomatizaciones } from "@/modulos/automatizaciones/pagina-automatizaciones";
import { PaginaDetalleAutomatizacion } from "@/modulos/automatizaciones/pagina-detalle-automatizacion";
import { PaginaNuevaAutomatizacion } from "@/modulos/automatizaciones/pagina-nueva-automatizacion";
import { PaginaFlujos } from "@/modulos/flujos/pagina-flujos";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
  useLocation,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { useEffect } from "react";

type UsuarioSesion = {
  nombre?: string;
  avatarUrl?: string;
};

type RespuestaSesion = {
  success: boolean;
  data?: { usuario?: UsuarioSesion };
  isUnauthorized: boolean;
};

const consultaSesion = async (): Promise<RespuestaSesion> => {
  const res = await fetch("/api/auth/qlik/sesion", {
    method: "GET",
    credentials: "include",
  });
  if (res.status === 401) {
    return { success: false, isUnauthorized: true };
  }
  if (!res.ok) {
    throw new Error("Error al verificar sesión");
  }
  const json = await res.json();
  if (!json.success) {
    throw new Error("Error al verificar sesión");
  }
  return { ...json, isUnauthorized: false };
};

export function LayoutPrincipal() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mostrarError } = useNotificaciones();
  const esLogin = location.pathname === "/login";

  // Verificar sesión activa en el servidor (solo si NO es login)
  const {
    data: sesion,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["sesion"],
    queryFn: consultaSesion,
    retry: false,
    enabled: !esLogin, // No consultar sesión en /login
  });

  // Mostrar error una sola vez para errores no-401 (sin redirigir)
  useEffect(() => {
    if (isError && error) {
      mostrarError("Error al verificar sesión");
    }
  }, [isError, error, mostrarError]);

  // Redirigir a login DESPUÉS del render solo para 401 (sesión caducada)
  useEffect(() => {
    if (
      !esLogin &&
      !isLoading &&
      sesion &&
      !sesion.success &&
      "isUnauthorized" in sesion &&
      sesion.isUnauthorized
    ) {
      navigate({ to: "/login" });
    }
  }, [esLogin, isLoading, sesion, navigate]);

  const { mutate: cerrarSesion } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/qlik/cerrar-sesion", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Error cerrando sesión");
      const json = await res.json();
      if (!json.success) {
        throw new Error("No se pudo cerrar sesión");
      }
    },
    onSuccess: () => {
      navigate({ to: "/login" });
    },
    onError: () => {
      mostrarError("No se pudo cerrar sesión");
    },
  });

  // La pantalla de login no usa el shell de la aplicación.
  if (esLogin) {
    return <Outlet />;
  }

  // No renderizar navegación ni contenido protegido mientras no haya sesión.
  if (isLoading || !sesion?.success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <p className="text-gray-500" aria-live="polite">
          Verificando sesión...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Qlik Automatizaciones</h1>
          <div className="flex gap-4">
            <Button variant="ghost" onClick={() => navigate({ to: "/flujos" })}>
              Flujos
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate({ to: "/automatizaciones" })}
            >
              Automatizaciones
            </Button>
            <Button
              variant="outline"
              data-accion="cerrar-sesion"
              onClick={() => cerrarSesion()}
            >
              Cerrar sesión
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

const rootRoute = createRootRoute({
  component: LayoutPrincipal,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: PaginaInicio,
});

export function PaginaInicio() {
  const navigate = useNavigate();
  const { data: sesion } = useQuery({
    queryKey: ["sesion"],
    queryFn: consultaSesion,
  });
  const nombre = sesion?.data?.usuario?.nombre?.trim() || "Usuario Qlik";
  const avatarUrl = sesion?.data?.usuario?.avatarUrl?.trim();
  const partesNombre = nombre.split(/\s+/).filter(Boolean);
  const iniciales = [partesNombre[0], partesNombre.at(-1)]
    .filter(
      (parte, indice, partes) => parte && (indice === 0 || parte !== partes[0]),
    )
    .map((parte) => parte?.[0]?.toUpperCase())
    .join("");

  return (
    <div className="mx-auto max-w-4xl py-4 sm:py-10">
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-xl sm:px-10 sm:py-12">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Qlik Automatizaciones
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
              Hola, {nombre}
            </h2>
            <p className="mt-4 max-w-md text-base leading-7 text-slate-300 sm:text-lg">
              Gestiona tus automatizaciones y flujos desde un solo lugar.
            </p>
          </div>
          <div
            className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white/10 text-2xl font-bold text-cyan-100 shadow-lg sm:h-24 sm:w-24 sm:text-3xl"
            aria-label={avatarUrl ? undefined : `Iniciales de ${nombre}`}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={`Avatar de ${nombre}`}
                className="h-full w-full object-cover"
              />
            ) : (
              iniciales
            )}
          </div>
        </div>
      </section>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button onClick={() => navigate({ to: "/flujos" })}>Ver flujos</Button>
        <Button
          variant="outline"
          onClick={() => navigate({ to: "/automatizaciones" })}
        >
          Ver automatizaciones
        </Button>
      </div>
    </div>
  );
}

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: function Login() {
    return <PaginaLogin />;
  },
});

const flujosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flujos",
  component: function Flujos() {
    return <PaginaFlujos />;
  },
});

const automatizacionesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/automatizaciones",
  component: function Automatizaciones() {
    return <PaginaAutomatizaciones />;
  },
});

const nuevaAutomatizacionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/automatizaciones/nueva",
  component: function NuevaAutomatizacion() {
    return <PaginaNuevaAutomatizacion />;
  },
});

const detalleAutomatizacionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/automatizaciones/$id",
  component: function DetalleAutomatizacion() {
    const { id } = useParams({ from: "/automatizaciones/$id" });
    return <PaginaDetalleAutomatizacion id={id} />;
  },
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  flujosRoute,
  automatizacionesRoute,
  nuevaAutomatizacionRoute,
  detalleAutomatizacionRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
