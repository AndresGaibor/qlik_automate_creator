import { type AnyRoute, createRoute, useParams } from "@tanstack/react-router";
import { PaginaAutomatizaciones } from "./pagina-automatizaciones";
import { PaginaDetalleAutomatizacion } from "./pagina-detalle-automatizacion";
import { PaginaNuevaAutomatizacion } from "./pagina-nueva-automatizacion";

export function crearRutasAutomatizaciones(rutaRaiz: AnyRoute) {
  const listado = createRoute({
    getParentRoute: () => rutaRaiz,
    path: "/automatizaciones",
    component: PaginaAutomatizaciones,
  });
  const nueva = createRoute({
    getParentRoute: () => rutaRaiz,
    path: "/automatizaciones/nueva",
    component: PaginaNuevaAutomatizacion,
  });
  const detalle = createRoute({
    getParentRoute: () => rutaRaiz,
    path: "/automatizaciones/$id",
    component: function RutaDetalleAutomatizacion() {
      const { id } = useParams({ strict: false }) as { id: string };
      return <PaginaDetalleAutomatizacion id={id} />;
    },
  });
  return [listado, nueva, detalle];
}
