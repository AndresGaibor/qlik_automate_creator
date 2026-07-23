import { EstadoError } from "@/componentes/feedback/estado-error";
import { useNotificaciones } from "@/componentes/feedback/notificaciones";
import { Button } from "@/componentes/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/componentes/ui/card";
import type { ResumenAutomatizacion } from "@/modulos/automatizaciones/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

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
  return auto.isEnabled ? "Activa" : "Inactiva";
}

export function PaginaAutomatizaciones() {
  const { mostrarError } = useNotificaciones();
  const {
    data: automatizaciones,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<ResumenAutomatizacion[]>({
    queryKey: ["automatizaciones"],
    queryFn: async () => {
      const res = await fetch("/api/qlik/automatizaciones");
      let json: { success?: boolean; error?: string; data?: ResumenAutomatizacion[] };
      try {
        json = await res.json();
      } catch {
        throw new Error("Error al cargar automatizaciones");
      }
      if (!res.ok)
        throw new Error(json?.error ?? "Error al cargar automatizaciones");
      if (typeof json !== "object" || json === null)
        throw new Error("Error al cargar automatizaciones");
      if (!json.success)
        throw new Error(json?.error ?? "Error al cargar automatizaciones");
      return (json.data as ResumenAutomatizacion[]) ?? [];
    },
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

  if (isLoading) return <div>Cargando automatizaciones...</div>;

  if (isError) {
    return <EstadoError mensaje={error.message} onReintentar={handleRefetch} />;
  }

  const lista = automatizaciones ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Automatizaciones</h2>
        <Button asChild>
          <a href="/automatizaciones/nueva">Nueva automatización</a>
        </Button>
      </div>

      <div className="space-y-4">
        {lista.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
            <p className="text-gray-500">
              No hay automatizaciones para mostrar.
            </p>
          </div>
        ) : (
          lista.map((auto) => (
            <Card key={auto.id}>
              <CardHeader>
                <CardTitle>
                  <a
                    href={`/automatizaciones/${auto.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {auto.name}
                  </a>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Estado: {estadoVisual(auto)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Disparador: {auto.triggerType || "Manual"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Espacio: {auto.espacioNombre}
                    </p>
                    <p className="text-sm text-gray-500">
                      Propietario: {auto.ownerNombre}
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
                      disabled={!auto.puedeEjecutar}
                    >
                      {auto.ejecucionActiva ? "En ejecución" : "Ejecutar"}
                    </Button>
                    <Button variant="outline">Editar</Button>
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
