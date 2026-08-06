import { useState } from "react";

export function useCopiaTemporal(duracionMs = 2000) {
  const [copiado, setCopiado] = useState(false);

  const copiar = async (texto: string) => {
    await navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), duracionMs);
  };

  return { copiado, copiar };
}
