import {
  type AnyRoute,
  createRoute,
  lazyRouteComponent,
} from "@tanstack/react-router";

const PaginaFlujos = lazyRouteComponent(
  () => import("./pagina-flujos"),
  "PaginaFlujos",
);
const PaginaDetalleFlujo = lazyRouteComponent(
  () => import("./pagina-detalle-flujo"),
  "PaginaDetalleFlujo",
);

export function crearRutasFlujos(rutaRaiz: AnyRoute) {
  return [
    createRoute({
      getParentRoute: () => rutaRaiz,
      path: "/flujos",
      component: PaginaFlujos,
    }),
    createRoute({
      getParentRoute: () => rutaRaiz,
      path: "/flujos/$id",
      component: PaginaDetalleFlujo,
    }),
  ];
}
