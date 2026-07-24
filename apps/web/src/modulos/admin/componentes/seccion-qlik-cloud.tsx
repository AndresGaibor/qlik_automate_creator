import { useState } from "react";
import { Button } from "@/compartido/componentes/ui/button";
import { ConfirmDialog } from "@/compartido/componentes/ui/confirm-dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/compartido/componentes/ui/card";
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
      <Card className="border-gray-200">
      <CardHeader className="border-b bg-gray-50/50 pb-4">
        <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
          ☁️ Conexión con Qlik Cloud
        </CardTitle>
        <p className="text-xs text-gray-500">
          Ingresa la dirección web (Host) de tu entorno Qlik Cloud. No se
          requieren IDs técnicos complejos.
        </p>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg border grid gap-3 sm:grid-cols-3 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Host / Dominio Qlik Cloud{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              value={hostQlik}
              onChange={(evento) => setHostQlik(evento.target.value)}
              placeholder="ej: miempresa.us.qlikcloud.com"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Nombre de la Conexión (Opcional)
            </label>
            <input
              value={nombreTenantQlik}
              onChange={(evento) => setNombreTenantQlik(evento.target.value)}
              placeholder="ej: Entorno Producción"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <Button
            disabled={!hostQlik.trim() || crear.isPending}
            onClick={() => {
              onCrear({
                host: hostQlik.trim(),
                ...(nombreTenantQlik.trim() ? { nombre: nombreTenantQlik.trim() } : {}),
              });
              setHostQlik("");
              setNombreTenantQlik("");
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium w-full"
          >
            {crear.isPending ? "Conectando..." : "+ Agregar Conexión Qlik"}
          </Button>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-800">
            Conexiones Registradas
          </h4>
          {tenantsQlik.map((tQlik) => (
            <div
              key={tQlik.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border bg-white hover:border-gray-300 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">
                    {tQlik.nombre || tQlik.host}
                  </span>
                  {tQlik.esPrincipal ? (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded font-medium">
                      ⭐ Conexión Principal
                    </span>
                  ) : null}
                </div>
                <p className="text-xs text-gray-500 font-mono">{tQlik.host}</p>
              </div>
              <div className="flex gap-2">
                {!tQlik.esPrincipal && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onHacerPrincipal(tQlik.id)}
                    disabled={hacerPrincipal.isPending}
                    className="text-xs"
                  >
                    ⭐ Usar como Principal
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-600 text-xs hover:bg-red-50"
                  onClick={() => {
                    setConfirmDialog({
                      open: true,
                      mensaje: "¿Estás seguro de eliminar esta conexión de Qlik?",
                      onConfirm: () => onEliminar(tQlik.id),
                    });
                  }}
                  disabled={eliminar.isPending}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
          {tenantsQlik.length === 0 && (
            <p className="text-xs text-gray-400 italic">
              Aún no has agregado la dirección de Qlik Cloud para esta
              organización.
            </p>
          )}
        </div>
      </CardContent>
    </Card>

    <ConfirmDialog
      open={confirmDialog.open}
      mensaje={confirmDialog.mensaje}
      titulo="Eliminar conexión Qlik"
      confirmText="Eliminar"
      variant="danger"
      onConfirm={() => {
        confirmDialog.onConfirm();
        setConfirmDialog({ ...confirmDialog, open: false });
      }}
      onCancel={() => setConfirmDialog({ ...confirmDialog, open: false })}
    />
    </>
  );
}
