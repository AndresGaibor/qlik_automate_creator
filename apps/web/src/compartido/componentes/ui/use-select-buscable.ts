import { type KeyboardEvent, useEffect, useId, useRef, useState } from "react";

export function useSelectBuscable(onSeleccionar: (valor: string) => void) {
  const [abierto, setAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const contenedorRef = useRef<HTMLDivElement>(null);
  const disparadorRef = useRef<HTMLButtonElement>(null);
  const busquedaRef = useRef<HTMLInputElement>(null);
  const listaId = useId();
  const disparadorId = useId();

  useEffect(() => {
    const cerrarFuera = (evento: MouseEvent) => {
      if (!contenedorRef.current?.contains(evento.target as Node)) {
        setAbierto(false);
      }
    };
    document.addEventListener("mousedown", cerrarFuera);
    return () => document.removeEventListener("mousedown", cerrarFuera);
  }, []);

  useEffect(() => {
    if (abierto) busquedaRef.current?.focus();
  }, [abierto]);

  function cerrar() {
    setAbierto(false);
    setBusqueda("");
    disparadorRef.current?.focus();
  }

  function seleccionar(valor: string) {
    onSeleccionar(valor);
    cerrar();
  }

  function opcionesEnDom(): HTMLButtonElement[] {
    return Array.from(
      contenedorRef.current?.querySelectorAll<HTMLButtonElement>(
        "[data-opcion-select]",
      ) ?? [],
    );
  }

  function enfocarOpcion(indice: number) {
    const opciones = opcionesEnDom();
    if (opciones.length === 0) return;
    const normalizado = (indice + opciones.length) % opciones.length;
    opciones[normalizado]?.focus();
  }

  function onKeyDownBusqueda(evento: KeyboardEvent<HTMLInputElement>) {
    if (evento.key === "Escape") {
      evento.preventDefault();
      cerrar();
    } else if (evento.key === "ArrowDown") {
      evento.preventDefault();
      enfocarOpcion(0);
    } else if (evento.key === "ArrowUp") {
      evento.preventDefault();
      enfocarOpcion(-1);
    }
  }

  function onKeyDownOpcion(
    evento: KeyboardEvent<HTMLButtonElement>,
    valor: string,
  ) {
    const opciones = opcionesEnDom();
    const indice = opciones.indexOf(evento.currentTarget);
    if (evento.key === "ArrowDown") {
      evento.preventDefault();
      enfocarOpcion(indice + 1);
    } else if (evento.key === "ArrowUp") {
      evento.preventDefault();
      enfocarOpcion(indice - 1);
    } else if (evento.key === "Home") {
      evento.preventDefault();
      enfocarOpcion(0);
    } else if (evento.key === "End") {
      evento.preventDefault();
      enfocarOpcion(opciones.length - 1);
    } else if (evento.key === "Escape") {
      evento.preventDefault();
      cerrar();
    } else if (evento.key === "Enter" || evento.key === " ") {
      evento.preventDefault();
      seleccionar(valor);
    }
  }

  return {
    abierto,
    busqueda,
    setBusqueda,
    contenedorRef,
    disparadorRef,
    busquedaRef,
    listaId,
    disparadorId,
    abrir: () => setAbierto(true),
    cerrar,
    alternar: () => setAbierto((actual) => !actual),
    seleccionar,
    onKeyDownBusqueda,
    onKeyDownOpcion,
  };
}
