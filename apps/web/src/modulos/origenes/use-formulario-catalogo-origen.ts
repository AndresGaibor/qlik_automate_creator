import { useState } from "react";
import {
  type ConexionOrigen,
  type ConexionSugerida,
  type EstadoFormularioOrigen,
  crearEstadoDesdeConexion,
  crearEstadoFormularioInicial,
  obtenerConexionesSugeridas,
} from "./modelo-catalogo-origen";

export function useFormularioCatalogoOrigen() {
  const [estado, setEstado] = useState<EstadoFormularioOrigen>(
    crearEstadoFormularioInicial,
  );
  const [sugerencias] = useState(() =>
    obtenerConexionesSugeridas(window.location.search),
  );

  function actualizar<K extends keyof EstadoFormularioOrigen>(
    campo: K,
    valor: EstadoFormularioOrigen[K],
  ) {
    setEstado((actual) => ({ ...actual, [campo]: valor }));
  }

  function seleccionarSugerencia(sugerencia: ConexionSugerida) {
    setEstado((actual) => ({
      ...actual,
      tipo: sugerencia.tipo,
      nombre: sugerencia.nombre,
      conexionEditandoId: null,
      valorSecretoJdbc: "",
      valorSecretoClavePrivada: "",
    }));
  }

  function editarConexion(conexion: ConexionOrigen) {
    setEstado(crearEstadoDesdeConexion(conexion));
  }

  function marcarGuardada() {
    setEstado((actual) => ({
      ...actual,
      conexionEditandoId: null,
      valorSecretoJdbc: "",
      valorSecretoClavePrivada: "",
    }));
  }

  function limpiarSecretos() {
    setEstado((actual) => ({
      ...actual,
      valorSecretoJdbc: "",
      valorSecretoClavePrivada: "",
    }));
  }

  return {
    estado,
    sugerencias,
    actualizar,
    seleccionarSugerencia,
    editarConexion,
    marcarGuardada,
    limpiarSecretos,
  };
}
