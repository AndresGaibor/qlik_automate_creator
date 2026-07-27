import { type AnyRoute, createRoute } from "@tanstack/react-router";
import { PaginaDetalleFlujo } from "./pagina-detalle-flujo";
import { PaginaFlujos } from "./pagina-flujos";

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
