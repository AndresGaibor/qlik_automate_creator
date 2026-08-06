import type { PuertoCatalogoDestinos } from "../aplicacion/puertos/puerto-catalogo-destinos.js";
import { validarIdentificadorImpala } from "../dominio/identificador-impala.js";
import type {
  EsquemaTablaDestino,
  FlujoDatosDestino,
} from "../dominio/modelos.js";
import {
  type OpcionesImpala,
  normalizarOpcionesImpala,
} from "./configuracion-impala.js";
import {
  type EjecutorConsultasImpala,
  crearEjecutorHiveImpala,
} from "./ejecutor-hive-impala.js";
import { construirEsquemaTablaImpala } from "./modelo-esquema-impala.js";

export type { OpcionesImpala } from "./configuracion-impala.js";

export class ClienteImpalaDirecto implements PuertoCatalogoDestinos {
  readonly defaultDatabase: string;
  private readonly ejecutor: EjecutorConsultasImpala;

  constructor(opciones: OpcionesImpala, ejecutor?: EjecutorConsultasImpala) {
    const configuracion = normalizarOpcionesImpala(opciones);
    this.defaultDatabase = configuracion.database;
    this.ejecutor = ejecutor ?? crearEjecutorHiveImpala(configuracion);
  }

  ejecutarConsultaFilas(sql: string): Promise<string[][]> {
    return this.ejecutor.ejecutarFilas(sql);
  }

  ejecutarConsulta(sql: string): Promise<string[]> {
    return this.ejecutor.ejecutarColumna(sql);
  }

  listarBasesDatos(): Promise<string[]> {
    return this.ejecutarConsulta("SHOW DATABASES");
  }

  listarTablas(baseDatos: string): Promise<string[]> {
    const bd = validarIdentificadorImpala(baseDatos || this.defaultDatabase);
    return this.ejecutarConsulta(`SHOW TABLES IN \`${bd}\``);
  }

  async obtenerEsquemaTabla(
    baseDatos: string,
    tabla: string,
  ): Promise<EsquemaTablaDestino> {
    const bd = validarIdentificadorImpala(baseDatos || this.defaultDatabase);
    const tb = validarIdentificadorImpala(tabla);
    try {
      const filas = await this.ejecutarConsultaFilas(
        `DESCRIBE \`${bd}\`.\`${tb}\``,
      );
      return construirEsquemaTablaImpala(bd, tb, filas);
    } catch {
      return construirEsquemaTablaImpala(bd, tb, []);
    }
  }

  async listarFlujosDatos(): Promise<FlujoDatosDestino[]> {
    return [];
  }

  async obtenerFlujoDatos(id: string): Promise<FlujoDatosDestino> {
    return { id, nombre: `Flujo ${id}` };
  }
}
