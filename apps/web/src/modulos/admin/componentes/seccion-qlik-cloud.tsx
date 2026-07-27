import { Button } from "@/compartido/componentes/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/compartido/componentes/ui/card";
import { ConfirmDialog } from "@/compartido/componentes/ui/confirm-dialog";
import { Icon } from "@/compartido/componentes/ui/icon";
import { useState } from "react";
import type { TenantQlik } from "../api";

interface Props {
  tenant: { id: string };
  tenantsQlik: TenantQlik[];
  onCrear: (params: { host: string; nombre?: string }) => void;
  onEliminar: (id: string) => void;
  onHacerPrincipal: (id: string) => void;
  crear: { isPending: boolean };
  eliminar: { isPending: boolean };
  hacerPrincipal: { isPending: boolean };
}

export function SeccionQlikCloud({
  tenant,
  tenantsQlik,
  onCrear,
  onEliminar,
  onHacerPrincipal,
  crear,
  eliminar,
  hacerPrincipal,
}: Props) {
  const [hostQlik, setHostQlik] = useState("");
  const [nombreTenantQlik, setNombreTenantQlik] = useState("");
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    mensaje: string;
    onConfirm: () => void;
  }>({ open: false, mensaje: "", onConfirm: () => {} });

  return (
    <>
      <Card className="border-line-200 bg-surface shadow-card">
        <CardHeader className="border-b border-line-200 bg-app/30 pb-4">
          <CardTitle className="font-display text-lg font-semibold text-ink-900 flex items-center gap-2">
            <Icon name="cloud" className="text-obj-600" />
            Conexión con Qlik Cloud
          </CardTitle>
          <p className="text-xs text-ink-500 mt-1">
            Agrega la dirección web de tu entorno Qlik Cloud (ej:{" "}
            <code>miempresa.us.qlikcloud.com</code>). Puedes conectar varios
            entornos a la misma organización.
          </p>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="bg-app/50 p-4 rounded-lg border border-line-200 grid gap-3 sm:grid-cols-3 items-end">
            <div>
              <label
                htmlFor="host-qlik"
                className="block text-xs font-semibold text-ink-700 mb-1"
              >
                Dirección del entorno Qlik Cloud{" "}
                <span className="text-danger-600">*</span>
              </label>
              <input
                id="host-qlik"
                value={hostQlik}
                onChange={(evento) => setHostQlik(evento.target.value)}
                placeholder="ej: miempresa.us.qlikcloud.com"
                className="w-full rounded-md border border-line-200 bg-surface px-3 py-2 text-sm text-ink-900 focus:border-brand-600 focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="nombre-tenant-qlik"
                className="block text-xs font-semibold text-ink-700 mb-1"
              >
                Alias o nombre descriptivo (opcional)
              </label>
              <input
                id="nombre-tenant-qlik"
                value={nombreTenantQlik}
                onChange={(evento) => setNombreTenantQlik(evento.target.value)}
                placeholder="ej: Producción, Pruebas, BanCol"
                className="w-full rounded-md border border-line-200 bg-surface px-3 py-2 text-sm text-ink-900 focus:border-brand-600 focus:outline-none"
              />
            </div>
            <Button
              disabled={!hostQlik.trim() || crear.isPending}
              onClick={() => {
                onCrear({
                  host: hostQlik.trim(),
                  nombre: nombreTenantQlik.trim() || undefined,
                });
                setHostQlik("");
                setNombreTenantQlik("");
              }}
              className="gap-1.5"
            >
              <Icon name="plus" size="sm" />
              Agregar este entorno Qlik
            </Button>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-3">
              Entornos conectados
            </h4>
            {tenantsQlik.length === 0 ? (
              <div className="rounded-lg border border-dashed border-line-300 bg-app/30 p-6 text-center">
                <div className="flex h-10 w-10 mx-auto items-center justify-center rounded-full bg-line-200 text-ink-400 mb-3">
                  <Icon name="cloud" className="text-ink-400" size="sm" />
                </div>
                <p className="text-sm font-medium text-ink-600 mb-1">
                  Aún no tienes entornos Qlik conectados
                </p>
                <p className="text-xs text-ink-400">
                  Agrega el host de tu tenant usando el formulario de arriba.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {tenantsQlik.map((tQlik) => (
                  <div
                    key={tQlik.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-line-200 bg-surface hover:border-line-300 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-ink-900 text-sm">
                          {tQlik.nombre || "Tenant Qlik"}
                        </span>
                        {tQlik.esPrincipal && (
                          <span className="inline-flex items-center gap-1 rounded bg-brand-50 border border-brand-100 px-2 py-0.5 text-[11px] font-semibold text-brand-700">
                            <Icon
                              name="star"
                              size="sm"
                              className="text-brand-600"
                            />
                            Conexión Principal
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-xs text-ink-500 block mt-0.5">
                        {tQlik.host}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {!tQlik.esPrincipal && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={hacerPrincipal.isPending}
                          onClick={() => onHacerPrincipal(tQlik.id)}
                          className="text-xs gap-1"
                        >
                          <Icon name="star" size="sm" />
                          Hacer Principal
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
                            mensaje: `¿Eliminar la conexión con "${tQlik.nombre || tQlik.host}"? Esta acción no se puede deshacer.`,
                            onConfirm: () => onEliminar(tQlik.id),
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
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmDialog.open}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, open: false }))}
        onConfirm={() => {
          confirmDialog.onConfirm();
          setConfirmDialog((prev) => ({ ...prev, open: false }));
        }}
        titulo="Eliminar Conexión Qlik Cloud"
        mensaje={confirmDialog.mensaje}
      />
    </>
  );
}
