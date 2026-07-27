import { useEffect, useId, useRef } from "react";
import { Button } from "./button";

interface Props {
  open: boolean;
  mensaje: string;
  titulo?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "default";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  mensaje,
  titulo = "Confirmar acción",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "default",
  onConfirm,
  onCancel,
}: Props) {
  const cancelarRef = useRef<HTMLButtonElement>(null);
  const dialogoRef = useRef<HTMLDivElement>(null);
  const tituloId = useId();
  const mensajeId = useId();
  useEffect(() => {
    if (!open) return;
    const focoPrevio = document.activeElement as HTMLElement | null;
    cancelarRef.current?.focus();
    const teclado = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") {
        evento.preventDefault();
        onCancel();
      }
      if (evento.key === "Tab" && dialogoRef.current) {
        const focos = dialogoRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (!focos.length) return;
        const primero = focos[0];
        const ultimo = focos[focos.length - 1];
        if (evento.shiftKey && document.activeElement === primero) {
          evento.preventDefault();
          ultimo.focus();
        } else if (!evento.shiftKey && document.activeElement === ultimo) {
          evento.preventDefault();
          primero.focus();
        }
      }
    };
    document.addEventListener("keydown", teclado);
    return () => {
      document.removeEventListener("keydown", teclado);
      focoPrevio?.focus();
    };
  }, [open, onCancel]);
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-150"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        ref={dialogoRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={tituloId}
        aria-describedby={mensajeId}
        className="relative w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl sm:p-8"
      >
        <h3 id={tituloId} className="mb-2 text-xl font-bold text-gray-900">
          {titulo}
        </h3>
        <p id={mensajeId} className="mb-6 text-sm text-gray-600">
          {mensaje}
        </p>
        <div className="flex gap-3 justify-end">
          <Button ref={cancelarRef} variant="outline" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button
            variant={variant === "danger" ? "destructive" : "default"}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
