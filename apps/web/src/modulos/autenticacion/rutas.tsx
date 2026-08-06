import {
  type AnyRoute,
  createRoute,
  lazyRouteComponent,
} from "@tanstack/react-router";

const PaginaLogin = lazyRouteComponent(
  () => import("./pagina-login"),
  "PaginaLogin",
);

export function crearRutasAutenticacion(rutaRaiz: AnyRoute) {
  return [
    createRoute({
      getParentRoute: () => rutaRaiz,
      path: "/login",
      component: PaginaLogin,
      validateSearch: (busqueda: Record<string, unknown>) => ({
        motivo_sesion:
          typeof busqueda.motivo_sesion === "string"
            ? busqueda.motivo_sesion
            : undefined,
      }),
    }),
  ];
}
