import { crearRutasAdmin } from "@/modulos/admin/publico";
import { crearRutasAutenticacion } from "@/modulos/autenticacion/publico";
import { crearRutasAutomatizaciones } from "@/modulos/automatizaciones/publico";
import { crearRutasFlujos } from "@/modulos/flujos/publico";
import { crearRutasInicio } from "@/modulos/inicio/publico";
import { crearRutasSetup } from "@/modulos/setup/publico";
import { crearRutasTablas } from "@/modulos/tablas/rutas";
import { createRootRoute, createRouter } from "@tanstack/react-router";
import { LayoutPrincipal } from "./layout-principal";

const rutaRaiz = createRootRoute({ component: LayoutPrincipal });
const arbolRutas = rutaRaiz.addChildren([
  ...crearRutasInicio(rutaRaiz),
  ...crearRutasAutenticacion(rutaRaiz),
  ...crearRutasFlujos(rutaRaiz),
  ...crearRutasAutomatizaciones(rutaRaiz),
  ...crearRutasTablas(rutaRaiz),
  ...crearRutasAdmin(rutaRaiz),
  ...crearRutasSetup(rutaRaiz),
]);

export const router = createRouter({ routeTree: arbolRutas });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
