import { EstadoError } from "@/compartido/componentes/feedback/estado-error";
import { estaEnCurso } from "@/compartido/utiles/estados-ejecucion";
import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import { obtenerSesion } from "@/modulos/autenticacion/api";
import {
  type DetalleAutomatizacion,
  type EjecucionResumen,
  detenerEjecucion,
  ejecutarAutomatizacion,
  obtenerDetalleAutomatizacion,
} from "@/modulos/automatizaciones/api";
import { TarjetaDetalleAutomatizacion } from "@/modulos/automatizaciones/componentes/tarjeta-detalle-automatizacion";
import { ListaEjecuciones } from "@/modulos/automatizaciones/componentes/lista-ejecuciones";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Props {
  id: string;
}

export function PaginaDetalleAutomatizacion({ id }: Props) {
  const { mostrarError } = useNotificaciones();
  const queryClient = useQueryClient();

  const { data: sesion } = useQuery({
    queryKey: ["sesion"],
    queryFn: obtenerSesion,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: detalle,
    isLoading: cargandoDetalle,
    isError: errorDetalle,
    error: errorDetalleMsg,
  } = useQuery<DetalleAutomatizacion>({
    queryKey: ["automatizacion", id],
    queryFn: () => obtenerDetalleAutomatizacion(id),
    retry: false,
    refetchInterval: (consulta) => {
      const detalleActual = consulta.state.data as DetalleAutomatizacion | undefined;
      const automatizacionActual = detalleActual?.automatizacion;
      const ejecucionActiva =
        automatizacionActual?.ejecucionActiva ||
        detalleActual?.ejecuciones.some((ejecucion) => estaEnCurso(ejecucion.estado)) ||
        false;
      return ejecucionActiva ? 3000 : false;
    },
    refetchIntervalInBackground: true,
  });

  const auto = detalle?.automatizacion;
  const ejecuciones = detalle?.ejecuciones;

  const mutationEjecutar = useMutation({
    mutationFn: () => ejecutarAutomatizacion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automatizacion", id] });
    },
    onError: (err: Error) => {
      mostrarError(err.message);
    },
  });

  const mutationDetener = useMutation({
    mutationFn: (runId: string) => detenerEjecucion(id, runId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automatizacion", id] });
    },
    onError: (err: Error) => {
      mostrarError(err.message);
    },
  });

  if (cargandoDetalle) return <div>Cargando automatización...</div>;

  if (errorDetalle) {
    return (
      <EstadoError
        mensaje={errorDetalleMsg?.message ?? "Error al cargar"}
        onReintentar={() =>
          queryClient.invalidateQueries({ queryKey: ["automatizacion", id] })
        }
      />
    );
  }

  if (!auto) return null;

  const ejecutandoActiva = ejecuciones?.find((e: EjecucionResumen) => estaEnCurso(e.estado));
  const hostQlik = sesion?.tenantHost?.trim();
  const urlQlik = hostQlik
    ? new URL(`/automations/${id}`, `https://${hostQlik}`).toString()
    : null;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{auto.nombre}</h2>
      </div>

      <TarjetaDetalleAutomatizacion
        automatizacion={auto}
        ejecutandoActiva={ejecutandoActiva}
        urlQlik={urlQlik}
        onEjecutar={() => mutationEjecutar.mutate()}
        onDetener={(runId) => mutationDetener.mutate(runId)}
        mutationEjecutar={mutationEjecutar}
        mutationDetener={mutationDetener}
      />

      <ListaEjecuciones ejecuciones={ejecuciones ?? []} />
    </div>
  );
}
