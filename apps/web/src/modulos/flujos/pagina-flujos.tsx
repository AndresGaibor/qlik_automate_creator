import { EstadoError } from "@/componentes/feedback/estado-error";
import { useNotificaciones } from "@/componentes/feedback/notificaciones";
import { Button } from "@/componentes/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/componentes/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

interface Flujo {
  id: string;
  nombre: string;
  espacio: { id: string; nombre: string };
  modificadoEn: string;
  automatizacion?: {
    existe: boolean;
    id: string;
    nombre: string;
  };
}

export function PaginaFlujos() {
  const { mostrarError } = useNotificaciones();
  const {
    data: flujos,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Flujo[]>({
    queryKey: ["flujos"],
    queryFn: async () => {
      const res = await fetch("/api/flujos");
      let json: { success?: boolean; error?: string; data?: Flujo[] };
      try {
        json = await res.json();
      } catch {
        throw new Error("Error al cargar flujos");
      }
      if (!res.ok) throw new Error(json?.error ?? "Error al cargar flujos");
      if (typeof json !== "object" || json === null)
        throw new Error("Error al cargar flujos");
      if (!json.success)
        throw new Error(json?.error ?? "Error al cargar flujos");
      return (json.data as Flujo[]) ?? [];
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

  if (isLoading) return <div>Cargando flujos...</div>;

  if (isError) {
    return <EstadoError mensaje={error.message} onReintentar={handleRefetch} />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
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

      <div className="space-y-4">
        {flujos?.map((flujo) => (
          <Card key={flujo.id}>
            <CardHeader>
              <CardTitle>{flujo.nombre}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Espacio: {flujo.espacio.nombre}
                  </p>
                  <p className="text-sm text-gray-500">
                    Modificado:{" "}
                    {new Date(flujo.modificadoEn).toLocaleDateString()}
                  </p>
                </div>
                {flujo.automatizacion?.existe ? (
                  <Button variant="outline">Ver automatización</Button>
                ) : (
                  <Button>Crear automatización</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
