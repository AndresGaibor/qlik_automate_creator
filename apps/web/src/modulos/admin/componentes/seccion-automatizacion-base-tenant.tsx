import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/compartido/componentes/ui/card";
import { Icon } from "@/compartido/componentes/ui/icon";
import type { TenantQlik } from "@/modulos/admin/api";
import { SeccionConfigurarAutomatizacionBase } from "./seccion-configurar-automatizacion-base";
import { SeccionConfigurarImpalaTenant } from "./seccion-configurar-impala-tenant";

interface Props {
  organizacionId: string;
  tenantsQlik: TenantQlik[];
}

function EstadoPaso({
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
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
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

export function SeccionAutomatizacionBaseTenant({
  organizacionId,
  tenantsQlik,
}: Props) {
  if (tenantsQlik.length === 0) return null;

  return (
    <Card className="border-line-200 bg-surface shadow-card">
      <CardHeader className="border-b border-line-200 bg-app/30 pb-4">
        <CardTitle className="font-display text-lg font-semibold text-ink-900 flex items-center gap-2">
          <Icon name="robot" className="text-brand-600" />
          Configuración técnica del entorno
        </CardTitle>
        <p className="text-xs text-ink-500 mt-1">
          Para que los usuarios puedan crear automatizaciones, cada entorno Qlik
          necesita dos cosas: una <strong>plantilla base</strong> y una{" "}
          <strong>conexión a Impala</strong>.
        </p>
      </CardHeader>

      {/* Caja azul explicativa de plantilla base */}
      <div className="mx-6 mt-5 rounded-xl border border-brand-100 bg-brand-50/60 p-4 flex gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700 text-base">
          <Icon name="sparkles" className="h-4 w-4 text-brand-700" />
        </div>
        <div>
          <p className="text-sm font-semibold text-brand-900">
            ¿Qué es la plantilla base?
          </p>
          <p className="mt-1 text-xs text-brand-800 leading-relaxed">
            Es una automatización en Qlik Cloud que actúa como molde. Cuando un
            usuario crea una nueva automatización, el sistema la{" "}
            <strong>clona automáticamente</strong> y la personaliza con el
            Dataflow y la tabla Impala que eligió. Los usuarios finales nunca la
            ven directamente.
          </p>
          <p className="mt-1.5 text-xs text-amber-700 font-medium flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500" />
            Sin ella configurada, los usuarios no podrán crear automatizaciones.
          </p>
        </div>
      </div>

      <CardContent className="pt-6 space-y-6">
        {tenantsQlik.map((tQlik, idx) => {
          const tienePlantilla = !!tQlik.automatizacionBaseIdQlik;
          const tieneImpala = !!tQlik.impalaHost;
          const todoListo = tienePlantilla && tieneImpala;

          return (
            <div
              key={tQlik.id}
              className="rounded-xl border border-line-200 bg-surface overflow-hidden"
            >
              {/* Cabecera del entorno Qlik */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-200 bg-app/40 px-5 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-obj-100 text-obj-700 font-bold text-sm">
                    Q{idx + 1}
                  </div>
                  <div className="min-w-0">
                    <span className="font-semibold text-ink-900 text-sm block truncate">
                      {tQlik.nombre || "Entorno Qlik Cloud"}
                    </span>
                    <span className="font-mono text-xs text-ink-500 block truncate">
                      {tQlik.host}
                    </span>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                    todoListo
                      ? "bg-brand-50 text-brand-700 border border-brand-100"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      todoListo ? "bg-brand-600" : "bg-amber-500 animate-pulse"
                    }`}
                  />
                  {todoListo ? "Listo para usar" : "Requiere configuración"}
                </span>
              </div>

              {/* Grid de dos columnas — siempre visibles */}
              <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-line-200">
                {/* ── PASO 1: Plantilla base ── */}
                <div className="p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        tienePlantilla
                          ? "bg-brand-600 text-white"
                          : "bg-amber-400 text-white"
                      }`}
                    >
                      {tienePlantilla ? "✓" : "1"}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-ink-900 text-sm">
                        Plantilla base
                      </span>
                      <EstadoPaso
                        listo={tienePlantilla}
                        textoListo="Configurada"
                        textoPendiente="Pendiente"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-ink-500 leading-relaxed">
                    Selecciona la automatización de Qlik Automate que servirá
                    como molde. Debe existir previamente en tu entorno Qlik.
                  </p>

                  {/* Plantilla actualmente configurada */}
                  {tQlik.automatizacionBaseNombre && (
                    <div className="rounded-lg border border-brand-100 bg-brand-50/40 p-3 flex items-start gap-2">
                      <Icon
                        name="star"
                        size="sm"
                        className="text-brand-600 mt-0.5 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-xs text-ink-500 block">
                          Plantilla activa:
                        </span>
                        <span className="font-bold text-brand-800 text-sm block truncate">
                          {tQlik.automatizacionBaseNombre}
                        </span>
                        <span className="text-ink-400 font-mono text-[10px] block mt-0.5 truncate">
                          ID: {tQlik.automatizacionBaseIdQlik}
                        </span>
                      </div>
                    </div>
                  )}

                  <SeccionConfigurarAutomatizacionBase
                    organizacionId={organizacionId}
                    tenantQlik={tQlik}
                  />
                </div>

                {/* ── PASO 2: Conexión Impala ── */}
                <div className="p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        tieneImpala
                          ? "bg-brand-600 text-white"
                          : "bg-amber-400 text-white"
                      }`}
                    >
                      {tieneImpala ? "✓" : "2"}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-ink-900 text-sm">
                        Conexión a Impala
                      </span>
                      <EstadoPaso
                        listo={tieneImpala}
                        textoListo="Conectado"
                        textoPendiente="Sin configurar"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-ink-500 leading-relaxed">
                    La app necesita acceder a Impala para que los usuarios
                    puedan elegir tablas de destino al crear automatizaciones.
                  </p>

                  {tieneImpala && (
                    <div className="rounded-lg border border-obj-100 bg-obj-50/40 p-3 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-obj-600 animate-pulse shrink-0" />
                      <span className="font-mono text-xs text-obj-700 font-medium truncate">
                        {tQlik.impalaHost}:{tQlik.impalaPort || 21050}
                      </span>
                      {tQlik.impalaDatabase && (
                        <span className="text-xs text-ink-400 truncate">
                          · base: <strong>{tQlik.impalaDatabase}</strong>
                        </span>
                      )}
                    </div>
                  )}

                  <SeccionConfigurarImpalaTenant
                    organizacionId={organizacionId}
                    tenantQlik={tQlik}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
