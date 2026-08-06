export type {
  ConfiguracionConexionOrigen,
  ConsultaConexionesOrigen,
} from "./aplicacion/puertos/consulta-conexiones-origen.js";
export {
  construirCatalogoConexionesSpark,
  descubrirRequisitosConexion,
  parsearScriptQlik,
} from "./aplicacion/generador-catalogo-spark.js";
export type { PuertoConsultaFlujos } from "./aplicacion/puertos/puerto-consulta-flujos.js";
export type { Flujo } from "./dominio/flujo.js";
export { crearRutasFlujos } from "./http/rutas.js";
