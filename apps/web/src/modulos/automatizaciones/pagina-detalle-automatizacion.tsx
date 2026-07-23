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
  type Automatizacion,
  type Ejecucion,
  detenerEjecucion,
  ejecutarAutomatizacion,
  obtenerDetalleAutomatizacion,
  obtenerEjecuciones,
} from "@/modulos/automatizaciones/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Props {
  id: string;
}

function estaEnEjecucion(auto: {
  ejecucionActiva?: boolean;
  state?: string;
}): boolean {
  if (auto.ejecucionActiva) return true;
  if (auto.state?.trim()) {
    const lower = auto.state.toLowerCase();
    if (lower === "running" || lower === "en ejecución") return true;
  }
  return false;
}

function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleString();
}

export function PaginaDetalleAutomatizacion({ id }: Props) {
  const { mostrarError } = useNotificaciones();
  const queryClient = useQueryClient();

  const {
    data: auto,
    isLoading: cargandoAuto,
    isError: errorAuto,
    error: errorAutoDetalle,
  } = useQuery<Automatizacion>({
    queryKey: ["automatizacion", id],
    queryFn: () => obtenerDetalleAutomatizacion(id),
    retry: false,
  });

  const {
    data: ejecuciones,
    isLoading: cargandoEjecuciones,
  } = useQuery<Ejecucion[]>({
    queryKey: ["ejecuciones", id],
    queryFn: () => obtenerEjecuciones(id),
    retry: false,
  });

  const mutationEjecutar = useMutation({
    mutationFn: () => ejecutarAutomatizacion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automatizacion", id] });
      queryClient.invalidateQueries({ queryKey: ["ejecuciones", id] });
    },
    onError: (err: Error) => {
      mostrarError(err.message);
    },
  });

  const mutationDetener = useMutation({
    mutationFn: (runId: string) => detenerEjecucion(id, runId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automatizacion", id] });
      queryClient.invalidateQueries({ queryKey: ["ejecuciones", id] });
    },
    onError: (err: Error) => {
      mostrarError(err.message);
    },
  });

  if (cargandoAuto) return <div>Cargando automatización...</div>;

  if (errorAuto) {
    return (
      <EstadoError
        mensaje={errorAutoDetalle?.message ?? "Error al cargar"}
        onReintentar={() =>
          queryClient.invalidateQueries({ queryKey: ["automatizacion", id] })
        }
      />
    );
  }

  if (!auto) return null;

  const ejecutando = estaEnEjecucion(auto);
  const ejecucionActiva = ejecuciones?.find((e) => e.status === "running");

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
              <dd>{auto.state ?? (auto.isEnabled ? "Activa" : "Inactiva")}</dd>
            </div>
            {auto.spaceId && (
              <div>
                <dt className="font-medium text-gray-900">Espacio</dt>
                <dd>{auto.spaceId}</dd>
              </div>
            )}
            {auto.owner && (
              <div>
                <dt className="font-medium text-gray-900">Propietario</dt>
                <dd>{auto.owner.name}</dd>
              </div>
            )}
            {auto.triggerType && (
              <div>
                <dt className="font-medium text-gray-900">Disparador</dt>
                <dd>{auto.triggerType}</dd>
              </div>
            )}
            <div>
              <dt className="font-medium text-gray-900">Creado</dt>
              <dd>{formatearFecha(auto.createdDate)}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Modificado</dt>
              <dd>{formatearFecha(auto.modifiedDate)}</dd>
            </div>
          </dl>
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              data-accion="ejecutar"
              disabled={ejecutando}
              onClick={() => mutationEjecutar.mutate()}
            >
              {ejecutando ? "En ejecución" : "Ejecutar"}
            </Button>
            {ejecutando && ejecucionActiva && (
              <Button
                variant="outline"
                data-accion="detener"
                onClick={() => mutationDetener.mutate(ejecucionActiva.id)}
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
          {cargandoEjecuciones ? (
            <p className="text-sm text-gray-500">Cargando ejecuciones...</p>
          ) : !ejecuciones || ejecuciones.length === 0 ? (
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
                {ejecuciones.map((ejecucion) => (
                  <tr key={ejecucion.id} className="border-b last:border-0">
                    <td className="py-2">{ejecucion.id}</td>
                    <td className="py-2">{ejecucion.status}</td>
                    <td className="py-2">
                      {formatearFecha(ejecucion.startTime)}
                    </td>
                    <td className="py-2">
                      {ejecucion.endTime
                        ? formatearFecha(ejecucion.endTime)
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
