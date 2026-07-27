import { type AnyRoute, createRoute, useParams } from "@tanstack/react-router";
import { PaginaSuperadmins } from "./PaginaSuperadmins";
import { PaginaDetalleTenant } from "./pagina-detalle-tenant";
import { PaginaListaTenants } from "./pagina-lista-tenants";

export function crearRutasAdmin(rutaRaiz: AnyRoute) {
  const listado = createRoute({
    getParentRoute: () => rutaRaiz,
    path: "/admin/tenants",
    component: PaginaListaTenants,
  });

  const detalle = createRoute({
    getParentRoute: () => rutaRaiz,
    path: "/admin/tenants/$tenantId",
    component: function RutaDetalleTenant() {
      const { tenantId } = useParams({ strict: false }) as { tenantId: string };
      return <PaginaDetalleTenant tenantId={tenantId} />;
    },
  });

  const superadmins = createRoute({
    getParentRoute: () => rutaRaiz,
    path: "/admin/superadmins",
    component: PaginaSuperadmins,
  });

  return [listado, detalle, superadmins];
}
