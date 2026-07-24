import { useState } from "react";
import { Button } from "@/compartido/componentes/ui/button";

interface Props {
  open: boolean;
  onClose: () => void;
  onCrear: (nombre: string) => void;
  isPending: boolean;
}

export function ModalCrearOrganizacion({ open, onClose, onCrear, isPending }: Props) {
  const [nombre, setNombre] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl border">
        <h3 className="text-xl font-bold text-gray-900 mb-1">Nueva Organización</h3>
        <p className="text-xs text-gray-500 mb-4">
          Registra un nombre descriptivo para la empresa o área de trabajo.
        </p>
        <div className="mb-4">
          <label htmlFor="nombre-tenant" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la Empresa / Organización
          </label>
          <input
            id="nombre-tenant"
            type="text"
            value={nombre}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="ej: Bancolombia - Finanzas"
          />
        </div>
        <div className="flex gap-2 justify-end pt-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button
            onClick={() => { onCrear(nombre); setNombre(""); }}
            disabled={!nombre.trim() || isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isPending ? "Guardando..." : "Crear Organización"}
          </Button>
        </div>
      </div>
    </div>
  );
}