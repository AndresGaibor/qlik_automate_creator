import {
  type AnyRoute,
  createRoute,
  lazyRouteComponent,
} from "@tanstack/react-router";

const PaginaTablasDestino = lazyRouteComponent(
  () => import("./pagina-tablas-destino"),
  "PaginaTablasDestino",
);

export function crearRutasTablas(rutaRaiz: AnyRoute) {
  return [
    createRoute({
      getParentRoute: () => rutaRaiz,
      path: "/tablas",
      component: PaginaTablasDestino,
    }),
  ];
}
