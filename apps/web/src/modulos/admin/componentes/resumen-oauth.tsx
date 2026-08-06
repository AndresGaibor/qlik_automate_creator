import { Button } from "@/compartido/componentes/ui/button";
import { Icon } from "@/compartido/componentes/ui/icon";
import type { ConfiguracionOauthQlik, TenantQlik } from "../api";

interface Props {
  tenant: TenantQlik;
  configuracion: ConfiguracionOauthQlik;
  verificando: boolean;
  onEditar: () => void;
  onVerificar: () => void;
}

function fechaLegible(valor: string | null) {
  if (!valor) return "Aún no verificada";
  return new Intl.DateTimeFormat("es-EC", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(valor));
}

export function ResumenOauth({
  tenant,
  configuracion,
  verificando,
  onEditar,
  onVerificar,
}: Props) {
  const verificada = configuracion.estado === "verificada";

  return (
    <section className="rounded-xl border border-line-200 bg-surface p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate font-semibold text-ink-900">
              {tenant.nombre || "Entorno Qlik Cloud"}
            </h3>
            <span
              className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                verificada
                  ? "border-brand-100 bg-brand-50 text-brand-700"
                  : "border-amber-200 bg-amber-50 text-amber-800"
              }`}
            >
              {verificada ? "Verificada" : "Pendiente de verificar"}
            </span>
          </div>
          <p className="mt-1 truncate font-mono text-xs text-ink-500">
            {tenant.host}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="button" size="sm" variant="outline" onClick={onEditar}>
            Editar configuración
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onVerificar}
            disabled={verificando}
            className="gap-1.5"
          >
            <Icon name="play" size="sm" />
            {verificando ? "Verificando…" : "Volver a verificar"}
          </Button>
        </div>
      </div>

      <dl className="mt-5 grid gap-3 rounded-lg border border-line-200 bg-app/40 p-4 sm:grid-cols-3">
        <div className="min-w-0">
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
            Client ID
          </dt>
          <dd className="mt-1 truncate font-mono text-sm text-ink-900">
            {configuracion.clienteId || "No configurado"}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
            Permisos
          </dt>
          <dd className="mt-1 text-sm font-semibold text-ink-900">
            {configuracion.scopes.length} autorizados
          </dd>
        </div>
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
            Última verificación
          </dt>
          <dd className="mt-1 text-sm font-medium text-ink-900">
            {fechaLegible(configuracion.verificadaEn)}
          </dd>
        </div>
      </dl>

      {configuracion.ultimoError && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700"
        >
          {configuracion.ultimoError}
        </p>
      )}
    </section>
  );
}
