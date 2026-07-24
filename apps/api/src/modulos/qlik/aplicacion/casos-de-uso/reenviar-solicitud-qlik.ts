import type {
  PuertoQlik,
  RespuestaCrudaQlik,
  SolicitudQlik,
} from "../puertos/puerto-qlik.js";

export class ReenviarSolicitudQlik {
  constructor(private readonly cliente: PuertoQlik) {}

  ejecutar(solicitud: SolicitudQlik): Promise<RespuestaCrudaQlik> {
    return this.cliente.solicitarCrudo(solicitud);
  }
}
