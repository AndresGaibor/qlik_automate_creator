import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import { useFiltroEspacioConPersistencia } from "@/compartido/hooks/use-filtro-espacio-con-persistencia";
import {
  type ConfiguracionTenant,
  type ConexionDestino,
  type RecursoDestino,
  type ResultadoCrearDesdePlantilla,
  type ResumenAutomatizacion,
  type TablaImpala,
  crearAutomatizacionDesdePlantilla,
  obtenerAutomatizaciones,
  obtenerConexionesDestino,
  obtenerConfiguracionTenant,
  obtenerFlujosConFiltros,
  obtenerRecursosDestino,
  obtenerTablasImpala,
} from "@/modulos/automatizaciones/api";
import { AlertaConfiguracionTenant } from "@/modulos/automatizaciones/componentes/alerta-configuracion-tenant";
import { FormularioCrearAutomatizacion } from "@/modulos/automatizaciones/componentes/formulario-crear-automatizacion";
import type { ResumenFlujo } from "@qlik/contratos";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export function PaginaNuevaAutomatizacion() {
  const navegar = useNavigate();
  const queryClient = useQueryClient();
  const { mostrarError, mostrarExito } = useNotificaciones();
  const { espacioId: espacioIdPersistente } = useFiltroEspacioConPersistencia();

  const searchParams = new URLSearchParams(window.location.search);
  const espacioIdActual =
    searchParams.get("espacioId") || espacioIdPersistente || undefined;
  const flujoIdParam = searchParams.get("flujoId") || "";

  const [flujoId, setFlujoId] = useState(flujoIdParam);
  const [tablaId, setTablaId] = useState("");
  const [destinoId, setDestinoId] = useState<string | undefined>();
  const [nombre, setNombre] = useState("");

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

  const destinoActivo =
    modoActivo === 2
      ? conexiones.find((destino) => destino.id === destinoId)
      : conexiones.find((destino) => destino.id === destinoId) ?? conexiones[0];

  useEffect(() => {
    if (destinoId) {
      setTablaId("");
    }
  }, [destinoId]);

  const { data: recursosDestino = [], isLoading: cargandoRecursos } = useQuery<
    RecursoDestino[]
  >({
    queryKey: ["destinos-recursos", destinoActivo?.id],
    queryFn: () => obtenerRecursosDestino(destinoActivo?.id ?? ""),
    retry: false,
    enabled: configurada && Boolean(destinoActivo),
  });

  const { data: tablasHeredadas = [], isLoading: cargandoTablasHeredadas } = useQuery<
    { nombre: string }[]
  >({
    queryKey: ["impala-tablas"],
    queryFn: obtenerTablasImpala,
    retry: false,
    enabled: configurada && modoActivo === 1 && !destinoActivo,
  });

  const tablas: RecursoDestino[] =
    modoActivo === 2
      ? recursosDestino
      : tablasHeredadas.map((tabla) => ({
          id: tabla.nombre,
          nombre: tabla.nombre,
          tipo: "tabla",
          espacioDeNombres: "default",
          metadatos: {},
        }));

  useEffect(() => {
    if (flujoIdParam && !flujoId) {
      setFlujoId(flujoIdParam);
    }
  }, [flujoIdParam, flujoId]);

  useEffect(() => {
    if (flujoId && tablaId && !nombre) {
      const flujo = flujos.find((f) => f.id === flujoId);
      if (flujo) setNombre(`${flujo.nombre} hacia ${tablaId}`);
    }
  }, [flujoId, tablaId, flujos, nombre]);

  const crear = useMutation<ResultadoCrearDesdePlantilla>({
    mutationFn: async () => {
      const flujoObj = flujos.find((f) => f.id === flujoId);
      if (!flujoObj)
        throw new Error("Debes seleccionar un flujo de datos válido");
      if (!tablaId)
        throw new Error("Debes seleccionar un recurso de destino");
      if (modoActivo === 2 && !destinoId) {
        throw new Error(
          "El modo 2 requiere seleccionar una conexión destino y una tabla.",
        );
      }
      return crearAutomatizacionDesdePlantilla({
        nombre: nombre.trim() || `Auto - ${flujoObj.nombre} a ${tablaId}`,
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

  function onCrear() {
    if (!flujoId) {
      mostrarError("Por favor selecciona un flujo de datos");
      return;
    }
    if (!tablaId) {
      mostrarError("Por favor selecciona un recurso de destino");
      return;
    }
    crear.mutate();
  }

  if (cargandoConfig) {
    return (
      <div className="mx-auto max-w-3xl flex items-center justify-center py-20 text-gray-500 text-sm gap-2">
        Verificando configuración del tenant...
      </div>
    );
  }

  if (!configurada) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Nueva automatización
        </h2>
        <AlertaConfiguracionTenant
          configTenant={configTenant}
          onVolver={() => navegar({ to: "/automatizaciones" })}
        />
      </div>
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
      tablas={tablas}
      automatizaciones={automatizaciones}
      espacioId={espacioIdActual}
      isLoadingFlujos={cargandoFlujos}
      isLoadingTablas={cargandoRecursos || cargandoTablasHeredadas}
      onCrear={onCrear}
      isCreating={crear.isPending}
      puedeCrear={!!(flujoId && tablaId && nombre.trim() && (modoActivo !== 2 || Boolean(destinoId)))}
      modoActivo={modoActivo}
      plantillaEfectivaNombre={configTenant?.plantillaEfectivaNombre ?? null}
      destinoId={destinoId}
      setDestinoId={setDestinoId}
      conexiones={conexiones}
      requiereDestino={modoActivo === 2}
      etiquetaDestino={destinoActivo?.nombre ?? "Impala heredado"}
    />
  );
}
