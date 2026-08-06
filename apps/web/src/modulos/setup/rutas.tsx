import {
  type AnyRoute,
  createRoute,
  lazyRouteComponent,
} from "@tanstack/react-router";

const PaginaSetup = lazyRouteComponent(
  () => import("./pagina-setup"),
  "PaginaSetup",
);

export function crearRutasSetup(rutaRaiz: AnyRoute) {
  return [
    createRoute({
      getParentRoute: () => rutaRaiz,
      path: "/setup",
      component: PaginaSetup,
    }),
  ];
}
