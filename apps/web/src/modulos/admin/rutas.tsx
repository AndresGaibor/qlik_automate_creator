import { EstadoCarga } from "@/compartido/componentes/ui/estado-carga";
import {
  type AnyRoute,
  createRoute,
  lazyRouteComponent,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect } from "react";

const PaginaConfiguracion = lazyRouteComponent(
  () => import("./pagina-configuracion"),
  "PaginaConfiguracion",
);
const RutaDetalleTenant = lazyRouteComponent(
  () => import("./ruta-detalle-tenant"),
  "RutaDetalleTenant",
);

function RedireccionConfiguracion() {
  const navegar = useNavigate();

  useEffect(() => {
    navegar({ to: "/configuracion", replace: true });
  }, [navegar]);

  return <EstadoCarga mensaje="Abriendo configuración..." />;
}

export function crearRutasAdmin(rutaRaiz: AnyRoute) {
  return [
    createRoute({
      getParentRoute: () => rutaRaiz,
      path: "/configuracion",
      component: PaginaConfiguracion,
    }),
    createRoute({
      getParentRoute: () => rutaRaiz,
      path: "/admin/tenants",
      component: RedireccionConfiguracion,
    }),
    createRoute({
      getParentRoute: () => rutaRaiz,
      path: "/admin/tenants/$tenantId",
      component: RutaDetalleTenant,
    }),
    createRoute({
      getParentRoute: () => rutaRaiz,
      path: "/admin/superadmins",
      component: RedireccionConfiguracion,
    }),
  ];
}
