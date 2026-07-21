import { useQuery } from "@tanstack/react-query";
import { Button } from "@/componentes/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/componentes/ui/card";
import { apiCliente } from "@/infraestructura/api/cliente";

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
  const { data: flujos, isLoading } = useQuery<Flujo[]>({
    queryKey: ["flujos"],
    queryFn: async () => {
      const res = await fetch("/api/flujos");
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    },
  });

  if (isLoading) return <div>Cargando flujos...</div>;

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
                    Modificado: {new Date(flujo.modificadoEn).toLocaleDateString()}
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
