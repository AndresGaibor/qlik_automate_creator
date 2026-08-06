import { EstadoCarga } from "@/compartido/componentes/ui/estado-carga";
import {
  type AnyRoute,
  createRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { PaginaDetalleTenant } from "./pagina-detalle-tenant";

function RedireccionConfiguracion() {
  const navegar = useNavigate();

  useEffect(() => {
    navegar({ to: "/configuracion", replace: true });
  }, [navegar]);

  return <EstadoCarga mensaje="Abriendo configuración..." />;
}

export function crearRutasAdmin(rutaRaiz: AnyRoute) {
  const listadoHeredado = createRoute({
    getParentRoute: () => rutaRaiz,
    path: "/admin/tenants",
    component: RedireccionConfiguracion,
  });

  const detalle = createRoute({
    getParentRoute: () => rutaRaiz,
    path: "/admin/tenants/$tenantId",
    component: function RutaDetalleTenant() {
      const { tenantId } = useParams({ strict: false }) as { tenantId: string };
      return <PaginaDetalleTenant tenantId={tenantId} modoConfiguracion />;
    },
  });

  const superadminsOculto = createRoute({
    getParentRoute: () => rutaRaiz,
    path: "/admin/superadmins",
    component: RedireccionConfiguracion,
  });

  return [listadoHeredado, detalle, superadminsOculto];
}
