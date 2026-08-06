import {
  type AnyRoute,
  createRoute,
  lazyRouteComponent,
} from "@tanstack/react-router";

const PaginaInicio = lazyRouteComponent(
  () => import("./pagina-inicio"),
  "PaginaInicio",
);

export function crearRutasInicio(rutaRaiz: AnyRoute) {
  return [
    createRoute({
      getParentRoute: () => rutaRaiz,
      path: "/",
      component: PaginaInicio,
    }),
  ];
}
