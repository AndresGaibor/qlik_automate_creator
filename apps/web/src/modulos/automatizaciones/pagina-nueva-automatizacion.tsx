import { Button } from "@/componentes/ui/button";
import { useNavigate } from "@tanstack/react-router";

export function PaginaNuevaAutomatizacion() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Nueva automatización</h2>
      </div>

      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
        <p className="mb-4 text-gray-500">
          Formulario de creación de automatización (próximamente).
        </p>
        <Button
          variant="outline"
          onClick={() => navigate({ to: "/automatizaciones" })}
        >
          Volver a automatizaciones
        </Button>
      </div>
    </div>
  );
}
