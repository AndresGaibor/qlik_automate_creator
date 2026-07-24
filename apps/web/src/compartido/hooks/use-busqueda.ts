import { useState } from "react";

interface UseBusquedaOptions {
  inicial?: string;
  onReset?: () => void;
}

export function useBusqueda(opciones: UseBusquedaOptions = {}) {
  const [temp, setTemp] = useState("");
  const [activa, setActiva] = useState(opciones.inicial ?? "");

  const buscar = (e: React.FormEvent) => {
    e.preventDefault();
    setActiva(temp.trim());
  };

  const limpiar = () => {
    setTemp("");
    setActiva("");
  };

  const sincronizar = (nuevoValor: string) => {
    setTemp(nuevoValor);
    setActiva(nuevoValor);
  };

  return {
    busquedaTemp: temp,
    setBusquedaTemp: setTemp,
    busquedaActiva: activa,
    setBusquedaActiva: setActiva,
    buscar,
    limpiar,
    sincronizar,
  };
}
