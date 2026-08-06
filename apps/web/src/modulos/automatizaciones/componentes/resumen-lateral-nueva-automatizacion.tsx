import { Button } from "@/compartido/componentes/ui/button";
import { Link } from "@tanstack/react-router";
import { ResumenNuevaAutomatizacion } from "./resumen-nueva-automatizacion";

export function ResumenLateralNuevaAutomatizacion({
  flujoNombre,
  conexionNombre,
  recursoNombre,
  nombre,
  modoActivo,
  plantillaNombre,
  requiereDestino,
  isCreating,
  onCrear,
}: {
  flujoNombre: string;
  conexionNombre: string;
  recursoNombre: string;
  nombre: string;
  modoActivo: 1 | 2;
  plantillaNombre: string | null;
  requiereDestino: boolean;
  isCreating: boolean;
  onCrear: () => void;
}) {
  return (
    <aside aria-label="Resumen de creación" className="xl:sticky xl:top-24">
      <ResumenNuevaAutomatizacion
        flujoNombre={flujoNombre}
        conexionNombre={conexionNombre}
        recursoNombre={recursoNombre}
        nombre={nombre}
        modoActivo={modoActivo}
        plantillaNombre={plantillaNombre}
        requiereDestino={requiereDestino}
        isCreating={isCreating}
        onCrear={onCrear}
      />
      <Link to="/automatizaciones" className="mt-3 block">
        <Button
          type="button"
          variant="ghost"
          disabled={isCreating}
          className="w-full"
        >
          Cancelar y volver
        </Button>
      </Link>
    </aside>
  );
}
