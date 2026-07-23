import { EstadoError } from "@/componentes/feedback/estado-error";
import { useNotificaciones } from "@/componentes/feedback/notificaciones";
import { Button } from "@/componentes/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/componentes/ui/card";
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

export function PaginaDetalleAutomatizacion({ id }: Props) {
  const { mostrarError } = useNotificaciones();
  const queryClient = useQueryClient();

  const {
    data: detalle,
    isLoading: cargandoDetalle,
    isError: errorDetalle,
    error: errorDetalleMsg,
  } = useQuery<DetalleAutomatizacion>({
    queryKey: ["automatizacion", id],
    queryFn: () => obtenerDetalleAutomatizacion(id),
    retry: false,
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

  const ejecutandoActiva = ejecuciones?.find(
    (e: EjecucionResumen) => e.status === "running",
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{auto.name}</h2>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Detalles</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-2 text-sm text-gray-600 sm:grid-cols-2">
            <div>
              <dt className="font-medium text-gray-900">Estado</dt>
              <dd>
                {auto.ejecucionActiva
                  ? "En ejecución"
                  : auto.isEnabled
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
              <dd>{auto.ownerNombre}</dd>
            </div>
            {auto.triggerType && (
              <div>
                <dt className="font-medium text-gray-900">Disparador</dt>
                <dd>{auto.triggerType}</dd>
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
                    <td className="py-2">{ejecucion.status}</td>
                    <td className="py-2">
                      {formatearFechaSeguro(ejecucion.startTime)}
                    </td>
                    <td className="py-2">
                      {ejecucion.endTime
                        ? formatearFechaSeguro(ejecucion.endTime)
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
