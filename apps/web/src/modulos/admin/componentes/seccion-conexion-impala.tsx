import { Button } from "@/compartido/componentes/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/compartido/componentes/ui/card";
import { Icon } from "@/compartido/componentes/ui/icon";
import { useState } from "react";
import type { TenantQlik } from "../api";
import {
  nombreVisibleEntornoQlik,
  normalizarHostQlik,
} from "../utiles-presentacion-qlik";
import { SeccionConfigurarImpalaTenant } from "./seccion-configurar-impala-tenant";

export function SeccionConexionImpala({
  organizacionId,
  tenantsQlik,
}: {
  organizacionId: string;
  tenantsQlik: TenantQlik[];
}) {
  if (tenantsQlik.length === 0) return null;

  return (
    <Card className="border-line-200 bg-surface shadow-card">
      <CardHeader className="border-b border-line-200 bg-app/30 pb-4">
        <CardTitle className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
          <Icon name="db" className="text-brand-600" />
          Conexión a Impala
        </CardTitle>
        <p className="mt-1 text-xs text-ink-500">
          Servidor donde se consultan y escriben las tablas de resultados.
        </p>
      </CardHeader>
      <CardContent className="space-y-4 p-4 sm:p-5">
        {tenantsQlik.map((tenantQlik) => (
          <ImpalaPorEntorno
            key={tenantQlik.id}
            organizacionId={organizacionId}
            tenantQlik={tenantQlik}
          />
        ))}
      </CardContent>
    </Card>
  );
}

function ImpalaPorEntorno({
  organizacionId,
  tenantQlik,
}: {
  organizacionId: string;
  tenantQlik: TenantQlik;
}) {
  const configurada = Boolean(tenantQlik.impalaHost);
  const [editando, setEditando] = useState(!configurada);
  const nombreEntorno = nombreVisibleEntornoQlik(tenantQlik);
  const hostQlik = normalizarHostQlik(tenantQlik.host);

  if (configurada && !editando) {
    return (
      <article className="rounded-xl border border-line-200 bg-app/20 p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700">
                <Icon name="db" size="sm" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink-900">
                  {nombreEntorno}
                </p>
                <p className="truncate font-mono text-xs text-ink-500">
                  {hostQlik}
                </p>
              </div>
            </div>
          </div>

          <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2 lg:max-w-2xl">
            <div className="rounded-lg border border-line-200 bg-surface px-3 py-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                Servidor
              </p>
              <p className="mt-1 truncate font-mono text-sm font-semibold text-ink-800">
                {tenantQlik.impalaHost}:{tenantQlik.impalaPort || 21050}
              </p>
            </div>
            <div className="rounded-lg border border-line-200 bg-surface px-3 py-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                Base de datos
              </p>
              <p className="mt-1 truncate text-sm font-semibold text-ink-800">
                {tenantQlik.impalaDatabase || "default"}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-100 bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
              Conectado
            </span>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={() => setEditando(true)}
            >
              <Icon name="edit" size="sm" />
              Editar conexión
            </Button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="overflow-hidden rounded-xl border border-line-200 bg-surface">
      <div className="flex flex-col gap-3 border-b border-line-200 bg-app/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-ink-900">{nombreEntorno}</p>
          <p className="font-mono text-xs text-ink-500">{hostQlik}</p>
        </div>
        {configurada && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setEditando(false)}
          >
            Cancelar edición
          </Button>
        )}
      </div>
      {!configurada && (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          Configura el servidor para habilitar la consulta de resultados.
        </div>
      )}
      <div className="p-4 sm:p-5">
        <SeccionConfigurarImpalaTenant
          organizacionId={organizacionId}
          tenantQlik={tenantQlik}
        />
      </div>
    </article>
  );
}
