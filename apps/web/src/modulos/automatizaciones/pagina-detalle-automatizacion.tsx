import { ErrorClienteApi } from "@/compartido/api/cliente";
import { EstadoAccesoRecursoQlik } from "@/compartido/componentes/feedback/estado-acceso-recurso-qlik";
import { EstadoError } from "@/compartido/componentes/feedback/estado-error";
import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import { EstadoCarga } from "@/compartido/componentes/ui/estado-carga";
import { Icon } from "@/compartido/componentes/ui/icon";
import { estaEnCurso } from "@/compartido/utiles/estados-ejecucion";
import { obtenerSesion } from "@/modulos/autenticacion/publico";
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
import { ListaEjecuciones } from "@/modulos/automatizaciones/componentes/lista-ejecuciones";
import { ModalClonarAutomatizacion } from "@/modulos/automatizaciones/componentes/modal-clonar-automatizacion";
import { TarjetaDetalleAutomatizacion } from "@/modulos/automatizaciones/componentes/tarjeta-detalle-automatizacion";
import { VisorWorkspace } from "@/modulos/automatizaciones/componentes/visor-workspace";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

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
      mostrarExito("Ejecución iniciada");
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

  const { data: workspace, isLoading: cargandoWorkspace } =
    useQuery<WorkspaceAutomatizacion>({
      queryKey: ["workspace", id],
      queryFn: () => obtenerWorkspaceAutomatizacion(id),
      retry: false,
    });

  const mutationClonar = useMutation({
    mutationFn: (nombre: string) => clonarAutomatizacion(id, { nombre }),
    onSuccess: (resultado) => {
      mostrarExito(`Automatización "${resultado.nombre}" clonada`);
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
    return <EstadoCarga mensaje="Cargando automatización…" />;
  }

  if (
    errorDetalle &&
    errorDetalleMsg instanceof ErrorClienteApi &&
    errorDetalleMsg.codigo === "ESPACIO_NO_AUTORIZADO"
  ) {
    return <EstadoAccesoRecursoQlik />;
  }

  if (errorDetalle) {
    return (
      <EstadoError
        mensaje={
          errorDetalleMsg?.message ??
          "Error al cargar el detalle de la automatización"
        }
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
  const ultimaEjecucion = [...(ejecuciones ?? [])].sort(
    (a, b) =>
      new Date(b.iniciadoEn ?? 0).getTime() -
      new Date(a.iniciadoEn ?? 0).getTime(),
  )[0];
  const hostQlik = sesion?.tenantHost?.trim();
  const urlQlik = hostQlik
    ? new URL(`/automations/${id}`, `https://${hostQlik}`).toString()
    : null;

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <header className="border-b border-line-200 pb-5">
        <Link
          to="/automatizaciones"
          className="inline-flex items-center gap-2 text-sm font-medium text-ink-500 transition-colors hover:text-ink-900"
        >
          <Icon name="chev" size="sm" className="rotate-180" />
          Volver a automatizaciones
        </Link>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-brand-700">
          <Icon name="zap" size="sm" />
          Automatización de Qlik Automate
        </div>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink-900 sm:text-[28px]">
          {auto.nombre}
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-500">
          Orquestación configurada para el espacio{" "}
          <span className="font-medium text-ink-700">
            {auto.espacioNombre || "Personal"}
          </span>
        </p>
      </header>

      <TarjetaDetalleAutomatizacion
        automatizacion={auto}
        ejecutandoActiva={ejecutandoActiva}
        ultimaEjecucion={ultimaEjecucion}
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
