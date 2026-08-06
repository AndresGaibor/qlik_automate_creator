import type {
  ConexionDestino,
  ConexionDestinoConSecreto,
} from "../aplicacion/puertos/repositorio-conexiones-destino.js";

export function presentarConexionDestino({
  id,
  tipo,
  nombre,
  estado,
  mensajeError,
  probadaEn,
}: ConexionDestino) {
  return {
    id,
    tipo,
    nombre,
    estado,
    mensajeError,
    probadaEn: probadaEn?.toISOString() ?? null,
  };
}

export function configurarConexionConSecreto(
  conexion: ConexionDestinoConSecreto,
): ConexionDestino {
  return {
    ...conexion,
    config: conexion.secreto
      ? { ...conexion.config, password: conexion.secreto.valor }
      : conexion.config,
  };
}
