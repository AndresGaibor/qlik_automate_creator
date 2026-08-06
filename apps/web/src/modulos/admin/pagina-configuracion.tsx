import { EstadoError } from "@/compartido/componentes/feedback/estado-error";
import { EstadoCarga } from "@/compartido/componentes/ui/estado-carga";
import { PageLayout } from "@/compartido/componentes/ui/page-layout";
import { useQuery } from "@tanstack/react-query";
import { obtenerTenants } from "./api";
import { PaginaDetalleTenant } from "./pagina-detalle-tenant";
import { seleccionarConfiguracionPrincipal } from "./utiles-configuracion";

export function PaginaConfiguracion() {
  const configuraciones = useQuery({
    queryKey: ["admin-tenants"],
    queryFn: obtenerTenants,
  });

  if (configuraciones.isLoading) {
    return <EstadoCarga mensaje="Cargando configuración..." />;
  }

  if (configuraciones.isError) {
    return (
      <EstadoError
        mensaje="No pudimos cargar la configuración de la plataforma."
        onReintentar={() => configuraciones.refetch()}
      />
    );
  }

  const configuracion = seleccionarConfiguracionPrincipal(
    configuraciones.data ?? [],
  );

  if (!configuracion) {
    return (
      <PageLayout>
        <div className="rounded-lg border border-danger-200 bg-surface p-6 text-center">
          <h1 className="font-display text-xl font-semibold text-ink-900">
            No encontramos la configuración inicial
          </h1>
          <p className="mt-2 text-sm text-ink-500">
            Revisa el proceso de instalación de la plataforma antes de
            continuar.
          </p>
        </div>
      </PageLayout>
    );
  }

  return <PaginaDetalleTenant tenantId={configuracion.id} modoConfiguracion />;
}
