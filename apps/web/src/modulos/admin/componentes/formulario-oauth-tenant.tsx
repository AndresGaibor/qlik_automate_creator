import type { ConfiguracionOauthQlik, TenantQlik } from "../api";
import { EstadoOauth } from "./estado-oauth";
import { OauthCredenciales } from "./oauth-credenciales";
import { OauthInstrucciones } from "./oauth-instrucciones";

interface Props {
  tenant: TenantQlik;
  configuracion?: ConfiguracionOauthQlik;
  cargando: boolean;
  clienteId: string;
  clienteSecreto: string;
  scopesTexto: string;
  habilitado: boolean;
  guardando: boolean;
  onClienteId: (valor: string) => void;
  onClienteSecreto: (valor: string) => void;
  onScopesTexto: (valor: string) => void;
  onGuardar: (conectar: boolean) => void;
  onCancelar?: () => void;
  onCopiar: () => void;
}

export function FormularioOauthTenant({
  tenant,
  configuracion,
  cargando,
  onCopiar,
  ...credenciales
}: Props) {
  return (
    <section className="rounded-xl border border-line-200 bg-app/20 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-semibold text-ink-900">
            {tenant.nombre || "Tenant Qlik"}
          </h3>
          <p className="font-mono text-xs text-ink-500">{tenant.host}</p>
        </div>
        <EstadoOauth configuracion={configuracion} cargando={cargando} />
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <OauthInstrucciones
          tenant={tenant}
          configuracion={configuracion}
          onCopiar={onCopiar}
        />
        <OauthCredenciales
          tenant={tenant}
          configuracion={configuracion}
          {...credenciales}
        />
      </div>
    </section>
  );
}
