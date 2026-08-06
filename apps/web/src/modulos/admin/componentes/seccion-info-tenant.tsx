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
  actualizar: { isPending: boolean };
}

export function SeccionInfoTenant({
  tenant,
  onActualizarEstado,
  onActualizarNombre,
  actualizar,
}: Props) {
  const [detallesAbiertos, setDetallesAbiertos] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    mensaje: string;
    onConfirm: () => void;
  }>({ open: false, mensaje: "", onConfirm: () => undefined });
  const activa = tenant.estado === "activa";

  return (
    <>
      <Card className="border-line-200 bg-surface shadow-card">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50 text-brand-700">
                  <Icon name="gear" size="sm" />
                </span>
                <div>
                  <h2 className="font-display text-base font-semibold text-ink-900">
                    General
                  </h2>
                  <p className="text-xs text-ink-500">
                    Información principal de la plataforma.
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <NombreEditor
                  nombre={tenant.nombre}
                  isPending={actualizar.isPending}
                  onActualizarNombre={onActualizarNombre}
                />
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                    activa
                      ? "border-brand-100 bg-brand-50 text-brand-700"
                      : "border-red-200 bg-red-50 text-danger-600"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${activa ? "bg-brand-600" : "bg-danger-600"}`}
                  />
                  {activa ? "Plataforma activa" : "Plataforma suspendida"}
                </span>
              </div>
            </div>

            <Button
              type="button"
              size="sm"
              variant="outline"
              aria-expanded={detallesAbiertos}
              onClick={() => setDetallesAbiertos((actual) => !actual)}
              className="shrink-0 gap-1.5"
            >
              <Icon name="more" size="sm" />
              {detallesAbiertos ? "Ocultar detalles" : "Detalles y acciones"}
            </Button>
          </div>

          {detallesAbiertos && (
            <div className="mt-5 grid gap-4 border-t border-line-200 pt-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.7fr)]">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-line-200 bg-app/40 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                    Identificador interno (slug)
                  </p>
                  <code className="mt-2 block font-mono text-sm text-ink-800">
                    {tenant.slug}
                  </code>
                </div>
                <div className="rounded-lg border border-line-200 bg-app/40 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                    Registrada
                  </p>
                  <p className="mt-2 text-sm font-medium text-ink-800">
                    {new Intl.DateTimeFormat("es-EC", {
                      dateStyle: "medium",
                    }).format(new Date(tenant.creadoEn))}
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-red-200 bg-red-50/60 p-4">
                <p className="text-sm font-semibold text-danger-700">
                  Zona de riesgo
                </p>
                <p className="mt-1 text-xs leading-5 text-red-700">
                  {activa
                    ? "Desactivar impide temporalmente que los usuarios ingresen."
                    : "Activa la plataforma para permitir nuevamente el acceso."}
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={actualizar.isPending}
                  className={`mt-3 gap-1.5 ${
                    activa
                      ? "border-red-200 text-danger-600 hover:bg-red-100"
                      : "border-brand-200 text-brand-700 hover:bg-brand-50"
                  }`}
                  onClick={() => {
                    const nuevoEstado = activa ? "suspendida" : "activa";
                    setConfirmDialog({
                      open: true,
                      mensaje: activa
                        ? `¿Desactivar la plataforma "${tenant.nombre}"? Los usuarios no podrán iniciar sesión mientras esté suspendida.`
                        : `¿Activar la plataforma "${tenant.nombre}"? Los usuarios autorizados podrán volver a iniciar sesión.`,
                      onConfirm: () => onActualizarEstado(nuevoEstado),
                    });
                  }}
                >
                  <Icon name={activa ? "pause" : "play"} size="sm" />
                  {activa ? "Desactivar plataforma" : "Activar plataforma"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmDialog.open}
        onCancel={() =>
          setConfirmDialog((actual) => ({ ...actual, open: false }))
        }
        onConfirm={() => {
          confirmDialog.onConfirm();
          setConfirmDialog((actual) => ({ ...actual, open: false }));
        }}
        titulo="Cambiar estado de la plataforma"
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

  function cancelar() {
    setNuevoNombre(nombre);
    setEditando(false);
  }

  function guardar() {
    const limpio = nuevoNombre.trim();
    if (limpio && limpio !== nombre) onActualizarNombre(limpio);
    setEditando(false);
  }

  if (editando) {
    return (
      <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row sm:items-center">
        <input
          ref={campoNombreRef}
          type="text"
          aria-label="Nombre de la empresa"
          value={nuevoNombre}
          onChange={(evento) => setNuevoNombre(evento.target.value)}
          onKeyDown={(evento) => {
            if (evento.key === "Enter") guardar();
            if (evento.key === "Escape") cancelar();
          }}
          className="h-10 min-w-0 flex-1 rounded-md border border-line-200 px-3 text-sm font-semibold text-ink-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
        />
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={guardar}
            disabled={isPending || !nuevoNombre.trim()}
          >
            Guardar
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={cancelar}
            disabled={isPending}
          >
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="truncate font-display text-xl font-semibold text-ink-900">
        {nombre}
      </span>
      <button
        type="button"
        onClick={() => setEditando(true)}
        aria-label="Editar nombre de la empresa"
        className="grid h-9 w-9 place-items-center rounded-md text-ink-400 transition-colors hover:bg-hover hover:text-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        <Icon name="edit" size="sm" />
      </button>
    </div>
  );
}
