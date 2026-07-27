import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import { useFiltroEspacioConPersistencia } from "@/compartido/hooks/use-filtro-espacio-con-persistencia";
import {
  type ConfiguracionTenant,
  type ResultadoCrearDesdePlantilla,
  crearAutomatizacionDesdePlantilla,
  obtenerConfiguracionTenant,
  obtenerFlujosConFiltros,
  obtenerTablasImpala,
  type TablaImpala,
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
  const espacioIdActual = searchParams.get("espacioId") || espacioIdPersistente || undefined;

  const [flujoId, setFlujoId] = useState("");
  const [tablaId, setTablaId] = useState("");
  const [nombre, setNombre] = useState("");

  const { data: configTenant, isLoading: cargandoConfig } = useQuery<ConfiguracionTenant>({
    queryKey: ["automatizaciones-config-tenant"],
    queryFn: obtenerConfiguracionTenant,
    retry: false,
  });

  const tieneBase = !!configTenant?.automatizacionBaseIdQlik;

  const { data: flujos = [], isLoading: cargandoFlujos } = useQuery<ResumenFlujo[]>({
    queryKey: espacioIdActual ? ["flujos", espacioIdActual] : ["flujos"],
    queryFn: () => obtenerFlujosConFiltros(espacioIdActual),
    retry: false,
    enabled: tieneBase,
  });

  const { data: tablas = [], isLoading: cargandoTablas } = useQuery<TablaImpala[]>({
    queryKey: ["impala-tablas"],
    queryFn: obtenerTablasImpala,
    retry: false,
    enabled: tieneBase,
  });

  useEffect(() => {
    if (flujoId && tablaId && !nombre) {
      const flujo = flujos.find((f) => f.id === flujoId);
      if (flujo) setNombre(`Auto - ${flujo.nombre} → ${tablaId}`);
    }
  }, [flujoId, tablaId, flujos, nombre]);

  const crear = useMutation<ResultadoCrearDesdePlantilla>({
    mutationFn: async () => {
      const flujoObj = flujos.find((f) => f.id === flujoId);
      if (!flujoObj) throw new Error("Debes seleccionar un flujo de datos válido");
      if (!tablaId) throw new Error("Debes seleccionar una tabla de destino Impala");
      if (!configTenant?.automatizacionBaseIdQlik) {
        throw new Error("El tenant no tiene una automatización base configurada");
      }
      return crearAutomatizacionDesdePlantilla({
        nombre: nombre.trim() || `Auto - ${flujoObj.nombre} → ${tablaId}`,
        espacioIdQlik: espacioIdActual,
        flujoId,
        tablaId,
        reemplazosWorkspace: [],
      });
    },
    onSuccess: async (resultado) => {
      mostrarExito(`✅ Automatización "${resultado.nombre}" creada correctamente en Qlik Cloud`);
      await queryClient.invalidateQueries({ queryKey: ["automatizaciones"] });
      navegar({ to: "/automatizaciones" });
    },
    onError: (error: Error) => mostrarError(error.message),
  });

  function onCrear() {
    if (!flujoId) { mostrarError("Por favor selecciona un flujo de datos"); return; }
    if (!tablaId) { mostrarError("Por favor selecciona una tabla de destino Impala"); return; }
    crear.mutate();
  }

  if (cargandoConfig) {
    return (
      <div className="mx-auto max-w-3xl flex items-center justify-center py-20 text-gray-500 text-sm gap-2">
        <span className="animate-spin">⚙️</span> Verificando configuración del tenant...
      </div>
    );
  }

  if (!tieneBase) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Nueva Automatización</h2>
        <AlertaConfiguracionTenant
          configTenant={configTenant}
          onVolver={() => navegar({ to: "/automatizaciones" })}
        />
      </div>
    );
  }

  return (
    <FormularioCrearAutomatizacion
      flujoId={flujoId} setFlujoId={setFlujoId}
      tablaId={tablaId} setTablaId={setTablaId}
      nombre={nombre} setNombre={setNombre}
      flujos={flujos} tablas={tablas}
      espacioId={espacioIdActual}
      isLoadingFlujos={cargandoFlujos} isLoadingTablas={cargandoTablas}
      onCrear={onCrear} isCreating={crear.isPending}
      puedeCrear={!!(flujoId && tablaId && nombre.trim())}
      configTenant={configTenant}
    />
  );
}
