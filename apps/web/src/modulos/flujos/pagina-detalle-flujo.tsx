import { ErrorClienteApi } from "@/compartido/api/cliente";
import { EstadoAccesoRecursoQlik } from "@/compartido/componentes/feedback/estado-acceso-recurso-qlik";
import { EstadoError } from "@/compartido/componentes/feedback/estado-error";
import { Button } from "@/compartido/componentes/ui/button";
import { EstadoCarga } from "@/compartido/componentes/ui/estado-carga";
import { Icon } from "@/compartido/componentes/ui/icon";
import { PageHeader } from "@/compartido/componentes/ui/page-header";
import { PageLayout } from "@/compartido/componentes/ui/page-layout";
import { VisorJsonInteractivo } from "@/compartido/componentes/ui/visor-json-interactivo";
import { useTenantActivo } from "@/compartido/hooks/use-tenant-activo";
import { construirUrlVerFlujoQlik } from "@/compartido/utiles/qlik-urls";
import {
  type ResumenAutomatizacion,
  obtenerAutomatizaciones,
} from "@/modulos/automatizaciones/publico";
import {
  type ResumenFlujo,
  obtenerCatalogoSparkFlujo,
  obtenerFlujosConFiltros,
  obtenerScriptFlujo,
} from "@/modulos/flujos/api";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { useState } from "react";

function urlCatalogoConexiones(conexiones: string[]): string {
  const parametros = new URLSearchParams();

  for (const conexion of conexiones) {
    const coincidencia = conexion.match(
      /^(Base de Datos \/ JDBC|Servidor SFTP): "(.+)"$/,
    );
    if (!coincidencia) continue;
    const tipo = coincidencia[1] === "Base de Datos / JDBC" ? "jdbc" : "sftp";
    parametros.append("conexion", `${tipo}:${coincidencia[2]}`);
  }

  return `/configuracion?${parametros.toString()}`;
}

export function PaginaDetalleFlujo() {
  const { id } = useParams({ from: "/flujos/$id" });
  const [pestana, setPestana] = useState<
    "script" | "spark" | "metadata" | "automatizaciones"
  >("script");
  const [copiadoScript, setCopiadoScript] = useState(false);
  const [copiadoSpark, setCopiadoSpark] = useState(false);
  const [copiadoMeta, setCopiadoMeta] = useState(false);

  const { tenant: tenantActivo } = useTenantActivo();

  const {
    data: flujos = [],
    isLoading: cargandoFlujos,
    isError: errorFlujos,
  } = useQuery<ResumenFlujo[]>({
    queryKey: ["flujos"],
    queryFn: () => obtenerFlujosConFiltros(),
    staleTime: 60 * 1000,
  });

  const {
    data: datosScript,
    isLoading: cargandoScript,
    isError: errorScript,
    error: errorScriptDetalle,
  } = useQuery({
    queryKey: ["flujo-script", id],
    queryFn: () => obtenerScriptFlujo(id),
    staleTime: 60 * 1000,
  });

  const {
    data: datosSpark,
    isLoading: cargandoSpark,
    error: errorSparkDetalle,
  } = useQuery({
    queryKey: ["flujo-catalogo-spark", id],
    queryFn: () => obtenerCatalogoSparkFlujo(id),
    staleTime: 60 * 1000,
  });

  const { data: automatizaciones = [] } = useQuery<ResumenAutomatizacion[]>({
    queryKey: ["automatizaciones"],
    queryFn: () => obtenerAutomatizaciones(),
    staleTime: 60 * 1000,
  });

  const flujo = flujos.find((f) => f.id === id);
  const automatizacionVinculada = automatizaciones.find(
    (auto) =>
      auto.nombre.includes(id) ||
      (flujo && auto.nombre.toLowerCase().includes(flujo.nombre.toLowerCase())),
  );

  const targetHost = tenantActivo?.host;
  const urlQlikCloud =
    targetHost && flujo
      ? construirUrlVerFlujoQlik(targetHost, flujo.id, flujo.espacioId || "")
      : null;

  if (cargandoFlujos) {
    return <EstadoCarga mensaje="Cargando información del flujo de datos..." />;
  }

  const accesoDenegado = [errorScriptDetalle, errorSparkDetalle].some(
    (error) =>
      error instanceof ErrorClienteApi &&
      error.codigo === "ESPACIO_NO_AUTORIZADO",
  );

  if (accesoDenegado) {
    return <EstadoAccesoRecursoQlik />;
  }

  if (errorFlujos || !flujo) {
    return (
      <EstadoError
        mensaje={
          !flujo
            ? `No se encontró el flujo de datos con ID "${id}".`
            : "Error al recuperar información del flujo."
        }
      />
    );
  }

  const metadataDataflow = {
    id: flujo.id,
    name: flujo.nombre,
    resourceType: "app",
    resourceSubType: "qix-df",
    spaceId: flujo.espacioId || null,
    spaceName: flujo.espacioNombre || "Personal",
    updatedAt: flujo.modificadoEn || null,
    engine: "QIX Data Pipeline Engine",
  };

  const copiarScript = () => {
    if (datosScript?.script) {
      navigator.clipboard.writeText(datosScript.script);
      setCopiadoScript(true);
      setTimeout(() => setCopiadoScript(false), 2000);
    }
  };

  const copiarMetadata = () => {
    navigator.clipboard.writeText(JSON.stringify(metadataDataflow, null, 2));
    setCopiadoMeta(true);
    setTimeout(() => setCopiadoMeta(false), 2000);
  };

  return (
    <PageLayout>
      {/* Botón Volver */}
      <div>
        <Link
          to="/flujos"
          className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 transition-colors font-medium mb-4"
        >
          <Icon name="chev" size="sm" className="rotate-180" />
          Volver a Dataflows de Qlik
        </Link>
      </div>

      <PageHeader
        title={flujo.nombre}
        description={`Dataflow de Qlik · Espacio ${flujo.espacioNombre || "Personal"}`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {urlQlikCloud && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs"
              >
                <a
                  href={urlQlikCloud}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="ext" size="sm" />
                  Ver en Qlik Cloud
                </a>
              </Button>
            )}

            {automatizacionVinculada ? (
              <Button
                asChild
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
              >
                <Link
                  to="/automatizaciones/$id"
                  params={{ id: automatizacionVinculada.id }}
                >
                  <Icon name="zap" size="sm" />
                  Ver automatización ya creada
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                size="sm"
                className="bg-brand-600 hover:bg-brand-700 text-white gap-1.5"
              >
                <Link
                  to="/automatizaciones/nueva"
                  search={{ flujoId: flujo.id }}
                >
                  <Icon name="zap" size="sm" />
                  Crear automatización en Qlik Automate
                </Link>
              </Button>
            )}
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex rounded-xl bg-line-200/60 p-1 text-sm max-w-fit shadow-xs">
        <button
          type="button"
          onClick={() => setPestana("script")}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            pestana === "script"
              ? "bg-surface text-ink-900 shadow-sm"
              : "text-ink-500 hover:text-ink-900"
          }`}
        >
          Script de carga
        </button>
        <button
          type="button"
          onClick={() => setPestana("spark")}
          className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
            pestana === "spark"
              ? "bg-surface text-ink-900 shadow-sm"
              : "text-ink-500 hover:text-ink-900"
          }`}
        >
          <Icon name="sparkles" size="sm" className="text-brand-600" />
          Catálogo Spark (JSON)
        </button>
        <button
          type="button"
          onClick={() => setPestana("metadata")}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            pestana === "metadata"
              ? "bg-surface text-ink-900 shadow-sm"
              : "text-ink-500 hover:text-ink-900"
          }`}
        >
          Detalles del Dataflow
        </button>
        <button
          type="button"
          onClick={() => setPestana("automatizaciones")}
          className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
            pestana === "automatizaciones"
              ? "bg-surface text-ink-900 shadow-sm"
              : "text-ink-500 hover:text-ink-900"
          }`}
        >
          <span>Automatización en Qlik Automate</span>
          {automatizacionVinculada && (
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          )}
        </button>
      </div>

      {/* Contenido principal */}
      <div className="space-y-6">
        {pestana === "script" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm text-xs">
              <span className="text-slate-600 font-medium flex items-center gap-2">
                <Icon name="sparkles" size="sm" className="text-brand-600" />
                Este script se trae directo desde Qlik Cloud y siempre muestra
                la versión más reciente.
              </span>

              <button
                type="button"
                onClick={copiarScript}
                disabled={!datosScript?.script}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-line-300 text-ink-800 hover:bg-app text-xs font-semibold transition-colors shadow-sm disabled:opacity-50"
              >
                <Icon name="copy" size="sm" className="text-brand-600" />
                {copiadoScript ? "¡Script copiado!" : "Copiar script"}
              </button>
            </div>

            {cargandoScript && (
              <div className="flex min-h-[300px] flex-col items-center justify-center gap-2 bg-white rounded-xl border p-8">
                <div className="h-7 w-7 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
                <p className="text-sm text-ink-500 font-medium">
                  Cargando script de carga desde Qlik Cloud...
                </p>
              </div>
            )}

            {errorScript && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-xs text-amber-900 space-y-2">
                <p className="font-semibold text-sm">
                  Este Dataflow se creó con transformación visual en Qlik Cloud
                  (sin escribir código), por eso no hay un script para mostrar
                  aquí. La automatización funciona igual de bien.
                </p>
              </div>
            )}

            {!cargandoScript && !errorScript && datosScript && (
              <div className="relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                {datosScript.versionMessage && (
                  <div className="text-xs text-slate-500 font-mono border-b border-slate-100 pb-2">
                    Mensaje de versión: {datosScript.versionMessage}
                  </div>
                )}

                <pre className="font-mono text-xs text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-200 overflow-x-auto whitespace-pre-wrap leading-relaxed min-h-[400px]">
                  {datosScript.script ||
                    "Este Dataflow todavía no tiene un script de carga para mostrar."}
                </pre>
              </div>
            )}
          </div>
        )}

        {pestana === "spark" && (
          <div className="space-y-4">
            {datosSpark?.conexionesFaltantes &&
              datosSpark.conexionesFaltantes.length > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-semibold text-amber-800 text-sm">
                      <Icon
                        name="sparkles"
                        size="sm"
                        className="text-amber-600"
                      />
                      ¡Falta configurar el catálogo técnico de conexiones!
                    </div>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="bg-white border-amber-300 text-amber-900 hover:bg-amber-100 text-xs"
                    >
                      <a
                        href={urlCatalogoConexiones(
                          datosSpark.conexionesFaltantes,
                        )}
                      >
                        Ir a Configuración de Conexiones
                      </a>
                    </Button>
                  </div>
                  <p className="text-amber-700">
                    El script Qlik contiene nombres de conexión, tablas y
                    archivos, pero falta definir los datos técnicos (URL JDBC,
                    Hosts SFTP, usuarios, etc.) en el catálogo central para las
                    siguientes conexiones:
                  </p>
                  <ul className="list-disc list-inside font-mono text-[11px] text-amber-800 bg-amber-100/50 p-2.5 rounded-lg border border-amber-200 space-y-1">
                    {datosSpark.conexionesFaltantes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p className="text-[11px] text-amber-600 italic">
                    Una vez configuradas en el módulo de Conexiones Destino, se
                    reutilizarán automáticamente para este y cualquier otro
                    Dataflow que use la misma conexión.
                  </p>
                </div>
              )}

            <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm text-xs">
              <span className="text-slate-600 font-medium flex items-center gap-2">
                <Icon name="sparkles" size="sm" className="text-brand-600" />
                Catálogo resuelto generado automáticamente a partir del script
                Qlik para Spark motor.py.
              </span>

              <button
                type="button"
                onClick={() => {
                  if (datosSpark?.catalogoJson) {
                    navigator.clipboard.writeText(
                      JSON.stringify(datosSpark.catalogoJson, null, 2),
                    );
                    setCopiadoSpark(true);
                    setTimeout(() => setCopiadoSpark(false), 2000);
                  }
                }}
                disabled={!datosSpark?.catalogoJson}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-line-300 text-ink-800 hover:bg-app text-xs font-semibold transition-colors shadow-sm disabled:opacity-50"
              >
                <Icon name="copy" size="sm" className="text-brand-600" />
                {copiadoSpark ? "¡JSON Copiado!" : "Copiar JSON para Spark"}
              </button>
            </div>

            {cargandoSpark ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center gap-2 bg-white rounded-xl border p-8">
                <div className="h-7 w-7 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
                <p className="text-sm text-ink-500 font-medium">
                  Generando catálogo JSON para Spark...
                </p>
              </div>
            ) : datosSpark?.catalogoJson ? (
              <VisorJsonInteractivo data={datosSpark.catalogoJson} />
            ) : (
              <div className="p-5 text-xs text-slate-500">
                No se pudo generar el catálogo para este flujo.
              </div>
            )}
          </div>
        )}

        {pestana === "metadata" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-line-200 bg-surface p-5 shadow-sm space-y-4">
              <h4 className="font-semibold text-sm text-ink-900">
                Detalles del Dataflow
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="p-3 bg-app/50 rounded-lg border border-line-200">
                  <span className="text-ink-400 block mb-1">
                    ID del Dataflow:
                  </span>
                  <span className="font-mono font-semibold text-ink-900">
                    {flujo.id}
                  </span>
                </div>
                <div className="p-3 bg-app/50 rounded-lg border border-line-200">
                  <span className="text-ink-400 block mb-1">
                    Espacio en Qlik Cloud:
                  </span>
                  <span className="font-semibold text-ink-900">
                    {flujo.espacioNombre || "Personal"}
                  </span>
                </div>
                <div className="p-3 bg-app/50 rounded-lg border border-line-200">
                  <span className="text-ink-400 block mb-1">
                    Última actualización:
                  </span>
                  <span className="font-mono text-ink-900">
                    {flujo.modificadoEn
                      ? new Date(flujo.modificadoEn).toLocaleString()
                      : "—"}
                  </span>
                </div>
                <div className="p-3 bg-app/50 rounded-lg border border-line-200">
                  <span className="text-ink-400 block mb-1">
                    Tipo de Dataflow:
                  </span>
                  <span className="font-mono text-brand-600 font-semibold">
                    Dataflow de Qlik
                  </span>
                </div>
              </div>
            </div>

            <details className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <summary className="cursor-pointer font-medium text-xs text-brand-600 hover:underline">
                Ver JSON avanzado (para usuarios con experiencia técnica)
              </summary>
              <div className="mt-3 text-[11px] font-mono text-slate-500 border-t border-slate-200 pt-3 flex justify-between items-center">
                <span>METADATA_JSON_DATAFLOW</span>
                <button
                  type="button"
                  onClick={copiarMetadata}
                  className="text-xs text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2.5 py-1 rounded transition-colors font-medium"
                >
                  {copiadoMeta ? "¡JSON Copiado!" : "Copiar JSON"}
                </button>
              </div>
              <VisorJsonInteractivo data={metadataDataflow} />
            </details>
          </div>
        )}

        {pestana === "automatizaciones" && (
          <div className="space-y-4">
            {automatizacionVinculada ? (
              <div className="p-5 bg-white rounded-xl border border-emerald-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                    <h4 className="font-semibold text-sm text-gray-900">
                      Este Dataflow ya tiene una automatización activa en Qlik
                      Automate
                    </h4>
                  </div>
                  <Button
                    asChild
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs"
                  >
                    <Link
                      to="/automatizaciones/$id"
                      params={{ id: automatizacionVinculada.id }}
                    >
                      Ver automatización completa
                    </Link>
                  </Button>
                </div>
                <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100 text-xs space-y-1">
                  <p className="font-semibold text-emerald-900">
                    {automatizacionVinculada.nombre}
                  </p>
                  <p className="text-emerald-700 font-mono">
                    ID Automate: {automatizacionVinculada.id}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-8 bg-white rounded-xl border border-dashed border-slate-300 text-center space-y-3">
                <Icon
                  name="robot"
                  size="lg"
                  className="mx-auto text-slate-400"
                />
                <h4 className="font-semibold text-sm text-slate-800">
                  Este Dataflow todavía no tiene una automatización
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Créala en Qlik Automate para que la extracción y carga hacia
                  Impala ocurran solas, sin que tengas que hacerlo manualmente.
                </p>
                <Button
                  asChild
                  size="sm"
                  className="bg-brand-600 hover:bg-brand-700 text-white gap-1.5 text-xs"
                >
                  <Link
                    to="/automatizaciones/nueva"
                    search={{ flujoId: flujo.id }}
                  >
                    <Icon name="zap" size="sm" />
                    Crear automatización en Qlik Automate
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
