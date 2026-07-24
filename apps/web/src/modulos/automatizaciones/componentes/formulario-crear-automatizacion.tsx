import { Button } from "@/compartido/componentes/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/compartido/componentes/ui/card";
import { SelectBuscable } from "@/compartido/componentes/ui/select-buscable";
import type { ConfiguracionTenant, TablaImpala } from "@/modulos/automatizaciones/api";
import type { ResumenFlujo } from "@qlik/contratos";
import { type FormEvent } from "react";

interface Props {
  flujoId: string;
  setFlujoId: (v: string) => void;
  tablaId: string;
  setTablaId: (v: string) => void;
  nombre: string;
  setNombre: (v: string) => void;
  flujos: ResumenFlujo[];
  tablas: TablaImpala[];
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
  espacioId,
  isLoadingFlujos,
  isLoadingTablas,
  onCrear,
  isCreating,
  puedeCrear,
  configTenant,
}: Props) {
  const opcionesFlujos = flujos.map((f) => ({
    id: f.id,
    nombre: f.nombre,
    espacioNombre: f.espacioNombre || "Espacio Personal",
  }));

  const opcionesTablas = tablas.map((t) => ({
    id: t.nombre,
    nombre: t.nombre,
    espacioNombre: "Impala",
  }));

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    onCrear();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Nueva Automatización</h2>
        <p className="mt-1 text-sm text-gray-500">
          Selecciona un Flujo de Datos (Dataflow) de Qlik y la tabla de destino
          Impala para orquestar la ejecución automáticamente.
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
        <span>✅</span>
        <span>
          Plantilla base:{" "}
          <strong>
            {configTenant?.automatizacionBaseNombre ??
              configTenant?.automatizacionBaseIdQlik}
          </strong>
        </span>
        {espacioId && (
          <>
            <span className="text-gray-300">·</span>
            <span>
              Espacio destino: <strong>{espacioId}</strong>
            </span>
          </>
        )}
      </div>

      <Card className="border-gray-200">
        <CardHeader className="border-b bg-gray-50/50 pb-4">
          <CardTitle className="text-lg font-bold text-gray-900">
            Configuración del Orquestador
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form className="space-y-6" onSubmit={enviar}>
            <SelectBuscable
              etiqueta="1. Seleccionar Flujo de Datos (Dataflow de Qlik Cloud)"
              placeholder="Selecciona un flujo de datos..."
              searchPlaceholder="Buscar flujo por nombre o espacio..."
              emptyText="No se encontraron flujos que coincidan con la búsqueda"
              opciones={opcionesFlujos}
              valorSeleccionado={flujoId}
              onSeleccionar={setFlujoId}
              cargando={isLoadingFlujos}
            />

            <div>
              <SelectBuscable
                etiqueta="2. Seleccionar Tabla de Destino (Impala)"
                placeholder="Selecciona una tabla de destino..."
                searchPlaceholder="Buscar tabla Impala por nombre..."
                emptyText="No se encontraron tablas en la base de datos configurada"
                opciones={opcionesTablas}
                valorSeleccionado={tablaId}
                onSeleccionar={setTablaId}
                cargando={isLoadingTablas}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                3. Nombre de la Automatización
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Auto - Dataflow Ventas → tabla_ventas_diarias"
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none shadow-sm"
                required
              />
              <p className="mt-1 text-xs text-gray-400">
                Se sugiere automáticamente al seleccionar el flujo y la tabla.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" disabled={isCreating}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={!puedeCrear || isCreating}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                {isCreating ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⚙️</span> Creando en Qlik
                    Cloud…
                  </span>
                ) : (
                  "🚀 Crear Automatización"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
