import type { PuertoCatalogoDestinos } from "../puertos/puerto-catalogo-destinos.js";

export class ConsultarDestinos {
  constructor(private readonly catalogo: PuertoCatalogoDestinos) {}

  listarBasesDatos() {
    return this.catalogo.listarBasesDatos();
  }

  listarTablas(baseDatos: string) {
    return this.catalogo.listarTablas(baseDatos);
  }

  obtenerEsquemaTabla(baseDatos: string, tabla: string) {
    return this.catalogo.obtenerEsquemaTabla(baseDatos, tabla);
  }

  listarFlujosDatos() {
    return this.catalogo.listarFlujosDatos();
  }
}
