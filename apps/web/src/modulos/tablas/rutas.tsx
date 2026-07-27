import { type AnyRoute, createRoute } from "@tanstack/react-router";
import { PaginaTablasDestino } from "./pagina-tablas-destino";

export function crearRutasTablas(rutaRaiz: AnyRoute) {
  return [
    createRoute({
      getParentRoute: () => rutaRaiz,
      path: "/tablas",
      component: PaginaTablasDestino,
    }),
  ];
}
