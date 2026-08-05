import type { CrearDesdePlantilla } from "@qlik/contratos/automatizaciones";
import type { PuertoQlik } from "../../../qlik/aplicacion/puertos/puerto-qlik.js";
import { aplicarReemplazosEnWorkspace } from "./servicio-reemplazo-workspace.js";
import type { ParametrosPlantilla } from "./preparar-parametros-plantilla.js";
import { configurarWorkspacePlantilla } from "./configurar-workspace-plantilla.js";

export interface ResultadoCopiaAutomatizacion {
  id: string;
  nombre: string;
  plantillaIdQlik: string;
  error?: unknown;
}

type EntradaExtendida = CrearDesdePlantilla & {
  parametros?: ParametrosPlantilla;
  reemplazosWorkspace?: Array<{ ruta: string; valor: unknown }>;
};

export async function copiarAutomatizacion(
  qlik: PuertoQlik,
  entrada: CrearDesdePlantilla,
): Promise<ResultadoCopiaAutomatizacion> {
  const entradaExt = entrada as EntradaExtendida;
  const parametros = entradaExt.parametros;
  const reemplazos = entradaExt.reemplazosWorkspace ?? [];

  if (parametros) {
    const plantilla = await qlik.obtenerAutomatizacion(entrada.plantillaIdQlik);
    configurarWorkspacePlantilla(plantilla.workspace ?? {}, parametros);
  }

  const copia = await qlik.copiarAutomatizacion(
    entrada.plantillaIdQlik,
    entrada.nombre,
  );
  const id = copia.id;

  if (entrada.espacioIdQlik) {
    await qlik.cambiarEspacioAutomatizacion(id, entrada.espacioIdQlik);
  }

  let errorWorkspace: unknown;

  if (parametros) {
    try {
      const clon = await qlik.obtenerAutomatizacion(id);
      let workspaceClon = structuredClone(clon.workspace ?? {});
      workspaceClon = configurarWorkspacePlantilla(workspaceClon, parametros);
      if (reemplazos.length > 0) {
        aplicarReemplazosEnWorkspace(workspaceClon, reemplazos);
      }
      const upd = {
        name: clon.name,
        schedules: clon.schedules ?? [],
        workspace: workspaceClon,
        description: clon.description ?? "",
        maxConcurrentRuns: clon.maxConcurrentRuns ?? 1,
      };
      await qlik.actualizarAutomatizacion(id, upd);
    } catch (e) {
      await qlik.eliminarAutomatizacion(id).catch(() => undefined);
      errorWorkspace = e;
    }
  } else if (reemplazos.length > 0) {
    try {
      const clon = await qlik.obtenerAutomatizacion(id);
      const workspaceClon = structuredClone(clon.workspace ?? {});
      aplicarReemplazosEnWorkspace(workspaceClon, reemplazos);
      await qlik.actualizarAutomatizacion(id, {
        name: clon.name,
        schedules: clon.schedules ?? [],
        workspace: workspaceClon,
        description: clon.description ?? "",
        maxConcurrentRuns: clon.maxConcurrentRuns ?? 1,
      });
    } catch (e) {
      errorWorkspace = e;
    }
  }

  if (entrada.propietarioIdQlik) {
    await qlik.cambiarPropietarioAutomatizacion(id, entrada.propietarioIdQlik);
  }

  return {
    id,
    nombre: entrada.nombre,
    plantillaIdQlik: entrada.plantillaIdQlik,
    error: errorWorkspace,
  };
}
