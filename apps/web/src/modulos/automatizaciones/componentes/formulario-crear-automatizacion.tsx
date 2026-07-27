import { Button } from "@/compartido/componentes/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/compartido/componentes/ui/card";
import { Icon } from "@/compartido/componentes/ui/icon";
import { SelectBuscable } from "@/compartido/componentes/ui/select-buscable";
import type {
  ConfiguracionTenant,
  TablaImpala,
} from "@/modulos/automatizaciones/api";
import type { ResumenFlujo } from "@qlik/contratos";
import { Link } from "@tanstack/react-router";
import type { FormEvent } from "react";

import type { ResumenAutomatizacion } from "@qlik/contratos/automatizaciones";

interface Props {
  flujoId: string;
  setFlujoId: (v: string) => void;
  tablaId: string;
  setTablaId: (v: string) => void;
  nombre: string;
  setNombre: (v: string) => void;
  flujos: ResumenFlujo[];
  tablas: TablaImpala[];
  automatizaciones?: ResumenAutomatizacion[];
  espacioId?: string;
  isLoadingFlujos: boolean;
  isLoadingTablas: boolean;
  onCrear: () => void;
  isCreating: boolean;
  puedeCrear: boolean;
  configTenant: ConfiguracionTenant | undefined;
}

export function FormularioCrearAutomatizacion({
  flujoId,
  setFlujoId,
  tablaId,
  setTablaId,
  nombre,
  setNombre,
  flujos,
  tablas,
  automatizaciones = [],
  espacioId,
  isLoadingFlujos,
  isLoadingTablas,
  onCrear,
  isCreating,
  puedeCrear,
  configTenant,
}: Props) {
  const opcionesFlujos = flujos.map((f) => {
    const autoVinculada = automatizaciones.find(
      (a) =>
        a.nombre.toLowerCase().includes(f.nombre.toLowerCase()) ||
        a.nombre.includes(f.id),
    );
    return {
      id: f.id,
      nombre: f.nombre,
      espacioNombre: f.espacioNombre || "Espacio Personal",
      badgeAviso: autoVinculada
        ? `⚠️ Este Dataflow ya se usa en: "${autoVinculada.nombre.slice(0, 25)}"`
        : undefined,
    };
  });

  const opcionesTablas = tablas.map((t) => {
    const autoVinculada = automatizaciones.find((a) =>
      a.nombre.toLowerCase().includes(t.nombre.toLowerCase()),
    );
    return {
      id: t.nombre,
      nombre: t.nombre,
      espacioNombre: "Impala",
      badgeAviso: autoVinculada
        ? `⚠️ Esta tabla ya se usa en: "${autoVinculada.nombre.slice(0, 25)}"`
        : undefined,
    };
  });

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    onCrear();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Enlace Volver */}
      <div>
        <Link
          to="/automatizaciones"
          className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 transition-colors font-medium"
        >
          <Icon name="chev" size="sm" className="rotate-180" />
          Volver a automatizaciones (Qlik Automate)
        </Link>
      </div>

      <div>
        <h2 className="font-display text-2xl font-semibold text-ink-900 tracking-tight">
          Crear automatización en Qlik Automate
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          Elige el Dataflow de Qlik del que vienen tus datos y la tabla en
          Impala a la que quieres que lleguen. Nosotros configuramos el resto
          por ti.
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs text-brand-700 bg-brand-50 border border-brand-100 rounded-lg px-3.5 py-2.5 font-medium shadow-sm">
        <Icon name="check" size="sm" className="text-brand-600 shrink-0" />
        <span>
          Plantilla base:{" "}
          <strong className="font-semibold text-brand-900">
            {configTenant?.automatizacionBaseNombre ??
              configTenant?.automatizacionBaseIdQlik ??
              "Configurada por el administrador"}
          </strong>
        </span>
        {espacioId && (
          <>
            <span className="text-brand-300">·</span>
            <span>
              Espacio destino: <strong>{espacioId}</strong>
            </span>
          </>
        )}
      </div>

      <Card className="border-line-200 bg-surface shadow-card">
        <CardHeader className="border-b border-line-200 bg-app/30 pb-4">
          <CardTitle className="font-display text-lg font-semibold text-ink-900 flex items-center gap-2">
            <Icon name="zap" className="text-brand-600" />
            Configura tu automatización
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form className="space-y-6" onSubmit={enviar}>
            <SelectBuscable
              etiqueta="1. Dataflow de origen (Qlik Cloud)"
              placeholder="Elige un Dataflow de Qlik Cloud..."
              searchPlaceholder="Busca por nombre o espacio…"
              emptyText="No encontramos flujos con ese nombre. Verifica el nombre e inténtalo de nuevo."
              opciones={opcionesFlujos}
              valorSeleccionado={flujoId}
              onSeleccionar={setFlujoId}
              cargando={isLoadingFlujos}
            />

            <div>
              <SelectBuscable
                etiqueta="2. Tabla destino (Impala)"
                placeholder="Elige dónde guardar el resultado en Impala..."
                searchPlaceholder="Busca la tabla por nombre…"
                emptyText="No se encontraron tablas. Verifica que la conexión a Impala esté configurada correctamente."
                opciones={opcionesTablas}
                valorSeleccionado={tablaId}
                onSeleccionar={setTablaId}
                cargando={isLoadingTablas}
              />
            </div>

            <div>
              <label
                htmlFor="nombre-automatizacion"
                className="block text-sm font-semibold text-ink-900 mb-1.5"
              >
                3. Ponle un nombre a tu automatización
              </label>
              <input
                id="nombre-automatizacion"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Dataflow Ventas hacia tabla_ventas_diarias"
                className="w-full px-3.5 py-2.5 text-sm border border-line-200 rounded-md bg-surface text-ink-900 focus:border-brand-600 focus:outline-none shadow-card"
                required
              />
              <p className="mt-1.5 text-xs text-ink-400">
                Se sugiere automáticamente al elegir el flujo y la tabla. Puedes
                cambiarlo si lo deseas.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-line-200">
              <Link to="/automatizaciones">
                <Button type="button" variant="outline" disabled={isCreating}>
                  Cancelar
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={!puedeCrear || isCreating}
                className="gap-2"
              >
                {isCreating ? (
                  <>
                    <span className="h-3.5 w-3.5 rounded-full border-2 border-surface border-t-transparent animate-spin" />
                    Creando en Qlik Cloud…
                  </>
                ) : (
                  <>
                    <Icon name="sparkles" size="sm" />
                    Crear automatización
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
