import { clienteApi } from "@/compartido/api/cliente";
import { EstadoError } from "@/compartido/componentes/feedback/estado-error";
import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import { Button } from "@/compartido/componentes/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/compartido/componentes/ui/card";
import { useFiltroEspacioPersistente } from "@/compartido/hooks/use-filtro-espacio-persistente";
import type { EspacioDisponible, ResumenFlujo } from "@qlik/contratos";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

const claseSelector =
  "mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200";

export function PaginaFlujos() {
  const { mostrarError } = useNotificaciones();
  const { espacioId, establecerEspacioId } = useFiltroEspacioPersistente();
  const espacioFiltrado = espacioId.trim() || undefined;

  const {
    data: flujos,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<ResumenFlujo[]>({
    queryKey: espacioFiltrado ? ["flujos", espacioFiltrado] : ["flujos"],
    queryFn: () =>
      clienteApi.get<ResumenFlujo[]>("/flujos", {
        parametros: espacioFiltrado
          ? { espacioId: espacioFiltrado }
          : undefined,
      }),
    retry: false,
  });

  const espacios = useQuery<EspacioDisponible[]>({
    queryKey: ["automatizaciones", "espacios"],
    queryFn: () =>
      clienteApi.get<EspacioDisponible[]>("/automatizaciones/espacios"),
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

  if (isLoading) return <div>Cargando flujos...</div>;

  if (isError) {
    return <EstadoError mensaje={error.message} onReintentar={handleRefetch} />;
  }

  const lista = flujos ?? [];

  return (
    <div>
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold">Flujos</h2>
          <Button asChild>
            <a
              href="https://qlikcloud.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Crear flujo en Qlik
            </a>
          </Button>
        </div>

        <label className="block max-w-md text-sm font-medium text-gray-700">
          Filtrar por espacio
          <select
            className={claseSelector}
            value={espacioId}
            onChange={(evento) => establecerEspacioId(evento.target.value)}
            disabled={espacios.isLoading}
          >
            <option value="">
              {espacios.isLoading
                ? "Cargando espacios..."
                : "Todos los espacios"}
            </option>
            {(espacios.data ?? []).map((espacio) => (
              <option key={espacio.id} value={espacio.id}>
                {espacio.nombre} · {espacio.tipo}
              </option>
            ))}
          </select>
          {espacios.isError ? (
            <span className="mt-1 block text-xs text-red-600">
              No se pudieron cargar los espacios.
            </span>
          ) : null}
        </label>
      </div>

      <div className="space-y-4">
        {lista.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
            <p className="text-gray-500">
              {espacioFiltrado
                ? "No hay flujos para mostrar en este espacio."
                : "No hay flujos para mostrar."}
            </p>
          </div>
        ) : (
          lista.map((flujo) => (
            <Card key={flujo.id}>
              <CardHeader>
                <CardTitle>{flujo.nombre}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Espacio: {flujo.espacioNombre}
                    </p>
                    <p className="text-sm text-gray-500">
                      Modificado:{" "}
                      {flujo.modificadoEn
                        ? new Date(flujo.modificadoEn).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                  <Button>Crear automatización</Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
