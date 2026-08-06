import { Button } from "@/compartido/componentes/ui/button";
import { Icon } from "@/compartido/componentes/ui/icon";
import { useState } from "react";
import type { ConfiguracionOauthQlik, TenantQlik } from "../api";

export function OauthInstrucciones({
  tenant,
  configuracion,
  onCopiar,
}: {
  tenant: TenantQlik;
  configuracion?: ConfiguracionOauthQlik;
  onCopiar: () => void;
}) {
  const [mostrar, setMostrar] = useState(false);
  return (
    <div className="rounded-lg border border-line-200 bg-surface p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-ink-900">
            Configuración en Qlik Cloud
          </h4>
          <p className="mt-1 text-xs text-ink-500">
            Copia la URL de redirección en el cliente OAuth de tipo Web.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          aria-expanded={mostrar}
          onClick={() => setMostrar((actual) => !actual)}
        >
          {mostrar ? "Ocultar instrucciones" : "Ver instrucciones"}
        </Button>
      </div>
      {mostrar && (
        <ol className="mt-4 list-decimal space-y-2 border-t border-line-200 pt-4 pl-5 text-xs leading-5 text-ink-600">
          <li>Abre Administration y entra en la sección OAuth.</li>
          <li>Crea un cliente nuevo de tipo Web.</li>
          <li>Copia exactamente la URL de redirección.</li>
          <li>Usa los permisos recomendados por la plataforma.</li>
          <li>Copia el Client ID y el secreto antes de cerrar Qlik.</li>
        </ol>
      )}
      <label
        htmlFor={`oauth-redirect-${tenant.id}`}
        className="mt-4 block text-xs font-semibold text-ink-700"
      >
        URL de redirección
      </label>
      <div className="mt-1 flex flex-col gap-2 sm:flex-row">
        <input
          id={`oauth-redirect-${tenant.id}`}
          readOnly
          value={configuracion?.redirectUri ?? "Cargando…"}
          className="min-w-0 flex-1 rounded-md border border-line-200 bg-app px-3 py-2 font-mono text-xs text-ink-700"
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={!configuracion?.redirectUri}
          onClick={onCopiar}
          className="gap-1"
        >
          <Icon name="copy" size="sm" />
          Copiar URL
        </Button>
      </div>
    </div>
  );
}
