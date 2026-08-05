import { type AnyRoute, createRoute } from "@tanstack/react-router";
import { PaginaLogin } from "./pagina-login";

export function crearRutasAutenticacion(rutaRaiz: AnyRoute) {
  return [
    createRoute({
      getParentRoute: () => rutaRaiz,
      path: "/login",
      component: PaginaLogin,
      validateSearch: (busqueda: Record<string, unknown>) => ({
        motivo_sesion:
          typeof busqueda.motivo_sesion === "string"
            ? busqueda.motivo_sesion
            : undefined,
      }),
    }),
  ];
}
