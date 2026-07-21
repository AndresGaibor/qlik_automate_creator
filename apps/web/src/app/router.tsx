import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  useNavigate,
} from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/componentes/ui/button";
import { PaginaLogin } from "@/modulos/autenticacion/pagina-login";
import { PaginaFlujos } from "@/modulos/flujos/pagina-flujos";
import { PaginaAutomatizaciones } from "@/modulos/automatizaciones/pagina-automatizaciones";

function LayoutPrincipal() {
  const navigate = useNavigate();

  const { mutate: cerrarSesion } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/cerrar-sesion", { method: "POST" });
      if (!res.ok) throw new Error("Error cerrando sesión");
    },
    onSuccess: () => {
      navigate({ to: "/login" });
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Qlik Automatizaciones</h1>
          <div className="flex gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate({ to: "/flujos" })}
            >
              Flujos
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate({ to: "/automatizaciones" })}
            >
              Automatizaciones
            </Button>
            <Button variant="outline" onClick={() => cerrarSesion()}>
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
  component: function Index() {
    const navigate = useNavigate();
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Bienvenido</h2>
        <p className="text-gray-600 mb-6">
          Gestiona tus automatizaciones de Qlik
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigate({ to: "/flujos" })}>
            Ver flujos
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate({ to: "/automatizaciones" })}
          >
            Ver automatizaciones
          </Button>
        </div>
      </div>
    );
  },
});

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

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  flujosRoute,
  automatizacionesRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
