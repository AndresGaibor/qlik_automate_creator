import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import { Button } from "@/compartido/componentes/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/compartido/componentes/ui/card";
import { SelectBuscable } from "@/compartido/componentes/ui/select-buscable";
import { useFiltroEspacioPersistente } from "@/compartido/hooks/use-filtro-espacio-persistente";
import {
  type ResumenAutomatizacion,
  crearAutomatizacionDesdePlantilla,
  obtenerTablasImpala,
  type TablaImpala,
} from "@/modulos/automatizaciones/api";
import { obtenerFlujosConFiltros, type ResumenFlujo } from "@/modulos/flujos/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { type FormEvent, useEffect, useState } from "react";

export function PaginaNuevaAutomatizacion() {
  const navegar = useNavigate();
  const queryClient = useQueryClient();
  const { mostrarError, mostrarExito } = useNotificaciones();
  const { espacioId: espacioIdPersistente } = useFiltroEspacioPersistente();

  // Leer espacioId de URL si viene como query parameter
  const searchParams = new URLSearchParams(window.location.search);
  const espacioIdUrl = searchParams.get("espacioId");
  const espacioIdActual = espacioIdUrl || espacioIdPersistente || undefined;

  const [flujoId, setFlujoId] = useState("");
  const [tablaId, setTablaId] = useState("");
  const [nombre, setNombre] = useState("");

  // 1. Cargar Flujos de Datos desde Qlik Cloud (vía OAuth autenticado)
  const { data: flujos = [], isLoading: cargandoFlujos } = useQuery<ResumenFlujo[]>({
    queryKey: espacioIdActual ? ["flujos", espacioIdActual] : ["flujos"],
    queryFn: () => obtenerFlujosConFiltros(espacioIdActual),
    retry: false,
  });

  // 2. Cargar Tablas de Destino Impala (conexión directa por tenant)
  const { data: tablas = [], isLoading: cargandoTablas } = useQuery<TablaImpala[]>({
    queryKey: ["impala-tablas"],
    queryFn: obtenerTablasImpala,
    retry: false,
  });

  // Sugerir nombre automáticamente al seleccionar flujo y tabla
  useEffect(() => {
    if (flujoId && tablaId && !nombre) {
      const flujo = flujos.find((f) => f.id === flujoId);
      if (flujo) {
        setNombre(`Auto - ${flujo.nombre} → ${tablaId}`);
      }
    }
  }, [flujoId, tablaId, flujos, nombre]);

  const crear = useMutation({
    mutationFn: async () => {
      const flujoObj = flujos.find((f) => f.id === flujoId);
      if (!flujoObj) throw new Error("Debes seleccionar un flujo de datos válido");
      if (!tablaId) throw new Error("Debes seleccionar una tabla de destino Impala");

      // Llamar a crear desde plantilla máster del tenant
      return crearAutomatizacionDesdePlantilla({
        plantillaIdQlik: "plantilla-base",
        nombre: nombre.trim() || `Auto - ${flujoObj.nombre}`,
        espacioIdQlik: espacioIdActual,
        reemplazosWorkspace: [
          { ruta: "/variables/flujoId", valor: flujoId },
          { ruta: "/variables/tablaImpala", valor: tablaId },
        ],
      });
    },
    onSuccess: async () => {
      mostrarExito("Automatización creada exitosamente");
      await queryClient.invalidateQueries({ queryKey: ["automatizaciones"] });
      navegar({ to: "/automatizaciones" });
    },
    onError: (error: Error) => mostrarError(error.message),
  });

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!flujoId) {
      mostrarError("Por favor selecciona un flujo de datos");
      return;
    }
    if (!tablaId) {
      mostrarError("Por favor selecciona una tabla de destino Impala");
      return;
    }
    crear.mutate();
  }

  const opcionesFlujos = flujos.map((f) => ({
    id: f.id,
    nombre: f.nombre,
    espacioNombre: f.espacioNombre || "Espacio Personal",
  }));

  const opcionesTablas = tablas.map((t) => ({
    id: t.nombre,
    nombre: t.nombre,
    espacioNombre: "Impala / default",
  }));

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Nueva Automatización</h2>
        <p className="mt-1 text-sm text-gray-500">
          Selecciona un Flujo de Datos (Dataflow) de Qlik y la tabla de destino Impala para orquestar la ejecución automáticamente.
        </p>
      </div>

      <Card className="border-gray-200">
        <CardHeader className="border-b bg-gray-50/50 pb-4">
          <CardTitle className="text-lg font-bold text-gray-900">
            Configuración del Orquestador
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form className="space-y-6" onSubmit={enviar}>
            {/* 1. Seleccionar Flujo de Datos (Dataflow) */}
            <SelectBuscable
              etiqueta="1. Seleccionar Flujo de Datos (Dataflow de Qlik Cloud)"
              placeholder="Selecciona un flujo de datos..."
              searchPlaceholder="Buscar flujo por nombre o espacio..."
              emptyText="No se encontraron flujos que coincidan con la búsqueda"
              opciones={opcionesFlujos}
              valorSeleccionado={flujoId}
              onSeleccionar={setFlujoId}
              cargando={cargandoFlujos}
            />

            {/* 2. Seleccionar Tabla de Destino (Impala) */}
            <SelectBuscable
              etiqueta="2. Seleccionar Tabla de Destino (Impala)"
              placeholder="Selecciona una tabla de destino..."
              searchPlaceholder="Buscar tabla Impala por nombre..."
              emptyText="No se encontraron tablas Impala. Verifica la conexión del tenant."
              opciones={opcionesTablas}
              valorSeleccionado={tablaId}
              onSeleccionar={setTablaId}
              cargando={cargandoTablas}
            />

            {/* 3. Nombre de la Automatización */}
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
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navegar({ to: "/automatizaciones" })}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={crear.isPending || !flujoId || !tablaId}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                {crear.isPending ? "🚀 Creando en Qlik Cloud…" : "🚀 Crear Automatización"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
