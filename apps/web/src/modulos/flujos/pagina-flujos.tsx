import { EstadoError } from "@/compartido/componentes/feedback/estado-error";
import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import { Button } from "@/compartido/componentes/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/compartido/componentes/ui/card";
import { ModalSeleccionarTenantQlik } from "@/compartido/componentes/ui/modal-seleccionar-tenant-qlik";
import { SelectBuscable } from "@/compartido/componentes/ui/select-buscable";
import { useFiltroEspacioPersistente } from "@/compartido/hooks/use-filtro-espacio-persistente";
import {
  construirUrlCrearFlujoQlik,
  construirUrlVerFlujoQlik,
} from "@/compartido/utiles/qlik-urls";
import { obtenerSesion } from "@/modulos/autenticacion/api";
import { obtenerEspacios, obtenerFlujosConFiltros, type ResumenFlujo } from "@/modulos/flujos/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

const ELEMENTOS_POR_PAGINA = 10;

export function PaginaFlujos() {
  const { mostrarError } = useNotificaciones();
  const { espacioId, establecerEspacioId } = useFiltroEspacioPersistente();
  const espacioFiltrado = espacioId.trim() || undefined;
  const [modalTenantsAbierto, setModalTenantsAbierto] = useState(false);

  const [busquedaTemp, setBusquedaTemp] = useState("");
  const [busquedaActiva, setBusquedaActiva] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  const sesionQuery = useQuery({
    queryKey: ["sesion"],
    queryFn: obtenerSesion,
    retry: false,
  });

  const {
    data: flujos,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<ResumenFlujo[]>({
    queryKey: ["flujos", espacioFiltrado, busquedaActiva],
    queryFn: () => obtenerFlujosConFiltros(espacioFiltrado, busquedaActiva),
    retry: false,
  });

  const espacios = useQuery({
    queryKey: ["automatizaciones", "espacios"],
    queryFn: obtenerEspacios,
    retry: false,
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
        <p className="text-gray-500 animate-pulse">Cargando flujos de datos...</p>
      </div>
    );
  }

  if (isError) {
    return <EstadoError mensaje={error.message} onReintentar={handleRefetch} />;
  }

  const lista = flujos ?? [];
  const tenants = sesionQuery.data?.tenantsDisponibles ?? [];
  const tenantActivo =
    tenants.find((t) => t.id === sesionQuery.data?.tenantActivoId) ??
    tenants[0];
  const targetHost = tenantActivo?.host ?? "l676lvg3emfvcq2.us.qlikcloud.com";
  const targetUrlCrear = construirUrlCrearFlujoQlik(targetHost, espacioId);

  const totalPaginas = Math.max(
    1,
    Math.ceil(lista.length / ELEMENTOS_POR_PAGINA),
  );
  const inicio = (paginaActual - 1) * ELEMENTOS_POR_PAGINA;
  const flujosPaginados = lista.slice(
    inicio,
    inicio + ELEMENTOS_POR_PAGINA,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Flujos de Datos (Dataflows)
          </h2>
          <p className="text-sm text-gray-500">
            Explora, busca y selecciona los Dataflows de Qlik Cloud para vincularlos a tus automatizaciones.
          </p>
        </div>
        {tenants.length > 1 ? (
          <Button
            onClick={() => setModalTenantsAbierto(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            + Crear flujo en Qlik Cloud ↗
          </Button>
        ) : (
          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            <a href={targetUrlCrear} target="_blank" rel="noopener noreferrer">
              + Crear flujo en Qlik Cloud ↗
            </a>
          </Button>
        )}
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
            Buscar Flujos por Nombre
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={busquedaTemp}
                onChange={(e) => setBusquedaTemp(e.target.value)}
                placeholder="Escribe el nombre del Dataflow..."
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

      {/* Lista de Flujos Paginados */}
      <div className="space-y-4">
        {lista.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
            <p className="text-gray-500 font-medium mb-1">
              {busquedaActiva
                ? `No se encontraron flujos que coincidan con "${busquedaActiva}".`
                : espacioFiltrado
                  ? "No hay flujos de datos registrados para este espacio."
                  : "No hay flujos de datos disponibles."}
            </p>
            <p className="text-xs text-gray-400">
              Prueba realizando otra búsqueda o cambiando el filtro de espacio.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {flujosPaginados.map((flujo) => (
              <Card
                key={flujo.id}
                className="hover:shadow-md transition border-gray-200"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold text-gray-900">
                    {flujo.nombre}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>
                        <span className="text-gray-400">Espacio:</span>{" "}
                        <span className="font-semibold text-gray-800">
                          {flujo.espacioNombre || "Espacio Personal"}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Última modificación:{" "}
                        {flujo.modificadoEn
                          ? new Date(flujo.modificadoEn).toLocaleDateString()
                          : "—"}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        asChild
                        variant="outline"
                        className="text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-medium"
                      >
                        <a
                          href={construirUrlVerFlujoQlik(
                            targetHost,
                            flujo.id,
                            espacioId,
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          👁️ Ver en Qlik Cloud ↗
                        </a>
                      </Button>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium">
                        🚀 Crear Automatización desde este Flujo
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
                {Math.min(inicio + ELEMENTOS_POR_PAGINA, lista.length)}
              </span>{" "}
              de <span className="font-semibold text-gray-900">{lista.length}</span> flujos de datos
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

      <ModalSeleccionarTenantQlik
        abierto={modalTenantsAbierto}
        onCerrar={() => setModalTenantsAbierto(false)}
        tenants={sesionQuery.data?.tenantsDisponibles ?? []}
        tenantActivoId={sesionQuery.data?.tenantActivoId}
        espacioId={espacioId}
      />
    </div>
  );
}
