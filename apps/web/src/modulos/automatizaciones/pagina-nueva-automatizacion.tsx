import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import { useFiltroEspacioConPersistencia } from "@/compartido/hooks/use-filtro-espacio-con-persistencia";
import {
  type ConexionDestino,
  type ConfiguracionTenant,
  type PreflightAutomatizacion,
  type RecursoDestino,
  type ResultadoCrearDesdePlantilla,
  type ResumenAutomatizacion,
  crearAutomatizacionDesdePlantilla,
  obtenerAutomatizaciones,
  obtenerConexionesDestino,
  obtenerConfiguracionTenant,
  obtenerFlujosConFiltros,
  obtenerPreflightAutomatizacion,
  obtenerRecursosDestino,
  probarConexionOrigen,
} from "@/modulos/automatizaciones/api";
import { AlertaConfiguracionTenant } from "@/modulos/automatizaciones/componentes/alerta-configuracion-tenant";
import { FormularioCrearAutomatizacion } from "@/modulos/automatizaciones/componentes/formulario-crear-automatizacion";
import { FormularioCrearAutomatizacionModo1 } from "@/modulos/automatizaciones/componentes/formulario-crear-automatizacion-modo-1";
import type { ResumenFlujo } from "@qlik/contratos";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export function PaginaNuevaAutomatizacion() {
  const navegar = useNavigate();
  const queryClient = useQueryClient();
  const { mostrarError, mostrarExito } = useNotificaciones();
  const { espacioId: espacioIdPersistente } = useFiltroEspacioConPersistencia();
  const parametrosUrl = new URLSearchParams(window.location.search);
  const espacioIdActual =
    parametrosUrl.get("espacioId") || espacioIdPersistente || undefined;
  const flujoIdParam = parametrosUrl.get("flujoId") || "";

  const [flujoId, setFlujoId] = useState(flujoIdParam);
  const [tablaId, setTablaId] = useState("");
  const [destinoId, setDestinoId] = useState<string | undefined>();
  const [nombre, setNombre] = useState("");
  const [confirmacionSecretos, setConfirmacionSecretos] = useState(false);

  const { data: configTenant, isLoading: cargandoConfig } =
    useQuery<ConfiguracionTenant>({
      queryKey: ["automatizaciones-config-tenant"],
      queryFn: obtenerConfiguracionTenant,
      retry: false,
    });
  const modoActivo = configTenant?.modoAutomatizacionActivo ?? 1;
  const configurada = configTenant?.configurada ?? false;

  const { data: automatizaciones = [] } = useQuery<ResumenAutomatizacion[]>({
    queryKey: ["automatizaciones"],
    queryFn: obtenerAutomatizaciones,
    retry: false,
  });
  const { data: flujos = [], isLoading: cargandoFlujos } = useQuery<
    ResumenFlujo[]
  >({
    queryKey: espacioIdActual ? ["flujos", espacioIdActual] : ["flujos"],
    queryFn: () => obtenerFlujosConFiltros(espacioIdActual),
    retry: false,
    enabled: configurada,
  });
  const { data: conexiones = [] } = useQuery<ConexionDestino[]>({
    queryKey: ["destinos-conexiones"],
    queryFn: obtenerConexionesDestino,
    retry: false,
    enabled: configurada,
  });

  const preflight = useQuery<PreflightAutomatizacion>({
    queryKey: ["automatizaciones-preflight", flujoId],
    queryFn: () => obtenerPreflightAutomatizacion(flujoId),
    retry: false,
    enabled: configurada && modoActivo === 1 && Boolean(flujoId),
  });

  const probarOrigen = useMutation({
    mutationFn: (conexionId: string) => probarConexionOrigen(conexionId),
    onError: (error: Error) => mostrarError(error.message),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["automatizaciones-preflight", flujoId],
      });
    },
  });

  const destinoModo2 = conexiones.find((destino) => destino.id === destinoId);
  const { data: recursosDestino = [], isLoading: cargandoRecursos } = useQuery<
    RecursoDestino[]
  >({
    queryKey: ["destinos-recursos", destinoModo2?.id],
    queryFn: () => obtenerRecursosDestino(destinoModo2?.id ?? ""),
    retry: false,
    enabled: configurada && modoActivo === 2 && Boolean(destinoModo2?.id),
  });

  useEffect(() => {
    if (destinoId && modoActivo === 2) setTablaId("");
  }, [destinoId, modoActivo]);

  useEffect(() => {
    if (!flujoId || nombre) return;
    const flujo = flujos.find((item) => item.id === flujoId);
    if (!flujo) return;
    if (modoActivo === 1) setNombre(`Automatización - ${flujo.nombre}`);
    else if (tablaId) setNombre(`${flujo.nombre} hacia ${tablaId}`);
  }, [flujoId, tablaId, flujos, nombre, modoActivo]);

  const crear = useMutation<ResultadoCrearDesdePlantilla>({
    mutationFn: async () => {
      const flujo = flujos.find((item) => item.id === flujoId);
      if (!flujo) throw new Error("Debes seleccionar un Dataflow válido");
      if (modoActivo === 1) {
        if (!destinoId)
          throw new Error("Selecciona una base destino PostgreSQL");
        if (!confirmacionSecretos) {
          throw new Error("Confirma el uso de SECRETOSJSON antes de continuar");
        }
        return crearAutomatizacionDesdePlantilla({
          nombre: nombre.trim() || `Automatización - ${flujo.nombre}`,
          flujoId,
          destinoId,
          espacioIdQlik: espacioIdActual,
        });
      }
      if (!destinoId || !tablaId) {
        throw new Error(
          "El modo 2 requiere seleccionar una conexión destino y una tabla.",
        );
      }
      return crearAutomatizacionDesdePlantilla({
        nombre: nombre.trim() || `Auto - ${flujo.nombre} a ${tablaId}`,
        espacioIdQlik: espacioIdActual,
        flujoId,
        tablaId,
        destinoId,
        reemplazosWorkspace: [],
      });
    },
    onSuccess: async (resultado) => {
      mostrarExito(`Automatización "${resultado.nombre}" creada en Qlik Cloud`);
      await queryClient.invalidateQueries({ queryKey: ["automatizaciones"] });
      navegar({ to: "/automatizaciones" });
    },
    onError: (error: Error) => mostrarError(error.message),
  });

  const tieneCambiosSinGuardar = Boolean(
    flujoId || tablaId || destinoId || nombre.trim(),
  );
  useEffect(() => {
    if (!tieneCambiosSinGuardar || crear.isPending) return;
    const protegerSalida = (evento: BeforeUnloadEvent) => {
      evento.preventDefault();
      evento.returnValue = "";
    };
    window.addEventListener("beforeunload", protegerSalida);
    return () => window.removeEventListener("beforeunload", protegerSalida);
  }, [tieneCambiosSinGuardar, crear.isPending]);

  if (cargandoConfig) {
    return (
      <div className="mx-auto flex max-w-3xl items-center justify-center py-20 text-sm text-ink-500">
        Verificando configuración del tenant…
      </div>
    );
  }
  if (!configurada) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <h2 className="text-2xl font-bold text-ink-900">
          Nueva automatización
        </h2>
        <AlertaConfiguracionTenant
          configTenant={configTenant}
          onVolver={() => navegar({ to: "/automatizaciones" })}
        />
      </div>
    );
  }

  if (modoActivo === 1) {
    return (
      <FormularioCrearAutomatizacionModo1
        flujos={flujos}
        flujoId={flujoId}
        onFlujoChange={(id) => {
          setFlujoId(id);
          setDestinoId(undefined);
          setConfirmacionSecretos(false);
        }}
        preflight={preflight.data}
        cargandoPreflight={preflight.isLoading}
        conexiones={conexiones}
        destinoId={destinoId}
        onDestinoChange={(id) => setDestinoId(id || undefined)}
        nombre={nombre}
        onNombreChange={setNombre}
        confirmacion={confirmacionSecretos}
        onConfirmacionChange={setConfirmacionSecretos}
        onConexionGuardada={() => {
          queryClient.invalidateQueries({
            queryKey: ["automatizaciones-preflight", flujoId],
          });
        }}
        onDestinoGuardado={(id) => {
          setDestinoId(id);
          queryClient.invalidateQueries({ queryKey: ["destinos-conexiones"] });
          queryClient.invalidateQueries({
            queryKey: ["automatizaciones-preflight", flujoId],
          });
        }}
        puedeAdministrarConexiones={
          configTenant?.puedeAdministrarConexiones ?? false
        }
        conexionProbandoId={
          probarOrigen.isPending ? probarOrigen.variables : undefined
        }
        onProbarConexion={(id) => probarOrigen.mutate(id)}
        onCrear={() => crear.mutate()}
        creando={crear.isPending}
      />
    );
  }

  return (
    <FormularioCrearAutomatizacion
      flujoId={flujoId}
      setFlujoId={setFlujoId}
      tablaId={tablaId}
      setTablaId={setTablaId}
      nombre={nombre}
      setNombre={setNombre}
      flujos={flujos}
      tablas={recursosDestino}
      automatizaciones={automatizaciones}
      espacioId={espacioIdActual}
      isLoadingFlujos={cargandoFlujos}
      isLoadingTablas={cargandoRecursos}
      onCrear={() => crear.mutate()}
      isCreating={crear.isPending}
      puedeCrear={Boolean(flujoId && tablaId && nombre.trim() && destinoId)}
      modoActivo={2}
      plantillaEfectivaNombre={configTenant?.plantillaEfectivaNombre ?? null}
      destinoId={destinoId}
      setDestinoId={setDestinoId}
      conexiones={conexiones}
      requiereDestino={true}
      etiquetaDestino={destinoModo2?.nombre ?? "Destino"}
    />
  );
}
