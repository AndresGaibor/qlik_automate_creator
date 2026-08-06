import { Button } from "@/compartido/componentes/ui/button";
import { Icon } from "@/compartido/componentes/ui/icon";
import { useState } from "react";
import type { ConfiguracionOauthQlik, TenantQlik } from "../api";
import { normalizarScopesOauth } from "./oauth-formulario";

interface Props {
  tenant: TenantQlik;
  configuracion?: ConfiguracionOauthQlik;
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
}

export function OauthCredenciales({
  tenant,
  configuracion,
  clienteId,
  clienteSecreto,
  scopesTexto,
  habilitado,
  guardando,
  onClienteId,
  onClienteSecreto,
  onScopesTexto,
  onGuardar,
  onCancelar,
}: Props) {
  const [mostrarScopes, setMostrarScopes] = useState(false);
  return (
    <div className="space-y-4">
      {configuracion?.origen === "entorno_global" && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          Este tenant todavía usa las credenciales globales del servidor. Guarda
          una configuración propia para independizarlo.
        </div>
      )}
      <div>
        <label
          htmlFor={`oauth-cliente-${tenant.id}`}
          className="block text-xs font-semibold text-ink-700"
        >
          Client ID
        </label>
        <input
          id={`oauth-cliente-${tenant.id}`}
          value={clienteId}
          onChange={(evento) => onClienteId(evento.target.value)}
          placeholder="Client ID generado por Qlik"
          className="mt-1 w-full rounded-md border border-line-200 bg-surface px-3 py-2 text-sm text-ink-900 focus:border-brand-600 focus:outline-none"
        />
      </div>
      <div>
        <label
          htmlFor={`oauth-secreto-${tenant.id}`}
          className="block text-xs font-semibold text-ink-700"
        >
          Client Secret
        </label>
        <input
          id={`oauth-secreto-${tenant.id}`}
          type="password"
          autoComplete="new-password"
          value={clienteSecreto}
          onChange={(evento) => onClienteSecreto(evento.target.value)}
          placeholder={
            configuracion?.origen === "tenant"
              ? `Conservado como ${configuracion.secretoMascara ?? "secreto cifrado"}`
              : "Pega aquí el secreto generado por Qlik"
          }
          className="mt-1 w-full rounded-md border border-line-200 bg-surface px-3 py-2 text-sm text-ink-900 focus:border-brand-600 focus:outline-none"
        />
        <p className="mt-1 text-[11px] text-ink-500">
          Déjalo vacío al editar para conservar el secreto actual.
        </p>
      </div>
      <div className="rounded-lg border border-line-200 bg-app/40 p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-ink-700">
              Permisos OAuth recomendados
            </p>
            <p className="mt-1 text-[11px] text-ink-500">
              {normalizarScopesOauth(scopesTexto).length} permisos configurados.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            aria-expanded={mostrarScopes}
            onClick={() => setMostrarScopes((actual) => !actual)}
          >
            {mostrarScopes ? "Ocultar avanzado" : "Editar avanzado"}
          </Button>
        </div>
        {mostrarScopes && (
          <div className="mt-3 border-t border-line-200 pt-3">
            <label
              htmlFor={`oauth-scopes-${tenant.id}`}
              className="block text-xs font-semibold text-ink-700"
            >
              Scopes OAuth
            </label>
            <textarea
              id={`oauth-scopes-${tenant.id}`}
              rows={7}
              value={scopesTexto}
              onChange={(evento) => onScopesTexto(evento.target.value)}
              className="mt-1 w-full rounded-md border border-line-200 bg-surface px-3 py-2 font-mono text-xs text-ink-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
            />
            <p className="mt-1 text-[11px] text-ink-500">
              Modifica esta lista solo cuando Qlik requiera permisos distintos.
            </p>
          </div>
        )}
      </div>
      {configuracion?.ultimoError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          Último error: {configuracion.ultimoError}
        </div>
      )}
      <div className="flex flex-col-reverse gap-2 border-t border-line-200 pt-4 sm:flex-row sm:justify-end">
        {onCancelar && (
          <Button
            type="button"
            variant="ghost"
            disabled={guardando}
            onClick={onCancelar}
          >
            Cancelar
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          disabled={!habilitado || guardando}
          onClick={() => onGuardar(false)}
        >
          Guardar sin verificar
        </Button>
        <Button
          type="button"
          disabled={!habilitado || guardando}
          onClick={() => onGuardar(true)}
          className="gap-1.5"
        >
          <Icon name="play" size="sm" />
          {guardando ? "Guardando…" : "Guardar y verificar"}
        </Button>
      </div>
    </div>
  );
}
