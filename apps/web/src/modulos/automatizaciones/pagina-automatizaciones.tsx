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
import {
  type ResumenAutomatizacion,
  ejecutarAutomatizacion,
} from "@/modulos/automatizaciones/api";
import type { EspacioDisponible } from "@qlik/contratos/automatizaciones";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

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

const claseSelector =
  "mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200";

function sufijoBusqueda(espacioId?: string): string {
  return espacioId ? `?espacioId=${encodeURIComponent(espacioId)}` : "";
}

export function PaginaAutomatizaciones() {
  const { mostrarError, mostrarExito } = useNotificaciones();
  const queryClient = useQueryClient();
  const { espacioId, establecerEspacioId } = useFiltroEspacioPersistente();
  const espacioFiltrado = espacioId.trim() || undefined;
  const [idEjecutando, setIdEjecutando] = useState<string | null>(null);

  const {
    data: automatizaciones,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<ResumenAutomatizacion[]>({
    queryKey: espacioFiltrado
      ? ["automatizaciones", espacioFiltrado]
      : ["automatizaciones"],
    queryFn: () =>
      clienteApi.get<ResumenAutomatizacion[]>("/automatizaciones", {
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

  const ejecutar = useMutation({
    mutationFn: ejecutarAutomatizacion,
    onMutate: (id: string) => {
      setIdEjecutando(id);
    },
    onSuccess: async (_resultado, id) => {
      mostrarExito(`Automatización ejecutada: ${id}`);
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

  if (isLoading) return <div>Cargando automatizaciones...</div>;

  if (isError) {
    return <EstadoError mensaje={error.message} onReintentar={handleRefetch} />;
  }

  const lista = automatizaciones ?? [];
  const busqueda = sufijoBusqueda(espacioFiltrado);

  return (
    <div>
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold">Automatizaciones</h2>
          <Button asChild>
            <a href={`/automatizaciones/nueva${busqueda}`}>
              Nueva automatización
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
                ? "No hay automatizaciones para mostrar en este espacio."
                : "No hay automatizaciones para mostrar."}
            </p>
          </div>
        ) : (
          lista.map((auto) => (
            <Card key={auto.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle>
                    <a
                      href={`/automatizaciones/${auto.id}${busqueda}`}
                      className="text-blue-600 hover:underline"
                    >
                      {auto.nombre}
                    </a>
                  </CardTitle>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${claseEstado(auto)}`}
                  >
                    {estadoVisual(auto)}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Disparador: {auto.modoEjecucion || "Manual"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Espacio: {auto.espacioNombre}
                    </p>
                    <p className="text-sm text-gray-500">
                      Propietario: {auto.propietarioNombre}
                    </p>
                    <p className="text-sm text-gray-500">
                      Creado: {formatearFechaSeguro(auto.creadoEn)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Modificado: {formatearFechaSeguro(auto.modificadoEn)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      data-accion="ejecutar"
                      disabled={!auto.puedeEjecutar || idEjecutando === auto.id}
                      onClick={() => ejecutar.mutate(auto.id)}
                    >
                      {idEjecutando === auto.id
                        ? "Ejecutando…"
                        : auto.ejecucionActiva
                          ? "En ejecución"
                          : "Ejecutar"}
                    </Button>
                    <Button variant="outline" asChild>
                      <a href={`/automatizaciones/${auto.id}${busqueda}`}>
                        Editar
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
