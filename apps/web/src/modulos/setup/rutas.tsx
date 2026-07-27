import { type AnyRoute, createRoute } from "@tanstack/react-router";
import { PaginaSetup } from "./pagina-setup";

export function crearRutasSetup(rutaRaiz: AnyRoute) {
  return [
    createRoute({
      getParentRoute: () => rutaRaiz,
      path: "/setup",
      component: PaginaSetup,
    }),
  ];
}
