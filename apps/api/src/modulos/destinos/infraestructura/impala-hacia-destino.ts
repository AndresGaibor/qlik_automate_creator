import type { PuertoDestino } from "../aplicacion/puertos/puerto-destino.js";
import type {
  CapacidadesDestino,
  DetalleRecursoDestino,
  RecursoDestino,
} from "../dominio/tipos-destino.js";
import type { ClienteImpalaDirecto } from "./cliente-impala-directo.js";

export class ImpalaHaciaDestino implements PuertoDestino {
  readonly tipo = "impala" as const;

  constructor(private readonly cliente: ClienteImpalaDirecto) {}

  obtenerCapacidades(): CapacidadesDestino {
    return {
      listarRecursos: true,
      esquema: true,
      conteoRegistros: true,
      vistaPrevia: false,
      escritura: false,
    };
  }

  async listarRecursos(): Promise<RecursoDestino[]> {
    const bases = await this.cliente.listarBasesDatos();
    const resultado: RecursoDestino[] = [];
    for (const bd of bases) {
      const tablas = await this.cliente.listarTablas(bd);
      for (const tabla of tablas) {
        resultado.push({
          id: `${bd}.${tabla}`,
          nombre: tabla,
          tipo: "tabla",
          espacioDeNombres: bd,
          metadatos: {},
        });
      }
    }
    return resultado;
  }

  async obtenerRecurso(id: string): Promise<DetalleRecursoDestino> {
    const partes = id.split(".");
    const bd = partes[0] ?? "default";
    const tabla = partes.slice(1).join(".");
    const esquema = await this.cliente.obtenerEsquemaTabla(bd, tabla);
    return {
      id,
      nombre: tabla,
      tipo: "tabla",
      espacioDeNombres: bd,
      columnas: esquema.columnas,
      actualizadoEn: new Date().toISOString(),
      metadatos: {},
    };
  }
}
