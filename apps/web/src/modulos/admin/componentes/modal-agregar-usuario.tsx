import { Button } from "@/compartido/componentes/ui/button";

interface Props {
  open: boolean;
  onClose: () => void;
  onAgregar: (correo: string, rol: "admin" | "usuario") => void;
  isPending: boolean;
}

export function ModalAgregarUsuario({
  open,
  onClose,
  onAgregar,
  isPending,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl border">
        <AgregarUsuarioForm onAgregar={onAgregar} onClose={onClose} isPending={isPending} />
      </div>
    </div>
  );
}

function AgregarUsuarioForm({
  onAgregar,
  onClose,
  isPending,
}: {
  onAgregar: (correo: string, rol: "admin" | "usuario") => void;
  onClose: () => void;
  isPending: boolean;
}) {
  const [correo, setCorreo] = useState("");
  const [rol, setRol] = useState<"admin" | "usuario">("usuario");

  const handleSubmit = () => {
    onAgregar(correo.trim(), rol);
    setCorreo("");
    setRol("usuario");
    onClose();
  };

  return (
    <>
      <h3 className="text-lg font-bold text-gray-900 mb-1">
        Autorizar Usuarios
      </h3>
      <p className="text-xs text-gray-500 mb-4">
        Puedes ingresar uno o varios correos electrónicos separados por coma (
        <code>,</code>) o punto y coma (<code>;</code>). El nombre real se
        obtendrá automáticamente cuando el usuario ingrese por primera vez.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Correo(s) Electrónico(s) <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            required
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="ej: usuario1@empresa.com, usuario2@empresa.com"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Rol en esta Organización
          </label>
          <select
            value={rol}
            onChange={(e) =>
              setRol(e.target.value as "admin" | "usuario")
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="usuario">
              👤 Usuario (Crea y ejecuta automatizaciones)
            </option>
            <option value="admin">
              🛡️ Administrador (Gestiona usuarios y Qlik)
            </option>
          </select>
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-6">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!correo.trim() || isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isPending ? "Guardando..." : "Autorizar Usuario(s)"}
        </Button>
      </div>
    </>
  );
}

import { useState } from "react";
