import { EstadoError } from "@/compartido/componentes/feedback/estado-error";
import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import { Button } from "@/compartido/componentes/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/compartido/componentes/ui/card";
import { obtenerSesion } from "@/modulos/autenticacion/api";
import {
  type DetalleAutomatizacion,
  type EjecucionResumen,
  detenerEjecucion,
  ejecutarAutomatizacion,
  obtenerDetalleAutomatizacion,
} from "@/modulos/automatizaciones/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Props {
  id: string;
}

function formatearFechaSeguro(iso: string | undefined | null): string {
  if (!iso) return "—";
  try {
    const fecha = new Date(iso);
    if (Number.isNaN(fecha.getTime())) return "—";
    return fecha.toLocaleString();
  } catch {
    return "—";
  }
}

function estaEnCurso(estado: string): boolean {
  return ["running", "starting", "queued", "must stop"].includes(estado);
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
      const detalleActual = consulta.state.data as
        | DetalleAutomatizacion
        | undefined;
      const automatizacionActual = detalleActual?.automatizacion;
      const ejecucionActiva =
        automatizacionActual?.ejecucionActiva ||
        detalleActual?.ejecuciones.some((ejecucion) =>
          estaEnCurso(ejecucion.estado),
        ) ||
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

  const ejecutandoActiva = ejecuciones?.find((e: EjecucionResumen) =>
    estaEnCurso(e.estado),
  );
  const hostQlik = sesion?.tenantHost?.trim();
  const urlQlik = hostQlik
    ? new URL(`/automations/${id}`, `https://${hostQlik}`).toString()
    : null;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{auto.nombre}</h2>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>Detalles</CardTitle>
            {auto.ejecucionActiva ? (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                Actualización automática activa
              </span>
            ) : null}
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-2 text-sm text-gray-600 sm:grid-cols-2">
            <div>
              <dt className="font-medium text-gray-900">Estado</dt>
              <dd>
                {auto.ejecucionActiva
                  ? "En ejecución"
                  : auto.activa
                    ? "Activa"
                    : "Inactiva"}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Espacio</dt>
              <dd>{auto.espacioNombre}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Propietario</dt>
              <dd>{auto.propietarioNombre}</dd>
            </div>
            {auto.modoEjecucion && (
              <div>
                <dt className="font-medium text-gray-900">Disparador</dt>
                <dd>{auto.modoEjecucion}</dd>
              </div>
            )}
            <div>
              <dt className="font-medium text-gray-900">Creado</dt>
              <dd>{formatearFechaSeguro(auto.creadoEn)}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Modificado</dt>
              <dd>{formatearFechaSeguro(auto.modificadoEn)}</dd>
            </div>
          </dl>
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              data-accion="ejecutar"
              disabled={!auto.puedeEjecutar}
              onClick={() => mutationEjecutar.mutate()}
            >
              {auto.ejecucionActiva ? "En ejecución" : "Ejecutar"}
            </Button>
            {auto.ejecucionActiva && ejecutandoActiva && (
              <Button
                variant="outline"
                data-accion="detener"
                onClick={() => mutationDetener.mutate(ejecutandoActiva.id)}
              >
                Detener
              </Button>
            )}
            {urlQlik ? (
              <Button variant="outline" asChild>
                <a href={urlQlik} target="_blank" rel="noopener noreferrer">
                  Abrir en Qlik Cloud
                </a>
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ejecuciones recientes</CardTitle>
        </CardHeader>
        <CardContent>
          {!ejecuciones || ejecuciones.length === 0 ? (
            <p className="text-sm text-gray-500">
              No hay ejecuciones recientes
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-2 font-medium">ID</th>
                  <th className="pb-2 font-medium">Estado</th>
                  <th className="pb-2 font-medium">Inicio</th>
                  <th className="pb-2 font-medium">Fin</th>
                </tr>
              </thead>
              <tbody>
                {ejecuciones.map((ejecucion: EjecucionResumen) => (
                  <tr key={ejecucion.id} className="border-b last:border-0">
                    <td className="py-2">{ejecucion.id}</td>
                    <td className="py-2">{ejecucion.estado}</td>
                    <td className="py-2">
                      {formatearFechaSeguro(ejecucion.iniciadoEn)}
                    </td>
                    <td className="py-2">
                      {ejecucion.finalizadoEn
                        ? formatearFechaSeguro(ejecucion.finalizadoEn)
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
