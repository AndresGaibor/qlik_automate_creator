import {
  type AnyRoute,
  createRoute,
  lazyRouteComponent,
} from "@tanstack/react-router";

const PaginaAutomatizaciones = lazyRouteComponent(
  () => import("./pagina-automatizaciones"),
  "PaginaAutomatizaciones",
);
const PaginaNuevaAutomatizacion = lazyRouteComponent(
  () => import("./pagina-nueva-automatizacion"),
  "PaginaNuevaAutomatizacion",
);
const RutaDetalleAutomatizacion = lazyRouteComponent(
  () => import("./ruta-detalle-automatizacion"),
  "RutaDetalleAutomatizacion",
);

export function crearRutasAutomatizaciones(rutaRaiz: AnyRoute) {
  return [
    createRoute({
      getParentRoute: () => rutaRaiz,
      path: "/automatizaciones",
      component: PaginaAutomatizaciones,
    }),
    createRoute({
      getParentRoute: () => rutaRaiz,
      path: "/automatizaciones/nueva",
      component: PaginaNuevaAutomatizacion,
    }),
    createRoute({
      getParentRoute: () => rutaRaiz,
      path: "/automatizaciones/$id",
      component: RutaDetalleAutomatizacion,
    }),
  ];
}
