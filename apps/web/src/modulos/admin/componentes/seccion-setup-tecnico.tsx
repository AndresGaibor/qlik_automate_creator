import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import { Button } from "@/compartido/componentes/ui/button";
import { ConfirmDialog } from "@/compartido/componentes/ui/confirm-dialog";
import { Icon } from "@/compartido/componentes/ui/icon";
import { SelectBuscable } from "@/compartido/componentes/ui/select-buscable";
import type { ResumenAutomatizacion } from "@qlik/contratos/automatizaciones";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
/**
 * SeccionSetupTecnico
 *
 * Accordion de 3 pasos para configurar un entorno de Qlik Cloud:
 *   Paso 1 — Conexión Qlik Cloud
 *   Paso 2 — Plantilla base (automatización molde)
 *   Paso 3 — Conexión Impala
 *
 * Reglas UX:
 * - El primer paso incompleto aparece expandido automáticamente.
 * - Los pasos completos muestran solo una fila resumen (colapsados).
 * - Cualquier paso puede abrirse manualmente haciendo clic.
 * - Los pasos sin prerequisito cumplido aparecen "atenuados" (no bloqueantes).
 */
import { useEffect, useState } from "react";
import {
  type ConfigurarImpalaTenant,
  type TenantQlik,
  configurarAutomatizacionBaseTenant,
  configurarImpalaTenant,
  listarAutomatizacionesParaAdmin,
} from "../api";

/* ─────────────────────────────────────────────
   Tipos / Props raíz
───────────────────────────────────────────── */
interface Props {
  tenant: { id: string };
  tenantsQlik: TenantQlik[];
  onCrearQlik: (params: { host: string; nombre?: string }) => void;
  onEliminarQlik: (id: string) => void;
  onHacerPrincipal: (id: string) => void;
  crear: { isPending: boolean };
  eliminar: { isPending: boolean };
  hacerPrincipal: { isPending: boolean };
}

/* ─────────────────────────────────────────────
   Componente de badge de estado
───────────────────────────────────────────── */
function Badge({
  listo,
  textoListo,
  textoPendiente,
}: {
  listo: boolean;
  textoListo: string;
  textoPendiente: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
        listo
          ? "bg-brand-50 text-brand-700 border border-brand-100"
          : "bg-amber-50 text-amber-700 border border-amber-200"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          listo ? "bg-brand-600" : "bg-amber-500 animate-pulse"
        }`}
      />
      {listo ? textoListo : textoPendiente}
    </span>
  );
}

/* ─────────────────────────────────────────────
   Wrapper de paso del accordion
───────────────────────────────────────────── */
function PasoAccordion({
  numero,
  titulo,
  descripcionCorta,
  tooltipInfo,
  listo,
  expandido,
  onToggle,
  resumen,
  children,
}: {
  numero: number;
  titulo: string;
  descripcionCorta: string;
  tooltipInfo: string;
  listo: boolean;
  expandido: boolean;
  onToggle: () => void;
  resumen?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [mostrandoTooltip, setMostrandoTooltip] = useState(false);

  return (
    <div
      className={`rounded-xl border transition-all duration-200 ${
        expandido ? "border-brand-200 shadow-sm" : "border-line-200"
      } bg-surface overflow-hidden`}
    >
      {/* Cabecera del paso (siempre visible) */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-hover transition-colors"
      >
        {/* Número / check */}
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
            listo
              ? "bg-brand-600 text-white"
              : expandido
                ? "bg-ink-900 text-white"
                : "bg-line-200 text-ink-500"
          }`}
        >
          {listo ? "✓" : numero}
        </div>

        {/* Título + descripción corta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-ink-900">{titulo}</span>
            <Badge
              listo={listo}
              textoListo="Configurado"
              textoPendiente="Pendiente"
            />

            {/* Tooltip info */}
            <button
              type="button"
              aria-label={`Más información sobre ${titulo}`}
              className="relative inline-flex"
              onMouseEnter={() => setMostrandoTooltip(true)}
              onMouseLeave={() => setMostrandoTooltip(false)}
              onFocus={() => setMostrandoTooltip(true)}
              onBlur={() => setMostrandoTooltip(false)}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-ink-300 hover:text-ink-500 cursor-default text-xs select-none">
                ⓘ
              </span>
              {mostrandoTooltip && (
                <div className="absolute left-6 top-0 z-20 w-64 rounded-lg border border-line-200 bg-surface shadow-panel p-3 text-xs text-ink-600 leading-relaxed">
                  {tooltipInfo}
                </div>
              )}
            </button>
          </div>

          {/* Resumen compacto cuando está colapsado y listo */}
          {!expandido && listo && resumen && (
            <div className="mt-0.5">{resumen}</div>
          )}
          {/* Descripción cuando está colapsado y pendiente */}
          {!expandido && !listo && (
            <p className="text-xs text-ink-400 mt-0.5 truncate">
              {descripcionCorta}
            </p>
          )}
        </div>

        {/* Chevron */}
        <Icon
          name="chev"
          size="sm"
          className={`shrink-0 text-ink-400 transition-transform duration-200 ${
            expandido ? "rotate-90" : "-rotate-90"
          }`}
        />
      </button>

      {/* Contenido expandible */}
      {expandido && (
        <div className="border-t border-line-200 px-5 py-5">{children}</div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   PASO 1 — Conexión Qlik Cloud
───────────────────────────────────────────── */
function PasoQlikCloud({
  tenant,
  tenantsQlik,
  onCrearQlik,
  onEliminarQlik,
  onHacerPrincipal,
  crear,
  eliminar,
  hacerPrincipal,
}: {
  tenant: { id: string };
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
      {/* Formulario agregar */}
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

      {/* Lista de entornos */}
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

/* ─────────────────────────────────────────────
   PASO 2 — Plantilla base (por entorno Qlik)
───────────────────────────────────────────── */
function PasoPlantillaBase({
  organizacionId,
  tenantsQlik,
}: {
  organizacionId: string;
  tenantsQlik: TenantQlik[];
}) {
  const { mostrarExito, mostrarError } = useNotificaciones();
  const queryClient = useQueryClient();

  const { data: automatizaciones = [], isLoading } = useQuery<
    ResumenAutomatizacion[]
  >({
    queryKey: ["automatizaciones-admin-list"],
    queryFn: listarAutomatizacionesParaAdmin,
  });

  const guardar = useMutation({
    mutationFn: ({
      tenantQlikId,
      auto,
    }: {
      tenantQlikId: string;
      auto: ResumenAutomatizacion;
    }) =>
      configurarAutomatizacionBaseTenant(
        organizacionId,
        tenantQlikId,
        auto.id,
        auto.nombre,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-tenants-qlik", organizacionId],
      });
      mostrarExito("Plantilla base actualizada correctamente");
    },
    onError: (err: Error) => mostrarError(err.message),
  });

  const opciones = automatizaciones.map((a) => ({
    id: a.id,
    nombre: a.nombre,
    espacioNombre: a.espacioNombre || "Personal",
  }));

  return (
    <div className="space-y-4">
      {tenantsQlik.map((tQlik) => (
        <div
          key={tQlik.id}
          className="rounded-lg border border-line-200 bg-app/30 p-4 space-y-3"
        >
          {/* Cabecera del entorno */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">
              Entorno:
            </span>
            <span className="font-semibold text-ink-900 text-sm">
              {tQlik.nombre || tQlik.host}
            </span>
            <span className="font-mono text-xs text-ink-400">
              {tQlik.nombre ? `· ${tQlik.host}` : ""}
            </span>
          </div>

          {/* Plantilla activa */}
          {tQlik.automatizacionBaseNombre && (
            <div className="flex items-center gap-2 rounded-md border border-brand-100 bg-brand-50/50 px-3 py-2">
              <Icon name="star" size="sm" className="text-brand-600 shrink-0" />
              <div className="min-w-0">
                <span className="text-xs text-ink-500">Plantilla activa: </span>
                <span className="font-semibold text-brand-800 text-sm truncate">
                  {tQlik.automatizacionBaseNombre}
                </span>
              </div>
            </div>
          )}

          {/* Select */}
          <SelectBuscable
            placeholder={
              tQlik.automatizacionBaseNombre
                ? "Seleccionar otra plantilla…"
                : "Busca y selecciona la automatización molde…"
            }
            searchPlaceholder="Filtra por nombre…"
            emptyText="No encontramos automatizaciones en este entorno."
            opciones={opciones}
            valorSeleccionado={tQlik.automatizacionBaseIdQlik || ""}
            onSeleccionar={(id) => {
              const auto = automatizaciones.find((a) => a.id === id);
              if (auto) guardar.mutate({ tenantQlikId: tQlik.id, auto });
            }}
            cargando={isLoading}
          />
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   PASO 3 — Conexión Impala (por entorno Qlik)
───────────────────────────────────────────── */
function PasoImpala({
  organizacionId,
  tenantsQlik,
}: {
  organizacionId: string;
  tenantsQlik: TenantQlik[];
}) {
  return (
    <div className="space-y-6">
      {tenantsQlik.map((tQlik) => (
        <ImpalaPorEntorno
          key={tQlik.id}
          organizacionId={organizacionId}
          tenantQlik={tQlik}
        />
      ))}
    </div>
  );
}

function ImpalaPorEntorno({
  organizacionId,
  tenantQlik,
}: {
  organizacionId: string;
  tenantQlik: TenantQlik;
}) {
  const { mostrarExito, mostrarError } = useNotificaciones();
  const queryClient = useQueryClient();

  const [host, setHost] = useState(tenantQlik.impalaHost || "");
  const [port, setPort] = useState(tenantQlik.impalaPort || 21050);
  const [authMechanism, setAuthMechanism] = useState<
    NonNullable<ConfigurarImpalaTenant["impalaAuthMechanism"]>
  >(
    (tenantQlik.impalaAuthMechanism as NonNullable<
      ConfigurarImpalaTenant["impalaAuthMechanism"]
    >) || "NOSASL",
  );
  const [user, setUser] = useState(tenantQlik.impalaUser || "");
  const [password, setPassword] = useState("");
  const [database, setDatabase] = useState(
    tenantQlik.impalaDatabase || "default",
  );

  const guardar = useMutation({
    mutationFn: () =>
      configurarImpalaTenant(organizacionId, tenantQlik.id, {
        impalaHost: host.trim(),
        impalaPort: Number(port),
        impalaAuthMechanism: authMechanism,
        impalaUser: user.trim() || undefined,
        impalaPassword: password.trim() || undefined,
        impalaDatabase: database.trim() || "default",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-tenants-qlik", organizacionId],
      });
      mostrarExito("Conexión Impala guardada correctamente");
    },
    onError: (err: Error) => mostrarError(err.message),
  });

  const necesitaCredenciales =
    authMechanism === "PLAIN" || authMechanism === "LDAP";

  return (
    <div className="rounded-lg border border-line-200 bg-app/30 p-4 space-y-4">
      {/* Cabecera del entorno */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">
            Entorno:
          </span>
          <span className="font-semibold text-ink-900 text-sm">
            {tenantQlik.nombre || tenantQlik.host}
          </span>
        </div>
        {tenantQlik.impalaHost && (
          <span className="inline-flex items-center gap-1.5 text-xs text-obj-700 bg-obj-50 border border-obj-100 rounded-full px-2.5 py-0.5 font-mono font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-obj-600 animate-pulse" />
            {tenantQlik.impalaHost}:{tenantQlik.impalaPort || 21050}
          </span>
        )}
      </div>

      {/* Campos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="setup-impala-host"
            className="block text-xs font-semibold text-ink-700 mb-1.5"
          >
            Host o IP <span className="text-danger-600">*</span>
          </label>
          <input
            id="setup-impala-host"
            type="text"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            placeholder="ej: impala.empresa.com"
            className="w-full px-3 py-2 text-sm border border-line-200 rounded-md bg-surface text-ink-900 focus:border-brand-600 focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="setup-impala-puerto"
            className="block text-xs font-semibold text-ink-700 mb-1.5"
          >
            Puerto
          </label>
          <input
            id="setup-impala-puerto"
            type="number"
            value={port}
            onChange={(e) => setPort(Number(e.target.value))}
            className="w-full px-3 py-2 text-sm border border-line-200 rounded-md bg-surface text-ink-900 focus:border-brand-600 focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="setup-impala-base-datos"
            className="block text-xs font-semibold text-ink-700 mb-1.5"
          >
            Base de datos
          </label>
          <input
            id="setup-impala-base-datos"
            type="text"
            value={database}
            onChange={(e) => setDatabase(e.target.value)}
            placeholder="default"
            className="w-full px-3 py-2 text-sm border border-line-200 rounded-md bg-surface text-ink-900 focus:border-brand-600 focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="setup-impala-autenticacion"
            className="block text-xs font-semibold text-ink-700 mb-1.5"
          >
            Autenticación
          </label>
          <select
            id="setup-impala-autenticacion"
            value={authMechanism}
            onChange={(e) =>
              setAuthMechanism(
                e.target.value as NonNullable<
                  ConfigurarImpalaTenant["impalaAuthMechanism"]
                >,
              )
            }
            className="w-full px-3 py-2 text-sm border border-line-200 rounded-md bg-surface text-ink-900 focus:border-brand-600 focus:outline-none"
          >
            <option value="NOSASL">Sin autenticación</option>
            <option value="PLAIN">Usuario / Contraseña</option>
            <option value="LDAP">LDAP</option>
            <option value="KERBEROS">Kerberos</option>
          </select>
        </div>

        {necesitaCredenciales && (
          <>
            <div>
              <label
                htmlFor="setup-impala-usuario"
                className="block text-xs font-semibold text-ink-700 mb-1.5"
              >
                Usuario
              </label>
              <input
                id="setup-impala-usuario"
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="impala_user"
                className="w-full px-3 py-2 text-sm border border-line-200 rounded-md bg-surface text-ink-900 focus:border-brand-600 focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="setup-impala-contrasena"
                className="block text-xs font-semibold text-ink-700 mb-1.5"
              >
                Contraseña
              </label>
              <input
                id="setup-impala-contrasena"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={
                  tenantQlik.tieneImpalaPassword
                    ? `Conservada como ${tenantQlik.impalaPasswordMascara}; deja vacío para mantenerla`
                    : "Contraseña de Impala"
                }
                className="w-full px-3 py-2 text-sm border border-line-200 rounded-md bg-surface text-ink-900 focus:border-brand-600 focus:outline-none"
              />
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end pt-1">
        <Button
          size="sm"
          disabled={!host.trim() || guardar.isPending}
          onClick={() => guardar.mutate()}
          className="gap-1.5"
        >
          <Icon name="check" size="sm" />
          {guardar.isPending ? "Guardando…" : "Guardar conexión Impala"}
        </Button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   COMPONENTE RAÍZ — SeccionSetupTecnico
───────────────────────────────────────────── */
export function SeccionSetupTecnico({
  tenant,
  tenantsQlik,
  onCrearQlik,
  onEliminarQlik,
  onHacerPrincipal,
  crear,
  eliminar,
  hacerPrincipal,
}: Props) {
  const tieneQlik = tenantsQlik.length > 0;
  const tienePlantilla = tenantsQlik.some((t) => !!t.automatizacionBaseIdQlik);
  const tieneImpala = tenantsQlik.some((t) => !!t.impalaHost);

  // Determina qué paso abrir automáticamente al montar
  const primerPasoAbierto = !tieneQlik
    ? 0
    : !tienePlantilla
      ? 1
      : !tieneImpala
        ? 2
        : -1;
  const [pasoAbierto, setPasoAbierto] = useState<number>(primerPasoAbierto);

  const toggle = (i: number) => setPasoAbierto((prev) => (prev === i ? -1 : i));

  const pasos = [
    {
      titulo: "Conexión Qlik Cloud",
      descripcionCorta:
        "Vincula al menos un entorno Qlik Cloud a esta organización.",
      tooltipInfo:
        "El host es la dirección web de tu entorno Qlik Cloud (ej: miempresa.us.qlikcloud.com). Puedes conectar múltiples entornos a la misma organización.",
      listo: tieneQlik,
      resumen: tieneQlik ? (
        <p className="text-xs text-ink-500 truncate">
          {tenantsQlik.length === 1
            ? tenantsQlik[0].nombre || tenantsQlik[0].host
            : `${tenantsQlik.length} entornos conectados`}
        </p>
      ) : null,
      contenido: (
        <PasoQlikCloud
          tenant={tenant}
          tenantsQlik={tenantsQlik}
          onCrearQlik={onCrearQlik}
          onEliminarQlik={onEliminarQlik}
          onHacerPrincipal={onHacerPrincipal}
          crear={crear}
          eliminar={eliminar}
          hacerPrincipal={hacerPrincipal}
        />
      ),
    },
    {
      titulo: "Plantilla base",
      descripcionCorta:
        "Designa la automatización de Qlik que servirá como molde para crear nuevas automatizaciones.",
      tooltipInfo:
        "La plantilla base es una automatización existente en Qlik Automate. Cuando un usuario crea una nueva automatización, el sistema clona esta plantilla automáticamente y la personaliza. Los usuarios finales nunca la ven.",
      listo: tienePlantilla,
      resumen: tienePlantilla ? (
        <p className="text-xs text-ink-500 truncate">
          {
            tenantsQlik.find((t) => t.automatizacionBaseNombre)
              ?.automatizacionBaseNombre
          }
        </p>
      ) : null,
      contenido: tieneQlik ? (
        <PasoPlantillaBase
          organizacionId={tenant.id}
          tenantsQlik={tenantsQlik}
        />
      ) : (
        <p className="text-sm text-ink-400 py-2">
          Primero conecta un entorno Qlik Cloud en el paso anterior.
        </p>
      ),
    },
    {
      titulo: "Conexión Impala",
      descripcionCorta:
        "Configura el acceso al servidor Impala para que los usuarios puedan seleccionar tablas de destino.",
      tooltipInfo:
        "La conexión a Impala permite que los usuarios elijan tablas de datos al crear automatizaciones. Sin esto, no podrán seleccionar a qué tabla escribir los datos.",
      listo: tieneImpala,
      resumen: tieneImpala ? (
        <p className="text-xs text-ink-500 font-mono truncate">
          {tenantsQlik.find((t) => t.impalaHost)?.impalaHost}
        </p>
      ) : null,
      contenido: tieneQlik ? (
        <PasoImpala organizacionId={tenant.id} tenantsQlik={tenantsQlik} />
      ) : (
        <p className="text-sm text-ink-400 py-2">
          Primero conecta un entorno Qlik Cloud en el paso 1.
        </p>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      {/* Banner de estado global */}
      {tieneQlik && tienePlantilla && tieneImpala ? (
        <div className="flex items-center gap-3 rounded-xl border border-brand-200 bg-brand-50/60 px-4 py-3 mb-4">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white text-sm font-bold">
            ✓
          </span>
          <div>
            <p className="text-sm font-semibold text-brand-900">
              Configuración técnica completa
            </p>
            <p className="text-xs text-brand-700">
              Los usuarios pueden crear automatizaciones en este entorno.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/50 px-4 py-3 mb-4">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-xs font-bold mt-0.5">
            !
          </span>
          <div>
            <p className="text-sm font-semibold text-amber-900">
              Completa los{" "}
              {3 -
                [tieneQlik, tienePlantilla, tieneImpala].filter(Boolean)
                  .length}{" "}
              pasos pendientes
            </p>
            <p className="text-xs text-amber-700">
              Los usuarios no podrán crear automatizaciones hasta que todo esté
              configurado.
            </p>
          </div>
        </div>
      )}

      {/* Accordion de pasos */}
      {pasos.map((paso, i) => (
        <PasoAccordion
          key={paso.titulo}
          numero={i + 1}
          titulo={paso.titulo}
          descripcionCorta={paso.descripcionCorta}
          tooltipInfo={paso.tooltipInfo}
          listo={paso.listo}
          expandido={pasoAbierto === i}
          onToggle={() => toggle(i)}
          resumen={paso.resumen}
        >
          {paso.contenido}
        </PasoAccordion>
      ))}
    </div>
  );
}
