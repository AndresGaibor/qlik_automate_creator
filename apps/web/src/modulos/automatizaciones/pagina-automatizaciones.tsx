import { useQuery } from "@tanstack/react-query";
import { Button } from "@/componentes/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/componentes/ui/card";
import { apiCliente } from "@/infraestructura/api/cliente";

interface Automatizacion {
  id: string;
  nombre: string;
  flujoIdQlik: string;
  flujoNombre: string;
  destinoProveedor: string;
  destinoNombre: string;
  estado: string;
  creadoEn: string;
  modificadoEn: string;
}

export function PaginaAutomatizaciones() {
  const { data: automatizaciones, isLoading } = useQuery<Automatizacion[]>({
    queryKey: ["automatizaciones"],
    queryFn: async () => {
      const res = await fetch("/api/automatizaciones");
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    },
  });

  if (isLoading) return <div>Cargando automatizaciones...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Automatizaciones</h2>
        <Button asChild>
          <a href="/automatizaciones/nueva">Nueva automatización</a>
        </Button>
      </div>

      <div className="space-y-4">
        {automatizaciones?.map((automatizacion) => (
          <Card key={automatizacion.id}>
            <CardHeader>
              <CardTitle>{automatizacion.nombre}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Flujo: {automatizacion.flujoNombre}
                  </p>
                  <p className="text-sm text-gray-500">
                    Destino: {automatizacion.destinoNombre}
                  </p>
                  <p className="text-sm text-gray-500">
                    Estado: {automatizacion.estado}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Ejecutar</Button>
                  <Button variant="outline">Editar</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
