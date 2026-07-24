export interface ColumnaDestino {
  nombre: string;
  tipo: string;
}

export interface EsquemaTablaDestino {
  baseDatos: string;
  tabla: string;
  columnas: ColumnaDestino[];
  especificacionEsquema: string;
}

export interface FlujoDatosDestino {
  id: string;
  aplicacionId?: string;
  nombre: string;
  descripcion?: string;
  tipoDestino?: string;
  destinoId?: string;
  etiquetaDestino?: string;
  nombreArchivo?: string;
  extension?: string;
  formato?: string;
  tratarComoRelativo?: boolean;
}
