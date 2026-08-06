import type {
  ConexionDestino,
  RecursoDestino,
} from "@/modulos/automatizaciones/api";
import type { ResumenFlujo } from "@qlik/contratos";
import type { ResumenAutomatizacion } from "@qlik/contratos/automatizaciones";

export function construirOpcionesConexiones(conexiones: ConexionDestino[]) {
  return conexiones.map((item) => ({
    id: item.id,
    nombre: item.nombre,
    espacioNombre: item.tipo.toUpperCase(),
  }));
}

export function construirOpcionesFlujos(
  flujos: ResumenFlujo[],
  automatizaciones: ResumenAutomatizacion[],
) {
  return flujos.map((flujo) => {
    const vinculada = automatizaciones.find(
      (auto) =>
        auto.nombre.toLowerCase().includes(flujo.nombre.toLowerCase()) ||
        auto.nombre.includes(flujo.id),
    );
    return {
      id: flujo.id,
      nombre: flujo.nombre,
      espacioNombre: flujo.espacioNombre || "Espacio personal",
      badgeAviso: vinculada
        ? `Ya se usa en "${vinculada.nombre.slice(0, 25)}"`
        : undefined,
    };
  });
}

export function construirOpcionesTablas(
  tablas: RecursoDestino[],
  etiquetaDestino: string,
) {
  return tablas.map((tabla) => ({
    id: tabla.nombre,
    nombre: tabla.nombre,
    espacioNombre: tabla.espacioDeNombres || etiquetaDestino,
  }));
}

export function resolverSeleccionFormulario({
  flujoId,
  tablaId,
  destinoId,
  flujos,
  tablas,
  conexiones,
  requiereDestino,
  isLoadingTablas,
}: {
  flujoId: string;
  tablaId: string;
  destinoId?: string;
  flujos: ResumenFlujo[];
  tablas: RecursoDestino[];
  conexiones: ConexionDestino[];
  requiereDestino: boolean;
  isLoadingTablas: boolean;
}) {
  const flujo = flujos.find((item) => item.id === flujoId);
  const conexion = conexiones.find((item) => item.id === destinoId);
  const recurso = tablas.find(
    (item) => item.id === tablaId || item.nombre === tablaId,
  );
  return {
    flujoNombre: flujo?.nombre ?? "",
    conexionNombre: conexion?.nombre ?? "",
    recursoNombre: recurso?.nombre ?? tablaId,
    destinoBloqueado:
      !flujoId || (requiereDestino && !destinoId) || isLoadingTablas,
  };
}
