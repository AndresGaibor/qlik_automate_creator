import { type AnyRoute, createRoute } from "@tanstack/react-router";
import { PaginaConfiguracion } from "../admin/pagina-configuracion";
import { PaginaTablasDestino } from "./pagina-tablas-destino";

export function crearRutasTablas(rutaRaiz: AnyRoute) {
  return [
    createRoute({
      getParentRoute: () => rutaRaiz,
      path: "/tablas",
      component: PaginaTablasDestino,
    }),
    createRoute({
      getParentRoute: () => rutaRaiz,
      path: "/configuracion",
      component: PaginaConfiguracion,
    }),
  ];
}
