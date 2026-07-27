import { Button } from "@/compartido/componentes/ui/button";
import { useState } from "react";
import type { AgregarSuperadmin } from "../api";

interface Props {
  open: boolean;
  onClose: () => void;
  onAgregar: (datos: AgregarSuperadmin) => void;
  isPending: boolean;
}

export function ModalAgregarSuperadmin({
  open,
  onClose,
  onAgregar,
  isPending,
}: Props) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");

  if (!open) return null;

  const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
  const formularioValido = nombre.trim().length > 0 && correoValido;

  function handleSubmit() {
    if (formularioValido) {
      onAgregar({ nombre: nombre.trim(), correo: correo.trim().toLowerCase() });
      setNombre("");
      setCorreo("");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl border">
        <h3 className="text-xl font-bold text-gray-900 mb-1">
          Agregar Superadministrador
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Ingresa el nombre y correo electrónico del nuevo superadministrador.
        </p>
        <div className="mb-4">
          <label
            htmlFor="superadmin-nombre"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nombre completo
          </label>
          <input
            id="superadmin-nombre"
            type="text"
            value={nombre}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNombre(e.target.value)
            }
            className="w-full border rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="ej: Juan Pérez"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="superadmin-correo"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Correo electrónico
          </label>
          <input
            id="superadmin-correo"
            type="email"
            value={correo}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCorreo(e.target.value)
            }
            className="w-full border rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="ej: juan.perez@empresa.com"
          />
          {correo.length > 0 && !correoValido && (
            <p className="text-xs text-red-500 mt-1">
              Ingresa un correo electrónico válido
            </p>
          )}
        </div>
        <div className="flex gap-2 justify-end pt-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!formularioValido || isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isPending ? "Guardando..." : "Agregar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
