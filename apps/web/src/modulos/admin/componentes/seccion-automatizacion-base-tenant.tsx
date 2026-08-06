import { Button } from "@/compartido/componentes/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/compartido/componentes/ui/card";
import { Icon } from "@/compartido/componentes/ui/icon";
import type { TenantQlik } from "@/modulos/admin/api";
import { obtenerConexionesDestino } from "@/modulos/automatizaciones/publico";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  nombreVisibleEntornoQlik,
  normalizarHostQlik,
} from "../utiles-presentacion-qlik";
import { SeccionConfigurarAutomatizacionBase } from "./seccion-configurar-automatizacion-base";
import { SeccionConfigurarDestinosTenant } from "./seccion-configurar-destinos-tenant";

interface Props {
  organizacionId: string;
  tenantsQlik: TenantQlik[];
}

export function SeccionAutomatizacionBaseTenant({
  organizacionId,
  tenantsQlik,
}: Props) {
  const { data: conexionesDestino = [] } = useQuery({
    queryKey: ["destinos-conexiones"],
    queryFn: obtenerConexionesDestino,
    retry: false,
  });

  if (tenantsQlik.length === 0) return null;

  return (
    <Card className="border-line-200 bg-surface shadow-card">
      <CardHeader className="border-b border-line-200 bg-app/30 pb-4">
        <CardTitle className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
          <Icon name="robot" className="text-brand-600" />
          Plantilla y destinos
        </CardTitle>
        <p className="mt-1 text-xs text-ink-500">
          Define qué automatización se clonará en cada modo y dónde se
          escribirán los resultados.
        </p>
      </CardHeader>
      <CardContent className="space-y-4 p-4 sm:p-5">
        {tenantsQlik.map((tenantQlik) => (
          <ConfiguracionTecnicaPorEntorno
            key={tenantQlik.id}
            organizacionId={organizacionId}
            tenantQlik={tenantQlik}
            cantidadDestinos={conexionesDestino.length}
          />
        ))}
      </CardContent>
    </Card>
  );
}

function ConfiguracionTecnicaPorEntorno({
  organizacionId,
  tenantQlik,
  cantidadDestinos,
}: {
  organizacionId: string;
  tenantQlik: TenantQlik;
  cantidadDestinos: number;
}) {
  const tienePlantilla = Boolean(
    tenantQlik.automatizacionPlantillaModo1IdQlik ||
      tenantQlik.automatizacionBaseIdQlik ||
      tenantQlik.automatizacionPlantillaModo2IdQlik,
  );
  const tieneDestino = cantidadDestinos > 0 || Boolean(tenantQlik.impalaHost);
  const lista = tienePlantilla && tieneDestino;
  const [forzarEdicion, setForzarEdicion] = useState(false);
  const mostrarEditor = !lista || forzarEdicion;
  const nombreEntorno = nombreVisibleEntornoQlik(tenantQlik);
  const hostVisible = normalizarHostQlik(tenantQlik.host);
  const plantillaModo1 =
    tenantQlik.automatizacionPlantillaModo1Nombre ||
    tenantQlik.automatizacionBaseNombre ||
    "Sin configurar";
  const plantillaModo2 =
    tenantQlik.automatizacionPlantillaModo2Nombre || "Sin configurar";
  const cantidadVisible =
    cantidadDestinos > 0
      ? `${cantidadDestinos} ${cantidadDestinos === 1 ? "conexión" : "conexiones"}`
      : tenantQlik.impalaHost
        ? "Impala configurado"
        : "Sin destinos";

  if (!mostrarEditor) {
    return (
      <article className="rounded-xl border border-line-200 bg-app/20 p-4 sm:p-5">
        <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(220px,0.8fr)_minmax(0,1.8fr)_auto] xl:items-center">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                <Icon name="robot" size="sm" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink-900">
                  {nombreEntorno}
                </p>
                <p className="truncate font-mono text-xs text-ink-500">
                  {hostVisible}
                </p>
              </div>
            </div>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-brand-100 bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
              <Icon name="check" size="sm" />
              Listo para crear automatizaciones
            </span>
          </div>

          <div className="grid min-w-0 gap-3 sm:grid-cols-3">
            <DatoResumen
              etiqueta="Modo 1 · Spark/Python"
              valor={plantillaModo1}
              configurado={plantillaModo1 !== "Sin configurar"}
            />
            <DatoResumen
              etiqueta="Modo 2 · SFTP/Talend"
              valor={plantillaModo2}
              configurado={plantillaModo2 !== "Sin configurar"}
            />
            <DatoResumen
              etiqueta="Destinos"
              valor={cantidadVisible}
              configurado={tieneDestino}
            />
          </div>

          <Button
            type="button"
            size="sm"
            variant="outline"
            className="w-full shrink-0 gap-1.5 xl:w-auto"
            onClick={() => setForzarEdicion(true)}
          >
            <Icon name="edit" size="sm" />
            Gestionar plantillas y destinos
          </Button>
        </div>
      </article>
    );
  }

  return (
    <article className="rounded-xl border border-line-200 bg-surface">
      <div className="flex flex-col gap-3 rounded-t-xl border-b border-line-200 bg-app/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700">
            <Icon name="robot" size="sm" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink-900">
              {nombreEntorno}
            </p>
            <p className="truncate font-mono text-xs text-ink-500">
              {hostVisible}
            </p>
          </div>
          <EstadoGeneral listo={lista} />
        </div>
        {lista && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="gap-1.5"
            onClick={() => setForzarEdicion(false)}
          >
            <Icon name="x" size="sm" />
            Cerrar edición
          </Button>
        )}
      </div>

      {!lista && (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
          Completa los elementos pendientes para habilitar la creación de
          automatizaciones.
        </div>
      )}

      <div className="space-y-4 rounded-b-xl bg-app/15 p-4 sm:p-5">
        <section className="rounded-xl border border-line-200 bg-surface">
          <div className="rounded-t-xl border-b border-line-200 bg-app/30 px-4 py-3 sm:px-5">
            <CabeceraBloque
              numero="1"
              titulo="Plantillas por modo"
              lista={tienePlantilla}
              descripcion="Elige el molde específico para procesos Spark/Python y para procesos SFTP/Talend."
            />
          </div>
          <div className="p-4 sm:p-5">
            <SeccionConfigurarAutomatizacionBase
              organizacionId={organizacionId}
              tenantQlik={tenantQlik}
            />
          </div>
        </section>

        <section className="rounded-xl border border-line-200 bg-surface">
          <div className="rounded-t-xl border-b border-line-200 bg-app/30 px-4 py-3 sm:px-5">
            <CabeceraBloque
              numero="2"
              titulo="Conexiones de destino"
              lista={tieneDestino}
              descripcion="Administra los recursos donde las automatizaciones escribirán sus resultados."
            />
          </div>
          <div className="p-4 sm:p-5">
            <SeccionConfigurarDestinosTenant
              organizacionId={organizacionId}
              tenantQlik={tenantQlik}
              cantidadExistentes={cantidadDestinos}
            />
          </div>
        </section>
      </div>
    </article>
  );
}

function EstadoGeneral({ listo }: { listo: boolean }) {
  return (
    <span
      className={`hidden shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold sm:inline-flex ${
        listo
          ? "border-brand-100 bg-brand-50 text-brand-700"
          : "border-amber-200 bg-amber-50 text-amber-700"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${listo ? "bg-brand-600" : "bg-amber-500"}`}
      />
      {listo ? "Configuración lista" : "Requiere atención"}
    </span>
  );
}

function DatoResumen({
  etiqueta,
  valor,
  configurado,
}: {
  etiqueta: string;
  valor: string;
  configurado: boolean;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-line-200 bg-surface px-3.5 py-3">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-ink-400">
          {etiqueta}
        </p>
        <span
          className={`h-2 w-2 shrink-0 rounded-full ${configurado ? "bg-brand-600" : "bg-amber-500"}`}
          aria-label={configurado ? "Configurado" : "Pendiente"}
        />
      </div>
      <p
        className={`mt-1.5 text-sm font-semibold leading-5 ${
          configurado ? "text-ink-800" : "text-amber-700"
        }`}
        title={valor}
      >
        {valor}
      </p>
    </div>
  );
}

function CabeceraBloque({
  numero,
  titulo,
  lista,
  descripcion,
}: {
  numero: string;
  titulo: string;
  lista: boolean;
  descripcion: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
          lista ? "bg-brand-600 text-white" : "bg-amber-400 text-white"
        }`}
      >
        {lista ? <Icon name="check" size="sm" /> : numero}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-ink-900">{titulo}</h3>
          <span
            className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
              lista
                ? "border-brand-100 bg-brand-50 text-brand-700"
                : "border-amber-200 bg-amber-50 text-amber-700"
            }`}
          >
            {lista ? "Listo" : "Pendiente"}
          </span>
        </div>
        <p className="mt-1 text-xs leading-5 text-ink-500">{descripcion}</p>
      </div>
    </div>
  );
}
