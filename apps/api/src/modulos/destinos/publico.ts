export type { PuertoCatalogoDestinos } from "./aplicacion/puertos/puerto-catalogo-destinos.js";
export type { PuertoDestino } from "./aplicacion/puertos/puerto-destino.js";
export type {
  ColumnaDestino,
  EsquemaTablaDestino,
  FlujoDatosDestino,
} from "./dominio/modelos.js";
export type {
  TipoDestino,
  TipoRecursoDestino,
  CapacidadesDestino,
  RecursoDestino,
  DetalleRecursoDestino,
} from "./dominio/tipos-destino.js";
export { crearRutasDestinos } from "./http/rutas.js";
export { crearRutasDestinosGenericas } from "./http/rutas-destinos-genericos.js";
export { crearClienteDestino } from "./aplicacion/fabrica-destinos.js";
