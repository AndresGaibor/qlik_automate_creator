import type { RecursoDestino } from "../dominio/tipos-destino.js";
import type { PuertoCatalogoDestinos } from "./puertos/puerto-catalogo-destinos.js";
import type { PuertoDestino } from "./puertos/puerto-destino.js";

export class AdaptadorPuertoDestinoACatalogo implements PuertoCatalogoDestinos {
  constructor(private readonly destino: PuertoDestino) {}

  get tipo(): string {
    return this.destino.tipo;
  }

  async listarBasesDatos(): Promise<string[]> {
    const recursos = await this.destino.listarRecursos();
    const espacios = new Set<string>();
    for (const r of recursos) {
      if (r.espacioDeNombres) espacios.add(r.espacioDeNombres);
    }
    return [...espacios];
  }

  async listarTablas(baseDatos: string): Promise<string[]> {
    const recursos = await this.destino.listarRecursos();
    const resultado: string[] = [];
    for (const r of recursos) {
      if (r.espacioDeNombres === baseDatos) resultado.push(r.nombre);
    }
    return resultado;
  }

  async obtenerEsquemaTabla(
    baseDatos: string,
    tabla: string,
  ): Promise<import("../dominio/modelos.js").EsquemaTablaDestino> {
    const id = `${baseDatos}.${tabla}`;
    const detalle = await this.destino.obtenerRecurso(id);
    return {
      baseDatos,
      tabla,
      columnas: detalle.columnas ?? [],
      especificacionEsquema: (detalle.columnas ?? [])
        .map(
          (col: { nombre: string; tipo: string }) =>
            `${col.nombre}:${col.tipo}`,
        )
        .join("|"),
    };
  }

  async listarFlujosDatos(): Promise<
    import("../dominio/modelos.js").FlujoDatosDestino[]
  > {
    return [];
  }

  async obtenerFlujoDatos(
    id: string,
  ): Promise<import("../dominio/modelos.js").FlujoDatosDestino> {
    return { id, nombre: `Flujo ${id}` };
  }
}
