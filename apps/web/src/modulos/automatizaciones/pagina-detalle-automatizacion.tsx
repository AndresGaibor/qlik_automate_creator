import { EstadoError } from "@/compartido/componentes/feedback/estado-error";
import { estaEnCurso } from "@/compartido/utiles/estados-ejecucion";
import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import { PageHeader } from "@/compartido/componentes/ui/page-header";
import { Icon } from "@/compartido/componentes/ui/icon";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { obtenerSesion } from "@/modulos/autenticacion/api";
import {
  type DetalleAutomatizacion,
  type EjecucionResumen,
  type WorkspaceAutomatizacion,
  clonarAutomatizacion,
  detenerEjecucion,
  ejecutarAutomatizacion,
  obtenerDetalleAutomatizacion,
  obtenerWorkspaceAutomatizacion,
} from "@/modulos/automatizaciones/api";
import { TarjetaDetalleAutomatizacion } from "@/modulos/automatizaciones/componentes/tarjeta-detalle-automatizacion";
import { ListaEjecuciones } from "@/modulos/automatizaciones/componentes/lista-ejecuciones";
import { VisorWorkspace } from "@/modulos/automatizaciones/componentes/visor-workspace";
import { ModalClonarAutomatizacion } from "@/modulos/automatizaciones/componentes/modal-clonar-automatizacion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Props {
  id: string;
}

export function PaginaDetalleAutomatizacion({ id }: Props) {
  const { mostrarError, mostrarExito } = useNotificaciones();
  const queryClient = useQueryClient();
  const navegar = useNavigate();
  const [modalClonarAbierto, setModalClonarAbierto] = useState(false);

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
      mostrarExito("Ejecución iniciada correctamente");
      queryClient.invalidateQueries({ queryKey: ["automatizacion", id] });
    },
    onError: (err: Error) => {
      mostrarError(err.message);
    },
  });

  const mutationDetener = useMutation({
    mutationFn: (runId: string) => detenerEjecucion(id, runId),
    onSuccess: () => {
      mostrarExito("Ejecución detenida");
      queryClient.invalidateQueries({ queryKey: ["automatizacion", id] });
    },
    onError: (err: Error) => {
      mostrarError(err.message);
    },
  });

  const {
    data: workspace,
    isLoading: cargandoWorkspace,
  } = useQuery<WorkspaceAutomatizacion>({
    queryKey: ["workspace", id],
    queryFn: () => obtenerWorkspaceAutomatizacion(id),
    retry: false,
  });

  const mutationClonar = useMutation({
    mutationFn: (nombre: string) => clonarAutomatizacion(id, { nombre }),
    onSuccess: (resultado) => {
      mostrarExito(`Automatización "${resultado.nombre}" clonada correctamente`);
      setModalClonarAbierto(false);
      queryClient.invalidateQueries({ queryKey: ["automatizaciones"] });
      navegar({ to: `/automatizaciones/${resultado.id}` });
    },
    onError: (err: Error) => {
      mostrarError(err.message);
      setModalClonarAbierto(false);
    },
  });

  if (cargandoDetalle) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-ink-500 font-medium">Cargando automatización…</p>
      </div>
    );
  }

  if (errorDetalle) {
    return (
      <EstadoError
        mensaje={errorDetalleMsg?.message ?? "Error al cargar el detalle de la automatización"}
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
    <div className="space-y-6">
      {/* Botón Volver */}
      <div>
        <Link
          to="/automatizaciones"
          className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 transition-colors font-medium"
        >
          <Icon name="chev" size="sm" className="rotate-180" />
          Volver a automatizaciones
        </Link>
      </div>

      {/* Encabezado con PageHeader */}
      <PageHeader
        title={auto.nombre}
        description={`Orquestación configurada para el espacio ${auto.espacioNombre || "Personal"}`}
      />

      <TarjetaDetalleAutomatizacion
        automatizacion={auto}
        ejecutandoActiva={ejecutandoActiva}
        urlQlik={urlQlik}
        onEjecutar={() => mutationEjecutar.mutate()}
        onDetener={(runId) => mutationDetener.mutate(runId)}
        mutationEjecutar={mutationEjecutar}
        mutationDetener={mutationDetener}
        onClonar={() => setModalClonarAbierto(true)}
      />

      {workspace && <VisorWorkspace workspace={workspace} />}

      <ListaEjecuciones ejecuciones={ejecuciones ?? []} />

      <ModalClonarAutomatizacion
        open={modalClonarAbierto}
        nombreOriginal={auto.nombre}
        cargando={mutationClonar.isPending}
        onConfirmar={(nombre) => mutationClonar.mutate(nombre)}
        onCancelar={() => setModalClonarAbierto(false)}
      />
    </div>
  );
}
