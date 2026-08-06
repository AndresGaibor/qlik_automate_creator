import { useVistaUsuarioFinal } from "@/app/contexto-vista";
import { EstadoError } from "@/compartido/componentes/feedback/estado-error";
import { EstadoSinEspaciosQlik } from "@/compartido/componentes/feedback/estado-sin-espacios-qlik";
import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import { Button } from "@/compartido/componentes/ui/button";
import { EstadoCarga } from "@/compartido/componentes/ui/estado-carga";
import { ModalSeleccionarTenantQlik } from "@/compartido/componentes/ui/modal-seleccionar-tenant-qlik";
import { PageHeader } from "@/compartido/componentes/ui/page-header";
import { PageLayout } from "@/compartido/componentes/ui/page-layout";
import { useBusqueda } from "@/compartido/hooks/use-busqueda";
import { useFiltroEspacioConPersistencia } from "@/compartido/hooks/use-filtro-espacio-con-persistencia";
import { useManejoError } from "@/compartido/hooks/use-manejo-error";
import { usePaginacion } from "@/compartido/hooks/use-paginacion";
import { useTenantActivo } from "@/compartido/hooks/use-tenant-activo";
import { construirUrlCrearFlujoQlik } from "@/compartido/utiles/qlik-urls";
import {
  type ResumenAutomatizacion,
  obtenerAutomatizaciones,
  obtenerConfiguracionTenant,
} from "@/modulos/automatizaciones/publico";
import {
  type ResumenFlujo,
  obtenerEspacios,
  obtenerFlujosConFiltros,
} from "@/modulos/flujos/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { BarraFiltrosFlujos } from "./componentes/barra-filtros-flujos";
import { ListaFlujos } from "./componentes/lista-flujos";

export function PaginaFlujos() {
  const { mostrarError } = useNotificaciones();
  const { tenant: tenantActivo, tenants } = useTenantActivo();
  const { estado } = useVistaUsuarioFinal();
  const configuracion = useQuery({
    queryKey: ["configuracion-tenant", tenantActivo?.id],
    queryFn: obtenerConfiguracionTenant,
    retry: false,
  });
  const vistaRestringida =
    configuracion.data?.accesoEspacios?.restringido ?? estado.modoUsuarioFinal;
  const accesoCerrado = configuracion.data?.accesoEspacios?.cerrado ?? false;
  const { espacioId, establecerEspacioId } = useFiltroEspacioConPersistencia(
    tenantActivo?.id,
    { habilitado: !vistaRestringida },
  );
  const espacioFiltrado = espacioId.trim() || undefined;
  const [modalTenantsAbierto, setModalTenantsAbierto] = useState(false);
  const { busquedaTemp, setBusquedaTemp, busquedaActiva, buscar, limpiar } =
    useBusqueda();

  const {
    data: flujos,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<ResumenFlujo[]>({
    queryKey: ["flujos", tenantActivo?.id, espacioFiltrado, busquedaActiva],
    queryFn: () => obtenerFlujosConFiltros(espacioFiltrado, busquedaActiva),
    retry: false,
    enabled: configuracion.isSuccess && !accesoCerrado,
  });

  const { data: automatizaciones = [] } = useQuery<ResumenAutomatizacion[]>({
    queryKey: ["automatizaciones", tenantActivo?.id],
    queryFn: obtenerAutomatizaciones,
    retry: false,
    enabled: configuracion.isSuccess && !accesoCerrado,
  });

  const espacios = useQuery({
    queryKey: ["flujos", "espacios", tenantActivo?.id],
    queryFn: obtenerEspacios,
    retry: false,
    enabled: configuracion.isSuccess && !vistaRestringida && !accesoCerrado,
  });

  const { manejar } = useManejoError(mostrarError);

  const handleRefetch = () => refetch();

  useEffect(() => {
    if (isError) {
      manejar(error);
    }
  }, [isError, error, manejar]);

  const {
    paginaActual,
    totalPaginas,
    elementosPagina: flujosPaginados,
    irPagina,
  } = usePaginacion(flujos ?? []);

  if (configuracion.isLoading || isLoading) {
    return <EstadoCarga mensaje="Cargando flujos de datos..." />;
  }

  if (isError) {
    return <EstadoError mensaje={error.message} onReintentar={handleRefetch} />;
  }

  if (accesoCerrado) {
    return (
      <PageLayout>
        <PageHeader
          title="Dataflows de Qlik"
          description="Consulta los Dataflows autorizados para tu organización."
        />
        <EstadoSinEspaciosQlik />
      </PageLayout>
    );
  }
  const targetHost = tenantActivo?.host;
  const targetUrlCrear = targetHost
    ? construirUrlCrearFlujoQlik(targetHost, espacioId)
    : "#";

  return (
    <PageLayout>
      <PageHeader
        title="Dataflows de Qlik"
        description="Revisa los Dataflows que ya conectaste desde Qlik Cloud, mira cómo se transforman tus datos, y crea una automatización en un par de clics."
        actions={
          vistaRestringida ? null : tenants.length > 1 ? (
            <Button onClick={() => setModalTenantsAbierto(true)}>
              Crear flujo en Qlik Cloud
            </Button>
          ) : targetHost ? (
            <Button asChild>
              <a
                href={targetUrlCrear}
                target="_blank"
                rel="noopener noreferrer"
              >
                Crear flujo en Qlik Cloud
              </a>
            </Button>
          ) : null
        }
      />

      <BarraFiltrosFlujos
        busquedaTemp={busquedaTemp}
        setBusquedaTemp={setBusquedaTemp}
        buscar={buscar}
        limpiar={limpiar}
        espacios={espacios.data ?? []}
        errorEspacios={espacios.isError}
        espacioFiltrado={espacioFiltrado}
        onEspacioChange={establecerEspacioId}
        mostrarFiltroEspacio={!vistaRestringida}
      />

      <ListaFlujos
        flujos={flujosPaginados}
        automatizaciones={automatizaciones}
        targetHost={targetHost}
        espacioId={espacioId}
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        onPageChange={irPagina}
        total={flujos?.length ?? 0}
        hayFiltros={Boolean(espacioFiltrado || busquedaActiva)}
      />

      <ModalSeleccionarTenantQlik
        abierto={modalTenantsAbierto}
        onCerrar={() => setModalTenantsAbierto(false)}
        tenants={tenants}
        tenantActivoId={tenantActivo?.id}
        espacioId={espacioId}
      />
    </PageLayout>
  );
}
