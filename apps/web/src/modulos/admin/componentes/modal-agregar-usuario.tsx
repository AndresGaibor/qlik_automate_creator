import { Button } from "@/compartido/componentes/ui/button";
import { useState } from "react";

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
      <div className="bg-surface rounded-xl p-6 sm:p-8 w-full max-w-md shadow-panel border border-line-200">
        <AgregarUsuarioForm
          onAgregar={onAgregar}
          onClose={onClose}
          isPending={isPending}
        />
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
      <h3 className="font-display text-xl font-semibold text-ink-900 mb-1">
        Autorizar Usuarios
      </h3>
      <p className="text-xs text-ink-500 mb-5 leading-relaxed">
        Ingresa uno o varios correos electrónicos separados por coma (
        <code>,</code>) o punto y coma (<code>;</code>). El nombre real se
        obtendrá automáticamente al ingresar.
      </p>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="correos-usuarios"
            className="block text-xs font-semibold text-ink-700 mb-1.5"
          >
            Correo(s) Electrónico(s) <span className="text-danger-600">*</span>
          </label>
          <textarea
            id="correos-usuarios"
            rows={3}
            required
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="ej: usuario1@empresa.com, usuario2@empresa.com"
            className="w-full rounded-md border border-line-200 bg-surface px-3 py-2 text-sm text-ink-900 focus:border-brand-600 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="rol-usuario"
            className="block text-xs font-semibold text-ink-700 mb-1.5"
          >
            Rol en esta Organización
          </label>
          <select
            id="rol-usuario"
            value={rol}
            onChange={(e) => setRol(e.target.value as "admin" | "usuario")}
            className="w-full rounded-md border border-line-200 bg-surface px-3 py-2 text-sm text-ink-900 focus:border-brand-600 focus:outline-none"
          >
            <option value="usuario">
              Usuario (Crea y ejecuta automatizaciones)
            </option>
            <option value="admin">
              Administrador (Gestiona usuarios y Qlik)
            </option>
          </select>
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-6">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={!correo.trim() || isPending}>
          {isPending ? "Guardando…" : "Autorizar Usuario(s)"}
        </Button>
      </div>
    </>
  );
}
