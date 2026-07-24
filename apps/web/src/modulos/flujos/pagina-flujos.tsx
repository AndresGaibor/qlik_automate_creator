import { EstadoCarga } from "@/compartido/componentes/ui/estado-carga";
import { EstadoError } from "@/compartido/componentes/feedback/estado-error";
import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import { Button } from "@/compartido/componentes/ui/button";
import { ModalSeleccionarTenantQlik } from "@/compartido/componentes/ui/modal-seleccionar-tenant-qlik";
import { PageHeader } from "@/compartido/componentes/ui/page-header";
import { PageLayout } from "@/compartido/componentes/ui/page-layout";
import { useBusqueda } from "@/compartido/hooks/use-busqueda";
import { useFiltroEspacioConPersistencia } from "@/compartido/hooks/use-filtro-espacio-con-persistencia";
import { useManejoError } from "@/compartido/hooks/use-manejo-error";
import { usePaginacion } from "@/compartido/hooks/use-paginacion";
import { useTenantActivo } from "@/compartido/hooks/use-tenant-activo";
import { construirUrlCrearFlujoQlik } from "@/compartido/utiles/qlik-urls";
import { obtenerEspacios, obtenerFlujosConFiltros, type ResumenFlujo } from "@/modulos/flujos/api";
import { BarraFiltrosFlujos } from "./componentes/barra-filtros-flujos";
import { ListaFlujos } from "./componentes/lista-flujos";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function PaginaFlujos() {
  const { mostrarError } = useNotificaciones();
  const { espacioId, establecerEspacioId } = useFiltroEspacioConPersistencia();
  const espacioFiltrado = espacioId.trim() || undefined;
  const [modalTenantsAbierto, setModalTenantsAbierto] = useState(false);

  const { tenant: tenantActivo, tenants } = useTenantActivo();
  const { busquedaTemp, setBusquedaTemp, busquedaActiva, buscar, limpiar } = useBusqueda();

  const {
    data: flujos,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<ResumenFlujo[]>({
    queryKey: ["flujos", espacioFiltrado, busquedaActiva],
    queryFn: () => obtenerFlujosConFiltros(espacioFiltrado, busquedaActiva),
    retry: false,
  });

  const espacios = useQuery({
    queryKey: ["automatizaciones", "espacios"],
    queryFn: obtenerEspacios,
    retry: false,
  });

  const { manejar } = useManejoError(mostrarError);

  const handleRefetch = () => refetch();

  useEffect(() => {
    if (isError) {
      manejar(error);
    }
  }, [isError, error, manejar]);

  const { paginaActual, totalPaginas, elementosPagina: flujosPaginados, irPagina, reset } = usePaginacion(flujos ?? []);

  useEffect(() => {
    reset();
  }, [reset, espacioId, busquedaActiva]);

  if (isLoading) {
    return <EstadoCarga mensaje="Cargando flujos de datos..." />;
  }

  if (isError) {
    return <EstadoError mensaje={error.message} onReintentar={handleRefetch} />;
  }

  const targetHost = tenantActivo?.host;
  const targetUrlCrear = targetHost ? construirUrlCrearFlujoQlik(targetHost, espacioId) : "#";

  return (
    <PageLayout>
      <PageHeader
        title="Flujos de Datos (Dataflows)"
        description="Explora, busca y selecciona los Dataflows de Qlik Cloud para vincularlos a tus automatizaciones."
        actions={
          tenants.length > 1 ? (
            <Button
              onClick={() => setModalTenantsAbierto(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              + Crear flujo en Qlik Cloud ↗
            </Button>
          ) : targetHost ? (
            <Button
              asChild
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              <a href={targetUrlCrear} target="_blank" rel="noopener noreferrer">
                + Crear flujo en Qlik Cloud ↗
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
        espacioFiltrado={espacioFiltrado}
        onEspacioChange={establecerEspacioId}
        onCrear={() => {}}
        puedeCrear={!!targetHost}
      />

      <ListaFlujos
        flujos={flujosPaginados}
        onVer={() => {}}
        targetHost={targetHost}
        espacioId={espacioId}
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        onPageChange={irPagina}
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
