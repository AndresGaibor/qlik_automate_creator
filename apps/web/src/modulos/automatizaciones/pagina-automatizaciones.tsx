import { EstadoError } from "@/compartido/componentes/feedback/estado-error";
import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import { Button } from "@/compartido/componentes/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/compartido/componentes/ui/card";
import { SelectBuscable } from "@/compartido/componentes/ui/select-buscable";
import { useFiltroEspacioPersistente } from "@/compartido/hooks/use-filtro-espacio-persistente";
import { construirUrlVerAutomatizacionQlik } from "@/compartido/utiles/qlik-urls";
import { obtenerSesion } from "@/modulos/autenticacion/api";
import {
  type ResumenAutomatizacion,
  ejecutarAutomatizacion,
  obtenerAutomatizacionesConFiltros,
  obtenerEspacios,
} from "@/modulos/automatizaciones/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

const ELEMENTOS_POR_PAGINA = 10;

function formatearFechaSeguro(iso: string | undefined | null): string {
  if (!iso) return "—";
  try {
    const fecha = new Date(iso);
    if (Number.isNaN(fecha.getTime())) return "—";
    return fecha.toLocaleDateString();
  } catch {
    return "—";
  }
}

function estadoVisual(auto: ResumenAutomatizacion): string {
  if (auto.ejecucionActiva) return "En ejecución";
  return auto.activa ? "Activa" : "Inactiva";
}

function claseEstado(auto: ResumenAutomatizacion): string {
  if (auto.ejecucionActiva) {
    return "bg-amber-100 text-amber-800";
  }
  if (auto.activa) {
    return "bg-emerald-100 text-emerald-800";
  }
  return "bg-slate-100 text-slate-700";
}

function sufijoBusqueda(espacioId?: string): string {
  return espacioId ? `?espacioId=${encodeURIComponent(espacioId)}` : "";
}

export function PaginaAutomatizaciones() {
  const { mostrarError, mostrarExito } = useNotificaciones();
  const queryClient = useQueryClient();
  const { espacioId, establecerEspacioId } = useFiltroEspacioPersistente();
  const espacioFiltrado = espacioId.trim() || undefined;
  const [idEjecutando, setIdEjecutando] = useState<string | null>(null);

  const [busquedaTemp, setBusquedaTemp] = useState("");
  const [busquedaActiva, setBusquedaActiva] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  const sesionQuery = useQuery({
    queryKey: ["sesion"],
    queryFn: obtenerSesion,
    retry: false,
  });

  const {
    data: automatizaciones,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<ResumenAutomatizacion[]>({
    queryKey: ["automatizaciones", espacioFiltrado, busquedaActiva],
    queryFn: () => obtenerAutomatizacionesConFiltros(espacioFiltrado, busquedaActiva),
    retry: false,
  });

  const espacios = useQuery({
    queryKey: ["automatizaciones", "espacios"],
    queryFn: obtenerEspacios,
    retry: false,
  });

  const ejecutar = useMutation({
    mutationFn: ejecutarAutomatizacion,
    onMutate: (id: string) => {
      setIdEjecutando(id);
    },
    onSuccess: async (_resultado, _id) => {
      mostrarExito(`Automatización ejecutada exitosamente`);
      await queryClient.invalidateQueries({ queryKey: ["automatizaciones"] });
    },
    onError: (err: Error) => {
      mostrarError(err.message);
    },
    onSettled: () => {
      setIdEjecutando(null);
    },
  });

  const errorMsgRef = useRef<string | null>(null);

  const handleRefetch = () => {
    errorMsgRef.current = null;
    refetch();
  };

  useEffect(() => {
    if (isError && error?.message !== errorMsgRef.current) {
      errorMsgRef.current = error.message ?? null;
      mostrarError(error.message);
    }
  }, [isError, error, mostrarError]);

  // Resetear paginación al cambiar espacio o búsqueda activa
  useEffect(() => {
    setPaginaActual(1);
  }, [espacioId, busquedaActiva]);

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    setBusquedaActiva(busquedaTemp.trim());
  };

  const handleLimpiarBusqueda = () => {
    setBusquedaTemp("");
    setBusquedaActiva("");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-gray-500 animate-pulse">Cargando automatizaciones...</p>
      </div>
    );
  }

  if (isError) {
    return <EstadoError mensaje={error.message} onReintentar={handleRefetch} />;
  }

  const lista = automatizaciones ?? [];
  const busqueda = sufijoBusqueda(espacioFiltrado);

  const tenants = sesionQuery.data?.tenantsDisponibles ?? [];
  const tenantActivo =
    tenants.find((t) => t.id === sesionQuery.data?.tenantActivoId) ??
    tenants[0];
  const targetHost = tenantActivo?.host ?? "l676lvg3emfvcq2.us.qlikcloud.com";

  const totalPaginas = Math.max(
    1,
    Math.ceil(lista.length / ELEMENTOS_POR_PAGINA),
  );
  const inicio = (paginaActual - 1) * ELEMENTOS_POR_PAGINA;
  const automatizacionesPaginadas = lista.slice(
    inicio,
    inicio + ELEMENTOS_POR_PAGINA,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Automatizaciones de Qlik</h2>
          <p className="text-sm text-gray-500">
            Crea, administra, busca y ejecuta las automatizaciones que orquestan tus tareas Impala/Dataflow.
          </p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
          <a href={`/automatizaciones/nueva${busqueda}`}>
            + Nueva Automatización
          </a>
        </Button>
      </div>

      {/* Barra de Filtros: Espacio + Formulario de Búsqueda por Nombre */}
      <div className="bg-white p-4 rounded-lg border shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <SelectBuscable
          etiqueta="Filtrar por Espacio de Qlik Cloud"
          placeholder="Todos los Espacios"
          searchPlaceholder="Buscar espacio por nombre..."
          emptyText="No se encontraron espacios con ese nombre"
          allowClear
          opciones={espacios.data ?? []}
          valorSeleccionado={espacioId}
          onSeleccionar={establecerEspacioId}
          cargando={espacios.isLoading}
          error={espacios.isError}
        />

        <form onSubmit={handleBuscar}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Buscar Automatización por Nombre
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={busquedaTemp}
                onChange={(e) => setBusquedaTemp(e.target.value)}
                placeholder="Escribe el nombre de la automatización..."
                className="w-full pl-3 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none shadow-sm"
              />
              {busquedaTemp && (
                <button
                  type="button"
                  onClick={handleLimpiarBusqueda}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4"
            >
              🔍 Buscar
            </Button>
          </div>
        </form>
      </div>

      {/* Lista de Automatizaciones Paginadas */}
      <div className="space-y-4">
        {lista.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
            <p className="text-gray-500 font-medium mb-1">
              {busquedaActiva
                ? `No se encontraron automatizaciones que coincidan con "${busquedaActiva}".`
                : espacioFiltrado
                  ? "No hay automatizaciones para mostrar en este espacio."
                  : "No hay automatizaciones creadas aún."}
            </p>
            <p className="text-xs text-gray-400 mb-4">
              Prueba realizando otra búsqueda o creando una nueva automatización.
            </p>
            <Button size="sm" asChild className="bg-blue-600 text-white">
              <a href={`/automatizaciones/nueva${busqueda}`}>
                + Crear Automatización
              </a>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {automatizacionesPaginadas.map((auto) => (
              <Card key={auto.id} className="hover:shadow-md transition border-gray-200">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-lg font-bold">
                      <a
                        href={`/automatizaciones/${auto.id}${busqueda}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {auto.nombre}
                      </a>
                    </CardTitle>
                    <span
                      className={`rounded-full px-3 py-0.5 text-xs font-semibold ${claseEstado(
                        auto,
                      )}`}
                    >
                      ● {estadoVisual(auto)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-gray-600 bg-gray-50 p-3 rounded-md w-full max-w-2xl">
                      <div>
                        <span className="text-gray-400 block">Modo Disparador</span>
                        <span className="font-semibold text-gray-800">
                          ⚡ {auto.modoEjecucion || "Manual"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Espacio</span>
                        <span className="font-semibold text-gray-800 truncate block">
                          📁 {auto.espacioNombre || "Personal"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Propietario</span>
                        <span className="font-semibold text-gray-800 truncate block">
                          👤 {auto.propietarioNombre}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Modificado</span>
                        <span className="font-mono text-gray-700">
                          {formatearFechaSeguro(auto.modificadoEn)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        asChild
                        variant="outline"
                        className="text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-medium"
                      >
                        <a
                          href={construirUrlVerAutomatizacionQlik(
                            targetHost,
                            auto.id,
                            "edit",
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          👁️ Ver en Qlik Cloud ↗
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        data-accion="ejecutar"
                        disabled={!auto.puedeEjecutar || idEjecutando === auto.id}
                        onClick={() => ejecutar.mutate(auto.id)}
                        className="text-xs border-blue-200 text-blue-700 hover:bg-blue-50 font-medium"
                      >
                        {idEjecutando === auto.id
                          ? "⏳ Ejecutando…"
                          : auto.ejecucionActiva
                            ? "▶️ En ejecución"
                            : "▶️ Ejecutar"}
                      </Button>
                      <Button variant="outline" asChild className="text-xs">
                        <a href={`/automatizaciones/${auto.id}${busqueda}`}>
                          ⚙️ Editar
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Controles de Paginación via API */}
        {lista.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-lg border shadow-sm gap-4 text-sm text-gray-600">
            <span>
              Mostrando <span className="font-semibold text-gray-900">{inicio + 1}</span> -{" "}
              <span className="font-semibold text-gray-900">
                {Math.min(
                  inicio + ELEMENTOS_POR_PAGINA,
                  lista.length,
                )}
              </span>{" "}
              de <span className="font-semibold text-gray-900">{lista.length}</span> automatizaciones
            </span>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                disabled={paginaActual === 1}
                onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
                className="text-xs"
              >
                ◀ Anterior
              </Button>
              <span className="font-semibold text-gray-800 text-xs">
                Página {paginaActual} de {totalPaginas}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={paginaActual === totalPaginas}
                onClick={() =>
                  setPaginaActual((p) => Math.min(totalPaginas, p + 1))
                }
                className="text-xs"
              >
                Siguiente ▶
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
