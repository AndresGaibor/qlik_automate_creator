import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import { type FormEvent, useState } from "react";
import { completarSetup } from "./api";
import {
  type FormularioSetup,
  PASOS_SETUP,
  type PasoSetup,
  crearEntradaSetup,
  crearEstadoInicialSetup,
  validarPasoSetup,
} from "./modelo-setup";

export function useFormularioSetup() {
  const { mostrarExito, mostrarError } = useNotificaciones();
  const [paso, setPaso] = useState<PasoSetup>(1);
  const [formulario, setFormulario] = useState<FormularioSetup>(
    crearEstadoInicialSetup,
  );
  const [enviando, setEnviando] = useState(false);
  const [errorFormulario, setErrorFormulario] = useState<string | null>(null);

  const actualizarCampo = <K extends keyof FormularioSetup>(
    campo: K,
    valor: FormularioSetup[K],
  ) => {
    setErrorFormulario(null);
    setFormulario((anterior) => ({ ...anterior, [campo]: valor }));
  };

  const informarError = (mensaje: string) => {
    setErrorFormulario(mensaje);
    mostrarError(mensaje);
  };

  const avanzar = () => {
    const error = validarPasoSetup(paso, formulario);
    if (error) return informarError(error);
    setPaso((actual) => Math.min(actual + 1, PASOS_SETUP.length) as PasoSetup);
  };

  const retroceder = () => {
    setErrorFormulario(null);
    setPaso((actual) => Math.max(actual - 1, 1) as PasoSetup);
  };

  const alternarScope = (scope: string) => {
    actualizarCampo(
      "qlikScopes",
      formulario.qlikScopes.includes(scope)
        ? formulario.qlikScopes.filter((actual) => actual !== scope)
        : [...formulario.qlikScopes, scope],
    );
  };

  const copiarRedirectUri = async () => {
    try {
      await navigator.clipboard.writeText(formulario.qlikRedirectUri);
      mostrarExito("URI de redirección copiada");
    } catch {
      mostrarError("No se pudo copiar la URI de redirección");
    }
  };

  const enviar = async (evento: FormEvent) => {
    evento.preventDefault();
    const error = validarPasoSetup(3, formulario);
    if (error) return informarError(error);

    setEnviando(true);
    setErrorFormulario(null);
    try {
      const resultado = await completarSetup(
        crearEntradaSetup(formulario, window.location.origin),
      );
      if (!resultado.organizacionId || !resultado.tenantQlikId) {
        throw new Error(
          "La respuesta del servidor no contiene la configuración creada.",
        );
      }
      mostrarExito("Configuración inicial guardada.");
      window.location.assign("/login");
    } catch (causa) {
      informarError(
        causa instanceof Error
          ? causa.message
          : "No se pudo guardar la configuración.",
      );
    } finally {
      setEnviando(false);
    }
  };

  return {
    paso,
    formulario,
    enviando,
    errorFormulario,
    actualizarCampo,
    alternarScope,
    copiarRedirectUri,
    avanzar,
    retroceder,
    enviar,
  };
}
