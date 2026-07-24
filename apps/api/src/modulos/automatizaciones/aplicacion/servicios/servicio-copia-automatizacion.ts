import type { PuertoQlik } from "../../../qlik/aplicacion/puertos/puerto-qlik.js";
import type { CrearDesdePlantilla } from "@qlik/contratos/automatizaciones";
import { aplicarReemplazosEnWorkspace } from "./servicio-reemplazo-workspace.js";

export interface ResultadoCopiaAutomatizacion {
  id: string;
  nombre: string;
  plantillaIdQlik: string;
  error?: unknown;
}

export async function copiarAutomatizacion(
  qlik: PuertoQlik,
  entrada: CrearDesdePlantilla,
): Promise<ResultadoCopiaAutomatizacion> {
  const copia = await qlik.copiarAutomatizacion(
    entrada.plantillaIdQlik,
    entrada.nombre,
  );

  const id = copia.id;
  let errorReemplazos: unknown;

  if (entrada.espacioIdQlik) {
    await qlik.cambiarEspacioAutomatizacion(id, entrada.espacioIdQlik);
  }

  if (entrada.reemplazosWorkspace.length > 0) {
    try {
      await aplicarReemplazos(
        qlik,
        id,
        entrada.reemplazosWorkspace as Array<{ ruta: string; valor: unknown }>,
      );
    } catch (e) {
      errorReemplazos = e;
    }
  }

  if (entrada.propietarioIdQlik) {
    await qlik.cambiarPropietarioAutomatizacion(id, entrada.propietarioIdQlik);
  }

  return {
    id,
    nombre: entrada.nombre,
    plantillaIdQlik: entrada.plantillaIdQlik,
    error: errorReemplazos,
  };
}

async function aplicarReemplazos(
  qlik: PuertoQlik,
  automatizacionId: string,
  reemplazos: Array<{ ruta: string; valor: unknown }>,
): Promise<void> {
  const automatizacion = await qlik.obtenerAutomatizacion(automatizacionId);
  const workspace = structuredClone(automatizacion.workspace ?? {});
  aplicarReemplazosEnWorkspace(workspace, reemplazos);
  await qlik.actualizarAutomatizacion(automatizacionId, {
    name: automatizacion.name,
    schedules: automatizacion.schedules ?? [],
    workspace,
    description: automatizacion.description ?? "",
    maxConcurrentRuns: automatizacion.maxConcurrentRuns ?? 1,
  });
}
