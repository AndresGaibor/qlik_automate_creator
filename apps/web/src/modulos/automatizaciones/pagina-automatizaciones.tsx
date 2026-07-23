import { EstadoError } from "@/componentes/feedback/estado-error";
import { useNotificaciones } from "@/componentes/feedback/notificaciones";
import { Button } from "@/componentes/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/componentes/ui/card";
import type { Automatizacion } from "@/modulos/automatizaciones/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

function resolverEstado(auto: {
  state?: string;
  isEnabled?: boolean;
  lastRunStatus?: string;
}): string {
  if (auto.state?.trim()) return auto.state;
  if (auto.isEnabled !== undefined) return auto.isEnabled ? "Activa" : "Inactiva";
  const statusMap: Record<string, string> = {
    running: "En ejecución",
    failed: "Error",
    completed: "Activa",
    success: "Activa",
    pending: "En espera",
    queued: "En espera",
  };
  if (auto.lastRunStatus && statusMap[auto.lastRunStatus]) {
    return statusMap[auto.lastRunStatus];
  }
  return "Desconocido";
}

function resolverDisparador(auto: {
  triggerType?: string;
  runMode?: string;
  trigger?: { type?: string };
}): string {
  if (auto.triggerType?.trim()) return auto.triggerType;
  if (auto.trigger?.type?.trim()) return auto.trigger.type;
  if (auto.runMode?.trim()) return auto.runMode;
  return "Manual";
}

function estaEnEjecucion(auto: {
  ejecucionActiva?: boolean;
  state?: string;
}): boolean {
  if (auto.ejecucionActiva) return true;
  if (auto.state?.trim()) {
    const lower = auto.state.toLowerCase();
    if (lower === "running" || lower === "en ejecución") return true;
  }
  return false;
}

export function PaginaAutomatizaciones() {
  const { mostrarError } = useNotificaciones();
  const {
    data: automatizaciones,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Automatizacion[]>({
    queryKey: ["automatizaciones"],
    queryFn: async () => {
      const res = await fetch("/api/qlik/automatizaciones");
      let json: { success?: boolean; error?: string; data?: Automatizacion[] };
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
      return (json.data as Automatizacion[]) ?? [];
    },
    retry: false,
  });

  const errorMsgRef = useRef<string | null>(null);

  // Reset marker when refetch begins (before fetch runs)
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
          lista.map((automatizacion) => {
            const ejecutando = estaEnEjecucion(automatizacion);
            return (
              <Card key={automatizacion.id}>
                <CardHeader>
                  <CardTitle>
                    <a
                      href={`/automatizaciones/${automatizacion.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {automatizacion.name}
                    </a>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">
                        Estado: {resolverEstado(automatizacion)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Disparador: {resolverDisparador(automatizacion)}
                      </p>
                      {automatizacion.spaceId && (
                        <p className="text-sm text-gray-500">
                          Espacio: {automatizacion.spaceId}
                        </p>
                      )}
                      {automatizacion.owner && (
                        <p className="text-sm text-gray-500">
                          Propietario: {automatizacion.owner.name}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        Creado:{" "}
                        {new Date(
                          automatizacion.createdDate,
                        ).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Modificado:{" "}
                        {new Date(
                          automatizacion.modifiedDate,
                        ).toLocaleDateString()}
                      </p>
                      {automatizacion.lastExecution && (
                        <p className="text-sm text-gray-500">
                          Última ejecución:{" "}
                          {automatizacion.lastExecution.status}
                          {" · "}
                          {new Date(
                            automatizacion.lastExecution.startTime,
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        data-accion="ejecutar"
                        disabled={ejecutando}
                      >
                        {ejecutando ? "En ejecución" : "Ejecutar"}
                      </Button>
                      <Button variant="outline">Editar</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
