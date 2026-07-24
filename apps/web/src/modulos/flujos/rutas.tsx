import { type AnyRoute, createRoute } from "@tanstack/react-router";
import { PaginaFlujos } from "./pagina-flujos";

export function crearRutasFlujos(rutaRaiz: AnyRoute) {
  return [
    createRoute({
      getParentRoute: () => rutaRaiz,
      path: "/flujos",
      component: PaginaFlujos,
    }),
  ];
}
