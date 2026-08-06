import { Button } from "@/compartido/componentes/ui/button";
import { ConfirmDialog } from "@/compartido/componentes/ui/confirm-dialog";
import { Icon } from "@/compartido/componentes/ui/icon";
import { useState } from "react";
import type { TenantQlik } from "../api";

export function SetupTecnicoQlik({
  tenantsQlik,
  onCrearQlik,
  onEliminarQlik,
  onHacerPrincipal,
  crear,
  eliminar,
  hacerPrincipal,
}: {
  tenantsQlik: TenantQlik[];
  onCrearQlik: (params: { host: string; nombre?: string }) => void;
  onEliminarQlik: (id: string) => void;
  onHacerPrincipal: (id: string) => void;
  crear: { isPending: boolean };
  eliminar: { isPending: boolean };
  hacerPrincipal: { isPending: boolean };
}) {
  const [host, setHost] = useState("");
  const [nombre, setNombre] = useState("");
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    mensaje: string;
    onConfirm: () => void;
  }>({ open: false, mensaje: "", onConfirm: () => {} });

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3 items-end rounded-lg border border-line-200 bg-app/40 p-4">
        <div className="sm:col-span-1">
          <label
            htmlFor="setup-host-qlik"
            className="block text-xs font-semibold text-ink-700 mb-1.5"
          >
            Dirección del entorno <span className="text-danger-600">*</span>
          </label>
          <input
            id="setup-host-qlik"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            placeholder="empresa.us.qlikcloud.com"
            className="w-full rounded-md border border-line-200 bg-surface px-3 py-2 text-sm text-ink-900 focus:border-brand-600 focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="setup-alias-qlik"
            className="block text-xs font-semibold text-ink-700 mb-1.5"
          >
            Alias (opcional)
          </label>
          <input
            id="setup-alias-qlik"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="ej: Producción"
            className="w-full rounded-md border border-line-200 bg-surface px-3 py-2 text-sm text-ink-900 focus:border-brand-600 focus:outline-none"
          />
        </div>
        <Button
          disabled={!host.trim() || crear.isPending}
          onClick={() => {
            onCrearQlik({
              host: host.trim(),
              nombre: nombre.trim() || undefined,
            });
            setHost("");
            setNombre("");
          }}
          className="gap-1.5"
        >
          <Icon name="plus" size="sm" />
          Agregar entorno
        </Button>
      </div>

      {tenantsQlik.length === 0 ? (
        <p className="text-sm text-ink-400 text-center py-4">
          Agrega al menos un entorno Qlik Cloud para continuar.
        </p>
      ) : (
        <div className="space-y-2">
          {tenantsQlik.map((t) => (
            <div
              key={t.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line-200 bg-surface px-4 py-3 hover:border-line-300 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-obj-100 text-obj-700 font-bold text-xs">
                  Q
                </div>
                <div className="min-w-0">
                  <span className="font-semibold text-ink-900 text-sm block truncate">
                    {t.nombre || t.host}
                  </span>
                  {t.nombre && (
                    <span className="font-mono text-xs text-ink-500 block truncate">
                      {t.host}
                    </span>
                  )}
                </div>
                {t.esPrincipal && (
                  <span className="inline-flex items-center gap-1 rounded bg-brand-50 border border-brand-100 px-2 py-0.5 text-[11px] font-semibold text-brand-700 shrink-0">
                    <Icon name="star" size="sm" className="text-brand-600" />
                    Principal
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {!t.esPrincipal && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={hacerPrincipal.isPending}
                    onClick={() => onHacerPrincipal(t.id)}
                    className="text-xs gap-1"
                  >
                    <Icon name="star" size="sm" />
                    Principal
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={eliminar.isPending}
                  className="text-danger-600 hover:bg-red-50 text-xs"
                  onClick={() =>
                    setConfirmDialog({
                      open: true,
                      mensaje: `¿Eliminar la conexión con "${t.nombre || t.host}"? Esta acción no se puede deshacer.`,
                      onConfirm: () => onEliminarQlik(t.id),
                    })
                  }
                >
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={confirmDialog.open}
        onCancel={() => setConfirmDialog((p) => ({ ...p, open: false }))}
        onConfirm={() => {
          confirmDialog.onConfirm();
          setConfirmDialog((p) => ({ ...p, open: false }));
        }}
        titulo="Eliminar conexión Qlik Cloud"
        mensaje={confirmDialog.mensaje}
        variant="danger"
        confirmText="Sí, eliminar"
      />
    </div>
  );
}
