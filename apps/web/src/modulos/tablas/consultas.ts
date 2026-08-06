import { obtenerSesion } from "@/modulos/autenticacion/publico";
import { obtenerAutomatizaciones } from "@/modulos/automatizaciones/publico";
import { useQuery } from "@tanstack/react-query";
import {
  type RecursoDestino,
  obtenerConexionesDestino,
  obtenerDetalleRecursoDestino,
  obtenerDetalleTablaImpala,
  obtenerRecursosDestino,
  obtenerTablasImpala,
} from "./api";
import {
  adaptarDetalleTablaImpala,
  adaptarTablaImpala,
} from "./modelo-presentacion";

export interface SeleccionCatalogoDestinos {
  conexionId: string | null;
  recursoId: string | null;
}

export function useCatalogoDestinos(seleccion: SeleccionCatalogoDestinos) {
  const sesion = useQuery({
    queryKey: ["sesion"],
    queryFn: obtenerSesion,
    retry: false,
  });
  const conexiones = useQuery({
    queryKey: ["destinos-conexiones"],
    queryFn: obtenerConexionesDestino,
    retry: false,
  });
  const conexionActiva =
    conexiones.data?.find((item) => item.id === seleccion.conexionId) ??
    conexiones.data?.[0];

  const recursosGenericos = useQuery({
    queryKey: ["destinos-recursos", conexionActiva?.id],
    queryFn: () => obtenerRecursosDestino(conexionActiva?.id ?? ""),
    enabled: Boolean(conexionActiva),
    retry: false,
  });
  const tablasHeredadas = useQuery({
    queryKey: ["impala-tablas"],
    queryFn: obtenerTablasImpala,
    enabled: conexiones.isSuccess && !conexionActiva,
    retry: false,
  });
  const automatizaciones = useQuery({
    queryKey: ["automatizaciones"],
    queryFn: obtenerAutomatizaciones,
    retry: false,
  });

  const recursos: RecursoDestino[] = conexionActiva
    ? (recursosGenericos.data ?? [])
    : (tablasHeredadas.data ?? []).map(adaptarTablaImpala);

  const detalle = useQuery({
    queryKey: [
      "destino-recurso-detalle",
      conexionActiva?.id ?? "impala-heredado",
      seleccion.recursoId,
    ],
    queryFn: async () => {
      if (!seleccion.recursoId) throw new Error("Selecciona un reporte");
      if (conexionActiva) {
        return obtenerDetalleRecursoDestino(
          conexionActiva.id,
          seleccion.recursoId,
        );
      }
      return adaptarDetalleTablaImpala(
        await obtenerDetalleTablaImpala(seleccion.recursoId),
      );
    },
    enabled: Boolean(seleccion.recursoId),
    retry: false,
  });

  const cargando =
    sesionesPendientes(sesion.isLoading, conexiones.isLoading) ||
    (conexionActiva ? recursosGenericos.isLoading : tablasHeredadas.isLoading);
  const errorCatalogo =
    conexiones.error ??
    recursosGenericos.error ??
    tablasHeredadas.error ??
    null;

  return {
    sesion: sesion.data,
    conexiones: conexiones.data ?? [],
    conexionActiva,
    recursos,
    automatizaciones: automatizaciones.data ?? [],
    detalle: detalle.data,
    cargando,
    cargandoDetalle: detalle.isLoading,
    errorCatalogo,
    recargarCatalogo: async () => {
      await Promise.all([
        conexiones.refetch(),
        recursosGenericos.refetch(),
        tablasHeredadas.refetch(),
      ]);
    },
  };
}

function sesionesPendientes(...estados: boolean[]): boolean {
  return estados.some(Boolean);
}
