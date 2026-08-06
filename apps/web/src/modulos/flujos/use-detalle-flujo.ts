import { ErrorClienteApi } from "@/compartido/api/cliente";
import { useTenantActivo } from "@/compartido/hooks/use-tenant-activo";
import { construirUrlVerFlujoQlik } from "@/compartido/utiles/qlik-urls";
import {
  type ResumenAutomatizacion,
  obtenerAutomatizaciones,
} from "@/modulos/automatizaciones/publico";
import { useQuery } from "@tanstack/react-query";
import {
  type ResumenFlujo,
  obtenerCatalogoSparkFlujo,
  obtenerFlujosConFiltros,
  obtenerScriptFlujo,
} from "./api";
import {
  buscarAutomatizacionVinculada,
  construirMetadataDataflow,
} from "./modelo-detalle-flujo";

export function useDetalleFlujo(id: string) {
  const { tenant: tenantActivo } = useTenantActivo();
  const flujos = useQuery<ResumenFlujo[]>({
    queryKey: ["flujos"],
    queryFn: () => obtenerFlujosConFiltros(),
    staleTime: 60 * 1000,
  });
  const script = useQuery({
    queryKey: ["flujo-script", id],
    queryFn: () => obtenerScriptFlujo(id),
    staleTime: 60 * 1000,
  });
  const spark = useQuery({
    queryKey: ["flujo-catalogo-spark", id],
    queryFn: () => obtenerCatalogoSparkFlujo(id),
    staleTime: 60 * 1000,
  });
  const automatizaciones = useQuery<ResumenAutomatizacion[]>({
    queryKey: ["automatizaciones"],
    queryFn: () => obtenerAutomatizaciones(),
    staleTime: 60 * 1000,
  });

  const flujo = flujos.data?.find((item) => item.id === id);
  const automatizacionVinculada = buscarAutomatizacionVinculada(
    automatizaciones.data ?? [],
    flujo,
  );
  const accesoDenegado = [script.error, spark.error].some(
    (error) =>
      error instanceof ErrorClienteApi &&
      error.codigo === "ESPACIO_NO_AUTORIZADO",
  );
  const urlQlikCloud =
    tenantActivo?.host && flujo
      ? construirUrlVerFlujoQlik(
          tenantActivo.host,
          flujo.id,
          flujo.espacioId || "",
        )
      : null;

  return {
    flujo,
    automatizacionVinculada,
    metadata: flujo ? construirMetadataDataflow(flujo) : null,
    urlQlikCloud,
    accesoDenegado,
    cargandoFlujos: flujos.isLoading,
    errorFlujos: flujos.isError,
    datosScript: script.data,
    cargandoScript: script.isLoading,
    errorScript: script.isError,
    datosSpark: spark.data,
    cargandoSpark: spark.isLoading,
  };
}
