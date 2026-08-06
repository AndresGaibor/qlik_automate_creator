import { Button } from "@/compartido/componentes/ui/button";
import { Icon } from "@/compartido/componentes/ui/icon";
import type { ActualizarCampoSetup, FormularioSetup } from "../modelo-setup";
import { SCOPES_OAUTH_PREDETERMINADOS } from "../scopes-oauth";

interface Props {
  formulario: FormularioSetup;
  actualizarCampo: ActualizarCampoSetup;
  alternarScope(scope: string): void;
  copiarRedirectUri(): Promise<void>;
}

export function PasoQlik({
  formulario,
  actualizarCampo,
  alternarScope,
  copiarRedirectUri,
}: Props) {
  return (
    <fieldset className="space-y-5">
      <legend className="text-base font-semibold text-ink-900">
        Conexión con Qlik Cloud
      </legend>
      <p className="-mt-3 text-sm text-ink-600">
        Usa las credenciales de la aplicación OAuth registrada en el tenant.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label
            htmlFor="qlikTenantHost"
            className="mb-1.5 block text-sm font-medium text-ink-700"
          >
            Host del tenant
          </label>
          <input
            id="qlikTenantHost"
            type="text"
            required
            value={formulario.qlikTenantHost}
            onChange={(evento) =>
              actualizarCampo("qlikTenantHost", evento.target.value)
            }
            placeholder="empresa.us.qlikcloud.com"
            className="w-full rounded-md border border-line-200 bg-surface px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <div>
          <label
            htmlFor="qlikClientId"
            className="mb-1.5 block text-sm font-medium text-ink-700"
          >
            Client ID
          </label>
          <input
            id="qlikClientId"
            type="text"
            required
            autoComplete="username"
            value={formulario.qlikClientId}
            onChange={(evento) =>
              actualizarCampo("qlikClientId", evento.target.value)
            }
            className="w-full rounded-md border border-line-200 bg-surface px-3 py-2 text-sm text-ink-900 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <div>
          <label
            htmlFor="qlikClientSecret"
            className="mb-1.5 block text-sm font-medium text-ink-700"
          >
            Client Secret
          </label>
          <input
            id="qlikClientSecret"
            type="password"
            required
            autoComplete="new-password"
            value={formulario.qlikClientSecret}
            onChange={(evento) =>
              actualizarCampo("qlikClientSecret", evento.target.value)
            }
            className="w-full rounded-md border border-line-200 bg-surface px-3 py-2 text-sm text-ink-900 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium text-ink-700">Scopes OAuth</p>
        <div className="grid gap-2 border border-line-200 p-3 sm:grid-cols-2">
          {SCOPES_OAUTH_PREDETERMINADOS.map((scope) => (
            <label
              key={scope}
              className="flex items-start gap-2 text-sm text-ink-700"
            >
              <input
                type="checkbox"
                checked={formulario.qlikScopes.includes(scope)}
                onChange={() => alternarScope(scope)}
                className="mt-1 h-4 w-4 accent-[var(--color-brand-600)]"
              />
              <span className="font-mono text-xs leading-5">{scope}</span>
            </label>
          ))}
        </div>
        <p className="mt-2 text-xs text-ink-500">
          Los scopes disponibles coinciden con la configuración predeterminada
          del servidor.
        </p>
      </div>
      <aside
        className="border border-line-200 bg-app px-3 py-3"
        aria-label="URI de redirección OAuth"
      >
        <p className="text-sm font-medium text-ink-800">URI de redirección</p>
        <p className="mt-1 text-xs text-ink-600">
          Registra esta URI exactamente en la aplicación OAuth de Qlik Cloud.
        </p>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-start">
          <code className="block min-w-0 flex-1 break-all border border-line-200 bg-surface px-2 py-1.5 text-xs text-ink-800">
            {formulario.qlikRedirectUri}
          </code>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={copiarRedirectUri}
          >
            <Icon name="copy" size="sm" />
            Copiar URI
          </Button>
        </div>
      </aside>
    </fieldset>
  );
}
