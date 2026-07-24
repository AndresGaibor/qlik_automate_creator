import { type AnyRoute, createRoute } from "@tanstack/react-router";
import { PaginaLogin } from "./pagina-login";

export function crearRutasAutenticacion(rutaRaiz: AnyRoute) {
  return [
    createRoute({
      getParentRoute: () => rutaRaiz,
      path: "/login",
      component: PaginaLogin,
    }),
  ];
}
