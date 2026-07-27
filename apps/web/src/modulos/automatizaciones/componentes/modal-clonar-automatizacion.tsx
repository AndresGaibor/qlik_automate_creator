import { Button } from "@/compartido/componentes/ui/button";
import { Icon } from "@/compartido/componentes/ui/icon";
import { useState } from "react";

interface Props {
  open: boolean;
  nombreOriginal: string;
  cargando: boolean;
  onConfirmar: (nombre: string) => void;
  onCancelar: () => void;
}

export function ModalClonarAutomatizacion({
  open,
  nombreOriginal,
  cargando,
  onConfirmar,
  onCancelar,
}: Props) {
  const [nombre, setNombre] = useState(`${nombreOriginal} (Copia)`);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-gray-100 relative">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Clonar Automatización
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Se creará una copia de esta automatización con todos sus nodos y
          configuración.
        </p>

        <label
          htmlFor="nombre-clon"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          Nombre de la copia
        </label>
        <input
          id="nombre-clon"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
          placeholder="Nombre de la automatización"
          onKeyDown={(e) => {
            if (e.key === "Enter" && nombre.trim()) onConfirmar(nombre.trim());
            if (e.key === "Escape") onCancelar();
          }}
        />

        <div className="flex gap-3 justify-end mt-6">
          <Button variant="outline" onClick={onCancelar} disabled={cargando}>
            Cancelar
          </Button>
          <Button
            onClick={() => onConfirmar(nombre.trim())}
            disabled={!nombre.trim() || cargando}
            className="gap-1.5"
          >
            {cargando ? (
              "Clonando…"
            ) : (
              <>
                <Icon name="plus" size="sm" />
                Clonar
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
