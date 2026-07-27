import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import { Button } from "@/compartido/componentes/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/compartido/componentes/ui/card";
import { Icon } from "@/compartido/componentes/ui/icon";
import { iniciarVerificacionOauth } from "@/modulos/autenticacion/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { ConfiguracionOauthQlik, TenantQlik } from "../api";
import {
  guardarConfiguracionOauthTenant,
  obtenerConfiguracionOauthTenant,
} from "../api";
import { normalizarScopesOauth, puedeGuardarOauth } from "./oauth-formulario";

const SCOPES_RECOMENDADOS = [
  "user_default",
  "offline_access",
  "identity.name:read",
  "identity.email:read",
  "identity.subject:read",
  "identity.picture:read",
  "automations",
  "automations.private",
  "automations.shared",
  "spaces:read",
  "apps:read",
  "data-integration",
];
interface Props {
  organizacionId: string;
  tenantsQlik: TenantQlik[];
}

export function SeccionOauthQlik({ organizacionId, tenantsQlik }: Props) {
  const queryClient = useQueryClient();
  const { mostrarError, mostrarExito } = useNotificaciones();

  useEffect(() => {
    const parametros = new URLSearchParams(window.location.search);
    const verificado = parametros.get("oauth_verificado");
    const error = parametros.get("oauth_error");
    if (!verificado && !error) return;

    if (verificado) {
      mostrarExito("Conexión OAuth con Qlik verificada");
      queryClient.invalidateQueries({ queryKey: ["admin-oauth-qlik"] });
    } else if (error) {
      mostrarError("No se pudo verificar la conexión OAuth con Qlik");
    }
    history.replaceState(null, "", window.location.pathname);
  }, [mostrarError, mostrarExito, queryClient]);

  if (tenantsQlik.length === 0) return null;

  return (
    <Card className="border-line-200 bg-surface shadow-card">
      <CardHeader className="border-b border-line-200 bg-app/30 pb-4">
        <CardTitle className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
          <Icon name="gear" className="text-obj-600" />
          Acceso OAuth de Qlik
        </CardTitle>
        <p className="mt-1 text-xs text-ink-500">
          Cada entorno Qlik utiliza su propio cliente OAuth. El secreto se cifra
          antes de guardarse y nunca vuelve a mostrarse.
        </p>
      </CardHeader>
      <CardContent className="space-y-5 pt-6">
        {tenantsQlik.map((tenant) => (
          <TarjetaOauthTenant
            key={tenant.id}
            organizacionId={organizacionId}
            tenant={tenant}
          />
        ))}
      </CardContent>
    </Card>
  );
}
function TarjetaOauthTenant({
  organizacionId,
  tenant,
}: {
  organizacionId: string;
  tenant: TenantQlik;
}) {
  const queryClient = useQueryClient();
  const { mostrarError, mostrarExito } = useNotificaciones();
  const [clienteId, setClienteId] = useState("");
  const [clienteSecreto, setClienteSecreto] = useState("");
  const [scopesTexto, setScopesTexto] = useState(
    SCOPES_RECOMENDADOS.join("\n"),
  );

  const consulta = useQuery({
    queryKey: ["admin-oauth-qlik", organizacionId, tenant.id],
    queryFn: () => obtenerConfiguracionOauthTenant(organizacionId, tenant.id),
  });

  useEffect(() => {
    if (!consulta.data) return;
    setClienteId(consulta.data.clienteId ?? "");
    setScopesTexto(
      (consulta.data.scopes.length
        ? consulta.data.scopes
        : SCOPES_RECOMENDADOS
      ).join("\n"),
    );
  }, [consulta.data]);
  const guardar = useMutation({
    mutationFn: async (conectar: boolean) => {
      const scopes = normalizarScopesOauth(scopesTexto);
      const existeConfiguracionPropia = consulta.data?.origen === "tenant";
      if (
        !puedeGuardarOauth({
          clienteId,
          scopes,
          clienteSecreto,
          existeConfiguracionPropia,
        })
      ) {
        throw new Error(
          existeConfiguracionPropia
            ? "Ingresa el Client ID y al menos un scope OAuth"
            : "La primera configuración requiere Client ID, scopes y secreto",
        );
      }

      const configuracion = await guardarConfiguracionOauthTenant(
        organizacionId,
        tenant.id,
        {
          clienteId: clienteId.trim(),
          ...(clienteSecreto ? { clienteSecreto } : {}),
          scopes,
        },
      );
      setClienteSecreto("");

      if (conectar) {
        const retorno = `/admin/tenants/${organizacionId}`;
        const inicio = await iniciarVerificacionOauth(tenant.host, retorno);
        if (!inicio.exito || !inicio.datos?.url) {
          throw new Error(
            inicio.error?.mensaje ?? "No se pudo iniciar la verificación OAuth",
          );
        }
        window.location.href = inicio.datos.url;
      }
      return configuracion;
    },
    onSuccess: (_configuracion, conectar) => {
      setClienteSecreto("");
      queryClient.invalidateQueries({
        queryKey: ["admin-oauth-qlik", organizacionId, tenant.id],
      });
      if (!conectar) {
        mostrarExito("Configuración OAuth guardada");
      }
    },
    onError: (err: Error) => {
      mostrarError(err.message);
    },
  });

  const scopes = normalizarScopesOauth(scopesTexto);
  const existeConfiguracionPropia = consulta.data?.origen === "tenant";
  const habilitado = puedeGuardarOauth({
    clienteId,
    scopes,
    clienteSecreto,
    existeConfiguracionPropia,
  });

  return (
    <FormularioOauthTenant
      tenant={tenant}
      configuracion={consulta.data}
      cargando={consulta.isLoading}
      clienteId={clienteId}
      clienteSecreto={clienteSecreto}
      scopesTexto={scopesTexto}
      habilitado={habilitado}
      guardando={guardar.isPending}
      onClienteId={setClienteId}
      onClienteSecreto={setClienteSecreto}
      onScopesTexto={setScopesTexto}
      onGuardar={(conectar) => guardar.mutate(conectar)}
      onCopiar={async () => {
        const redirectUri = consulta.data?.redirectUri;
        if (!redirectUri) return;
        await navigator.clipboard.writeText(redirectUri);
        mostrarExito("URL de redirección copiada");
      }}
    />
  );
}
interface FormularioOauthTenantProps {
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
  onCopiar: () => void;
}

function FormularioOauthTenant({
  tenant,
  configuracion,
  cargando,
  clienteId,
  clienteSecreto,
  scopesTexto,
  habilitado,
  guardando,
  onClienteId,
  onClienteSecreto,
  onScopesTexto,
  onGuardar,
  onCopiar,
}: FormularioOauthTenantProps) {
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
        <div className="rounded-lg border border-line-200 bg-surface p-4">
          <h4 className="text-sm font-semibold text-ink-900">
            Instrucciones en Qlik Cloud
          </h4>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-xs leading-5 text-ink-600">
            <li>Abre Administration y entra en la sección OAuth.</li>
            <li>Crea un cliente nuevo de tipo Web.</li>
            <li>Copia exactamente la URL de redirección mostrada abajo.</li>
            <li>Agrega los scopes indicados en este formulario.</li>
            <li>Copia el Client ID y el secreto antes de cerrar Qlik.</li>
            <li>Guarda y conecta para comprobar la configuración real.</li>
          </ol>

          <label
            htmlFor={`oauth-redirect-${tenant.id}`}
            className="mt-4 block text-xs font-semibold text-ink-700"
          >
            URL de redirección
          </label>
          <div className="mt-1 flex gap-2">
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
              Copiar
            </Button>
          </div>
        </div>
        <div className="space-y-4">
          {configuracion?.origen === "entorno_global" && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
              Este tenant todavía usa las credenciales globales del servidor.
              Guarda una configuración propia para independizarlo.
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
          <div>
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
              className="mt-1 w-full rounded-md border border-line-200 bg-surface px-3 py-2 font-mono text-xs text-ink-900 focus:border-brand-600 focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-ink-500">
              Puedes separarlos por espacios, comas o líneas.
            </p>
          </div>

          {configuracion?.ultimoError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              Último error: {configuracion.ultimoError}
            </div>
          )}

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={!habilitado || guardando}
              onClick={() => onGuardar(false)}
            >
              Guardar configuración
            </Button>
            <Button
              type="button"
              disabled={!habilitado || guardando}
              onClick={() => onGuardar(true)}
              className="gap-1.5"
            >
              <Icon name="play" size="sm" />
              {guardando ? "Guardando…" : "Guardar y conectar con Qlik"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function EstadoOauth({
  configuracion,
  cargando,
}: {
  configuracion?: ConfiguracionOauthQlik;
  cargando: boolean;
}) {
  if (cargando) {
    return (
      <span className="rounded-full border border-line-200 bg-surface px-2.5 py-1 text-xs text-ink-500">
        Consultando…
      </span>
    );
  }

  const origen = configuracion?.origen ?? "sin_configurar";
  const estado = configuracion?.estado;
  const estilos =
    estado === "verificada"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : estado === "error"
        ? "border-red-200 bg-red-50 text-red-700"
        : origen === "entorno_global"
          ? "border-amber-200 bg-amber-50 text-amber-700"
          : "border-line-200 bg-surface text-ink-600";
  const texto =
    estado === "verificada"
      ? "Verificada"
      : estado === "error"
        ? "Con error"
        : estado === "pendiente"
          ? "Pendiente de verificar"
          : estado === "desactivada"
            ? "Desactivada"
            : origen === "entorno_global"
              ? "Configuración heredada"
              : "Sin configurar";

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${estilos}`}
    >
      {texto}
    </span>
  );
}
