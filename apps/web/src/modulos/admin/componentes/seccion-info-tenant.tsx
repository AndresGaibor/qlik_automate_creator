import { Button } from "@/compartido/componentes/ui/button";
import { Card, CardContent } from "@/compartido/componentes/ui/card";
import { ConfirmDialog } from "@/compartido/componentes/ui/confirm-dialog";
import { Icon } from "@/compartido/componentes/ui/icon";
import { useEffect, useRef, useState } from "react";
import type { DetalleTenant } from "../api";

interface Props {
  tenant: DetalleTenant;
  onActualizarEstado: (estado: "activa" | "suspendida") => void;
  onActualizarNombre: (nombre: string) => void;
  actualizar: {
    isPending: boolean;
  };
}

export function SeccionInfoTenant({
  tenant,
  onActualizarEstado,
  onActualizarNombre,
  actualizar,
}: Props) {
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    mensaje: string;
    onConfirm: () => void;
  }>({ open: false, mensaje: "", onConfirm: () => {} });

  return (
    <>
      <div className="space-y-4">
        {/* Card: datos básicos */}
        <Card className="border-line-200 bg-surface shadow-card">
          <CardContent className="pt-5 pb-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              {/* Info */}
              <div className="space-y-3">
                {/* Nombre editable */}
                <div>
                  <p className="text-xs font-semibold text-ink-500 mb-1.5">
                    Nombre de la organización
                  </p>
                  <NombreEditor
                    nombre={tenant.nombre}
                    isPending={actualizar.isPending}
                    onActualizarNombre={onActualizarNombre}
                  />
                </div>

                {/* Slug */}
                <div>
                  <p className="text-xs font-semibold text-ink-500 mb-1">
                    Identificador interno (slug)
                  </p>
                  <code className="inline-block bg-app border border-line-200 px-2 py-1 rounded font-mono text-xs text-ink-700">
                    {tenant.slug}
                  </code>
                </div>
              </div>

              {/* Acción de estado */}
              <div className="flex flex-col items-start sm:items-end gap-2">
                <p className="text-xs text-ink-500">Estado actual</p>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold mb-1 ${
                    tenant.estado === "activa"
                      ? "bg-brand-50 text-brand-700 border border-brand-100"
                      : "bg-red-50 text-danger-600 border border-red-100"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      tenant.estado === "activa"
                        ? "bg-brand-600 animate-dot-pulse"
                        : "bg-danger-600"
                    }`}
                  />
                  {tenant.estado === "activa" ? "Activa" : "Suspendida"}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className={
                    tenant.estado === "activa"
                      ? "text-danger-600 hover:bg-red-50 border-red-200 text-xs"
                      : "text-brand-700 hover:bg-brand-50 border-brand-200 text-xs"
                  }
                  onClick={() => {
                    const nuevoEstado =
                      tenant.estado === "activa" ? "suspendida" : "activa";
                    setConfirmDialog({
                      open: true,
                      mensaje:
                        nuevoEstado === "suspendida"
                          ? `¿Desactivar "${tenant.nombre}"? Los usuarios no podrán iniciar sesión mientras esté suspendida.`
                          : `¿Activar "${tenant.nombre}"? Los usuarios autorizados podrán volver a iniciar sesión.`,
                      onConfirm: () => onActualizarEstado(nuevoEstado),
                    });
                  }}
                >
                  <Icon
                    name={tenant.estado === "activa" ? "pause" : "play"}
                    size="sm"
                  />
                  {tenant.estado === "activa" ? "Desactivar" : "Activar"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={confirmDialog.open}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, open: false }))}
        onConfirm={() => {
          confirmDialog.onConfirm();
          setConfirmDialog((prev) => ({ ...prev, open: false }));
        }}
        titulo="Cambiar estado de la organización"
        mensaje={confirmDialog.mensaje}
      />
    </>
  );
}

function NombreEditor({
  nombre,
  isPending,
  onActualizarNombre,
}: {
  nombre: string;
  isPending: boolean;
  onActualizarNombre: (nombre: string) => void;
}) {
  const [editando, setEditando] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState(nombre);
  const campoNombreRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editando) campoNombreRef.current?.focus();
  }, [editando]);

  function guardar() {
    if (nuevoNombre.trim() && nuevoNombre.trim() !== nombre) {
      onActualizarNombre(nuevoNombre.trim());
    }
    setEditando(false);
  }

  if (editando) {
    return (
      <div className="flex items-center gap-2 max-w-sm">
        <input
          ref={campoNombreRef}
          type="text"
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") guardar();
            if (e.key === "Escape") {
              setNuevoNombre(nombre);
              setEditando(false);
            }
          }}
          className="flex-1 rounded-md border border-line-200 px-3 py-1.5 text-sm font-semibold text-ink-900 focus:border-brand-600 focus:outline-none"
        />
        <Button size="sm" onClick={guardar} disabled={isPending}>
          Guardar
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setNuevoNombre(nombre);
            setEditando(false);
          }}
        >
          Cancelar
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-semibold text-ink-900 text-base">{nombre}</span>
      <button
        type="button"
        onClick={() => setEditando(true)}
        className="text-ink-400 hover:text-ink-700 transition-colors"
        title="Editar nombre"
      >
        <Icon name="edit" size="sm" />
      </button>
    </div>
  );
}
