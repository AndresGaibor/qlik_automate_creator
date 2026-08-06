import { clienteApi } from "@/compartido/api/cliente";
import type {
  ActualizarModoAutomatizacion,
  ModoPlantilla,
} from "@qlik/contratos/admin";

const RUTA_MODO = "/admin/configuracion-plataforma/modo-automatizacion";

export function obtenerModoGlobalAutomatizacion() {
  return clienteApi.get<ActualizarModoAutomatizacion>(RUTA_MODO);
}

export function guardarModoGlobalAutomatizacion(modo: ModoPlantilla) {
  return clienteApi.put<ActualizarModoAutomatizacion>(RUTA_MODO, {
    modoAutomatizacionActivo: modo,
  });
}
