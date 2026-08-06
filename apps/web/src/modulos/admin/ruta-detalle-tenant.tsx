import { useParams } from "@tanstack/react-router";
import { PaginaDetalleTenant } from "./pagina-detalle-tenant";

export function RutaDetalleTenant() {
  const { tenantId } = useParams({ strict: false }) as { tenantId: string };
  return <PaginaDetalleTenant tenantId={tenantId} modoConfiguracion />;
}
