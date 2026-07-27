import type { CrearDesdePlantilla } from "@qlik/contratos/automatizaciones";
import type { PuertoQlik } from "../../../qlik/aplicacion/puertos/puerto-qlik.js";
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

  // ── Extracción dinámica si viene flujoId / tablaId ───────────────────────
  const reemplazosEntrantes = [
    ...(entrada.reemplazosWorkspace as Array<{ ruta: string; valor: unknown }>),
  ];

  if (entrada.flujoId) {
    try {
      const scriptRes = await qlik.obtenerScriptApp(entrada.flujoId, "current");
      const scriptTexto = scriptRes.script || "";

      // Regex para buscar: STORE [Filtro 1_DEFAULT] INTO [lib://Bancolombia prueba:SFTP//upload/ventas_incremental1.csv] (txt);
      const matchStore = scriptTexto.match(
        /STORE\s+.*?\s+INTO\s+\[lib:\/\/.*?\/\/.*?\/(.*?)\.(csv|txt|qvd|json)\]/i,
      );

      const archivoEntrada = matchStore
        ? matchStore[1].trim()
        : "ventas_incremental1";
      const extension = matchStore ? matchStore[2].trim() : "csv";
      const appId = entrada.flujoId;
      const dataset = archivoEntrada;
      const tablaDestino = entrada.tablaId
        ? entrada.tablaId.trim()
        : "ventas_filtro_curados";

      // Modificar workspace de forma directa inteligente
      const automatizacion = await qlik.obtenerAutomatizacion(id);
      const workspace = structuredClone(
        automatizacion.workspace ?? {},
      ) as Record<string, unknown>;

      modificarWorkspaceConParametrosFlujo(workspace, {
        appId,
        dataset,
        archivoEntrada,
        tablaDestino,
        extension,
      });

      // Aplicar reemplazos adicionales si existen
      if (reemplazosEntrantes.length > 0) {
        aplicarReemplazosEnWorkspace(workspace, reemplazosEntrantes);
      }

      await qlik.actualizarAutomatizacion(id, {
        name: automatizacion.name,
        schedules: automatizacion.schedules ?? [],
        workspace,
        description: automatizacion.description ?? "",
        maxConcurrentRuns: automatizacion.maxConcurrentRuns ?? 1,
      });
    } catch (e) {
      errorReemplazos = e;
    }
  } else if (reemplazosEntrantes.length > 0) {
    try {
      await aplicarReemplazos(qlik, id, reemplazosEntrantes);
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

/**
 * Modifica las variables y bloques en la estructura JSON del Automate clonado
 */
function modificarWorkspaceConParametrosFlujo(
  workspace: Record<string, unknown>,
  params: {
    appId: string;
    dataset: string;
    archivoEntrada: string;
    tablaDestino: string;
    extension: string;
  },
): void {
  const blocks = (
    Array.isArray(workspace.blocks) ? workspace.blocks : []
  ) as Record<string, unknown>[];

  // Map de valores para variables
  const mapaValores: Record<string, string> = {
    Appid: params.appId,
    Dataset: params.dataset,
    ArchivoEntrada: params.archivoEntrada,
    TablaDestino: params.tablaDestino,
    Extension: params.extension,
  };

  for (const block of blocks) {
    const name = String(block.name || "");
    const type = String(block.type || "");

    // Configurar listApps (Qlik Cloud Services - List Apps) con el espacio/app si aplica
    if (name === "listApps" || type === "EndpointBlock") {
      const inputs = (
        Array.isArray(block.inputs) ? block.inputs : []
      ) as Record<string, unknown>[];
      for (const input of inputs) {
        if (input.id === "8ce4fad0-107b-11ec-a6ac-2bd407ad134b") {
          input.value = params.appId;
        }
      }
    }

    // Configurar bloques VariableBlock (DataflowNombre, Appid, Dataset, ArchivoEntrada, TablaDestino, Extension)
    if (type === "VariableBlock" && name in mapaValores) {
      const valorNuevo = mapaValores[name];
      const operations = (
        Array.isArray(block.operations) ? block.operations : []
      ) as Record<string, unknown>[];
      if (operations.length > 0) {
        operations[0].value = valorNuevo;
      } else {
        block.operations = [
          {
            id: "set_value",
            key: crypto.randomUUID(),
            name: "Set value of { variable }",
            value: valorNuevo,
          },
        ];
      }
    }
  }

  // Actualizar también la declaración global en la propiedad variables si existe
  const variables = (
    Array.isArray(workspace.variables) ? workspace.variables : []
  ) as Record<string, unknown>[];
  for (const v of variables) {
    const vName = String(v.name || "");
    if (vName in mapaValores) {
      v.value = mapaValores[vName];
    }
  }
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
