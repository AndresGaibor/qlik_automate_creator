import { type AnyRoute, createRoute } from "@tanstack/react-router";
import { PaginaInicio } from "./pagina-inicio";

export function crearRutasInicio(rutaRaiz: AnyRoute) {
  return [
    createRoute({
      getParentRoute: () => rutaRaiz,
      path: "/",
      component: PaginaInicio,
    }),
  ];
}
