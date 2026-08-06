import { SelectBuscable } from "@/compartido/componentes/ui/select-buscable";
import { PasoFormularioAutomatizacion } from "./paso-formulario-automatizacion";

interface OpcionSeleccion {
  id: string;
  nombre: string;
  espacioNombre?: string;
  badgeAviso?: string;
}

export function PasosNuevaAutomatizacion({
  flujoId,
  tablaId,
  nombre,
  destinoId,
  espacioId,
  opcionesFlujos,
  opcionesConexiones,
  opcionesTablas,
  etiquetaDestino,
  requiereDestino,
  isLoadingFlujos,
  isLoadingTablas,
  destinoBloqueado,
  onFlujo,
  onTabla,
  onNombre,
  onDestino,
}: {
  flujoId: string;
  tablaId: string;
  nombre: string;
  destinoId?: string;
  espacioId?: string;
  opcionesFlujos: OpcionSeleccion[];
  opcionesConexiones: OpcionSeleccion[];
  opcionesTablas: OpcionSeleccion[];
  etiquetaDestino: string;
  requiereDestino: boolean;
  isLoadingFlujos: boolean;
  isLoadingTablas: boolean;
  destinoBloqueado: boolean;
  onFlujo: (valor: string) => void;
  onTabla: (valor: string) => void;
  onNombre: (valor: string) => void;
  onDestino: (valor: string) => void;
}) {
  return (
    <>
      <PasoFormularioAutomatizacion
        numero={1}
        titulo="Elige el origen"
        descripcion="Selecciona el Dataflow que produce los datos."
        completo={Boolean(flujoId)}
      >
        <SelectBuscable
          etiqueta="Dataflow de origen"
          placeholder="Elige un Dataflow de Qlik Cloud..."
          searchPlaceholder="Busca por nombre o espacio…"
          emptyText="No encontramos Dataflows disponibles."
          opciones={opcionesFlujos}
          valorSeleccionado={flujoId}
          onSeleccionar={onFlujo}
          cargando={isLoadingFlujos}
        />
        {espacioId && (
          <p className="mt-2 text-xs text-ink-500">
            Espacio filtrado: <span className="font-mono">{espacioId}</span>
          </p>
        )}
      </PasoFormularioAutomatizacion>

      <PasoFormularioAutomatizacion
        numero={2}
        titulo="Define el destino"
        descripcion="Indica dónde debe quedar disponible el resultado."
        completo={Boolean(tablaId && (!requiereDestino || destinoId))}
        bloqueado={!flujoId}
      >
        {requiereDestino && (
          <div className="mb-4">
            <SelectBuscable
              etiqueta="Conexión destino (obligatorio en Modo 2)"
              placeholder="Elige una conexión..."
              searchPlaceholder="Busca por nombre…"
              emptyText="No hay conexiones destino disponibles."
              opciones={opcionesConexiones}
              valorSeleccionado={destinoId ?? ""}
              onSeleccionar={onDestino}
              disabled={!flujoId}
              disabledText="Selecciona primero un Dataflow"
            />
          </div>
        )}
        <SelectBuscable
          etiqueta={`Recurso destino (${etiquetaDestino})`}
          placeholder="Elige dónde guardar el resultado..."
          searchPlaceholder="Busca por nombre…"
          emptyText="No hay recursos disponibles en esta conexión."
          opciones={opcionesTablas}
          valorSeleccionado={tablaId}
          onSeleccionar={onTabla}
          cargando={isLoadingTablas}
          disabled={destinoBloqueado}
          disabledText={
            !flujoId
              ? "Selecciona primero un Dataflow"
              : "Selecciona primero la conexión destino"
          }
        />
        {!flujoId && (
          <p className="mt-2 text-xs text-amber-700">
            Selecciona primero un Dataflow para continuar.
          </p>
        )}
        {requiereDestino && !destinoId && (
          <p className="mt-2 text-xs text-amber-700">
            El modo 2 requiere seleccionar una conexión destino y una tabla.
          </p>
        )}
      </PasoFormularioAutomatizacion>

      <PasoFormularioAutomatizacion
        numero={3}
        titulo="Identifica la automatización"
        descripcion="Usa un nombre fácil de reconocer en Qlik Cloud."
        completo={Boolean(nombre.trim())}
        bloqueado={!flujoId || !tablaId}
      >
        <label
          htmlFor="nombre-automatizacion"
          className="block text-sm font-semibold text-ink-900"
        >
          Nombre de la automatización
        </label>
        <input
          id="nombre-automatizacion"
          type="text"
          value={nombre}
          onChange={(evento) => onNombre(evento.target.value)}
          disabled={!flujoId || !tablaId}
          placeholder="Ej. Ventas diarias hacia tabla_ventas"
          className="mt-1.5 w-full rounded-md border border-line-200 bg-surface px-3.5 py-2.5 text-sm text-ink-900 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-app disabled:text-ink-400"
          required
        />
        <p className="mt-2 text-xs text-ink-500">
          Se sugiere automáticamente al elegir el origen y el destino.
        </p>
      </PasoFormularioAutomatizacion>
    </>
  );
}
